---
title: Tutorial - Double Dome Benchmark
---

<style>
  .md-sidebar--secondary .md-nav__list .md-nav__list .md-nav__item .md-nav {
    display: none !important;
  }

  .md-typeset td:first-child, .md-typeset th:first-child {
    white-space: nowrap;
  }
</style>

# Complete Tutorial: Double Dome Benchmark

This tutorial guides you step-by-step through creating and running a **Double Dome** simulation with COMFOR. The Double Dome benchmark is a standard test in the composite forming community, used to evaluate the ability of simulation codes to model the forming of complex composite structures.

## Introduction to the Double Dome Benchmark

### What is the Double Dome?

The **Double Dome** is a widely used numerical benchmark in the field of composite material forming simulation. It consists of a flat plate being formed into a double dome shape by a central punch. This test evaluates:

- The code's ability to handle large deformations
- The accuracy of composite material behavior modeling
- Contact management between punch, die, and plate
- Numerical stability for explicit simulations

### Benchmark Configuration

| Parameter | Value |
| :--- | :--- |
| **Material** | Textile composite (HYPERTEXTILE) |
| **Plate thickness** | 1.0 mm |
| **Punch speed** | 10 mm/s (reached after a 1 s ramp) |
| **Punch stroke** | 60 mm |
| **Simulation duration** | 6.5 seconds |
| **Friction** | Coulomb coefficient = 0.1 |

### Geometry

- **Plate**: Flat textile sheet, meshed with 3-node triangles
- **Punch**: Double-dome shaped rigid tool
- **Die**: Matching rigid cavity

---

## Required Files

To follow this tutorial, you will need the mesh files:

### Available Meshes

COMFOR provides two versions of the benchmark:

#### 1. Full Model
- **Complete geometry**, without symmetry
- Contains: `die.inp`, `plate.inp`, `punch.inp`
- **Download**: [full/die.inp](../assets/tutorial/full/die.inp), [full/plate.inp](../assets/tutorial/full/plate.inp), [full/punch.inp](../assets/tutorial/full/punch.inp)

#### 2. Quarter Model (Recommended for tutorial)
- **Faster simulations** exploiting the double symmetry of the benchmark
- Contains: `die.inp`, `plate.inp`, `punch.inp`, `plate.msh`
- Size: 1 892 nodes and 3 492 elements once the three parts are assembled
- **Download**: [quart/die.inp](../assets/tutorial/quart/die.inp), [quart/plate.inp](../assets/tutorial/quart/plate.inp), [quart/plate.msh](../assets/tutorial/quart/plate.msh), [quart/punch.inp](../assets/tutorial/quart/punch.inp)

!!! tip "Recommendation"
    For this tutorial, we use the **quarter** model which is faster to run while demonstrating all features.

---

## Step 1: Understanding the TOML File Structure

The `double-dome.toml` file is structured into multiple blocks that define the complete simulation. Let's examine each section:

### Global Structure

```
double-dome.toml
├── [control]        # Time parameters
├── [[output]]       # Output configuration
├── [mesh.*]         # Mesh sources (3)
├── [part.*]         # Physical components (3)
├── [set.*]          # Entity groups (5)
├── [material.*]     # Constitutive laws (1)
├── [section.*]      # Physical properties (2)
├── [[section_assignments]] # Associations (3)
├── [amplitude.*]    # Time functions (1)
├── [constraint.*]   # Boundary conditions (4)
├── [contact_behaviour.*] # Contact laws (2)
└── [contact.*]      # Contact definition (1)
```

---

## Step 2: Create the Input File

Create a file `double-dome.toml` with the following content. We will explain each section in detail.

### Section 1: Header

```toml
# Double-dome benchmark (quarter model)
# COMFOR v0.15 - Innovamics
```

TOML comments (`#`) are a convenient place to document the purpose, author and version of the model.

### Section 2: Simulation Control

```toml
# --- Control ---
[control]
run_from = 0.0
run_to = 6.5
```

- `run_from`: Start time (usually 0.0)
- `run_to`: End time of simulation (6.5 seconds for full punch stroke)

!!! info "Time Step"
    The time step is not specified here. COMFOR automatically calculates it based on mesh and material properties.

### Section 3: Output Configuration

