<style>
  .md-sidebar--secondary .md-nav__list .md-nav__list .md-nav__item .md-nav {
    display: none !important;
  }

  .md-typeset td:first-child, .md-typeset th:first-child {
    white-space: nowrap;
  }
</style>

<div class="grid cards" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))" markdown>

- :material-vector-line:{ .lg .middle }
  [<span style="color: #76B900; font-weight: bold;">1D Rod</span>](#rod_sections)

- :material-vector-triangle:{ .lg .middle }
  [<span style="color: #c73131ff; font-weight: bold;">Shell & Membrane</span>](#shell_membrane_sections)

- :material-cube-outline:{ .lg .middle }
  [<span style="color: #2B17E5; font-weight: bold;">Rigid</span>](#rigid_sections)

</div>

This section provides a **practical overview** of the section formulations available in **COMFOR**. Sections bridge structural finite elements with constitutive material laws by defining geometric cross-sections, integration rules, and physical dimensions.

# Available Section Types

## Common Parameters for All Sections

Most section types assign a constitutive law and require the following base parameter:

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Yes** | - | Section formulation keyword. |
| **`material`** | String | Yes* | - | Name of the assigned [Material](materials.md). *Required for all section types except `RIGID`.* |

---

## Rod Sections

Sections designed for 1D truss and line elements.

### ROD

Defines a 1D circular cross-section for axial rod/truss elements (`ROD_2`).

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`radius`** | Float | **Yes** | - | Cross-sectional radius $r$. Must be strictly positive. |

#### Examples

=== "TOML :simple-toml:"
    ```toml
    [section.SEC_ROD]
    type = "ROD"
    material = "Steel_S235"
    radius = 2.5
    ```

---

## Shell & Membrane Sections

Sections designed for 2D structural membranes and thin shells.

### MEMBRANE

Defines a 2D membrane section with in-plane stiffness and zero bending resistance (used by `MEMBRANE_3`).

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`thickness`** | Float | **Yes** | - | Physical membrane thickness $h$. Must be strictly positive. |

---

### SHELL_GAUSS

Defines a thin/thick shell section using numerical integration through the thickness ($z$-axis). Suitable for 3D materials like isotropic elastic or hyperelastic models.

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`thickness`** | Float | **Yes** | - | Physical shell thickness $h$. Must be strictly positive. |
| **`nip`** | Integer | **Yes** | - | Number of Integration Points through thickness. |
| `integration` | String | No | `"GAUSS"` | Through-thickness integration rule: `"GAUSS"`, `"LOBATTO"`, or `"SIMPSON"`. |

!!! info "Integration Rule Constraints"
    - **`GAUSS`**: Supports `nip` from **1 to 5** points.
    - **`LOBATTO`**: Supports `nip` from **2 to 5** points (includes top and bottom surface points).
    - **`SIMPSON`**: Supports `nip` of **3 or 5** points.

---

### SHELL_GENERALIZED

Defines a generalized shell section where stress resultants (membrane forces $N$ and bending moments $M$) are evaluated directly at the mid-plane. Ideal for composite materials (`HYPERTEXTILE`) where constitutive laws explicitly supply resultant equations.

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`thickness`** | Float | **Yes** | - | Physical shell thickness $h$. Must be strictly positive. |

#### Examples

=== "TOML :simple-toml:"
    ```toml
    # Numerical integration shell section (for Elastic or Hyperelastic materials)
    [section.SEC_SHELL_GAUSS]
    type = "SHELL_GAUSS"
    material = "Steel_S235"
    thickness = 1.5
    nip = 5
    integration = "GAUSS"

    # Generalized shell section (for Hypertextile composite materials)
    [section.SEC_COMPOSITE]
    type = "SHELL_GENERALIZED"
    material = "CarbonFabric"
    thickness = 0.25
    ```

---

## Rigid Sections

Sections used for rigid bodies and contact surfaces.

### RIGID

Defines geometric thickness for rigid tool surfaces or contact elements (`CONTACT_TRIANGLE`, `CONTACT_LINE`). No material law assignment is required.

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`thickness`** | Float | **Yes** | - | Physical contact offset or rigid surface thickness $h$. |
| `geometry` | String | No | - | Structural contact geometry context: `"SHELL"` or `"SOLID"`. |

#### Examples

=== "TOML :simple-toml:"
    ```toml
    [section.SEC_RIGID_TOOL]
    type = "RIGID"
    thickness = 1.0
    geometry = "SHELL"
    ```

---

# Choose a Section Type

- Use **`ROD`** for 1D truss elements (`ROD_2`).
- Use **`MEMBRANE`** for 2D membrane elements without bending stiffness (`MEMBRANE_3`).
- Use **`SHELL_GAUSS`** for 3D isotropic/hyperelastic shell elements (`DKT18`, `S3L_C0`) requiring through-thickness integration.
- Use **`SHELL_GENERALIZED`** for composite textile fabrics (`HYPERTEXTILE`) using resultant stress formulations.
- Use **`RIGID`** for rigid tools and contact master/slave surfaces.