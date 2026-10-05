<style>
  .md-sidebar--secondary .md-nav__list .md-nav__list .md-nav__item .md-nav {
    display: none !important;
  }
</style>

<div class="grid cards" style="grid-template-columns: repeat(auto-fit, minmax(200px, 320px))" markdown>

- :material-vector-point:{ .lg .middle }
  [<span style="color: #76B900; font-weight: bold;">Nodal Trackers</span>](#nodal_trackers_node)

- :material-shape-polygon-plus:{ .lg .middle }
  [<span style="color: #c73131ff; font-weight: bold;">Element Trackers</span>](#element_trackers_element)

</div>

This section provides a **practical overview** of the tracking modules available in **COMFOR**. Trackers log time-history data for specific nodes or elements into dedicated **CSV** files during the simulation.

# Available Tracker Types

## Common Parameters for All Trackers

Every tracker block requires these base parameters:

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Yes** | - | Entity type to track: `NODE` or `ELEMENT`. |
| **`variable`** | String | **Yes** | - | Physical quantity to output. |
| `set` | String | Yes* | - | Name of the target [Set](../preprocessing.md#set). *Required if explicit IDs are not used.* |

!!! warning "Target Exclusivity"
    Target entities must be defined using **either** a `set` name **or** an explicit list of IDs (`nodes` / `elements`), but **never both**.

---

## Nodal Trackers (NODE)

Tracks kinematic, kinetic, or contact data for a designated set or list of nodes over time.

### Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`direction`** | String | **Yes** | - | Global Cartesian component direction: `"X"`, `"Y"`, or `"Z"`. |
| `nodes` | Array | Yes* | - | List of explicit Node IDs. *Required if `set` is not provided.* |

### Supported Variables

| Keyword | Description |
| :--- | :--- |
| **`FORCE`** | Resultant internal nodal force. |
| **`MOMENT`** | Resultant internal nodal moment. |
| **`POSITION`** | Current nodal coordinate ($x, y,$ or $z$). |
| **`VELOCITY`** | Current nodal translational velocity. |
| **`ACCELERATION`** | Current nodal translational acceleration. |
| **`CONTACTFORCE`** | Nodal contact reaction force vector component. |
| **`CONTACTSLIDING`** | Nodal contact relative sliding velocity *(Alias: `CONTACTSLIDINGVELOCITY`)*. |

### Output Format
The CSV file `<result_root>/<tracker_name>.csv` has one row per [output](../preprocessing.md#output) frame. Columns are separated by `, ` (comma and space). The columns represent:
1. **Time**
2. Individual node values (`Node N1`, `Node N2`, ...)
3. **Total**: Sum of all tracked nodal values.

### Examples

=== "TOML :simple-toml:"
    ```toml
    # Tracking reaction forces on a constrained node set in the Z direction
    [tracker.ReactionForce]
    type = "NODE"
    variable = "FORCE"
    direction = "Z"
    set = "FixedBaseNodes"

    # Tracking Z-position on explicit node IDs
    [tracker.PunchDisplacement]
    type = "NODE"
    variable = "POSITION"
    direction = "Z"
    nodes = [101, 102, 103]
    ```

=== "Fembic :material-text:"
    ```xml
    TRACKERS TYPE NODE
    ReactionForce SET = FixedBaseNodes VARIABLE = FORCE DIRECTION = Z

    TRACKERS TYPE NODE
    PunchDisplacement NODES = [101, 102, 103] VARIABLE = POSITION DIRECTION = Z
    ```

---

## Element Trackers (ELEMENT)

Tracks one component of an element result field for a designated set or list of elements over time.

### Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`component`** | String | **Yes** | - | Component of the variable, see the table below. |
| `elements` | Array | Yes* | - | List of explicit Element IDs. *Required if `set` is not provided.* |

### Supported Variables

| Keyword | Components | Description |
| :--- | :--- | :--- |
| **`STRAIN`** | `C11`, `C22`, `C33`, `C23`, `C13`, `C12` | Element strain in the local frame. |
| **`GREEN_LAGRANGE_STRAIN`** | `xx`, `yy`, `zz`, `xy`, `yz`, `xz` | Green-Lagrange strain tensor. |
| **`DEFORMATION_GRADIENT`** | `xx`, `xy`, `xz`, `yx`, `yy`, `yz`, `zx`, `zy`, `zz` | Deformation gradient $\mathbf{F}$. |
| **`CAUCHY_STRESS`** | `xx`, `yy`, `zz`, `xy`, `yz`, `xz` | Cauchy stress tensor. |
| **`SHEAR_ANGLE`** | `value` | In-plane shear angle of the fabric (composite materials). |
| **`FIBER_STRAIN`** | `warp`, `weft` | Strain along the fiber directions (composite materials). |
| **`FIBER_STRESS`** | `warp`, `weft` | Stress along the fiber directions (composite materials). |
| **`FIBER_CURVATURE`** | `warp`, `weft` | Curvature along the fiber directions (composite materials). |
| **`FIBER_ORIENTATION_WARP`** | `x`, `y`, `z` | Current warp direction (composite materials). |
| **`FIBER_ORIENTATION_WEFT`** | `x`, `y`, `z` | Current weft direction (composite materials). |

!!! warning "Availability"
    The variable must be available for **every** tracked element. Rigid contact elements have no stress or strain, and fiber variables are only defined for composite materials (`HYPERTEXTILE`): select the tracked elements accordingly, otherwise the simulation stops with an error when the tracker is written.

### Output Format
The CSV file `<result_root>/<tracker_name>.csv` has one row per [output](../preprocessing.md#output) frame. Columns are separated by `, ` (comma and space). The columns represent:
1. **Time**
2. Individual element values (`Element E1`, `Element E2`, ...)
3. **Total**: Sum of all tracked element values.

### Examples

=== "TOML :simple-toml:"
    ```toml
    # Tracking the shear angle across a fabric element set
    [tracker.FabricShear]
    type = "ELEMENT"
    variable = "SHEAR_ANGLE"
    component = "value"
    set = "FabricElements"

    # Tracking the warp fiber stress on specific elements
    [tracker.WarpStress]
    type = "ELEMENT"
    variable = "FIBER_STRESS"
    component = "warp"
    elements = [50, 51, 52]
    ```

=== "Fembic :material-text:"
    ```xml
    TRACKERS TYPE ELEMENT
    FabricShear SET = FabricElements VARIABLE = SHEAR_ANGLE COMPONENT = value

    TRACKERS TYPE ELEMENT
    WarpStress ELEMENTS = [50, 51, 52] VARIABLE = FIBER_STRESS COMPONENT = warp
    ```

---

# Choose a Tracker Type

- Use **`NODE`** tracker with `variable = "FORCE"` or `variable = "CONTACTFORCE"` on support nodes to output total punch load vs. time curves.
- Use **`ELEMENT`** tracker with `variable = "SHEAR_ANGLE"`, `"FIBER_STRAIN"` or `"FIBER_STRESS"` to extract local shear, warp or weft histories of a fabric.