```toml
# --- Output ---
[[output]]
name = "fields"
type = "VTU"
frequency = 0.1
format = "BINARY"
```

| Parameter | Value | Description |
| :--- | :--- | :--- |
| `name` | `"fields"` | Name of the output (required). Also used as the name of the result sub-folder and files |
| `type` | `"VTU"` | Output format (recommended) |
| `frequency` | `0.1` | Write results every 0.1 seconds |
| `format` | `"BINARY"` | Binary format for smaller files |

!!! tip "Output Directory"
    By default, results are written to `Results_double-dome/`, next to the input file. The frames of this output are stored in `Results_double-dome/fields/`.

### Section 4: Mesh Import

```toml
# --- Mesh import ---
[mesh.punch]
type = "ABAQUS"
file = "quart/punch.inp"

[mesh.die]
type = "ABAQUS"
file = "quart/die.inp"

[mesh.plate]
type = "GMSH"
file = "quart/plate.msh"
```

**Explanations:**
- **`punch`**: Hemispherical punch (Abaqus `.inp` format)
- **`die`**: Die/cavity (Abaqus `.inp` format)
- **`plate`**: Plate to be formed (Gmsh `.msh` format)

!!! warning "File Paths"
    Relative mesh paths are resolved from the directory containing the TOML file. Make sure the mesh files are in a `quart/` directory next to `double-dome.toml`, or adjust the paths accordingly.

### Section 5: Part Definitions

```toml
# --- Parts ---
[part.punch]
mesh = "punch"
element_mapping = { "S3L_C0" = "CONTACT_TRIANGLE" }
translation = [-1.0, -1.0, 3.0]

[part.die]
mesh = "die"
element_mapping = { "S3L_C0" = "CONTACT_TRIANGLE" }
translation = [-1.0, -1.0, 0.0]

[part.plate]
mesh = "plate"
element_mapping = { "MEMBRANE_3" = "DKT18" }
translation = [0.0, 0.0, 2.0]
```

**Explanations:**

| Part | Mesh | Mapping | Translation | Role |
| :--- | :--- | :--- | :--- | :--- |
| `punch` | `punch` | S3L_C0 → CONTACT_TRIANGLE | [-1, -1, 3] | Movable punch |
| `die` | `die` | S3L_C0 → CONTACT_TRIANGLE | [-1, -1, 0] | Fixed die |
| `plate` | `plate` | MEMBRANE_3 → DKT18 | [0, 0, 2] | Plate to form |

