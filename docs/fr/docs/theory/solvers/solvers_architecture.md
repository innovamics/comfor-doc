---
title: Architecture des Solveurs
---

## Architecture des Solveurs dans COMFOR

COMFOR utilise une **architecture de solveurs modulaire et extensible** basée sur des principes de programmation orientée objet. Cette section décrit l'implémentation actuelle et la théorie sous-jacente.

### Hiérarchie des Classes

```
┌─────────────────────────────────────────────────────────────┐
│                        Solver (Interface)                         │
├─────────────────────────────────────────────────────────────┤
│  + configure(const ObjectConfig&)                              │
│  + initialize(SimulationData&, SolverState&)                  │
│  + solve(SimulationData&, SolverState&)                        │
│  + type() -> SolverType                                        │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │
              ┌───────────────────────────────┴───────────────────────────────┐
              │                                                               │
              ▼                                                               ▼
   ┌─────────────────────────┐                         ┌─────────────────────────┐
   │    ExplicitSolver         │                         │     (Future) Implicit     │
   │                         │                         │        Solver            │
   │  # computeForces()        │                         │                         │
   │  # computeAccelerations()│                         │                         │
   │  # computeCriticalTimeStep()│                     │                         │
   │  # computeEnergies()      │                         │                         │
   │  # saveKinematics()       │                         │                         │
   │  # saveForces()           │                         │                         │
   └────────────┬────────────┘                         └─────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                   ExplicitIntegrator (Interface)                 │
├─────────────────────────────────────────────────────────────┤
│  + updateKinematics(NodeContainer&, const StepContext&)         │
│  + updateVelocities(NodeContainer&, const StepContext&)         │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │
              ┌───────────────────────────────┴───────────────────────────────┐
              │                                                               │
              ▼                                                               ▼
   ┌─────────────────────────────┐               ┌─────────────────────────────┐
   │  CentralDifferenceIntegrator  │               │    (Future) Other Integrators │
   │                              │               │                             │
   │  Implementation des differences│               │                             │
   │  centrees pour l'integration  │               │                             │
   │  temporelle explicite          │               │                             │
   └─────────────────────────────┘               └─────────────────────────────┘
```

### Énumération des Types de Solveurs

```cpp
enum class SolverType { Explicit, Implicit };
```

---

## SolverState : État Transitoire

La structure `SolverState` encapsule l'état transitoire du solveur pendant l'intégration temporelle.

### Champs

| Champ | Type | Défaut | Description |
| :--- | :--- | :--- | :--- |
| `auto_step` | `bool` | `false` | Indique si le solveur calcule automatiquement le pas de temps |
| `step` | `StepContext` | - | Contexte temporel actuel |
| `energy` | `EnergyBalance` | - | Diagnostics énergétiques globaux |

### StepContext : Contexte Temporel

La structure `StepContext` stocke les temps décalés utilisés par la famille des différences centrées :

| Champ | Type | Description |
| :--- | :--- | :--- |
| `time_n` | `double` | Temps à l'instant entier $t^n$ |
| `dt_forward` | `double` | Intervalle de dérive avant $\Delta t^{n+\frac{1}{2}} = t^{n+1} - t^n$ |
| `dt_backward` | `double` | Intervalle de dérive arrière $\Delta t^{n-\frac{1}{2}} = t^n - t^{n-1}$ |

#### Méthodes Utilitaires

- **`dtCentral()`** : Retourne l'intervalle central $\Delta t^n = \frac{1}{2}(\Delta t^{n-\frac{1}{2}} + \Delta t^{n+\frac{1}{2}})$
- **`timeHalf()`** : Retourne le temps à mi-chemin $t^{n+\frac{1}{2}} = t^n + \frac{1}{2}\Delta t^{n+\frac{1}{2}}$

---

## EnergyBalance : Bilan Énergétique

La structure `EnergyBalance` fournit des diagnostics sur l'équilibre énergétique du système :

| Champ | Type | Défaut | Description |
| :--- | :--- | :--- | :--- |
| `internal` | `double` | `0.0` | Travail interne accumulé |
| `external` | `double` | `0.0` | Travail externe accumulé |
| `kinetic` | `double` | `0.0` | Énergie cinétique instantanée $E_k^n$ |
| `residual` | `double` | `0.0` | Défaut signé du bilan énergétique |
| `balance` | `double` | `0.0` | Défaut absolu $\| \text{residual} \|$ |
| `tolerance` | `double` | `0.0` | Tolérance utilisateur pour interpréter le défaut |
| `conservation` | `bool` | `true` | Vrai lorsque $\| \text{residual} \| \le \text{tolerance}$ |

---

## ExplicitSolver : Implémentation du Solveur Explicite

La classe `ExplicitSolver` est l'implémentation actuelle du solveur de dynamique explicite. Elle hérite de l'interface `Solver` et orchestrer le processus de résolution.

### Responsabilités

1. **Gestion de l'horloge** : Maintenir le temps de simulation et les intervalles
2. **Assemblage des forces** : Combiner les contributions des éléments, charges et contacts
3. **Calcul des accélérations** : Évaluer l'accélération algorithmique pour chaque nœud
4. **Délégation à l'intégrateur** : Transmettre la mise à jour cinématique à l'intégrateur
5. **Calcul du pas de temps critique** : Déterminer $\Delta t_{\text{crit}}$ pour le système
6. **Diagnostics énergétiques** : Mettre à jour et vérifier le bilan énergétique

### Paramètres de Configuration

| Paramètre | Type | Défaut | Description |
| :--- | :--- | :--- | :--- |
| `integrator` | `string` | `"central_difference"` | Type d'intégrateur à utiliser |
| `time_step_factor` | `double` | `0.9` | Facteur de sécurité pour le pas de temps automatique |
| `energy_balance_epsilon` | `double` | `1.0e-2` | Tolérance pour la vérification du bilan énergétique |

