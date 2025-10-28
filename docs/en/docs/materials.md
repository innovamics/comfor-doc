<div class="grid cards" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))" markdown>

- :material-vector-line:{ .lg .middle }
  [<span style="color: #76B900; font-weight: bold;">Elastic</span>](#elastic_models)

- :material-vector-bezier:{ .lg .middle }
  [<span style="color: #c73131ff; font-weight: bold;">Hyperelastic</span>](#hyperelastic_models)

- :material-grid:{ .lg .middle }
  [<span style="color: #2B17E5; font-weight: bold;">Composite</span>](#composite)

</div>

This section provides a **practical overview** of the material models available in Comfor. For detailed theoretical background, refer to the [Theory section](theory/theory_overview.md).

# Available material models

## Common parameters for all materials

| Parameter       | Description                   | Required |
| --------------- | ----------------------------- | -------- |
| `material_name` | Custom name for the material. | Yes      |
| `RHO`           | Mass density of the material. | Yes      |
| `DAMPING`       | Mass proportional damping     | No       |

## Elastic models

Elastic materials in Comfor are modeled using the [**Saint-Venant-Kirchhoff**](theory/materials/materials_overview.md#isotropic_kirchhoff) constitutive law, suitable for small strains and large rotations.

**Key parameters**

- `E`: Young's modulus
- `NU`: Poisson's ratio

**Example**

```xml
MATERIALS TYPE ELASTIC
<material_name> RHO = <mass_density> DAMPING = <damping_value> E = <young_modulus> NU = <poissons_ratio>
```

## Hyperelastic models

[**Hyperelastic**](theory/materials/materials_overview.md#hyperelastic_materials) models are used for materials undergoing large deformations, such as rubber or textile composites.

### Ogden model

- Suitable for **isotropic hyperelastic materials** (e.g., rubber, membranes).
- Requires parameters: `MU` (shear moduli) and `ALPHA` (dimensionless exponents).

**Example**

```xml
MATERIALS TYPE HYPERELASTIC
<material_name> RHO = <mass_density> DAMPING = <damping_value> TYPE = OGDEN MU = <mu_1, mu_2, ...> ALPHA = <alpha_1, alpha_2, ...>
```

!!! note
    The number of `MU` and `ALPHA` parameters must be equal.

## Composite

- Designed for [**anisotropic textile materials**](theory/materials/materials_overview.md#textile_composite_hyperelastic_materials)(e.g., woven composites).
- Requires orientation parameters for warp/weft directions and stiffness coefficients.

**Key parameters**

- `WARPORI`: Initial warp orientation (vector: `l1_x, l1_y, l1_z`).
- `WEFTORI`: Initial weft orientation (vector: `l2_x, l2_y, l2_z`).
- `KELONGWARP`, `KELONGWEFT`, `KSHEAR`: Stiffness coefficients for elongation and shear.

**Example**

```xml
MATERIALS TYPE HYPERTEXTILE
<material_name> RHO = <mass_density> DAMPING = <damping_value> WARPORI = <l1_x, l1_y, l1_z> WEFTORI = <l2_x, l2_y, l2_z> KELONGWARP = <k1, k2, ...> KELONGWEFT = <k1, k2, ...> KSHEAR = <k1, k2, ...>
```

# Choose a material model

- Use **Elastic** for small strain applications (e.g., tools).
- Use **Hyperelastic** for finite strain for isotropic materials (e.g., rubber, membranes).
- Use **Textile Composite** for anisotropic woven materials.

For advanced use cases, refer to the [Theory section](theory/materials/materials_overview.md).