!!! note "Element Mapping"
    Mesh readers first translate the native element types into COMFOR types, then `element_mapping` replaces them. The keys of the mapping are therefore **COMFOR type names**, not the names used in the mesh file:

    - Abaqus `S3` triangles are read as `S3L_C0`; punch and die remap them to `CONTACT_TRIANGLE` (rigid contact surfaces).
    - Gmsh triangles (type `2`) are read as `MEMBRANE_3`; the plate remaps them to `DKT18` (shell triangle with bending).

    See the [Mesh block](../docs/preprocessing.md#mesh) for the full translation tables.

!!! note "Translation"
    Translations are used to position parts in space. The punch starts above the plate (z=3.0) and the die below (z=0.0).

### Section 6: Set Definitions (Groups)

```toml
# --- Sets ---
[set.punchNodes]
type = "NODE"
part = "punch"

[set.punchElements]
type = "ELEMENT"
part = "punch"

[set.dieNodes]
type = "NODE"
part = "die"

[set.dieElements]
type = "ELEMENT"
part = "die"

[set.plateElements]
type = "ELEMENT"
part = "plate"

[set.plateXNodes]
type = "NODE"
part = "plate"
range = [1, 666, 35]

[set.plateYNodes]
type = "NODE"
part = "plate"
range = [1, 35, 1]
```

**Explanations:**

| Set | Type | Part | Selection | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `punchNodes` | NODE | punch | All nodes | Velocity constraint |
| `punchElements` | ELEMENT | punch | All elements | Section assignment |
| `dieNodes` | NODE | die | All nodes | Fixed constraint |
| `dieElements` | ELEMENT | die | All elements | Section assignment |
| `plateElements` | ELEMENT | plate | All elements | Section assignment |
| `plateXNodes` | NODE | plate | Nodes 1, 36, 71,... | X constraint |
| `plateYNodes` | NODE | plate | Nodes 1-35 | Y constraint |

!!! info "Range Selection"
    - `range = [1, 666, 35]`: Selects nodes 1, 36, 71, 106, ... 666 (increment of 35)
    - `range = [1, 35, 1]`: Selects nodes 1 to 35 (increment of 1)

### Section 7: Materials

```toml
# --- Materials ---
[material.HyperTex]
type = "HYPERTEXTILE"
density = 1e-6
damping = 5.0
warp_orientation = [1.0, 0.0, 0.0]
weft_orientation = [0.0, 1.0, 0.0]
k_elong_warp = [100.0]
k_elong_weft = [100.0]
k_shear = [0.0185, 0.0464, -0.0213]
k_bend_warp = [5.0]
k_bend_weft = [5.0]
k_bend_twist = [0.0]
```

**Composite Material Properties:**

| Parameter | Value | Description |
| :--- | :--- | :--- |
| `type` | `"HYPERTEXTILE"` | Composite material model |
| `density` | `1e-6` | Mass density (ton/mm³) |
| `damping` | `5.0` | Rayleigh damping |
| `warp_orientation` | [1,0,0] | Warp fiber direction |
| `weft_orientation` | [0,1,0] | Weft fiber direction |
| `k_elong_warp` | [100.0] | Tensile stiffness (warp) |
| `k_elong_weft` | [100.0] | Tensile stiffness (weft) |
| `k_shear` | [0.0185, 0.0464, -0.0213] | Shear stiffness |
| `k_bend_warp` | [5.0] | Bending stiffness (warp) |
| `k_bend_weft` | [5.0] | Bending stiffness (weft) |
| `k_bend_twist` | [0.0] | Twist stiffness |

### Section 8: Sections

```toml
# --- Sections ---
[section.toolSection]
type = "RIGID"
thickness = 2.0

[section.plateSection]
type = "SHELL_GENERALIZED"
material = "HyperTex"
thickness = 1.0

[[section_assignments]]
name = "AssignPunch"
section = "toolSection"
set = "punchElements"

[[section_assignments]]
name = "AssignDie"
section = "toolSection"
set = "dieElements"

[[section_assignments]]
name = "AssignPlate"
section = "plateSection"
set = "plateElements"
```

**Explanations:**

| Section | Type | Material | Thickness | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `toolSection` | RIGID | - | 2.0 mm | For punch and die (rigid bodies) |
| `plateSection` | SHELL_GENERALIZED | HyperTex | 1.0 mm | For deformable plate |

**Assignments:**
- Punch uses `toolSection` (rigid)
- Die uses `toolSection` (rigid)
- Plate uses `plateSection` (deformable composite)

### Section 9: Amplitudes

```toml
# --- Amplitudes ---
[amplitude.punchAmplitude]
type = "TABULAR"
values = [[0.0, 0.0],
          [1.0, 1.0],
          [10.0, 1.0]]
```

**Explanations:**
- `type = "TABULAR"`: Function defined by points
- `values`: [time, value] pairs
  - At t=0.0s: value = 0.0 (start from rest)
  - At t=1.0s: value = 1.0 (full speed)
  - At t=10.0s: value = 1.0 (speed maintained)

This amplitude is used to modulate the punch velocity.

### Section 10: Constraints (Boundary Conditions)

```toml
# --- constraints ---
[constraint.fixX]
type = "BOUNDARY_CONDITION"
set = "plateXNodes"
vx = 0.0

[constraint.fixY]
type = "BOUNDARY_CONDITION"
set = "plateYNodes"
vy = 0.0
vrx = 0.0

[constraint.fixPunch]
type = "BOUNDARY_CONDITION"
set = "punchNodes"
vx = 0.0
vy = 0.0
vz = {value = -10.0, amplitude = "punchAmplitude" }

[constraint.fixDie]
type = "BOUNDARY_CONDITION"
set = "dieNodes"
preset = "FIXED"
```

**Explanations:**

| Constraint | Set | DOFs | Value |
| :--- | :--- | :--- | :--- |
| `fixX` | plateXNodes | vx | 0.0 (blocked in X) |
| `fixY` | plateYNodes | vy, vrx | 0.0 (blocked in Y and rotation X) |
| `fixPunch` | punchNodes | vx, vy | 0.0 (laterally blocked) |
| `fixPunch` | punchNodes | vz | -10.0 with amplitude (downward speed) |
| `fixDie` | dieNodes | all | FIXED (completely fixed) |

!!! note "FIXED Preset"
    The `"FIXED"` preset blocks all degrees of freedom (vx, vy, vz, vrx, vry, vrz).

!!! info "Punch Speed"
    The punch moves downward at 10 mm/s (negative = downward), modulated by the amplitude which ramps from 0 to 1 during the first second. Over 6.5 s the punch therefore travels 0.5 × 10 × 1 + 10 × 5.5 = 60 mm.

### Section 11: Contact Behaviors

```toml
# --- Contact Behaviors ---
[contact_behaviour.PENALTY_GENERAL]
type = "LINEAR_PENALTY"
stiffness = 100.0

[contact_behaviour.COULOMB_GENERAL]
type = "COULOMB"
friction = 0.1
```

**Explanations:**

| Behavior | Type | Parameter | Value |
| :--- | :--- | :--- | :--- |
| `PENALTY_GENERAL` | LINEAR_PENALTY | stiffness | 100.0 (penalty stiffness) |
| `COULOMB_GENERAL` | COULOMB | friction | 0.1 (friction coefficient) |

### Section 12: Contact

```toml
# --- Contacts (General) ---
[contact.GENERAL_CONTACT]
type = "GENERAL"
normal = "PENALTY_GENERAL"
tangential = "COULOMB_GENERAL"
```

**Explanations:**
- `type = "GENERAL"`: General contact between all surfaces
- `normal = "PENALTY_GENERAL"`: Normal contact law (penalty)
- `tangential = "COULOMB_GENERAL"`: Tangential contact law (Coulomb friction)

!!! info "General Contact"
    General contact does not require explicit surface definitions: interactions are detected over the whole model. Only one `GENERAL` contact can be defined per model.

---

## Step 3: Validate the File

Before running the simulation, it is highly recommended to validate the input file:

```bash
comfor -j double-dome.toml --validate
```

**Expected Output** (after the banner):

```
 Logging job double-dome
 =======================================
 File info
  > File name: double-dome.toml
  > Extension: .toml
 Parse validation
  > Validation successful. No errors found.
 Exit Comfor
```

The same information is written to `double-dome.md`, next to the input file. When errors are found, all of them are listed in this file under **Validation Errors**.

!!! warning "Scope of the validation"
    `--validate` checks the syntax, the mandatory parameters, the allowed values and the uniqueness of names. Some checks require the model to be built (e.g. element/section compatibility, which depends on `element_mapping`); they are performed when the simulation starts.

!!! warning "Fixing Errors"
    If errors are reported:

    1. Check that all mesh file paths are correct
    2. Check that all references exist (e.g., `material.HyperTex` is referenced in `section.plateSection`)
    3. Check that every block that requires it has a `name` (e.g., `[[output]]`, `[[section_assignments]]`)

---

## Step 4: Run the Simulation

Once validation is successful, run the simulation:

```bash
comfor -j double-dome.toml
```

**Options:**

- `-j double-dome.toml`: Specify the input file (required)
- `-o <path>`: Optional, write the results to another directory (see [Running the Analysis](../docs/analysis.md))

**Output during execution** (extract):

```
 Model info
  > Number of objects instances
   - Nodes: 1892
   - Elements: 3492
   ...
  > Automatic step time: true
   - Step time: 0.000446
 Running info
 =======================================
  > Writing output file 1
   - Elapsed time: 0.397605
   - Current time: 0.100326
   - Time step: 0.000446
   - Internal energy: 0.000000
   - Kinetic energy: 0.000000
   - Ek/Ei (%): ...
 =======================================
 ...
 =======================================
 Solving took : 31.524193
 Exit Comfor
```

A block is printed each time an output frame is written (every 0.1 s here). The time step is computed automatically and may decrease during the forming as elements distort.

!!! info "Execution Time"
    With the quarter model, the simulation takes about 30 seconds on a recent laptop (serial execution).

!!! warning "Existing results"
    The results directory must not exist before the run. To run the same file again, delete `Results_double-dome/` or use `-o` to choose another directory.

---

## Step 5: Analyze the Results

### Results Structure

After execution, the following files are available:

```
double-dome.toml
double-dome.md                  # Job log
Results_double-dome/
├── manifest.toml               # Run status and list of generated files
└── fields/                     # One folder per [[output]] (its name)
    ├── fields_000000.vtu
    ├── fields_000001.vtu
    │   ... (1 file every 0.1 seconds)
    └── fields_000065.vtu
```

### Visualization with ParaView

1. **Launch ParaView**
2. **Open files**: Select the `fields_..vtu` group in `Results_double-dome/fields/`
3. **Apply**: Click the Apply button to display the mesh

#### Deformation Visualization

- The mesh is written at its current position: the displayed geometry is already the deformed one
- Color it with `Displacement` (magnitude or `Z` component)
- Use the VCR toolbar to play the animation

<figure>
  <img src="../../assets/img/deformed_vtk.gif" alt="Deformation visualization">
  <figcaption>Deformed plate at end of simulation</figcaption>
</figure>

#### Fabric Visualization

- Select `ShearAngle` to see the in-plane shear of the fabric (the key result of the double-dome benchmark)
- Select `FiberStress` or `FiberStrain` (2 components: warp and weft) to see the fiber tension
- Adjust color scale to see the distribution

#### Part Selection

- Apply a **`Threshold`** filter on `PartID` to display only the plate (the tools hide it at the end of the forming)

### Tracker Analysis

If you add trackers (not included in this basic example), one CSV file per tracker is written in `Results_double-dome/` (e.g. `Results_double-dome/PunchForce.csv`). See [Trackers](../docs/modules/trackers.md).

---

## Step 6: Interpret Results

### Simulation Verification

1. **Run status**: `Results_double-dome/manifest.toml` must contain `status = 'completed'`
2. **Energies**: In a quasi-static forming simulation, the kinetic energy should stay small compared to the internal energy. Monitor the `Ek/Ei (%)` ratio printed at each output
3. **Time step**: Should remain stable (no drastic reduction)

### Common Issues

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| `Directory already exists` | Results from a previous run | Delete the results directory or use `-o` |
| `assigned section must be of type ...` | Element type and section do not match | Check `element_mapping` and `section_assignments` |
| High `Ek/Ei (%)` | Dynamic effects too large | Reduce the punch speed or increase `damping` |
| Slow simulation | Mesh too fine or small time step | Use the quarter model or coarsen the mesh |
| Punch penetration | Insufficient contact stiffness | Increase `stiffness` in `PENALTY_GENERAL` |

---

## Complete File

You can download the complete file here: [double-dome.toml](../assets/tutorial/double-dome.toml)

---

## Exercise: Customize the Simulation

Try modifying the following parameters and observe the differences:

1. **Punch speed**: Change `vz = -10.0` to `-5.0` or `-20.0`
2. **Amplitude**: Modify `punchAmplitude` for progressive acceleration
3. **Friction**: Change `friction = 0.1` to `0.0` or `0.2`
4. **Material stiffness**: Modify `k_elong_warp` and `k_elong_weft`
5. **Plate thickness**: Change `thickness = 1.0` to `0.5` or `2.0`

---

## Summary

You have now:
- ✅ Understood the Double Dome benchmark
- ✅ Created a complete TOML input file
- ✅ Imported external meshes (Abaqus, Gmsh)
- ✅ Defined composite materials
- ✅ Configured contact with friction
- ✅ Run an explicit simulation
- ✅ Visualized results with ParaView

The Double Dome benchmark is a well-established test case in the composite forming community, widely used for validation and comparison of numerical simulation codes [@SAR10;@KHA10;@HAR13a].

---

## References

\bibliography

---

## Next Steps

- [ ] Try with the full model (`full/*.inp`); note that the full punch uses Abaqus `R3D3` elements, which are kept with their Abaqus name and can be mapped with `element_mapping = { "R3D3" = "CONTACT_TRIANGLE" }`
- [ ] Add trackers to record punch force
- [ ] Modify geometry to create a new benchmark
- [ ] Try with different material types (ELASTIC, etc.)
- [ ] Explore other examples in the documentation
