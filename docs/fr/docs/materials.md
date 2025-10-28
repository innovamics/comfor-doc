<div class="grid cards" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))" markdown>

- :material-vector-line:{ .lg .middle }
  [<span style="color: #76B900; font-weight: bold;">Élastique</span>](#modeles_elastiques)
  
- :material-vector-bezier:{ .lg .middle }
  [<span style="color: #c73131ff; font-weight: bold;">Hyperélastique</span>](#modeles_hyperelastiques)

- :material-grid:{ .lg .middle }
  [<span style="color: #2B17E5; font-weight: bold;">Composite</span>](#composite)
  
</div>

Cette section offre un **aperçu pratique** des modèles de matériaux disponibles dans Comfor. Pour les fondements théoriques détaillés, consultez la [section Théorie](theory/theory_overview.md).

# Modèles de matériaux disponibles

## Paramètres communs à tous les matériaux

| Paramètre        | Description                     | Obligatoire |
|------------------|---------------------------------|-------------|
| `material_name`  | Nom personnalisé du matériau    | Oui         |
| `RHO`            | Masse volumique du matériau     | Oui         |
| `DAMPING`        | Amortissement proportionnel    | Non         |

## Modèles élastiques

Les matériaux élastiques dans Comfor sont modélisés à l'aide de la **loi constitutive de Saint-Venant-Kirchhoff**, adaptée aux petites déformations et grandes rotations.

**Paramètres clés**

- `E` : Module de Young
- `NU` : Coefficient de Poisson

**Exemple**

```xml
MATERIALS TYPE ELASTIC
<material_name> RHO = <masse_volumique> DAMPING = <valeur_amortissement> E = <module_young> NU = <coefficient_poisson>
```

## Modèles hyperélastiques

Les modèles **hyperélastiques** sont utilisés pour les matériaux subissant de grandes déformations, comme le caoutchouc ou les composites textiles.

### Modèle d'Ogden

- Convient aux **matériaux hyperélastiques isotropes** (ex. : caoutchouc, membranes).
- Nécessite les paramètres : `MU` (modules de cisaillement) et `ALPHA` (exposants sans dimension).

**Exemple**

```xml
MATERIALS TYPE HYPERELASTIC
<material_name> RHO = <masse_volumique> DAMPING = <valeur_amortissement> TYPE = OGDEN MU = <mu_1, mu_2, ...> ALPHA = <alpha_1, alpha_2, ...>
```

!!! note
    Le nombre de paramètres `MU` et `ALPHA` doit être identique.

## Composite

Conçu pour les **matériaux textiles anisotropes** (ex. : composites tissés).
Nécessite des paramètres d'orientation pour les directions chaîne/trame et des coefficients de raideur.

**Paramètres clés**

- `WARPORI` : Orientation initiale de la chaîne (vecteur : `l1_x, l1_y, l1_z`).
- `WEFTORI` : Orientation initiale de la trame (vecteur : `l2_x, l2_y, l2_z`).
- `KELONGWARP`, `KELONGWEFT`, `KSHEAR` : Coefficients de raideur pour l'élongation et le cisaillement.

**Exemple**

```xml
MATERIALS TYPE HYPERTEXTILE
<material_name> RHO = <masse_volumique> DAMPING = <valeur_amortissement> WARPORI = <l1_x, l1_y, l1_z> WEFTORI = <l2_x, l2_y, l2_z> KELONGWARP = <k1, k2, ...> KELONGWEFT = <k1, k2, ...> KSHEAR = <k1, k2, ...>
```

# Choisir un modèle de matériau

- Utilisez **Élastique** pour les applications à petites déformations (ex. : outils).
- Utilisez **Hyperélastique** pour les grandes déformations des matériaux isotropes (ex. : caoutchouc, membranes).
- Utilisez **Composite textile** pour les matériaux anisotropes tissés.

Pour des cas d'utilisation avancés, consultez la [section Théorie](theory/materials/materials_overview.md).
