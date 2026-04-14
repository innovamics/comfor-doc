<style>
  .md-sidebar--secondary .md-nav__list .md-nav__list .md-nav__item .md-nav {
    display: none !important;
  }
</style>

<div class="grid cards" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))" markdown>

- :material-vector-line:{ .lg .middle }
  [<span style="color: #76B900; font-weight: bold;">Elastic</span>](#elastic_models)

- :material-vector-bezier:{ .lg .middle }
  [<span style="color: #c73131ff; font-weight: bold;">Hyperelastic</span>](#hyperelastic_models)

- :material-grid:{ .lg .middle }
  [<span style="color: #2B17E5; font-weight: bold;">Composite</span>](#composite)

</div>

This section provides a **practical overview** of the material models available in **COMFOR**. For detailed theoretical background and mathematical formulations, refer to the [Theory section](theory/theory_overview.md).

# Available material models

## Common parameters for all materials

Every material block requires these base parameters regardless of the underlying constitutive law.

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| `type` | String | **Yes** | - | Material model keyword. |
| `density` | Float | **Yes** | - | Mass density ($\rho$). |
| `damping` | Float | No | `0.0` | Mass proportional Rayleigh damping. |

---

## Elastic models

Elastic materials in **COMFOR** use the [**Saint-Venant-Kirchhoff**](theory/materials/materials_overview.md#isotropic_kirchhoff) law, which is suitable for small strains but allows for large rotations.

### Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| `young` | Float | **Yes** | - | Young's modulus ($E$). |
| `poisson` | Float | **Yes** | - | Poisson's ratio ($\nu$). |

### Examples

=== "TOML :simple-toml:"
    ```toml 
    [material.Steel_S235]
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

## Hyperelastic models

[**Hyperelastic**](theory/materials/materials_overview.md#hyperelastic_materials) models are designed for materials undergoing finite strains (large deformations), such as rubbers or soft membranes.

### Parameters (Ogden)

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| `potential` | String | **Yes** | - | Must be set to `OGDEN`. |
| `mu` | Array | **Yes** | - | List of shear moduli $\mu_i$. |
| `alpha` | Array | **Yes** | - | List of dimensionless exponents $\alpha_i$. |

!!! note
	The `mu` and `alpha` arrays must have the same number of elements. Each pair defines one term of the strain energy potential.

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
    MATERIALS TYPE HYPERELASTIC Rubber RHO = 1.1e-9 TYPE = OGDEN MU = [-0.09, 13.9, -0.20] ALPHA = [-13.7, 0.10, 5.06]
    ```

---

## Composite

Designed for [**anisotropic textile materials**](theory/materials/materials_overview.md#textile_composite_hyperelastic_materials) (e.g., woven composites). Requires orientation parameters for warp/weft directions and stiffness coefficients.

### Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| `warp_orientation` | Array | **Yes** | - | Initial warp fiber unit vector $[x, y, z]$. |
| `weft_orientation` | Array | **Yes** | - | Initial weft fiber unit vector $[x, y, z]$. |
| `k_elong_warp` | Array | **Yes** | - | Coefficients for warp elongation stiffness. |
| `k_elong_weft` | Array | **Yes** | - | Coefficients for weft elongation stiffness. |
| `k_shear` | Array | **Yes** | - | Coefficients for in-plane shear stiffness. |
| `k_bend_warp` | Array | No | `[0.0]` | Optional coefficients for warp bending. |
| `k_bend_weft` | Array | No | `[0.0]` | Optional coefficients for weft bending. |
| `k_bend_twist` | Array | No | `[0.0]` | Optional coefficients for twisting stiffness. |

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
	k_bend_warp = [0.05] # Optional bending
	```

=== "Fembic :material-text:"
	```xml
	MATERIALS TYPE HYPERTEXTILE CarbonFabric RHO = 1.5e-9 WARPORI = [1,0,0] WEFTORI = [0,1,0] KELONGWARP = [150,1000] KELONGWEFT = [150,1000] KSHEAR = [2.1,4.5] KBENDWARP = [0.05]
	```

---

# Choose a material model

- Use **Elastic** for small strain applications (e.g., tools).
- Use **Hyperelastic** for finite strain for isotropic materials (e.g., rubber, membranes).
- Use **Textile Composite** for anisotropic woven materials.

For advanced use cases, refer to the [Theory section](theory/materials/materials_overview.md).
