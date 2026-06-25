# Temporal Semantics of the Explicit Solver

This page defines the temporal meaning of the main nodal quantities used by the
explicit solver. It complements the theoretical presentation of the
[solver scheme](../docs/theory/solvers/solvers_overview.md) with the timing
contract used by the implementation.

Comfor uses a **variable-step central-difference scheme in leapfrog form**:

- positions, displacements, rotations, forces, and accelerations live on
  integer times `t^n`
- the primary velocity is staggered on half steps
  `t^{n-1/2}` and `t^{n+1/2}`

## Step context

The current increment is represented by:

- `time_n`: current solver time `t^n`
- `dt_forward`: forward drift interval `Δt^{n+1/2}`
- `dt_backward`: previous drift interval `Δt^{n-1/2}`

Two derived quantities are used repeatedly:

$$
\Delta t^n = \frac{1}{2}\left(\Delta t^{n-1/2} + \Delta t^{n+1/2}\right)
$$

and

$$
t^{n+1/2} = t^n + \frac{1}{2}\Delta t^{n+1/2}
$$

The first quantity is the kick interval used to update the staggered velocity.
The second is the time at which half-step velocity constraints are applied.

## Nodal field timing

The explicit solver uses the following interpretation:

| Quantity | Meaning | Time instant |
|---|---|---|
| `position`, `displacement`, `rotation` | current configuration | `t^n` |
| `velocity_half` | staggered velocity | `t^{n-1/2}` on entry, `t^{n+1/2}` after the kick |
| `velocity_at_n` | reconstructed integer-step velocity | `t^n` |
| `acceleration` | kick acceleration used by the solver | `t^n` |
| `internal_force`, `external_force`, `contact_force`, `total_force` | assembled nodal forces | `t^n` |
| `*_prev` history fields | previous-step values | `t^{n-1}` |

The distinction between `velocity_half` and `velocity_at_n` is essential:

- `velocity_half` is used by the explicit integrator and by rate-dependent
  constitutive updates
- `velocity_at_n` is used for nodal output and kinetic energy

## One explicit increment

One call to `ExplicitSolver::solve()` advances the solution from `t^n` to
`t^{n+1}`.

The sequence is:

1. choose the current `dt_forward`
2. assemble nodal forces on the current configuration `d^n`
3. compute nodal accelerations at `t^n`
4. reconstruct the integer-step velocity `v^n`
5. evaluate the current energy diagnostics
6. save the converged `n`-state needed by the next increment
7. kick the half-step velocity with `Δt^n`
8. apply prescribed velocity constraints at `t^{n+1/2}`
9. drift the configuration to `d^{n+1}` with `Δt^{n+1/2}`
10. save the force history
11. advance the solver clock to `t^{n+1}`

## Constitutive timing

Constitutive updates follow two common patterns.

### Configuration-based path

Material and section models based on the current geometry or deformation
gradient are evaluated on the current configuration `d^n`. They therefore
assemble stresses and internal forces at `t^n`.

### Rate-based path

Rate-based formulations use the staggered velocity on entry to the increment:

- `v^{n-1/2}`
- together with `Δt^{n-1/2}`

This defines the strain increment that closes at `t^n` and is then used to
assemble the force state `f^n`.

## Velocity conventions

- `velocity_half` is the primary kinematic quantity for the explicit update
- `velocity_at_n` is the reconstructed integer-step velocity used for output
  and energy evaluation

New code should avoid introducing an unnamed `velocity` quantity unless its time
location is explicit.

## Initial state

Before the first increment:

- the nodal state is reset to the reference configuration
- prescribed velocity conditions at `t = 0` are applied
- prescribed acceleration conditions at `t = 0` are applied

The first written state corresponds to this initialized configuration.

Acceleration-driven loads such as gravity are assembled during the first
increment. The output written at `t = 0` is therefore an initialized reference
state, not a fully assembled dynamic state for those loads.

## Output timing

Comfor writes:

- one initial output at `t = 0`
- one output after each solved increment, according to the configured frequency

Each written state is labeled with its actual converged solver time.

Trackers reporting nodal velocity use the reconstructed integer-step velocity
`v^n`, not the staggered half-step velocity.

## Energy diagnostics

The explicit solver tracks:

- internal energy
- external energy
- kinetic energy
- residual and balance indicators

These quantities remain useful, but damping dissipation and the work associated
with prescribed kinematic conditions are not yet isolated as separate terms.

## Summary

The explicit solver contract can be summarized as follows:

- geometry and forces are evaluated at integer times `t^n`
- the primary velocity is stored on staggered half steps
- one increment assembles on `d^n`, kicks the half-step velocity, and drifts to
  `d^{n+1}`
- rate-dependent updates use `v^{n-1/2}` and `Δt^{n-1/2}`
- nodal velocity output uses the reconstructed integer-step velocity `v^n`
- solved outputs are labeled with the actual converged time of the state
