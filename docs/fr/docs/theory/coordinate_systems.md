---
title: Systèmes de Coordonnées
---

## Introduction

COMFOR implique un système de gestion des **systèmes de coordonnées** qui permet de travailler avec des repères locaux et globaux. Cette fonctionnalité est particulièrement utile pour :

- La définition des orientations de matériaux (fibres dans les composites)
- La transformation des vecteurs et tenseurs entre repères
- Les algorithmes de contact qui nécessitent des transformations géométriques

---

## Architecture des Systèmes de Coordonnées

```
┌─────────────────────────────────────────────────────────────┐
│                 CoordinateSystem (Interface)                     │
├─────────────────────────────────────────────────────────────┤
│  + vectorToGlobal(const Vec3d&) -> Vec3d                        │
│  + vectorToLocal(const Vec3d&) -> Vec3d                         │
│  + tensorToGlobal(const Mat3d&) -> Mat3d                       │
│  + tensorToLocal(const Mat3d&) -> Mat3d                        │
│  + pointToGlobal(const Vec3d&) -> Vec3d                        │
│  + pointToLocal(const Vec3d&) -> Vec3d                         │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │
              ┌───────────────────────────────┴───────────────────────────────┐
              │                                                               │
              ▼                                                               ▼
   ┌─────────────────────────────────────────────────────────────┐
   │                    CartesianSystem                           │
   │                                                                  │
   │  Implementation concrète pour les repères cartesiens          │
   │  orthonormés (frames rigides)                                │
   │                                                                  │
   │  - Stockage interne : Eigen::Isometry3d                       │
   │  - Transformations : rotation + translation                    │
   │  - Factory methods pour création facile                      │
   └─────────────────────────────────────────────────────────────┘
```

---

## CoordinateSystem : Interface de Base

La classe abstraite `CoordinateSystem` définit l'interface pour toutes les transformations de coordonnées.

### Méthodes Virtuelles Pures

| Méthode | Description |
| :--- | :--- |
| `vectorToGlobal(v_local)` | Rotation d'un vecteur du repère local vers le repère global (push-forward) |
| `vectorToLocal(v_global)` | Rotation d'un vecteur du repère global vers le repère local (pull-back) |
| `tensorToGlobal(T_local)` | Rotation d'un tenseur d'ordre 2 du local vers le global |
| `tensorToLocal(T_global)` | Rotation d'un tenseur d'ordre 2 du global vers le local |
| `pointToGlobal(p_local)` | Transformation d'un point du local vers le global (rotation + translation) |
| `pointToLocal(p_global)` | Transformation d'un point du global vers le local (rotation + translation) |

!!! note "Transformations de Vecteurs vs Points"
    - **Vecteurs** : Seulement rotation (pas de translation)
    - **Tenseurs** : Seulement rotation (pas de translation)
    - **Points** : Rotation + translation (mapping complet)

---

## CartesianSystem : Système Cartésien Orthonormal

La classe `CartesianSystem` implémente un repère cartesien orthonormal défini par :

- **Origine** : Point de référence dans l'espace global
- **Base** : Trois vecteurs unitaires orthogonaux (e₁, e₂, e₃) définissant les axes locaux

### Stockage Interne

```cpp
Eigen::Isometry3d transform_ = Eigen::Isometry3d::Identity();
```

La transformation est stockée sous forme d'isométrie 3D (rotation + translation) de la bibliothèque Eigen.

---

## Création d'un Système de Coordonnées

`CartesianSystem` propose plusieurs méthodes de factory pour créer des repères :

### 1. Repère Identité

Crée un repère à l'origine avec la base canonique (e₁ = [1,0,0], e₂ = [0,1,0], e₃ = [0,0,1]).

```cpp
CartesianSystem system = CartesianSystem::Identity();
```

### 2. À partir d'une Base Orthonormée

Crée un repère avec une origine et une matrice de base orthonormée.

