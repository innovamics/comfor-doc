<style>
  .md-sidebar--secondary .md-nav__list .md-nav__list .md-nav__item .md-nav {
    display: none !important;
  }

  .md-typeset td:first-child, .md-typeset th:first-child {
    white-space: nowrap;
  }
</style>

<div class="grid cards" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))" markdown>

- :material-vector-line:{ .lg .middle }
  [<span style="color: #76B900; font-weight: bold;">Élastique</span>](#modeles_elastiques_elastic_models)

- :material-vector-bezier:{ .lg .middle }
  [<span style="color: #c73131ff; font-weight: bold;">Hyperélastique</span>](#modeles_hyperelastiques_hyperelastic_models)

- :material-grid:{ .lg .middle }
  [<span style="color: #2B17E5; font-weight: bold;">Composite</span>](#composite_hypertextile)

</div>

Cette section présente une **vue d'ensemble pratique** des modèles de matériaux disponibles dans **COMFOR**. Pour les aspects théoriques détaillés et les formulations mathématiques complètes, reportez-vous à la [Section Théorie](../theory/theory_overview.md).

# Modèles de Matériaux Disponibles

## Paramètres Communs à Tous les Matériaux

Chaque bloc de matériau nécessite ces paramètres de base, quelle que soit la loi de comportement sous-jacente :

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Oui** | - | Mot-clé du modèle de matériau (`ELASTIC`, `HYPERELASTIC`, `HYPERTEXTILE`). |
| **`density`** | Float | **Oui** | - | Masse volumique ($\rho$). Doit être strictement positive. |
| `damping` | Float | Non | `0.0` | Coefficient d'amortissement de Rayleigh proportionnel à la masse ($\alpha$). Doit être non-négatif. |

---

## Modèles Élastiques (Elastic Models)

Élasticité linéaire isotrope standard basée sur la loi de Hooke (formulation de [Saint-Venant-Kirchhoff](../theory/materials/materials_overview.md#materiau_isotrope_de_kirchhoff)). Elle suppose un état de contraintes planes pour les éléments 2D et convient aux petites déformations avec de grandes rotations.

### Paramètres

| Paramètre | Type | Requis | Plage | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`young`** | Float | **Oui** | $>0$ | Module de Young ($E$). |
| **`poisson`** | Float | **Oui** | $[0, 0.5]$ | Coefficient de Poisson ($\nu$). |

### Exemples

=== "TOML :simple-toml:"
    ```toml 
    [material.Acier_S235]
    type = "ELASTIC"
    density = 7.8e-9
    young = 210000.0
    poisson = 0.3
    damping = 0.1
    ```

=== "Fembic :material-text:"
    ```xml
    MATERIALS TYPE ELASTIC
    Acier_S235 DENSITY = 7.8e-9 YOUNG = 210000.0 POISSON = 0.3 DAMPING = 0.1
    ```

---

## Modèles Hyperélastiques (Hyperelastic Models)

Modèles non linéaires conçus pour les matériaux subissant de grandes déformations (grandes transformations), tels que les caoutchoucs ou les membranes souples. Prend actuellement en charge le potentiel d'énergie de déformation d'**Ogden** pour les matériaux incompressibles.

### Paramètres (Ogden)

| Paramètre | Type | Requis | Description |
| :--- | :--- | :---: | :--- |
| **`potential`** | String | **Oui** | Type de potentiel. Doit être défini sur `OGDEN`. |
| **`mu`** | Array | **Oui** | Liste des modules de cisaillement $\mu_i$. |
| **`alpha`** | Array | **Oui** | Liste des exposants adimensionnels non linéaires $\alpha_i$. |

!!! note "Cohérence des Tableaux"
    Les tableaux `mu` et `alpha` doivent contenir exactement le même nombre d'entrées. Chaque paire $(\mu_i, \alpha_i)$ définit un terme du potentiel d'énergie de déformation d'Ogden.

### Exemples

=== "TOML :simple-toml:"
    ```toml
    [material.Caoutchouc]
    type = "HYPERELASTIC"
    potential = "OGDEN"
    density = 1.1e-9
    mu = [ -0.09, 13.9, -0.20 ]
    alpha = [ -13.7, 0.10, 5.06 ]
    ```

=== "Fembic :material-text:"
    ```xml
    MATERIALS TYPE HYPERELASTIC
    Caoutchouc DENSITY = 1.1e-9 POTENTIAL = OGDEN MU = [-0.09, 13.9, -0.20] ALPHA = [-13.7, 0.10, 5.06]
    ```

---

## Composite (Hypertextile)

Conçu pour les [**matériaux textiles anisotropes**](../theory/materials/materials_overview.md#materiaux_textiles_hyperelastiques) (ex: composites tissés secs ou imprégnés). Il s'agit d'un modèle avancé basé sur les invariants (`HYPERTEXTILE`) qui découple l'allongement des fibres dans les directions chaîne (warp) et trame (weft) du cisaillement plan et de la flexion hors-plan.

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`warp_orientation`** | Array | **Oui** | - | Vecteur unitaire d'orientation initiale de la chaîne $[x, y, z]$. |
| **`weft_orientation`** | Array | **Oui** | - | Vecteur unitaire d'orientation initiale de la trame $[x, y, z]$. |
| **`k_elong_warp`** | Array | **Oui** | - | Coefficients polynomiaux pour la rigidité en allongement chaîne. |
| **`k_elong_weft`** | Array | **Oui** | - | Coefficients polynomiaux pour la rigidité en allongement trame. |
| **`k_shear`** | Array | **Oui** | - | Coefficients polynomiaux pour la rigidité en cisaillement plan. |
| `k_bend_warp` | Array | Non | - | Coefficients polynomiaux optionnels pour les moments de flexion chaîne. |
| `k_bend_weft` | Array | Non | - | Coefficients polynomiaux optionnels pour les moments de flexion trame. |
| `k_bend_twist` | Array | Non | - | Coefficients polynomiaux optionnels pour la rigidité en torsion. |

!!! tip "Projection de l'Orientation"
    Lors de l'initialisation, COMFOR projette automatiquement les vecteurs d'orientation globaux sur la base locale de chaque élément. Si une direction de fibre s'avère être perpendiculaire au plan d'un élément, la simulation s'arrêtera avec une erreur de validation.

### Exemples

=== "TOML :simple-toml:"
    ```toml
    [material.TissuCarbone]
    type = "HYPERTEXTILE"
    density = 1.5e-9
    warp_orientation = [1.0, 0.0, 0.0]
    weft_orientation = [0.0, 1.0, 0.0]
    k_elong_warp = [150.0, 1000.0]
    k_elong_weft = [150.0, 1000.0]
    k_shear = [2.1, 4.5]
    k_bend_warp = [0.05]
    ```

=== "Fembic :material-text:"
    ```xml
    MATERIALS TYPE HYPERTEXTILE
    TissuCarbone DENSITY = 1.5e-9 WARP_ORIENTATION = [1,0,0] WEFT_ORIENTATION = [0,1,0] K_ELONG_WARP = [150,1000] K_ELONG_WEFT = [150,1000] K_SHEAR = [2.1,4.5] K_BEND_WARP = [0.05]
    ```

---

# Choisir un Modèle de Matériau

- Utilisez **Élastique** (`ELASTIC`) pour les applications en petites déformations ou les interactions avec des outils quasi-rigides.
- Utilisez **Hyperélastique** (`HYPERELASTIC`) pour les matériaux isotropes en grandes déformations (ex: caoutchoucs, membranes élastomères).
- Utilisez **Composite** (`HYPERTEXTILE`) pour les tissus tissés anisotropes secs ou imprégnés.

Pour les cas d'utilisation avancés et les formulations mathématiques complètes, reportez-vous à la [Section Théorie](../theory/materials/materials_overview.md).