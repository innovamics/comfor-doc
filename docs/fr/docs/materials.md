<style>
  .md-sidebar--secondary .md-nav__list .md-nav__list .md-nav__item .md-nav {
    display: none !important;
  }
</style>

<div class="grid cards" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))" markdown>

- :material-vector-line:{ .lg .middle }
  [<span style="color: #76B900; font-weight: bold;">Élastique</span>](#modeles_elastiques)

- :material-vector-bezier:{ .lg .middle }
  [<span style="color: #c73131ff; font-weight: bold;">Hyperélastique</span>](#modeles_hyperelastiques)

- :material-grid:{ .lg .middle }
  [<span style="color: #2B17E5; font-weight: bold;">Composite</span>](#composite_textile)

</div>

Cette section fournit un **aperçu technique complet** des modèles de matériaux disponibles dans **COMFOR**. Pour des détails théoriques approfondis et les formulations mathématiques, veuillez vous référer à la [section Théorie](theory/theory_overview.md).

# Modèles de matériaux disponibles

## Paramètres communs à tous les matériaux

Chaque bloc de matériau nécessite ces paramètres de base, quelle que soit la loi de comportement utilisée.

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| `type` | String | **Oui** | - | Mot-clé du modèle de matériau (ex: `ELASTIC`). |
| `density` | Float | **Oui** | - | Masse volumique ($\rho$). |
| `damping` | Float | Non | `0.0` | Coefficient d'amortissement de Rayleigh proportionnel à la masse. |

---

## Modèles élastiques

Les matériaux élastiques dans **COMFOR** utilisent la loi de [**Saint-Venant-Kirchhoff**](theory/materials/materials_overview.md#materiau_isotrope_de_kirchhoff), qui convient aux petites déformations mais permet de grandes rotations.

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| `young` | Float | **Oui** | - | Module de Young ($E$). |
| `poisson` | Float | **Oui** | - | Coefficient de Poisson ($\nu$). |

### Exemples

=== "TOML :simple-toml:"
	```toml
	[material.Acier_S235]
	type = "ELASTIC"
	density = 7.8e-9
	young = 210000.0
	poisson = 0.3
	```

=== "Fembic :material-text:"
	```xml
	MATERIALS TYPE ELASTIC Steel_S235 RHO = 7.8e-9 YOUNG = 210000.0 POISSON = 0.3
	```

---

## Modèles hyperélastiques

Les modèles [**hyperélastiques**](theory/materials/materials_overview.md#materiaux_hyperelastiques) sont conçus pour les matériaux subissant des déformations finies (grandes déformations), comme les caoutchoucs ou les membranes souples.

### Paramètres (Ogden)

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| `potential` | String | **Oui** | - | Doit être réglé sur `OGDEN`. |
| `mu` | Array | **Oui** | - | Liste des modules de cisaillement $\mu_i$. |
| `alpha` | Array | **Oui** | - | Liste des exposants adimensionnels $\alpha_i$. |

!!! note "Cohérence des tableaux"
	Les tableaux `mu` et `alpha` doivent avoir le même nombre d'éléments. Chaque paire définit un terme du potentiel d'énergie de déformation.

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
	MATERIALS TYPE HYPERELASTIC Caoutchouc RHO = 1.1e-9 TYPE = OGDEN MU = [-0.09, 13.9, -0.20] ALPHA = [-13.7, 0.10, 5.06]
	```

---

## Composite (Textile)

Conçu pour les [**matériaux textiles anisotropes**](theory/materials/materials_overview.md#materiaux_textiles_hyperelastiques) (ex: composites tissés). Ce modèle nécessite des paramètres d'orientation pour les directions chaîne/trame et des coefficients de rigidité.

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| `warp_orientation` | Array | **Oui** | - | Vecteur unitaire initial des fibres de chaîne $[x, y, z]$. |
| `weft_orientation` | Array | **Oui** | - | Vecteur unitaire initial des fibres de trame $[x, y, z]$. |
| `k_elong_warp` | Array | **Oui** | - | Coefficients de rigidité en allongement pour la chaîne. |
| `k_elong_weft` | Array | **Oui** | - | Coefficients de rigidité en allongement pour la trame. |
| `k_shear` | Array | **Oui** | - | Coefficients de rigidité pour le cisaillement plan. |
| `k_bend_warp` | Array | Non | `[0.0]` | Coefficients optionnels pour la flexion chaîne. |
| `k_bend_weft` | Array | Non | `[0.0]` | Coefficients optionnels pour la flexion trame. |
| `k_bend_twist` | Array | Non | `[0.0]` | Coefficients optionnels pour la rigidité en torsion. |

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
	k_bend_warp = [0.05] # Flexion optionnelle
	```

=== "Fembic :material-text:"
	```xml
	MATERIALS TYPE HYPERTEXTILE TissuCarbone RHO = 1.5e-9 WARPORI = [1,0,0] WEFTORI = [0,1,0] KELONGWARP = [150,1000] KELONGWEFT = [150,1000] KSHEAR = [2.1,4.5] KBENDWARP = [0.05]
	```

---

# Choisir un modèle de matériau

  - Utilisez **Élastique** pour les applications à faibles déformations (ex: outillages, moules).
  - Utilisez **Hyperélastique** pour les grandes déformations des matériaux isotropes (ex: caoutchoucs, membranes).
  - Utilisez **Composite Textile** pour les matériaux tissés anisotropes.

Pour les cas d'utilisation avancés, reportez-vous à la [section Théorie](theory/materials/materials_overview.md).