### Méthodes Principales

| Méthode | Description |
| :--- | :--- |
| `computeForces()` | Assemble les états de forces nodales internes, externes et de contact |
| `computeAccelerations()` | Calcule les accélérations algorithmiques pour chaque nœud |
| `computeCriticalTimeStep()` | Retourne le pas de temps critique minimal sur tous les éléments actifs |
| `computeEnergies()` | Met à jour les diagnostics énergétiques globaux |
| `saveKinematics()` | Sauvegarde la cinématique convergée pour l'incrément suivant |
| `saveForces()` | Sauvegarde les forces assemblées pour l'incrément de travail suivant |

---

## CentralDifferenceIntegrator : Intégrateur par Différences Centrées

La classe `CentralDifferenceIntegrator` implémente le schéma d'intégration temporelle des différences centrées pour la dynamique explicite.

### Algorithme

1. **Mise à jour des vitesses** : $\mathbf{v}^{n+\frac{1}{2}} = \mathbf{v}^{n-\frac{1}{2}} + \Delta t^{n+\frac{1}{2}} \, \mathbf{a}^n$
2. **Mise à jour des positions** : $\mathbf{u}^{n+1} = \mathbf{u}^n + \Delta t^{n+1} \, \mathbf{v}^{n+\frac{1}{2}}$
3. **Mise à jour des coordonnées** : $\mathbf{x}^{n+1} = \mathbf{x}^n + \mathbf{u}^{n+1}$

### Collaboration avec ExplicitSolver

L'intégrateur travaille en étroite collaboration avec `ExplicitSolver` :

1. `ExplicitSolver` assemble les forces et calcule les accélérations
2. `CentralDifferenceIntegrator` utilise ces accélérations pour mettre à jour les vitesses et positions
3. Le cycle se répète pour chaque incrément de temps

---

## Flux de Résolution Explicite

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CYCLE DE RÉSOLUTION EXPLICITE                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. INITIALISATION                                                     │
│     ├── Charger le modèle (maillage, matériaux, sections, etc.)        │
│     ├── Configurer le solveur (ExplicitSolver)                         │
│     ├── Initialiser l'intégrateur (CentralDifferenceIntegrator)       │
│     └── Préparer l'état initial (SolverState)                          │
│                                                                         │
│  2. BOUCLE DE TEMPS (t^n → t^{n+1})                                   │
│     ├── computeForces()                                               │
│     │   ├── Assembler forces internes (éléments)                     │
│     │   ├── Assembler forces externes (charges)                       │
│     │   └── Assembler forces de contact                               │
│     │                                                                 │
│     ├── computeAccelerations()                                        │
│     │   └── a^n = M^{-1}(f_ext^n - f_int^n - C^d v^{n-1/2})           │
│     │                                                                 │
│     ├── computeCriticalTimeStep()                                     │
│     │   └── Δt_crit = α min_e(l_e / c_e)                              │
│     │                                                                 │
│     ├── integrator->updateVelocities()                                │
│     │   └── v^{n+1/2} = v^{n-1/2} + Δt^{n+1/2} a^n                     │
│     │                                                                 │
│     ├── integrator->updateKinematics()                                │
│     │   ├── u^{n+1} = u^n + Δt^{n+1} v^{n+1/2}                         │
│     │   └── x^{n+1} = x^n + u^{n+1}                                   │
│     │                                                                 │
│     ├── computeEnergies()                                              │
│     │   ├── Calculer énergie cinétique                                │
│     │   ├── Calculer travail interne                                  │
│     │   ├── Calculer travail externe                                  │
│     │   └── Vérifier conservation d'énergie                            │
│     │                                                                 │
│     ├── saveKinematics()                                               │
│     │   └── Sauvegarder x^{n+1}, v^{n+1/2} pour l'itération suivante     │
│     │                                                                 │
│     ├── saveForces()                                                   │
│     │   └── Sauvegarder f_int^n, f_ext^n pour l'itération suivante      │
│     │                                                                 │
│     └── state.advanceClock()                                           │
│         ├── dt_backward = dt_forward                                  │
│         └── time_n += dt_forward                                       │
│                                                                         │
│  3. SORTIE (si nécessaire)                                             │
│     ├── Écrire résultats VTU/VTK                                      │
│     ├── Écrire données de trackers (CSV)                              │
│     └── Vérifier convergence si temps final atteint                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Avantages de l'Architecture Actuelle

1. **Modularité** : Séparation claire entre solveur, intégrateur et logique métier
2. **Extensibilité** : Facile à étendre avec de nouveaux types de solveurs (implicite, etc.)
3. **Maintenabilité** : Code bien structuré et documenté
4. **Performance** : Optimisé pour les simulations explicites à grande échelle
5. **Diagnostics** : Bilan énergétique intégré pour vérifier la stabilité numérique

---

## Exemple de Configuration TOML

```toml
[control]
run_from = 0.0
run_to = 10.0

# Configuration explicite avec pas de temps automatique
[solver]
type = "EXPLICIT"
integrator = "central_difference"
time_step_factor = 0.9
energy_balance_epsilon = 1.0e-2

# Configuration avec pas de temps fixe
[solver]
type = "EXPLICIT"
integrator = "central_difference"
time_step = 0.001
energy_balance_epsilon = 1.0e-3
```

---

## Références

- [Sémantique temporelle](../../../developers/temporal_semantics.md) - Conventions de temps dans COMFOR
- [Amortissement de Rayleigh explicite](explicit_rayleigh_damping.md) - Traitement de l'amortissement

\bibliography