```cpp
Vec3d origin(1.0, 2.0, 3.0);
Mat3d basis;
basis << 1.0, 0.0, 0.0,
           0.0, 1.0, 0.0,
           0.0, 0.0, 1.0;

CartesianSystem system = CartesianSystem::FromBasis(origin, basis);
```

!!! warning "Validation de la Base"
    La matrice doit être une matrice de rotation orthonormée valide. La méthode `validateBasis()` vérifie que :
    - Les colonnes sont unitaires (norme ≈ 1)
    - Les colonnes sont orthogonales entre elles
    - Le déterminant est +1 (pas de réflexion)

### 3. À partir de l'Axe X

Crée un repère avec l'origine et la direction de l'axe X. Les axes Y et Z sont déterminés automatiquement par la méthode de Frisvad pour former une base orthonormée.

```cpp
Vec3d origin(0.0, 0.0, 0.0);
Vec3d x_direction(1.0, 1.0, 0.0); // Direction de l'axe X

CartesianSystem system = CartesianSystem::FromXAxis(origin, x_direction);
```

#### Algorithme de Frisvad

L'algorithme de Frisvad [Frisvad, 2012] est utilisé pour construire une base orthonormée stable à partir d'un seul vecteur directionnel. Il est particulièrement robuste pour les directions proches de l'axe Z.

!!! info "Seuil de Singularité"
    Lorsque la composante Z du vecteur est inférieure à `FrisvadZLimit ≈ -0.9999999` (≈ cos(179.995°)), une branche stable est utilisée pour éviter l'instabilité numérique.

### 4. À partir d'un Plan

Crée un repère avec l'origine, un point définissant l'axe X et un point définissant le plan XY.

```cpp
Vec3d origin(0.0, 0.0, 0.0);
Vec3d point_on_x(1.0, 0.0, 0.0); // Définit la direction de l'axe X
Vec3d point_in_xy(1.0, 1.0, 0.0); // Définit le plan XY

CartesianSystem system = CartesianSystem::FromPlane(origin, point_on_x, point_in_xy);
```

---

## Transformation entre Systèmes Arbitraires

En plus des transformations vers/depuis le repère global, `CartesianSystem` propose des méthodes pour transformer directement entre deux repères arbitraires :

### Méthodes de Transformation Directe

| Méthode | Description | Formule |
| :--- | :--- | :--- |
| `vectorTo(v_this, target)` | Transforme un vecteur de `this` vers `target` | $v_{target} = R_{target\leftarrow this} v_{this}$ |
| `tensorTo(T_this, target)` | Transforme un tenseur de `this` vers `target` | $T_{target} = R_{target\leftarrow this} T_{this} R_{this\leftarrow target}$ |
| `pointTo(p_this, target)` | Transforme un point de `this` vers `target` | $p_{target} = R_{target\leftarrow this} (p_{this} - o_{this}) + o_{target}$ |

### Exemple d'Utilisation

```cpp
// Créer deux systèmes de coordonnées
CartesianSystem systemA = CartesianSystem::FromXAxis(Vec3d(0,0,0), Vec3d(1,0,0));
CartesianSystem systemB = CartesianSystem::FromXAxis(Vec3d(1,0,0), Vec3d(0,1,0));

// Vecteur dans systemA
Vec3d v_A(1.0, 0.0, 0.0);

// Transformer vers systemB
Vec3d v_B = systemA.vectorTo(v_A, systemB);
```

---

## Accesseurs

`CartesianSystem` fournit plusieurs accesseurs pour inspecter le repère :

| Méthode | Retour | Description |
| :--- | :--- | :--- |
| `basis()` | `Mat3d` | Retourne la matrice de base (local → global) |
| `origin()` | `Vec3d` | Retourne l'origine dans les coordonnées globales |
| `ex()` | `Vec3d` | Retourne l'axe X dans les coordonnées globales |
| `ey()` | `Vec3d` | Retourne l'axe Y dans les coordonnées globales |
| `ez()` | `Vec3d` | Retourne l'axe Z dans les coordonnées globales |

