<style>
  .md-sidebar--secondary .md-nav__list .md-nav__list .md-nav__item .md-nav {
    display: none !important;
  }
</style>

<div class="grid cards" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))" markdown>

- :material-vector-line:{ .lg .middle }
  [<span style="color: #76B900; font-weight: bold;">1D Elements</span>](#1d_elements)

- :material-vector-triangle:{ .lg .middle }
  [<span style="color: #c73131ff; font-weight: bold;">Shell & Membrane</span>](#2d_shell_membrane_elements)

- :material-hand-pointing-right:{ .lg .middle }
  [<span style="color: #2B17E5; font-weight: bold;">Contact Elements</span>](#contact_elements)

</div>

This section provides a **practical overview** of the finite element formulations available in **COMFOR**. Physical properties (such as material or thickness) are assigned to elements indirectly via [Sections](sections.md) and [Section Assignments](../preprocessing.md#section_assignment).

# Available Element Types

## Common Parameters for All Elements

All element definitions require the `nodes` array defining connectivity.

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Yes** | - | Element formulation keyword. |
| **`nodes`** | Array | **Yes** | - | Array of node IDs defining element connectivity. |
| `contact` | String | No | - | Internal contact detection trigger: `"BASIC"` or `"EDGE"`. |
| `load` | String | No | - | Optional name of a [Load](../preprocessing.md#load) target. |

!!! note "TOML"
    In TOML, elements are created from a [mesh](../preprocessing.md#mesh): the type comes from the mesh reader (possibly changed with `element_mapping`) and the connectivity from the mesh file. Loads are applied with [load](../preprocessing.md#load) blocks on element sets, and contact with [contact](../preprocessing.md#contact) blocks. The `contact` and `load` element parameters are only used by the legacy Fembic format.

---

## 1D Elements

1D structural elements model axial bar/truss behavior along line connectivity.

### ROD_2

2-node linear rod/truss element supporting axial tension and compression.

| Parameter | Value / Range | Description |
| :--- | :--- | :--- |
| **Nodes** | 2 | Node connectivity array `[N1, N2]`. |
| **Required Section** | `ROD` | Requires a section with a defined `radius` and `material`. |
| **Contact Support** | `"EDGE"` | Generates an internal `CONTACT_LINE` for edge contact detection. |

#### Example

=== "TOML :simple-toml:"
    ```toml
    [mesh.InlineBar]
    type = "INLINE"
    nodes = [ [1, 0.0, 0.0, 0.0], [2, 10.0, 0.0, 0.0] ]
    elements = [ [1, "ROD_2", 1, 2] ]
    ```

---

## 2D Shell & Membrane Elements

2D surface element formulations for membranes and thin shells.

### MEMBRANE_3

3-node triangular membrane element with in-plane stiffness and no bending resistance.

| Parameter | Value / Range | Description |
| :--- | :--- | :--- |
| **Nodes** | 3 | Node connectivity array `[N1, N2, N3]`. |
| **Required Section** | `MEMBRANE` | Requires a section with `thickness` and `material`. |
| **Contact Support** | `"BASIC"`, `"EDGE"` | Generates internal `CONTACT_TRIANGLE` (and `CONTACT_LINE` for `"EDGE"`). |

---

### S3L_C0

3-node triangular shell element with $C^0$ continuous linear bending formulation.

| Parameter | Value / Range | Description |
| :--- | :--- | :--- |
| **Nodes** | 3 | Node connectivity array `[N1, N2, N3]`. |
| **Required Section** | `SHELL_GAUSS`, `SHELL_GENERALIZED` | Requires a shell section with `thickness` and `material` (plus `nip` for `SHELL_GAUSS`). |
| **Contact Support** | `"BASIC"`, `"EDGE"` | Generates internal contact entities. |

---

### DKT18

3-node Discrete Kirchhoff Triangle (DKT) element for thin shell bending analysis.

| Parameter | Value / Range | Description |
| :--- | :--- | :--- |
| **Nodes** | 3 | Node connectivity array `[N1, N2, N3]`. |
| **Required Section** | `SHELL_GAUSS`, `SHELL_GENERALIZED` | Requires a shell section with `thickness` and `material` (plus `nip` for `SHELL_GAUSS`). |
| **Contact Support** | `"BASIC"`, `"EDGE"` | Generates internal contact entities. |

#### Examples

=== "TOML :simple-toml:"
    ```toml
    [mesh.Plate]
    type = "INLINE"
    nodes = [
        [1, 0.0, 0.0, 0.0],
        [2, 1.0, 0.0, 0.0],
        [3, 1.0, 1.0, 0.0]
    ]
    elements = [
        [1, "DKT18", 1, 2, 3]
    ]
    ```

=== "Fembic :material-text:"
    ```xml
    ELEMENTS TYPE DKT18
    1 NODES = [1, 2, 3]
    ```

---

## Contact Elements

Specialized contact elements automatically generated or explicitly defined to enforce contact boundary conditions.

### CONTACT_TRIANGLE

3-node surface contact triangle element.

| Parameter | Value / Range | Description |
| :--- | :--- | :--- |
| **Nodes** | 3 | Node connectivity array `[N1, N2, N3]`. |
| **Required Section** | `RIGID` | Linked to a rigid section defining physical `thickness` and `geometry` (`"SHELL"` or `"SOLID"`). |

---

### CONTACT_LINE

2-node line contact element for edge-to-edge or node-to-edge interaction.

| Parameter | Value / Range | Description |
| :--- | :--- | :--- |
| **Nodes** | 2 | Node connectivity array `[N1, N2]`. |
| **Required Section** | `RIGID` | Linked to a rigid section defining `thickness` (used as contact radius $r = t/2$). |

!!! warning "Contact Parameters Deprecation"
    In COMFOR TOML, penalty factors (`factor`) and friction coefficients (`friction`) are no longer specified directly on elements. They must be configured in [Contact Behaviour](contact_behaviours.md) blocks and assigned via [Contact Pairs](../preprocessing.md#contact).

---

# Choose an Element Type

- Use **`MEMBRANE_3`** for thin dry fabrics or films where bending stiffness is negligible.
- Use **`DKT18`** or **`S3L_C0`** for thin shell structures requiring out-of-plane bending and curvature calculations.
- Use **`ROD_2`** for 1D structural members or edge reinforcements.
- Use **`contact = "BASIC"`** or **`contact = "EDGE"`** on structural elements to automatically instantiate underlying contact geometry.