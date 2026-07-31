<style>
  .md-sidebar--secondary .md-nav__list .md-nav__list .md-nav__item .md-nav {
    display: none !important;
  }
</style>

<div class="grid cards" style="grid-template-columns: repeat(auto-fit, minmax(200px, 300px))" markdown>

- :material-ray-vertex:{ .lg .middle }
  [<span style="color: #76B900; font-weight: bold;">Boundary Condition</span>](#boundary_condition)

</div>

This section provides a **practical overview** of the constraint formulations available in **COMFOR**. Constraints are used to prescribe boundary conditions (velocities or accelerations) on designated node sets.

# Available Constraint Types

## Common Parameters for All Constraints

Every constraint block requires these base parameters:

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Yes** | - | Constraint formulation keyword (e.g., `BOUNDARY_CONDITION`). |
| **`set`** | String | **Yes** | - | Name of the target [Node Set](../preprocessing.md#set). |
| `amplitude` | String | No | - | Name of a global [Amplitude](amplitudes.md) applied to all components. |

---

## Boundary Condition

The `BOUNDARY_CONDITION` constraint prescribes nodal velocities ($v$) and accelerations ($a$). Component values can be defined as flat numbers or as nested inline maps to assign individual local amplitudes.

### Component Syntax

Each kinematic component (e.g., `vx`, `vry`, `az`) can be specified in two ways:

1. **Numeric**: `vx = 1.0` (Scales with the block-level global `amplitude` if defined).
2. **Inline Map**: `vx = { value = 1.0, amplitude = "LocalAmp" }` (Overrides with a specific local amplitude).

### Parameters

| Parameter | Category | Description |
| :--- | :--- | :--- |
| `preset` | Special | Set to `"FIXED"` to fix all 6 degrees of freedom ($v_x, v_y, v_z, v_{rx}, v_{ry}, v_{rz} = 0.0$). |
| `vx`, `vy`, `vz` | Linear Velocity | Prescribed velocity along global X, Y, or Z axes. |
| `vrx`, `vry`, `vrz`| Rotational Velocity | Prescribed angular velocity around global X, Y, or Z axes. |
| `ax`, `ay`, `az` | Acceleration | Prescribed linear acceleration along global X, Y, or Z axes. |

!!! info "Velocity vs. Acceleration Priority"
    If a velocity component (e.g., `vx`) is set for a given axis, any prescribed acceleration for the same axis (`ax`) is overridden and set to $0.0$ to guarantee kinematic consistency.

### Evaluation Logic

The prescribed value for a given component at simulation time $t$ is calculated as:

$$V_{\text{applied}}(t) = \text{Value} \times \text{Amplitude}(t)$$

- If a component specifies its own local `amplitude`, that local amplitude is evaluated.
- If no local amplitude is defined, it falls back to the block-level global `amplitude`.
- If neither is provided, the scale factor defaults to **`1.0`**.

### Examples

=== "TOML :simple-toml:"
    ```toml
    # Fixed base support using the FIXED preset
    [constraint.FixedBase]
    type = "BOUNDARY_CONDITION"
    set = "BottomNodes"
    preset = "FIXED"

    # Prescribed platen displacement with local and global amplitudes
    [constraint.MovingPlaten]
    type = "BOUNDARY_CONDITION"
    set = "TopNodes"
    amplitude = "GlobalRamp"
    vy = { value = -10.0, amplitude = "LocalRamp" }
    vz = 0.0
    ```

=== "Fembic :material-text:"
    ```xml
    CONSTRAINTS TYPE BOUNDARY_CONDITION
    FixedBase SET = BottomNodes PRESET = FIXED

    CONSTRAINTS TYPE BOUNDARY_CONDITION
    MovingPlaten SET = TopNodes VY = -10.0 AMP = LocalRamp VZ = 0.0
    ```

---

# Choose a Constraint Type

- Use **`BOUNDARY_CONDITION`** with `preset = "FIXED"` for rigid clamps and fixed boundaries.
- Use **`BOUNDARY_CONDITION`** with prescribed `vx`/`vy`/`vz` velocities and a [Tabular Amplitude](amplitudes.md) for forming tool motion or platen displacement.