---

## Tolérances Numériques

La structure `CartesianSystemTolerances` définit les tolérances numériques utilisées pour la validation :

| Constante | Valeur | Description |
| :--- | :--- | :--- |
| `Norm` | `1e-12` | Norme minimale pour les vecteurs non-nuls |
| `Norm2` | `1e-24` | Norme au carré minimale (évite sqrt) |
| `Matrix` | `1e-10` | Tolérance pour la validation des matrices de rotation |
| `FrisvadZLimit` | `-0.9999999` | Seuil de singularité pour l'algorithme de Frisvad |

---

## Applications dans COMFOR

### 1. Orientation des Matériaux Composites

Les matériaux de type `HYPERTEXTILE` utilisent `CartesianSystem` pour définir les directions des fibres :

```cpp
// Dans HyperTextile::initialize()
CartesianSystem localFrame = CartesianSystem::FromXAxis(
    Vec3d::Zero(),
    warp_orientation_
);
```

### 2. Éléments de Coque

Les éléments `DKT18`, `S3L_C0`, `Membrane3`, `Rod2` utilisent `CartesianSystem` pour gérer leurs repères locaux :

```cpp
// Chaque élément a son propre système de coordonnées local
CartesianSystem elementFrame = ...;

// Transformation des contraintes du local vers le global
Mat3d stressGlobal = elementFrame.tensorToGlobal(stressLocal);
```

### 3. Algorithmes de Contact

Les éléments de contact `ContactTriangle` et `ContactLine` utilisent des transformations de coordonnées pour :

- Calculer les normales de contact
- Détecter les pénétrations
- Calculer les forces de contact dans le bon repère

---

## Exemple Complet : Transformation de Contraintes

```cpp
#include <CoordinateSystems/CartesianSystem.h>

using namespace comfor;

int main() {
    // Créer un système de coordonnées local incliné à 45°
    Vec3d origin(0.0, 0.0, 0.0);
    Mat3d basis;
    double angle = M_PI / 4.0; // 45 degrés
    basis << cos(angle), -sin(angle), 0.0,
              sin(angle),  cos(angle), 0.0,
              0.0,         0.0,        1.0;
    
    CartesianSystem localSystem = CartesianSystem::FromBasis(origin, basis);
    
    // Tenseur des contraintes dans le repère local (ex: matériau orthotrope)
    Mat3d stressLocal = Mat3d::Zero();
    stressLocal(0,0) = 100.0; // Contrainte normale dans la direction des fibres
    stressLocal(1,1) = 50.0;  // Contrainte normale perpendiculaire
    stressLocal(0,1) = 25.0;  // Contrainte de cisaillement
    
    // Transformer vers le repère global
    Mat3d stressGlobal = localSystem.tensorToGlobal(stressLocal);
    
    // Maintenant stressGlobal peut être utilisé dans les calculs globaux
    std::cout << "Stress in global frame:\n" << stressGlobal << std::endl;
    
    return 0;
}
```

---

## Bonnes Pratiques

1. **Utiliser les factory methods** : Préférer `FromXAxis()`, `FromPlane()`, `FromBasis()` plutôt que le constructeur direct
2. **Valider les bases** : Toujours vérifier que la matrice de base est orthonormée valide
3. **Éviter les transformations inutiles** : Les transformations ont un coût computationnel
4. **Utiliser les transformations directes** : Quand possible, utiliser `vectorTo()` et `tensorTo()` plutôt que des transformations intermédiaires

---

## Références

- Frisvad, J. R. (2012). "Building an orthonormal basis, revisited". Journal of Graphics Tools, 16(4), 51-59.
- Eigen Library Documentation: https://eigen.tuxfamily.org/

\bibliography
