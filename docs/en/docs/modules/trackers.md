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
In the generated CSV file, each row corresponds to a time step. The columns represent:
1. **Time**
2. Individual node values (`Node N1`, `Node N2`, ...)
3. **Total**: Cumulative sum of all tracked nodal values at that time step.

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

Tracks internal stress or strain tensor components for a designated set or list of elements over time.

### Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`component`** | String | **Yes** | - | Tensor component: `"C11"`, `"C22"`, `"C33"`, `"C12"`, `"C13"`, or `"C23"`. |
| `elements` | Array | Yes* | - | List of explicit Element IDs. *Required if `set` is not provided.* |

### Supported Variables

| Keyword | Description |
| :--- | :--- |
| **`STRAIN`** | Local element strain tensor component. |
| **`STRESS`** | Local element Cauchy stress tensor component. |

### Output Format
In the generated CSV file, each row corresponds to a time step. The columns represent:
1. **Time**
2. Individual element values (`Element E1`, `Element E2`, ...)
3. **Total**: Mean value across all tracked elements at that time step.

### Examples

=== "TOML :simple-toml:"
    ```toml
    # Tracking axial strain component C11 across a fabric element set
    [tracker.WarpStrain]
    type = "ELEMENT"
    variable = "STRAIN"
    component = "C11"
    set = "FabricElements"

    # Tracking shear stress component C12 on specific elements
    [tracker.ShearStressCore]
    type = "ELEMENT"
    variable = "STRESS"
    component = "C12"
    elements = [50, 51, 52]
    ```

=== "Fembic :material-text:"
    ```xml
    TRACKERS TYPE ELEMENT
    WarpStrain SET = FabricElements VARIABLE = STRAIN COMPONENT = C11

    TRACKERS TYPE ELEMENT
    ShearStressCore ELEMENTS = [50, 51, 52] VARIABLE = STRESS COMPONENT = C12
    ```

---

# Choose a Tracker Type

- Use **`NODE`** tracker with `variable = "FORCE"` or `variable = "CONTACTFORCE"` on support nodes to output total punch load vs. time curves.
- Use **`ELEMENT`** tracker with `variable = "STRAIN"` and `component = "C11"` / `"C22"` / `"C12"` to extract local warp, weft, or shear deformation histories.