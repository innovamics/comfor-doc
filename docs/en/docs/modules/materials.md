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
  [<span style="color: #76B900; font-weight: bold;">Elastic</span>](#elastic_models)

- :material-vector-bezier:{ .lg .middle }
  [<span style="color: #c73131ff; font-weight: bold;">Hyperelastic</span>](#hyperelastic_models)

- :material-grid:{ .lg .middle }
  [<span style="color: #2B17E5; font-weight: bold;">Composite</span>](#composite_hypertextile)

</div>

This section provides a **practical overview** of the material models available in **COMFOR**. For detailed theoretical background and mathematical formulations, refer to the [Theory section](../theory/theory_overview.md).

# Available Material Models

## Common Parameters for All Materials

Every material block requires these base parameters regardless of the underlying constitutive law.

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Yes** | - | Material model keyword (`ELASTIC`, `HYPERELASTIC`, `HYPERTEXTILE`). |
| **`density`** | Float | **Yes** | - | Mass density ($\rho$). Must be strictly positive. |
| `damping` | Float | No | `0.0` | Mass-proportional Rayleigh damping coefficient ($\alpha$). Must be non-negative. |

---

## Elastic Models

Standard isotropic linear elasticity based on Hooke's Law ([Saint-Venant-Kirchhoff](../theory/materials/materials_overview.md#isotropic_kirchhoff) formulation). It assumes a plane stress state for 2D elements and is suitable for small strains with large rotations.

### Parameters

| Parameter | Type | Required | Range | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`young`** | Float | **Yes** | $>0$ | Young's Modulus ($E$). |
| **`poisson`** | Float | **Yes** | $[0, 0.5]$ | Poisson's ratio ($\nu$). |

### Examples

=== "TOML :simple-toml:"
    ```toml 
    [material.Steel_S235]
    type = "ELASTIC"
    density = 7.8e-9
    young = 210000.0
    poisson = 0.3
    damping = 0.1
    ```

=== "Fembic :material-text:"
    ```xml
    MATERIALS TYPE ELASTIC
    Steel_S235 DENSITY = 7.8e-9 YOUNG = 210000.0 POISSON = 0.3 DAMPING = 0.1
    ```

---

## Hyperelastic Models

Non-linear elastic models designed for materials undergoing finite strains (large deformations), such as rubbers or soft membranes. Currently supports the **Ogden** strain energy potential for incompressible materials.

### Parameters (Ogden)

| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| **`potential`** | String | **Yes** | Potential model type. Must be set to `OGDEN`. |
| **`mu`** | Array | **Yes** | List of shear moduli $\mu_i$. |
| **`alpha`** | Array | **Yes** | List of non-linear dimensionless exponents $\alpha_i$. |

!!! note "Array Consistency"
    The `mu` and `alpha` arrays must have the exact same number of entries. Each pair $(\mu_i, \alpha_i)$ defines one term of the Ogden strain energy potential.

### Examples

=== "TOML :simple-toml:"
    ```toml
    [material.Rubber]
    type = "HYPERELASTIC"
    potential = "OGDEN"
    density = 1.1e-9
    mu = [ -0.09, 13.9, -0.20 ]
    alpha = [ -13.7, 0.10, 5.06 ]
    ```

=== "Fembic :material-text:"
    ```xml
    MATERIALS TYPE HYPERELASTIC
    Rubber DENSITY = 1.1e-9 POTENTIAL = OGDEN MU = [-0.09, 13.9, -0.20] ALPHA = [-13.7, 0.10, 5.06]
    ```

---

## Composite (Hypertextile)

Designed for [**anisotropic textile materials**](../theory/materials/materials_overview.md#textile_composite_hyperelastic_materials) (e.g., dry or impregnated woven composites). It is an advanced invariant-based model (`HYPERTEXTILE`) that decouples fiber elongation in warp and weft directions from in-plane shear and out-of-plane bending.

### Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`warp_orientation`** | Array | **Yes** | - | Initial warp fiber unit vector $[x, y, z]$. |
| **`weft_orientation`** | Array | **Yes** | - | Initial weft fiber unit vector $[x, y, z]$. |
| **`k_elong_warp`** | Array | **Yes** | - | Polynomial coefficients for warp elongation stiffness. |
| **`k_elong_weft`** | Array | **Yes** | - | Polynomial coefficients for weft elongation stiffness. |
| **`k_shear`** | Array | **Yes** | - | Polynomial coefficients for in-plane shear stiffness. |
| `k_bend_warp` | Array | No | - | Optional polynomial coefficients for warp bending moments. |
| `k_bend_weft` | Array | No | - | Optional polynomial coefficients for weft bending moments. |
| `k_bend_twist` | Array | No | - | Optional polynomial coefficients for twisting stiffness. |

!!! tip "Orientation Projection"
    During initialization, COMFOR automatically projects the global orientation vectors onto the local basis of each element. If a fiber direction is found to be perpendicular to an element's plane, the simulation will stop with a validation error.

### Examples

=== "TOML :simple-toml:"
    ```toml
    [material.CarbonFabric]
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
    CarbonFabric DENSITY = 1.5e-9 WARP_ORIENTATION = [1,0,0] WEFT_ORIENTATION = [0,1,0] K_ELONG_WARP = [150,1000] K_ELONG_WEFT = [150,1000] K_SHEAR = [2.1,4.5] K_BEND_WARP = [0.05]
    ```

---

# Choose a Material Model

- Use **Elastic** (`ELASTIC`) for small strain applications or rigid-like tool interactions.
- Use **Hyperelastic** (`HYPERELASTIC`) for finite strain isotropic materials (e.g., rubber, elastomer membranes).
- Use **Composite** (`HYPERTEXTILE`) for anisotropic dry or impregnated woven fabrics.

For advanced use cases and complete mathematical formulations, refer to the [Theory section](../theory/materials/materials_overview.md).