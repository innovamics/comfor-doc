<style>
  .md-sidebar--secondary .md-nav__list .md-nav__list .md-nav__item .md-nav {
    display: none !important;
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

There is no predefined unit system in COMFOR. The user can use any consistent unit system [see](https://femci.gsfc.nasa.gov/units/index.html){:target="_blank"}. The units must be consistent in that mathematical operations directly yield the correct units for the result quantity. For example for Newtons' law :

$$ \mathbf{f} = \mathbf{M} \mathbf{a} $$

If the unit force is the the newton $N$, the length unit is the $mm$ and the time unit is the second $s$, the units for acceleration are $mm/s^2$ and the units for mass, must be $kg \cdot 10^{3} = t$ (metric ton).

# Input Structure

The configuration file is organized into **Blocks**. Each block corresponds to a specific category of data (a label) and defines the properties of a model component.

<h4>Naming</h4>
Most blocks in COMFOR require a unique **Name**. This name acts as a handle that allows different parts of the simulation to talk to each other. For example, you define a `material` named "Steel", and then a `part` references that "Steel" to know which constitutive law to use.

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
        While you can use the array syntax `[[label]]` with a `name = "..."` field inside, it is more verbose. The keyed version `[label.Name]` is preferred for clarity and modularity.

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
| `time_step` | Float | No | `0.0` | Fixed time increment. If set to `0.0`, COMFOR uses an automatic stable time step based on the mesh and materials. |

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

The `output` block defines the results generation settings, including the format, storage location, and frequency of the output files. You can define multiple output channels in TOML to export different formats simultaneously.

### Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| `frequency` | Float | **Yes** | - | Time interval between two result frames. Must be positive. |
| `type` | String | No | `VTU` | Export format. Available: `VTU` (recommended) or `VTK`. |
| `format` | String | No | `ASCII` | Data encoding. Available: `ASCII` or `BINARY`. |
| `directory` | String | No | `""` | Subdirectory where results will be stored. |

!!! warning "Format Compatibility"
    The legacy `VTK` type does **not** support `BINARY` encoding. If you need binary exports for better performance and smaller file sizes, please use the `VTU` type.

### Examples

=== "TOML :simple-toml:"
    ```toml
    # Standard binary output in a specific folder
    [[output]]
    type = "VTU"
    format = "BINARY"
    frequency = 0.1
    directory = "results"

    # Additional ASCII output for debugging
    [[output]]
    type = "VTU"
    format = "ASCII"
    frequency = 0.5
    ```

=== "Fembic :material-text:"
    ```xml
    OUTPUT
    TYPE = VTU FREQUENCY = 0.1 FORMAT = BINARY DIRECTORY = results

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
| `mesh` | String | Yes* | - | Path to the external file. *Required for all types except `INLINE`.* |
| `nodes` | Array | Yes* | - | List of nodes `[id, x, y, z]`. *Required only for `INLINE` type.* |
| `elements` | Array | Yes* | - | List of elements `[id, "TYPE", n1, n2, ...]`. See [Element Library](#element_library) for available types. *Required only for `INLINE` type.* |

### Examples

=== "External File"
    ```toml
    [mesh.BodyMesh]
    type = "GMSH"
    mesh = "models/chassis.msh"
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

A `part` represents a physical component. It instantiates a geometric source and assigns it physical properties. Parameters defined here (like `material` or `thickness`) act as a global override for the entire part. 

### Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`mesh`** | String | **Yes** | - | Name of the `[mesh]` block to be used. |
| `material` | String | No | - | Material assigned to all elements. If omitted, must be defined in a [Section](#section). |
| `thickness` | Float | No | - | Thickness for Shell/Membrane elements. If omitted, must be defined in a `[Section](#section). |
| `node_offset` | Integer | No | `0` | Offset value added to all Node IDs. |
| `element_offset` | Integer | No | `0` | Offset value added to all Element IDs. |
| `translation` | Array | No | `[0,0,0]` | Global translation vector `[tx, ty, tz]`. |
| `element_mapping` | Map | No | - | Dictionary to map mesh element types to [COMFOR Technologies](#element_library). |

### Element Mapping Syntax

There are two ways to define the `element_mapping` in TOML:

1.  **Inline Table**: Useful for short mappings.
2.  **Nested Table**: Better for clarity when mapping many element types.

=== "1. Inline Table"
    ```toml
    [part.Wing]
    mesh = "AbaqusInp"
    material = "Composite"
    element_mapping = { "S3R" = "S3L_C0", "STRI3" = "DKT18" }
    ```

=== "2. Nested Table"
    ```toml
    [part.Wing]
    mesh = "AbaqusInp"
    material = "Composite"

    [part.Wing.element_mapping]
    "S3R"   = "S3L_C0"
    "STRI3" = "DKT18"
    ```

### Examples

=== "TOML :simple-toml:"
    ```toml
    # Defining a physical part from a mesh source
    [part.MainPlate]
    mesh = "PlateGeometry"
    material = "Steel_S235"
    thickness = 1.2
    node_offset = 0
    element_offset = 0
    translation = [0.0, 0.0, 50.0]

    # Reusing the same mesh for a second part with different properties
    [part.Reinforcement]
    mesh = "PlateGeometry"
    material = "Steel_S355"
    thickness = 2.5
    node_offset = 500      # MainPlate had 500 nodes
    element_offset = 450   # MainPlate had 450 elements
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

The `section` block allows you to assign specific physical properties to a subset of elements within a Part. It is used to define local variations of materials, thicknesses, or integration settings by targeting an element **Set**.

### Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`set`** | String | **Yes** | - | Name of the element [Set](#set) this section applies to. |
| **`type`** | String | **Yes** | - | Section technology (e.g., `SHELL`, `SOLID`). |
| `material` | String | Yes | - | Name of the [Material](#material_library). Overrides Part-level material. |
| `thickness` | Float | No* | - | Required for Shell types. Overrides Part-level thickness. |
| `nip` | Integer | No | `3` | Number of Integration Points through the thickness. |

### Examples

Sections are defined as a list of objects. They act as a bridge between a group of elements (a Set) and their physical behavior.

=== "TOML :simple-toml:"
    ```toml
    # Assigning a specific thickness to a reinforcement zone
    [section.ReinforcedZone]
    set = "CentralElements"
    type = "SHELL"
    thickness = 5.0
    nip = 5

    # Overriding material for a specific set within a part
    [section.ConnectionZone]
    set = "BoltedNodes"
    type = "SOLID"
    material = "HighStrengthSteel"
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

See the [Element Library](#element_library) for available technologies (e.g., `MEMBRANE_3`, `S3L_C0`, `ROD_2`).

### Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`ID`** | Integer | **Yes** | - | Unique identifier for the element (first token). |
| **`NODES`** | Array | **Yes** | - | List of node IDs, e.g., `[1, 2, 3]`. |
| **`MATERIAL`** | String | **Yes** | - | Name of the [Material](#material_library) to assign. |
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

Sets are named groups of entities (nodes or elements) used to apply boundary conditions, loads, or to define [Sections](#section). They allow for a modular selection of the model parts without redefining connectivity.

### Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Yes** | - | Entity type: `NODE` or `ELEMENT`. |
| `nodes` | Array | No* | - | List of node IDs. *Required for type `NODE` type.* |
| `elements` | Array | No* | - | List of element IDs. *Required for type `ELEMENT` type.* |
| `range` | Array | No* | - | Range definition: `[start, end, step]`. |

!!! warning "Validation Rules"
    - You must provide either a list (`nodes`/`elements`) or a `range`, but **not both**.
    - For the `range` parameter, the step (third value) **cannot be zero**.

### Range Syntax
The `range` array follows the pattern: `[start_id, end_id, step]`.

*Example:* `range = [1, 10, 2]` will select IDs: **1, 3, 5, 7, 9**.

### Examples

=== "TOML :simple-toml:"
    ```toml
    # Set of specific nodes
    [set.FixedNodes]
    type = "NODE"
    nodes = [1, 2, 10, 15]

    # Set of elements defined by a range
    [set.BottomElements]
    type = "ELEMENT"
    range = [1, 100, 1]
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
| **`type`** | String | **Yes** | - | Material model keyword. See [Material Library](#material_library). |
| **`density`** | Float | **Yes** | - | Material density ($\rho$). Must be positive. |
| `damping` | Float | No | `0.0` | Mass-proportional Rayleigh damping coefficient ($\alpha$). |

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
| **`type`** | String | **Yes** | - | Amplitude model. See [Amplitude Library](#amplitude_library). |

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
| **`type`** | String | **Yes** | - | Constraint technology. See [Constraint Library](#constraint_library). |
| **`set`** | String | **Yes** | - | Name of the [Node Set](#set) where the constraint is applied. |
| `amplitude` | String | No | - | Name of a global [Amplitude](#amplitude) to scale all defined components. |

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
| **`set`** | String | **Yes** | - | Name of the [Set](#set) or [Surface](#surface) to apply the load to. |
| `amplitude` | String | No | - | Name of the [Amplitude](#amplitude) used to scale values. |
| `p` | Float | No | `0.0` | Distributed pressure (typically for Shell/Membrane elements). |
| `fx`, `fy`, `fz` | Float | No | `0.0` | Punctual force components along global X, Y, and Z. |
| `mx`, `my`, `mz` | Float | No | `0.0` | Punctual moment components around global X, Y, and Z. |
| `ax`, `ay`, `az` | Float | No | `0.0` | Linear body acceleration components. |
| `arx`, `ary`, `arz`| Float | No | `0.0` | Rotational body acceleration components. |

### Evaluation Logic

The magnitude of a load component at a specific simulation time $t$ is calculated as the product of the base value and the amplitude factor:

$F_{applied}(t) = F_{base} \times Amplitude(t)$

If no `amplitude` is specified, the scale factor defaults to **1.0**.

### Examples

=== "TOML :simple-toml:"
    ```toml
    # Applying a vertical punctual force to a specific set
    [load.PunchForce]
    set = "TopNodes"
    fz = -500.0
    amplitude = "RampDown"

    # Applying a constant pressure to a surface
    [load.InternalPressure]
    set = "InnerSurface"
    p = 10.5
    ```

=== "Fembic :material-text:"
    ```xml
    LOADS
    PunchForce SET = TopNodes FZ = -500.0 AMPLITUDE = RampDown

    LOADS
    InternalPressure SET = InnerSurface P = 10.5
    ```

!!! tip "Multi-Component Loads"
    A single `load` block can define multiple components (e.g., `fx`, `fy`, and `fz`) simultaneously. All values in the block share the same `amplitude`.

---

## Contact Behaviour

The `contact_behaviour` block defines the physical laws (Normal and Tangential) that govern the interaction between two surfaces. These laws must be defined by name so they can be assigned to a specific [Contact](#contact) pair.

### Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Yes** | - | Technology keyword. See [Contact Behaviour Library](#contact_behaviour_library). |

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

The `contact` block defines the interaction between geometric entities. It pairs two surfaces together and assigns them specific physical laws defined in the [Contact Behaviour](#contact_behaviour) section.

### Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Yes** | - | Interaction technology. Currently supported: `PAIR`. |
| `master` | String | Yes\* | - | Name of the first [Surface](#surface). |
| `slave` | String | Yes\* | - | Name of the second [Surface](#surface). |
| `surfaces` | Array | Yes\* | - | Alternative syntax: List of two surfaces `["Surf1", "Surf2"]`. |
| **`normal`** | String | **Yes** | - | Name of the assigned Normal [Contact Behaviour](#contact_behaviour_library). |
| **`tangential`**| String | **Yes** | - | Name of the assigned Tangential [Contact Behaviour](#contact_behaviour_library). |
| `edge` | Boolean | No | `false` | If `true`, enables edge contact detection (surface + edges). If `false`, uses basic surface-only contact. |

!!! info "Surface Definition"
    You must define the surfaces involved using either the `master`/`slave` pair **or** the `surfaces` array. Using both simultaneously will result in a validation error.

### Examples

=== "TOML :simple-toml:"
    ```toml
    # Interaction defined using Master/Slave keywords (basic surface contact)
    [contact.DieToBlank]
    type = "PAIR"
    master = "ToolSurface"
    slave = "WorkpieceNodes"
    normal = "HardPenalty"
    tangential = "SteelFriction"

    # Interaction defined using the surfaces array (with edge contact enabled)
    [contact.SelfContact]
    type = "PAIR"
    surfaces = ["FabricSurface", "FabricSurface"]
    normal = "SoftPenalty"
    tangential = "FabricFriction"
    edge = true
    ```

=== "Fembic :material-text:"
    ```xml
    CONTACTS TYPE PAIR
    DieToBlank MASTER = ToolSurface SLAVE = WorkpieceNodes NORMAL = HardPenalty TANGENTIAL = SteelFriction

    CONTACTS TYPE PAIR
    SelfContact SURFACES = ["FabricSurface", "FabricSurface"] NORMAL = SoftPenalty TANGENTIAL = FabricFriction
    ```

---

## Tracker

The `tracker` block logs discrete simulation data into separate **CSV** files. It is the primary tool for extracting nodal history or element state variables over time.

### Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Yes** | - | Entity type to track: `NODE` or `ELEMENT`. |
| **`variable`** | String | **Yes** | - | Physical quantity to log. See [Tracker Library](#tracker_library). |

### Examples

=== "TOML :simple-toml:"
    ```toml
    # Tracking the reaction force of a node set in the Z direction
    [tracker.ReactionForce]
    type = "NODE"
    variable = "FORCE"
    direction = "Z"
    nodes = [1, 2, 3, 4]

    # Tracking the axial stress in a specific element
    [tracker.CoreStress]
    type = "ELEMENT"
    variable = "STRESS"
    component = "C11"
    elements = [101]
    ```

=== "Fembic :material-text:"
    ```xml
    TRACKERS TYPE NODE
    ReactionForce NODES = [1, 2, 3, 4] VARIABLE = FORCE DIRECTION = Z

    TRACKERS TYPE ELEMENT
    CoreStress ELEMENTS = [101] VARIABLE = STRESS COMPONENT = C11
    ```

---

# Library Reference

## Element Library

The following table lists the finite element technologies available. The requirement for specific geometric parameters (like `thickness` or `radius`) depends on the element technology.

| Keyword | Nodes | Category | Key Parameters | Description |
| :--- | :---: | :--- | :--- | :--- |
| **`ROD_2`** | 2 | Truss | `radius`, `material` | 1D rod supporting axial tension and compression only. |
| **`MEMBRANE_3`** | 3 | Shell | `thickness`, `material` | 3-node triangular membrane (in-plane stiffness, no bending). |
| **`S3L_C0`** | 3 | Shell | `thickness`, `material`, `nip` | 3-node shell element with linear bending (C0 continuity). |
| **`DKT18`** | 3 | Shell | `thickness`, `material`, `nip` | Discrete Kirchhoff Triangle for thin shell bending analysis. |
| **`HEXA8`** | 8 | Solid | `material` | 8-node linear isoparametric brick element for 3D continuum. |
| **`CONTACT_TRIANGLE`** | 3 | Contact | `thickness`, `factor`, `subtype` | Surface contact element. Subtypes: `SOLID` or `SHELL`. |
| **`CONTACT_LINE`** | 2 | Contact | `radius`, `factor` | 1D element for edge-to-edge or node-to-edge contact detection. |

### Parameter Details

* **`material`**: Name of the material assigned to the element. Required for all structural elements.
* **`thickness`**: Physical thickness of the shell, membrane, or contact surface.
* **`radius`**: Cross-sectional radius for `ROD_2` or `CONTACT_LINE`.
* **`nip`**: Number of Integration Points through the thickness (typically 1 to 5).
* **`factor`**: Penalty factor used to enforce contact constraints (stiffness).
* **`friction`**: Coulomb friction coefficient for contact interactions.

!!! tip "Contact Logic"
    Structural elements like `MEMBRANE_3` or `DKT18` can trigger internal contact detection if the `contact` parameter is set to `BASIC` or `EDGE` in their definition. This automatically creates underlying `CONTACT_TRIANGLE` or `CONTACT_LINE` entities.

---

## Material Library

This section lists the specific parameters required for each material technology.

### ELASTIC
Standard Isotropic Linear Elasticity based on Hooke's Law. It assumes a plane stress state for 2D elements.

| Parameter | Type | Required | Range | Description |
| :--- | :--- | :---: | :---: | :--- |
| `young` | Float | **Yes** | $>0$ | Young's Modulus ($E$). |
| `poisson` | Float | **Yes** | $[0, 0.5]$ | Poisson's ratio ($\nu$). |

### HYPERELASTIC
Non-linear elastic model for large strain analysis (rubbers, soft tissues). Currently supports the **Ogden** potential for incompressible materials.

| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `potential` | String | **Yes** | Potential type. Supported: `OGDEN`. |
| `mu` | Array | **Yes** | List of shear moduli $\mu_i$. |
| `alpha` | Array | **Yes** | List of non-linear exponents $\alpha_i$. |

!!! note "Array Consistency"
    The `mu` and `alpha` arrays must have the same number of entries. Each pair $( \mu_i, \alpha_i )$ defines one term of the Ogden strain energy potential.

### HYPERTEXTILE
Advanced invariant-based model specifically designed for dry or impregnated textile reinforcements. It decouples elongation in warp/weft directions from in-plane shear.

| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| **`warp_orientation`**| Array | **Yes** | Unit vector $[x, y, z]$ for initial warp fiber direction. |
| **`weft_orientation`**| Array | **Yes** | Unit vector $[x, y, z]$ for initial weft fiber direction. |
| **`k_shear`** | Array | **Yes** | Polynomial coefficients for shear stiffness. |
| **`k_elong_warp`** | Array | **Yes** | Polynomial coefficients for warp elongation. |
| **`k_elong_weft`** | Array | **Yes** | Polynomial coefficients for weft elongation. |
| `k_bend_warp` | Array | No | Coefficients for warp bending moments. |
| `k_bend_weft` | Array | No | Coefficients for weft bending moments. |
| `k_bend_twist` | Array | No | Coefficients for twisting moments. |

!!! tip "Orientation Projection"
    During initialization, COMFOR automatically projects the global orientation vectors onto the local basis of each element. If a fiber direction is found to be perpendicular to an element's plane, the simulation will stop with an error.

---

## Amplitude Library

### TABULAR
The `TABULAR` type defines a function through a series of discrete time/value pairs. COMFOR performs a **linear interpolation** between the provided points.

| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| **`values`** | Array | **Yes** | List of `[time, value]` pairs. |

!!! info "Operational Logic"
    * **Interpolation**: Linear between defined points.
    * **Out of Bounds**: If the current simulation time is outside the defined range $[t_{min}, t_{max}]$, the amplitude returns **0.0**.
    * **Sorting**: COMFOR automatically sorts the pairs by increasing time during initialization.

---

## Constraint Library

### BOUNDARY_CONDITION

This technology prescribes nodal velocities ($v$) and accelerations ($a$). You can define components as simple numeric values or as complex maps to include local amplitudes.

#### Component Syntax

Each component (e.g., `vx`, `vry`, `az`) can be defined in two ways:

1.  **Numeric**: `vx = 1.0` (Scales with the global constraint amplitude if provided).
2.  **Map**: `vx = { value = 1.0, amplitude = "MyAmp" }` (Uses a specific amplitude for this component).

#### Available Parameters

| Parameter | Category | Description |
| :--- | :--- | :--- |
| `preset` | Special | Use `FIXED` to set all velocities (linear and rotational) to 0.0. |
| `vx`, `vy`, `vz` | Linear Velocity | Prescribed velocity along X, Y, or Z axes. |
| `vrx`, `vry`, `vrz`| Rotational Vel. | Prescribed angular velocity around X, Y, or Z axes. |
| `ax`, `ay`, `az` | Acceleration | Prescribed acceleration along X, Y, or Z axes. |

!!! info "Velocity vs Acceleration"
    If a velocity component (e.g., `vx`) is set, any prescribed acceleration for the same axis (`ax`) is ignored and forced to $0.0$ to ensure kinematic consistency.

#### Value Evaluation
The value applied at a given time $t$ is calculated as:

$$V_{applied}(t) = Value \times Amplitude(t)$$

If no local amplitude is defined for the component, it falls back to the global `amplitude` defined at the block level. If neither is present, the factor is $1.0$.

---

## Contact Behaviour Library

This reference lists the specific parameters required for each contact technology.

### LINEAR_PENALTY (Normal)

A linear spring model that applies a reaction force proportional to the penetration distance (*gap*).

| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `stiffness` | Float | **Yes** | Penalty stiffness. (Alias: `factor`). |

### PENALTY_ADHESION (Normal)

A normal law that manages both compression (penalty) and adhesive forces (tension) when surfaces attempt to separate.

| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `stiffness` | Float | **Yes** | Compression stiffness. (Alias: `factor`). |
| `strength` | Float | **Yes** | Adhesive force magnitude. (Alias: `adhesive_strength`). |
| `threshold` | Float | No | Distance limit for adhesion. (Alias: `adhesion_threshold`). Defaults to element thickness. |

### COULOMB (Tangential)

Standard friction model. It includes a *smooth factor* regularization to ensure numerical stability during slip-direction changes.

| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `friction` | Float | **Yes** | Friction coefficient $\mu$. (Alias: `mu`). |

!!! info "Regularization"
    The `COULOMB` implementation uses a smoothing factor based on the dot product of the current and previous slip vectors. This minimizes numerical oscillations when the sliding direction changes abruptly.

---

## Tracker Library

### NODE

Tracks kinematic or kinetic data for a specific list of nodes.

| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| **`nodes`** | Array | **Yes** | List of Node IDs to track. |
| **`direction`**| String | **Yes** | Global component direction: `X`, `Y`, or `Z`. |
| **`variable`** | String | **Yes** | Supported: `FORCE`, `MOMENT`, `POSITION`, `VELOCITY`, `ACCELERATION`, `CONTACTFORCE`, `CONTACTSLIDING`. |

!!! info "Alias"
    The keyword `CONTACTSLIDINGVELOCITY` can be used as an alias for `CONTACTSLIDING`.

### ELEMENT

Tracks internal state variables for a specific list of elements.

| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| **`elements`** | Array | **Yes** | List of Element IDs to track. |
| **`component`** | String | **Yes** | Tensor component: `C11`, `C22`, `C33`, `C12`, `C13`, `C23`. |
| **`variable`** | String | **Yes** | Supported: `STRAIN`, `STRESS`. |

!!! tip "Total Values"
    In the generated CSV, the last column is automatically calculated as the **Sum** (for Node trackers) or **Mean** (for Element trackers) of all tracked entities.

[^1]: Parsing, syntax analysis, or syntactic analysis is the process of analyzing a string of symbols, either in natural language, computer languages or data structures, conforming to the rules of a formal grammar. [Wikipedia](https://en.wikipedia.org/wiki/Parsing){:target="_blank"}
