<style>
  .md-sidebar--secondary .md-nav__list .md-nav__list .md-nav__item .md-nav {
    display: none !important;
  }

  .md-typeset td:first-child, .md-typeset th:first-child {
    white-space: nowrap;
  }
</style>

COMFOR defines the numerical model through a structured input file. The framework features a modular parser architecture [^1] supporting both the modern **TOML** standard (recommended for its modularity and readability) and the legacy **Fembic** format (maintained for backward compatibility).

Unlike previous versions, COMFOR now decouples the geometric definition from the physical properties, allowing the direct import of external mesh formats such as **Abaqus (.inp)** or **Gmsh (.msh)**, alongside **Inline** definitions.

In the general case, a complete input file must define the following core pillars:

- **Geometry & Assembly**: Definition of mesh sources (Mesh) and their assembly into physical components (Part).
- **Material Properties**: Constitutive laws and physical data assigned to the parts.
- **Boundary Conditions**: Kinematic constraints (Constraints) applied to the model.
- **Loads**: External solicitations such as punctual forces, pressures, or gravity.
- **Analysis Control**: Simulation time range, time-stepping settings, and output frequency.

# Units

There is no predefined unit system in COMFOR. The user can use any consistent unit system [see reference](https://femci.gsfc.nasa.gov/units/index.html){:target="_blank"}. The units must be consistent in that mathematical operations directly yield the correct units for the result quantity. For example for Newtons' law :

$$ \mathbf{f} = \mathbf{M} \mathbf{a} $$

If the unit force is the the newton $N$, the length unit is the $mm$ and the time unit is the second $s$, the units for acceleration are $mm/s^2$ and the units for mass, must be $kg \cdot 10^{3} = t$ (metric ton).

# Input Structure

The configuration file is organized into **Blocks**. Each block corresponds to a specific category of data (a label) and defines the properties of a model component.

<h4>Naming</h4>
Every block requires a **Name**, except `control` and `solver`. This name acts as a handle that allows different parts of the simulation to talk to each other. For example, you define a `material` named "Steel", and then a `section` references "Steel" to know which constitutive law to use.

Names must be unique within a block type (two materials cannot share the same name, but a set and a surface can). Some names are also used for result files: the name of an `output` is the name of its result folder, and the name of a `tracker` is the name of its CSV file.

<h4>Available Blocks</h4>

| Block | Syntax | Required | Multiple | Description |
| :--- | :--- | :---: | :---: | :--- |
| [`control`](#control) | `[control]` | **Yes** | No | Simulation time range and time step |
| [`solver`](#solver) | `[solver]` | No | No | Time integration settings |
| [`output`](#output) | `[[output]]` | **Yes** | Yes | Result files (VTU/VTK) |
| [`mesh`](#mesh) | `[mesh.Name]` | Yes* | Yes | Geometric sources |
| [`part`](#part) | `[part.Name]` | Yes* | Yes | Physical components built from meshes |
| [`set`](#set) | `[set.Name]` | No | Yes | Groups of nodes or elements |
| [`surface`](#surface) | `[surface.Name]` | No | Yes | Merged sets used by contacts |
| [`material`](#material) | `[material.Name]` | No | Yes | Constitutive laws |
| [`section`](#section) | `[section.Name]` | No | Yes | Physical properties (thickness, radius...) |
| [`section_assignments`](#section_assignment) | `[[section_assignments]]` | No | Yes | Links sections to element sets |
| [`amplitude`](#amplitude) | `[amplitude.Name]` | No | Yes | Time functions |
| [`constraint`](#constraint) | `[constraint.Name]` | No | Yes | Boundary conditions |
| [`load`](#load) | `[load.Name]` | No | Yes | Forces, pressures, body accelerations |
| [`contact_behaviour`](#contact_behaviour) | `[contact_behaviour.Name]` | No | Yes | Normal and tangential contact laws |
| [`contact`](#contact) | `[contact.Name]` | No | Yes | Contact interactions |
| [`tracker`](#tracker) | `[tracker.Name]` | No | Yes | Time histories in CSV files |

*At least one `mesh` and one `part` are needed to define the geometry of the model.

!!! note
    `section_assignments` is the only block name written in the plural form.

!!! tip "Numbers"
    Write real-valued parameters as floating-point numbers (`10.0` rather than `10`), as in all the examples of this documentation.

<h4>Block Syntax</h4>

Depending on the format, the way you declare these blocks and their names differs.

=== "TOML :simple-toml:"
    In TOML, we strongly recommend using **Keyed Tables**. This syntax is more concise and clearly highlights the unique name of the object in the header.

    ```toml
    # Recommended Syntax (Keyed Table)
    [label.UniqueName]
    type = "SPECIFIC_TYPE"
    parameter = value
    ```

    *Example:*
    ```toml
    [material.Steel_S235]
    type = "ELASTIC"
    young = 210000.0
    ```

    !!! tip "Alternative Syntax"
        You can also use the array syntax `[[label]]` with a `name = "..."` field inside. Both syntaxes are equivalent and can be mixed in the same file. The keyed version `[label.Name]` is preferred for clarity, while the array syntax is commonly used for `[[output]]` and `[[section_assignments]]`.

        ```toml
        [[material]]
        name = "Steel_S235"
        type = "ELASTIC"
        young = 210000.0
        ```

=== "Fembic :material-text:"
    In the legacy format, the block starts with the label and the technology type. The entries follow on the subsequent lines, starting with their unique name.

    ```xml
    LABEL TYPE SPECIFIC_TYPE
    UniqueName parameter = value
    ```

    *Example:*
    ```xml
    MATERIALS TYPE ELASTIC
    Steel_S235 YOUNG = 210000.0
    ```

!!! hint "Order of Operations"
    The order of blocks in the input file does not impact the parsing. COMFOR loads all definitions into a registry before "linking" them together. However, keeping a logical flow (Control → Geometry → Physics → Trackers) is recommended for maintenance.

## Control

The `control` block defines the global time parameters for the simulation, managing the analysis duration and the time integration strategy.

### Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| `run_to` | Float | **Yes** | - | Final simulation time. Must be non-negative. |
| `run_from` | Float | No | `0.0` | Starting time of the analysis. Must be non-negative. |
| `time_step` | Float | No | - | Fixed time increment. Must be strictly positive if specified. If omitted, COMFOR uses an automatic stable time step based on the mesh and materials. |

!!! info "Validation Rule"
    The value of `run_from` must be strictly less than `run_to`. If this condition is not met, the simulation will fail during the validation phase with a `ControlStep` error.

### Examples

=== "TOML :simple-toml:"
    ```toml
    # Typical setup with automatic time-stepping
    [control]
    run_from = 0.0
    run_to = 15.0

    # Setup with a fixed manual time-step
    [control]
    run_to = 10.0
    time_step = 0.0001
    ```

=== "Fembic :material-text:"
    ```txt
    CONTROLS
    RUN FROM 0.0 TO 15.0

    CONTROLS
    RUN TO 10.0 STEP 0.0001
    ```

---

## Output

The `output` block defines the results generation settings, including the format and frequency of the output files. At least one output is required. You can define multiple outputs to export different formats or frequencies simultaneously.

### Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`name`** | String | **Yes** | - | Name of the output. The frames are written in `<result_root>/<name>/<name>_000000.vtu`, `..._000001.vtu`, etc. |
| **`frequency`** | Float | **Yes** | - | Time interval between two result frames. Must be positive. |
| `type` | String | No | `VTU` | Export format. Available: `VTU` (recommended) or `VTK`. |
| `format` | String | No | `ASCII` | Data encoding. Available: `ASCII` or `BINARY`. |

The result root is `Results_<input_name>/` next to the input file, or the directory given with the `-o` [command line option](analysis.md#command_line_options).

!!! warning "Format Compatibility"
    The legacy `VTK` type does **not** support `BINARY` encoding. If you need binary exports for better performance and smaller file sizes, please use the `VTU` type.

### Examples

=== "TOML :simple-toml:"
    ```toml
    # Standard binary output, written in Results_<input_name>/fields/
    [[output]]
    name = "fields"
    type = "VTU"
    format = "BINARY"
    frequency = 0.1

    # Additional ASCII output for debugging, written in Results_<input_name>/debug/
    [[output]]
    name = "debug"
    type = "VTU"
    format = "ASCII"
    frequency = 0.5
    ```

=== "Fembic :material-text:"
    ```xml
    OUTPUT
    TYPE = VTU FREQUENCY = 0.1 FORMAT = BINARY

    OUTPUT
    TYPE = VTU FREQUENCY = 0.5 FORMAT = ASCII
    ```

---

## Mesh

!!! info "TOML Only"
    This block is specific to the **TOML** configuration format. In the legacy Fembic format, geometry and physical properties are defined directly within the `NODES` and `ELEMENTS` blocks.

The `mesh` block defines the geometric source of your model. COMFOR can either read external files from standard pre-processors or define geometry "inline" for simple cases.

### Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| `type` | String | **Yes** | - | Reader engine: `ABAQUS`, `GMSH`, `FEMBIC` or `INLINE`. |
| `file` | String | Yes* | - | Path to the external file, absolute or relative to the directory of the input file. *Required for `GMSH` and `ABAQUS`.* |
| `nodes` | Array | Yes* | - | List of nodes `[id, x, y, z]`. *Required only for `INLINE` type.* |
| `elements` | Array | No | - | List of elements `[id, "TYPE", n1, n2, ...]`. See [Element Module](modules/elements.md) for available types. *Only for `INLINE` type.* |

### Element Type Translation

External readers translate the native element types into COMFOR element types (default translation). Any element type can be changed per part with [`element_mapping`](#part).

=== "ABAQUS"
    | Abaqus type (`*ELEMENT, TYPE=`) | COMFOR type |
    | :--- | :--- |
    | `T3D2` | `ROD_2` |
    | `M3D3` | `MEMBRANE_3` |
    | `S3`, `S3R` | `S3L_C0` |
    | `STRI3` | `DKT18` |
    | Any other type | No default: must be mapped with `element_mapping` (e.g. `R3D3`) |

    Only the `*NODE` and `*ELEMENT` keywords are read; other keywords are ignored.

=== "GMSH"
    | Gmsh element type | COMFOR type |
    | :--- | :--- |
    | `1` (2-node line) | `ROD_2` |
    | `2` (3-node triangle) | `MEMBRANE_3` |

    Other Gmsh element types have no default translation and must be mapped with `element_mapping`.

=== "INLINE"
    The element type is written directly in the `elements` array and must be a COMFOR element type.

### Examples

=== "External File"
    ```toml
    [mesh.BodyMesh]
    type = "GMSH"
    file = "models/chassis.msh"
    ```

=== "Inline Definition"
    ```toml
    [mesh.SimpleSquare]
    type = "INLINE"
    nodes = [
        [1, 0.0, 0.0, 0.0],
        [2, 1.0, 0.0, 0.0],
        [3, 1.0, 1.0, 0.0],
        [4, 0.0, 1.0, 0.0]
    ]
    elements = [
        [1, "MEMBRANE_3", 1, 2, 3],
        [2, "MEMBRANE_3", 3, 4, 1]
    ]
    ```

---

## Part

!!! info "TOML Only"
    This block is specific to the **TOML** configuration format. In the legacy Fembic format, geometry and physical properties are defined directly within the `NODES` and `ELEMENTS` blocks.

A `part` represents a physical component. It instantiates a geometric source defined in a `[mesh]` block and applies global spatial transformations or element type mappings.

### Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`mesh`** | String | **Yes** | - | Name of the `[mesh]` block to be used. |
| `translation` | Array | No* | `[0,0,0]` | Global translation vector `[tx, ty, tz]`. *Cannot be used with `pattern`.* |
| `pattern` | Array | No* | - | List of pattern configurations for duplicated placements. *Cannot be used with `translation`.* |
| `element_mapping` | Map | No | - | Dictionary `{ "FROM" = "TO" }` assigning a [COMFOR element type](modules/elements.md) to the element types of the mesh. |

!!! warning "Exclusivity Rule"
    The `translation` and `pattern` parameters are mutually exclusive. Specifying both on the same `part` will result in a validation error.

### Pattern Parameters (Linear)

When using the `pattern` array, each pattern definition supports the following keys:

| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| **`type`** | String | **Yes** | Pattern geometry type. Supported: `LINEAR`. |
| **`translation`** | Array | **Yes** | Base translation vector `[tx, ty, tz]` for the pattern origin. |
| **`count`** | Integer | **Yes** | Number of instances to generate (must be positive). |
| **`spacing`** | Float | **Yes** | Distance between consecutive instances (must be positive). |
| **`direction`** | Array | **Yes** | Direction vector `[dx, dy, dz]` for pattern propagation (cannot be zero, normalized internally). |

Instance `i` (starting at 0) is placed at `translation + i × spacing × direction`. Several patterns can be listed in the same part; their instances are added. Sets referring to a patterned part with `ids` or `range` select these IDs in **every** instance.

### Element Mapping Syntax

The keys of `element_mapping` are the element types **as written in the mesh file**: the Abaqus type (`"S3"`, `"R3D3"`...) or the Gmsh type number as a string (`"2"`). The COMFOR type given by the default [translation](#element_type_translation) (e.g. `"MEMBRANE_3"`) is also accepted as a key. When both match, the mesh file type takes precedence. Element types not listed in the mapping keep their default translation.

There are two ways to define the `element_mapping` in TOML:

1.  **Inline Table**: Useful for short mappings.
2.  **Nested Table**: Better for clarity when mapping many element types.

=== "1. Inline Table"
    ```toml
    [part.Tool]
    mesh = "AbaqusInp"
    element_mapping = { "S3" = "CONTACT_TRIANGLE", "R3D3" = "CONTACT_TRIANGLE" }
    ```

=== "2. Nested Table"
    ```toml
    [part.Tool]
    mesh = "AbaqusInp"

    [part.Tool.element_mapping]
    "S3"   = "CONTACT_TRIANGLE"
    "R3D3" = "CONTACT_TRIANGLE"
    ```

### Examples

=== "TOML :simple-toml:"
    ```toml
    # Defining a physical part with a translation from a mesh source
    [part.MainPlate]
    mesh = "PlateGeometry"
    translation = [0.0, 0.0, 50.0]

    # Duplicating a mesh using a linear pattern (5 instances along X)
    [part.Stiffeners]
    mesh = "RibMesh"
    [[part.Stiffeners.pattern]]
    type = "LINEAR"
    translation = [0.0, 0.0, 0.0]
    count = 5
    spacing = 20.0
    direction = [1.0, 0.0, 0.0]

    # Mapping element types for imported mesh formats
    # (Gmsh 3-node triangles are type 2)
    [part.Chassis]
    mesh = "GmshMesh"
    [part.Chassis.element_mapping]
    "2" = "S3L_C0"
    ```

=== "Fembic :material-text:"
    !!! note "Implicit Parts"
        In Fembic, parts are not explicitly defined. Properties like material and thickness are assigned directly within the `ELEMENTS` block.

    ```xml
    ELEMENTS TYPE MEMBRANE_3
    1 NODES = [1, 2, 3] MATERIAL = Steel_S235 T = 1.2
    ```

---

## Section

!!! info "TOML Only"
    This block is specific to the **TOML** configuration format. In the legacy Fembic format, geometry and physical properties are defined directly within the `NODES` and `ELEMENTS` blocks.

The `section` block defines specific physical properties (such as thickness, integration points, or radius) linked to a material model. Physical sections are then assigned to element sets using the `[[section_assignments]]` list.

### Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Yes** | - | Section formulation type: `ROD`, `MEMBRANE`, `SHELL_GAUSS`, `SHELL_GENERALIZED` or `RIGID`. |
| `material` | String | Yes* | - | Name of the [Material](#material). *Required for all types except `RIGID`.* |

The other parameters (`thickness`, `radius`, `nip`, `integration`, `geometry`) depend on the type: see the [Section Module](modules/sections.md). The section type must be compatible with the element types of the set it is assigned to (e.g. `ROD` for `ROD_2`, `RIGID` for contact elements).

### Examples

=== "TOML :simple-toml:"
    ```toml
    # Gauss shell section definition
    [section.SEC_SHELL]
    type = "SHELL_GAUSS"
    material = "Composite_Material"
    thickness = 2.5
    nip = 5
    integration = "GAUSS"

    # Assigning the section to an element set
    [[section_assignments]]
    name = "AssignShell"
    section = "SEC_SHELL"
    set = "ReinforcedSet"
    ```

=== "Fembic :material-text:"
    !!! note "Implicit Logic"
        Fembic does not have a "Section" concept. Variations in properties must be defined line-by-line within the `ELEMENTS` block.

    ```xml
    ELEMENTS TYPE MEMBRANE_3
    1 NODES=[1,2,3] MATERIAL=Steel T=1.2
    2 NODES=[4,5,6] MATERIAL=Steel T=5.0  # Equivalent to a manual section change
    ```

---

## Section Assignment

!!! info "TOML Only"
    This block is specific to the **TOML** configuration format. In the legacy Fembic format, physical properties are defined directly within the `ELEMENTS` block.

The `section_assignments` block links a defined [Section](#section) to an element [Set](#set). It acts as the mapping layer that applies geometric and constitutive definitions to specific regions of the model mesh.

### Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`name`** | String | **Yes** | - | Unique name of the assignment. |
| **`section`** | String | **Yes** | - | Name of the [Section](#section) to assign. |
| **`set`** | String | **Yes** | - | Name of the target element [Set](#set). Must be a set of type `ELEMENT`. |

!!! info "Validation Rule"
    The referenced set must exist and be defined as an `ELEMENT` set. Referencing a `NODE` set will result in a validation error during the linking phase.

### Examples

=== "TOML :simple-toml:"
    ```toml
    # Section assignment using array of tables syntax
    [[section_assignments]]
    name = "AssignMembrane"
    section = "SEC_MEMBRANE"
    set = "MainBodyElements"

    # Keyed table syntax is also supported
    [section_assignments.AssignBending]
    section = "SEC_SHELL"
    set = "RibElements"
    ```

=== "Fembic :material-text:"
    !!! note "Implicit Logic"
        In Fembic, section assignments do not exist as separate blocks. Physical properties are specified line-by-line inside the `ELEMENTS` block.

    ```xml
    ELEMENTS TYPE MEMBRANE_3
    1 NODES = [1, 2, 3] MATERIAL = Steel T = 1.0
    ```

---

## Nodes (Legacy)

!!! info "Fembic Only"
    This block is specific to the **Fembic** legacy format. In TOML, nodes are typically defined within a `[mesh]` block or using the `nodes` array in an `INLINE` mesh.

The `NODES` block defines the coordinates of each point in the model and can optionally assign boundary conditions or loads directly to them.

### Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`ID`** | Integer | **Yes** | - | Unique identifier for the node (first token). |
| **`X`, `Y`, `Z`** | Float | **Yes** | - | Spatial coordinates of the node. |
| `CONSTRAINT` | String | No | - | Name of a [Constraint](#constraint) to apply to this node. |
| `LOAD` | String | No | - | Name of a nodal [Load](#load) to apply to this node. |

### Example

```xml
NODES
1   X = 0.0  Y = 0.0  Z = 0.0  CONSTRAINT = FixedBase
2   X = 10.0 Y = 0.0  Z = 0.0  LOAD = PunctualForce
3   X = 5.0  Y = 5.0  Z = 0.0
```

!!! tip "Implicit Sets"
    When you assign a `CONSTRAINT` or a `LOAD` directly in the `NODES` block, COMFOR automatically creates an internal **Set** containing all nodes sharing that same constraint or load name.

---

## Elements (Legacy)

!!! info "Fembic Only"
    This block is specific to the **Fembic** legacy format. Elements in Fembic are "physical": they contain both connectivity and physical properties (material, thickness).

The `ELEMENTS` block defines the connectivity and the physical behavior of the mesh. All elements within a single block must share the same **Technology Type**.

### Block Header

```xml
ELEMENTS TYPE <TECHNOLOGY>
```

See the [Element Module](modules/elements.md) for available technologies (e.g., `MEMBRANE_3`, `S3L_C0`, `ROD_2`).

### Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`ID`** | Integer | **Yes** | - | Unique identifier for the element (first token). |
| **`NODES`** | Array | **Yes** | - | List of node IDs, e.g., `[1, 2, 3]`. |
| **`MATERIAL`** | String | **Yes** | - | Name of the [Material](modules/materials.md) to assign. |
| `T` | Float | No\* | - | Alias for **thickness**. Required for Shells/Membranes. |
| `R` | Float | No\* | - | Alias for **radius**. Required for Rods. |
| `LOAD` | String | No | - | Name of an element [Load](#load) (e.g., Pressure). |
| `CONTACT` | String | No | - | Contact detection mode: `BASIC` or `EDGE`. |
| `FRICTION` | Float | No | `0.0` | Coulomb friction coefficient. |
| `FACTOR` | Float | No | `1.0` | Penalty stiffness factor for contact. |

### Example

```xml
ELEMENTS TYPE MEMBRANE_3
1  NODES = [1, 2, 3]  MATERIAL = Steel  T = 1.0  CONTACT = EDGE  FRICTION = 0.1
2  NODES = [3, 4, 1]  MATERIAL = Steel  T = 1.0  CONTACT = EDGE  FRICTION = 0.1

ELEMENTS TYPE ROD_2
101 NODES = [10, 11]  MATERIAL = Nylon  R = 0.5
```

!!! note "Aliases"
    The Fembic parser automatically translates legacy short keys like `T` to `thickness` and `R` to `radius` to maintain compatibility with the core engine.

---

## Set

Sets are named groups of entities (nodes or elements) used to apply boundary conditions, loads, or to define [Sections](#section). They scope entities within one or more physical [Parts](#part) using explicit ID lists, ranges, or complete part selections.

### Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Yes** | - | Entity type: `NODE` or `ELEMENT`. |
| `part` | String | Yes* | - | Name of the target [Part](#part). *Required if `parts` is not used.* |
| `parts` | Array | Yes* | - | List of target [Part](#part) names. *Required if `part` is not used.* |
| `ids` | Array | No | - | Explicit list of node or element IDs. Cannot be combined with `range`. |
| `range` | Array | No | - | Range definition `[start, end, step]`. Cannot be combined with `ids`. |

!!! warning "Validation Rules"
    - You must specify either `part` or `parts`, but **not both**.
    - You can specify either `ids` or `range`, but **not both**. If neither is specified, the set automatically includes **all** entities of the specified type within the referenced part(s).
    - For the `range` parameter, the step (third value) **cannot be zero**.

### Range Syntax
The `range` array follows the pattern: `[start_id, end_id, step]`.

*Example:* `range = [1, 10, 2]` will select IDs: **1, 3, 5, 7, 9**.

### Examples

=== "TOML :simple-toml:"
    ```toml
    # Node set defined by explicit IDs within a single part
    [set.FixedNodes]
    type = "NODE"
    part = "MainPlate"
    ids = [1, 2, 10, 15]

    # Element set defined by a range across a single part
    [set.BottomElements]
    type = "ELEMENT"
    part = "MainPlate"
    range = [1, 100, 1]

    # Set targeting all nodes across multiple parts
    [set.AllPartNodes]
    type = "NODE"
    parts = ["MainPlate", "Reinforcement"]
    ```

=== "Fembic :material-text:"
    ```xml
    SETS TYPE NODE
    FixedNodes NODES = [1, 2, 10, 15]

    SETS TYPE ELEMENT
    BottomElements RANGE = [1, 100, 1]
    ```

---

## Surface

Surfaces are topological entities created by merging one or more existing [Sets](#set). They are primarily used to define interaction boundaries, such as contact zones.

### Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Yes** | - | Entity type: `NODE` or `ELEMENT`. |
| `node_sets` | Array | No* | - | List of node set names to merge. *Required for type `NODE`.* |
| `element_sets` | Array | No* | - | List of element set names to merge. *Required for type `ELEMENT`.* |

!!! info "Merging Logic"
    When you provide multiple sets in the array, COMFOR automatically merges them into a single continuous surface. All referenced sets must exist and match the surface `type` (e.g., you cannot put a Node Set into an Element Surface).

### Examples

=== "TOML :simple-toml:"
    ```toml
    # Creating a master contact surface by merging two element sets
    [surface.MasterContactSurface]
    type = "ELEMENT"
    element_sets = ["TopFlangeElements", "WebElements"]

    # Creating a nodal surface for specific output/constraints
    [surface.BoundaryInterface]
    type = "NODE"
    node_sets = ["EdgeNodes_Left", "EdgeNodes_Right"]
    ```

=== "Fembic :material-text:"
    ```xml
    SURFACES TYPE ELEMENT
    MasterContactSurface ELEMENT_SETS = ["TopFlangeElements", "WebElements"]

    SURFACES TYPE NODE
    BoundaryInterface NODE_SETS = ["EdgeNodes_Left", "EdgeNodes_Right"]
    ```

---

## Material

The `material` block defines the constitutive laws and physical properties assigned to the parts of the model. COMFOR supports a variety of models ranging from standard linear elasticity to advanced non-linear textile laws.

### Common Parameters

These parameters are shared by all material models.

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Yes** | - | Material model keyword: `ELASTIC`, `HYPERELASTIC` or `HYPERTEXTILE`. See [Material Module](modules/materials.md) for the specific parameters. |
| **`density`** | Float | **Yes** | - | Material density ($\rho$). Must be strictly positive. |
| `damping` | Float | No | `0.0` | Mass-proportional Rayleigh damping coefficient ($\alpha$). Must be non-negative. |

### Examples

=== "TOML :simple-toml:"
    ```toml
    # Definition of a standard steel material
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
    Steel_S235  DENSITY=7.8E-9  YOUNG=210000.0  POISSON=0.3  DAMPING=0.1
    ```

---

## Amplitude

The `amplitude` block defines time-dependent functions $y = f(t)$ used to scale loads, boundary conditions, or other time-sensitive parameters.

### Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Yes** | - | Amplitude model: `TABULAR`. See [Amplitude Module](modules/amplitudes.md). |
| **`values`** | Array | **Yes** | - | `[time, value]` pairs (at least 2), linearly interpolated. |

### Examples

=== "TOML :simple-toml:"
    ```toml
    # A simple ramp function from 0 to 10 over 1 second
    [amplitude.RampUp]
    type = "TABULAR"
    values = [
        [0.0, 0.0],
        [1.0, 10.0],
        [2.0, 10.0]
    ]
    ```

=== "Fembic :material-text:"
    !!! note "Data Format"
        In Fembic, the `values` are provided as a flat list. The parser automatically pairs them as `[time, value]`.

    ```xml
    AMPLITUDES TYPE TABULAR
    RampUp VALUES = [0.0, 0.0, 1.0, 10.0, 2.0, 10.0]
    ```

---

## Constraint

The `constraint` block is used to prescribe values to specific degrees of freedom for a group of nodes. This is how you define boundary conditions like fixed supports, imposed velocities, or prescribed rotations.

### Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Yes** | - | Constraint technology: `BOUNDARY_CONDITION`. See [Constraint Module](modules/constraints.md). |
| **`set`** | String | **Yes** | - | Name of the [Node Set](#set) where the constraint is applied. |
| `preset` | String | No* | - | `"FIXED"` blocks all 6 velocities. |
| `vx`, `vy`, `vz` | Float or Map | No* | - | Prescribed translational velocities. |
| `vrx`, `vry`, `vrz` | Float or Map | No* | - | Prescribed rotational velocities. |
| `ax`, `ay`, `az` | Float or Map | No* | - | Prescribed translational accelerations. |
| `amplitude` | String | No | - | Name of a global [Amplitude](#amplitude) to scale all defined components. |

*At least one of `preset` or a component is required. A component is either a number (`vx = 0.0`) or a map with its own amplitude (`vx = { value = -10.0, amplitude = "Ramp" }`).

### Examples

=== "TOML :simple-toml:"
    ```toml
    # Simple fixed support using a preset
    [constraint.FixedBase]
    type = "BOUNDARY_CONDITION"
    set = "BottomNodes"
    preset = "FIXED"

    # Imposed velocity with a local amplitude
    [constraint.MovingPlaten]
    type = "BOUNDARY_CONDITION"
    set = "TopNodes"
    vy = { value = -10.0, amplitude = "RampUp" }
    ```

=== "Fembic :material-text:"
    ```xml
    CONSTRAINTS TYPE BOUNDARY_CONDITION
    FixedBase SET = BottomNodes PRESET = FIXED
    MovingPlaten SET = TopNodes VY = -10.0 AMP = RampUp
    ```

---

## Load

The `load` block defines external efforts applied to the model. These can be punctual forces/moments on nodes, distributed pressures on surfaces, or prescribed body accelerations.

### Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`set`** | String | **Yes** | - | Name of the [Set](#set) to apply the load to. |
| `amplitude` | String | No | - | Name of the [Amplitude](#amplitude) used to scale values. |
| `p` | Float | No | `0.0` | Distributed pressure (typically for Shell/Membrane elements). |
| `fx`, `fy`, `fz` | Float | No | `0.0` | Punctual force components along global X, Y, and Z. |
| `mx`, `my`, `mz` | Float | No | `0.0` | Punctual moment components around global X, Y, and Z. |
| `ax`, `ay`, `az` | Float | No | `0.0` | Linear body acceleration components. |
| `arx`, `ary`, `arz`| Float | No | `0.0` | Rotational body acceleration components. |

### Evaluation Logic

The magnitude of a load component at a specific simulation time $t$ is calculated as the product of the base value and the amplitude factor:

$$F_{applied}(t) = F_{base} \times Amplitude(t)$$

If no `amplitude` is specified, the scale factor defaults to **1.0**.

### Target Set

- Nodal components (`fx`...`mz`, `ax`...`arz`) are applied to the nodes of a `NODE` set.
- The pressure `p` is applied to the elements of an `ELEMENT` set (shell and membrane elements).

### Examples

=== "TOML :simple-toml:"
    ```toml
    # Applying a vertical punctual force to a specific set
    [load.PunchForce]
    set = "TopNodes"
    fz = -500.0
    amplitude = "RampDown"

    # Applying a constant pressure to an element set
    [load.InternalPressure]
    set = "InnerElements"
    p = 10.5

    # Gravity (body acceleration) on all the nodes of a part
    [load.Gravity]
    set = "AllNodes"
    az = -9810.0
    ```

=== "Fembic :material-text:"
    ```xml
    LOADS
    PunchForce SET = TopNodes FZ = -500.0 AMPLITUDE = RampDown

    LOADS
    InternalPressure SET = InnerElements P = 10.5
    ```

!!! tip "Multi-Component Loads"
    A single `load` block can define multiple components (e.g., `fx`, `fy`, and `fz`) simultaneously. All values in the block share the same `amplitude`.

---

## Contact Behaviour

The `contact_behaviour` block defines the physical laws (Normal and Tangential) that govern the interaction between two surfaces. These laws must be defined by name so they can be assigned to a specific [Contact](#contact) pair.

### Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Yes** | - | Technology keyword. Normal laws: `LINEAR_PENALTY`, `PENALTY_ADHESION`. Tangential law: `COULOMB`. See [Contact Behaviour Module](modules/contact_behaviours.md) for their parameters. |

### Examples

=== "TOML :simple-toml:"
    ```toml
    # Definition of a normal penalty law
    [contact_behaviour.HardContact]
    type = "LINEAR_PENALTY"
    stiffness = 1.0e6

    # Definition of a tangential friction law
    [contact_behaviour.SteelFriction]
    type = "COULOMB"
    mu = 0.15
    ```

=== "Fembic :material-text:"
    ```xml
    CONTACT_BEHAVIOURS TYPE LINEAR_PENALTY
    HardContact STIFFNESS = 1.0e6

    CONTACT_BEHAVIOURS TYPE COULOMB
    SteelFriction MU = 0.15
    ```

---

## Contact

The `contact` block defines the interaction between geometric entities. It couples surfaces or the whole domain with specific physical laws defined in the [Contact Behaviour](#contact_behaviour) section.

### Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Yes** | - | Interaction technology keyword: `PAIR` or `GENERAL`. |
| `master` | String | Yes* | - | Name of the first [Surface](#surface). *Required for type `PAIR` if `surfaces` is not used.* |
| `slave` | String | Yes* | - | Name of the second [Surface](#surface). *Required for type `PAIR` if `surfaces` is not used.* |
| `surfaces` | Array | Yes* | - | List of two surfaces `["Surf1", "Surf2"]`. *Alternative syntax for type `PAIR`.* |
| **`normal`** | String | **Yes** | - | Name of the assigned Normal [Contact Behaviour](modules/contact_behaviours.md#normal_contact_laws). |
| **`tangential`**| String | **Yes** | - | Name of the assigned Tangential [Contact Behaviour](modules/contact_behaviours.md#tangential_contact_laws). |
| `edge` | Boolean | No | `false` | If `true`, enables edge contact detection for `PAIR` contact. |

The same surface can be used as `master` and `slave` to define self-contact.

!!! info "Surface Definition Rules"
    - For **`PAIR`** contact, define surfaces using either the `master`/`slave` pair **or** the `surfaces` array.
    - For **`GENERAL`** contact, surface definitions are omitted as it applies globally. Only **one** `GENERAL` contact can be defined per model; it can be combined with `PAIR` contacts.

### Examples

=== "TOML :simple-toml:"
    ```toml
    # Contact Pair defined using Master/Slave keywords
    [contact.DieToBlank]
    type = "PAIR"
    master = "ToolSurface"
    slave = "WorkpieceNodes"
    normal = "HardPenalty"
    tangential = "SteelFriction"

    # General contact definition
    [contact.GlobalContact]
    type = "GENERAL"
    normal = "SoftPenalty"
    tangential = "FabricFriction"
    ```

=== "Fembic :material-text:"
    ```xml
    CONTACTS TYPE PAIR
    DieToBlank MASTER = ToolSurface SLAVE = WorkpieceNodes NORMAL = HardPenalty TANGENTIAL = SteelFriction

    CONTACTS TYPE GENERAL
    GlobalContact NORMAL = SoftPenalty TANGENTIAL = FabricFriction
    ```

---

## Tracker

The `tracker` block logs discrete simulation data into separate **CSV** files, named `<result_root>/<tracker_name>.csv`. It is the primary tool for extracting nodal history or element state variables over time. Values are written each time an [output](#output) frame is written.

### Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Yes** | - | Entity type to track: `NODE` or `ELEMENT`. |
| **`variable`** | String | **Yes** | - | Physical quantity to log. See [Tracker Module](modules/trackers.md). |
| `set` | String | Yes* | - | Name of the target [Set](#set). *Cannot be combined with `nodes`/`elements`.* |
| `nodes` | Array | Yes* | - | Explicit node IDs (`NODE` trackers). |
| `elements` | Array | Yes* | - | Explicit element IDs (`ELEMENT` trackers). |
| `direction` | String | Yes* | - | `"X"`, `"Y"` or `"Z"`. *Required for `NODE` trackers.* |
| `component` | String | Yes* | - | Component of the variable (e.g. `"xx"`, `"warp"`, `"value"`). *Required for `ELEMENT` trackers.* See [Tracker Module](modules/trackers.md). |

### Examples

=== "TOML :simple-toml:"
    ```toml
    # Tracking the reaction force of a node set in the Z direction
    [tracker.ReactionForce]
    type = "NODE"
    variable = "FORCE"
    direction = "Z"
    set = "BottomNodes"

    # Tracking the Cauchy stress xx on explicit elements
    [tracker.CoreStress]
    type = "ELEMENT"
    variable = "CAUCHY_STRESS"
    component = "xx"
    elements = [101, 102]
    ```

=== "Fembic :material-text:"
    ```xml
    TRACKERS TYPE NODE
    ReactionForce SET = BottomNodes VARIABLE = FORCE DIRECTION = Z

    TRACKERS TYPE ELEMENT
    CoreStress ELEMENTS = [101, 102] VARIABLE = CAUCHY_STRESS COMPONENT = xx
    ```

---

## Solver

!!! info "TOML Only"
    This block is specific to the **TOML** configuration format. The Fembic format uses implicit solver parameters.

The optional `solver` block configures the dynamics solver used for time integration. COMFOR currently implements an **explicit solver** with centered differences integration. If the block is omitted, the explicit solver is used with the default values below. Only one `solver` block is allowed.

### Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| `type` | String | No | `"EXPLICIT"` | Solver type. Supported value: `"EXPLICIT"`. |
| `integrator` | String | No | `"central_difference"` | Time integrator type. Supported value: `"central_difference"`. |
| `time_step_factor` | Float | No | `0.9` | Safety factor for automatic time step calculation. |
| `energy_balance_epsilon` | Float | No | `1.0e-2` | Tolerance for energy balance verification. |

!!! info "Automatic Time Step Calculation"
    If the time step is not specified in the [`control`](#control) block, COMFOR automatically calculates a stable time step based on mesh and material properties. The `time_step_factor` is applied to this critical time step: $\Delta t = \alpha \cdot \Delta t_{crit}$ where $\alpha$ is the safety factor.

### Examples

=== "TOML :simple-toml:"
    ```toml
    # Explicit solver configuration with automatic time stepping
    [solver]
    type = "EXPLICIT"
    integrator = "central_difference"
    time_step_factor = 0.9
    energy_balance_epsilon = 1.0e-2

    # Only change the safety factor, other values keep their default
    [solver]
    time_step_factor = 0.8
    ```

=== "Fembic :material-text:"
    !!! note "Implicit Parameters"
        In Fembic format, the explicit solver is used by default with predefined parameters. It is not possible to explicitly configure the solver in this format.

---

## Validation

COMFOR validates the whole input file before building the model, and reports **all** the errors found at once (in the terminal and in the job log). To only validate a file, without running the simulation:

```bash
comfor -j simulation.toml --validate
```

The validation checks:

- the TOML syntax (with the line number of the error);
- the presence of the required blocks (`control`, at least one `output`) and of the `name` of each block;
- the uniqueness of the names within each block type;
- the mandatory parameters of each block, their types and their allowed values or ranges (e.g. `thickness > 0`, `poisson` in $[0, 0.5]$, `run_from < run_to`);
- the exclusive options (`translation`/`pattern`, `ids`/`range`, `part`/`parts`, `set`/`nodes`...).

Cross-references between blocks (a section referencing a material, an assignment referencing a set, a contact referencing surfaces...) and the compatibility between element types and sections are checked when the model is built, at the beginning of the simulation. See [Running the Analysis](analysis.md#validation) for details.

[^1]: Parsing, syntax analysis, or syntactic analysis is the process of analyzing a string of symbols, either in natural language, computer languages or data structures, conforming to the rules of a formal grammar. [Wikipedia](https://en.wikipedia.org/wiki/Parsing){:target="_blank"}
