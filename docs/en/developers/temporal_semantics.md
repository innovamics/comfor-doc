# Temporal semantics of the explicit solver

This page describes how the current explicit solver in **Comfor** interprets
time-dependent nodal quantities. It complements the general presentation of the
[solver scheme](../docs/theory/solvers/solvers_overview.md) with the practical
conventions used by the implementation.

Comfor uses a **variable-step central-difference scheme in leapfrog form**:

- positions, displacements, rotations, forces, and accelerations live on
  integer times `t^n`
- the primary velocity is staggered on half steps
  `t^{n-1/2}` and `t^{n+1/2}`

## Time quantities used by the solver

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

The first quantity is the **kick interval** used to update the staggered
velocity. The second is the time at which half-step velocity constraints are
applied.

## Main nodal quantities

The current explicit solver uses the following interpretation:

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
- `velocity_at_n` is used for nodal velocity output and kinetic energy

## Sequence of one explicit increment

One call to `ExplicitSolver::solve()` advances the solution from `t^n` to
`t^{n+1}`.

The current sequence in Comfor is:

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

## Force assembly and constitutive timing

Constitutive updates in Comfor follow two common patterns.

### Configuration-based constitutive updates

Material and section models based on the current geometry or deformation
gradient are evaluated on the current configuration `d^n`. They therefore
assemble stresses and internal forces at `t^n`.

### Rate-based constitutive updates

Rate-based formulations use the staggered velocity on entry to the increment:

- `v^{n-1/2}`
- together with `Δt^{n-1/2}`

This gives the strain increment that closes at `t^n`, which is then used to
assemble the force state `f^n`.

## Damping convention used today

The current solver uses a **nodal mass-proportional Rayleigh damping**
coefficient `alpha`.

This damping is applied:

- to translational motion
- to rotational motion

The acceleration stored in the nodal fields is the **algorithmic kick
acceleration** used by the damped central-difference update. It is therefore
not simply the raw physical quantity `M^{-1}f`.

The current damped kick uses the denominator:

$$
1 + \frac{1}{2}\alpha \Delta t^n
$$

Acceleration-type loads such as gravity are included in the physical
right-hand side before this damping factor is applied.

## Reconstruction of the integer-step velocity

The solver advances the half-step velocity and then reconstructs `v^n` for
quantities that must be associated with the integer-step state.

In the current implementation:

- `velocity_at_n` is the integer-step velocity used by nodal output
- the same reconstructed velocity is used in kinetic energy evaluation

When damping is active, this reconstructed velocity remains consistent with the
algorithmic update used by the solver.

## Initial state at `t = 0`

Before the first increment:

- the nodal state is reset to the reference configuration
- prescribed velocity conditions at `t = 0` are applied
- prescribed acceleration conditions at `t = 0` are applied

The first output written by the solver corresponds to this initialized state.

At the moment, acceleration-driven loads such as gravity are first evaluated
inside the solver during the first increment. Therefore the output written at
`t = 0` is an initialized reference state, not yet a fully assembled dynamic
state for those loads.

## Output convention

Comfor writes:

- one initial output at `t = 0`
- then one output after each solved increment, according to the configured
  output frequency

The current convention is:

- after an increment has been solved, the state is written with its **actual
  converged solver time**

This means that each output label corresponds to the time of the state that is
actually written.

Trackers reporting nodal velocity use the reconstructed integer-step velocity
`v^n`, not the staggered half-step velocity.

## Energy diagnostics

The explicit solver currently tracks:

- internal energy
- external energy
- kinetic energy
- residual and balance indicators

These diagnostics are useful, but they should still be interpreted with care:

- damping introduces dissipation that is not yet fully separated in the current
  balance
- prescribed kinematic boundary conditions may inject work that is not yet
  represented as a dedicated external-work contribution

For this reason, the public logging currently favors simple quantities such as
internal energy, kinetic energy, and `Ek/Ei (%)`.

## Current limitations

The temporal semantics above describe the current solver behavior. Some known
limitations remain:

- the state written at `t = 0` is not yet a fully assembled acceleration state
  for acceleration-driven loads
- the current energy balance is still incomplete for damping and prescribed
  kinematic work
- mass and inertia regularization are separate robustness topics and are not
  part of the temporal contract itself

## Summary

The current explicit solver in Comfor can be summarized as follows:

- geometry and forces are evaluated at integer times `t^n`
- the primary velocity is stored on staggered half steps
- one increment assembles on `d^n`, kicks the half-step velocity, and drifts to
  `d^{n+1}`
- rate-dependent updates use `v^{n-1/2}` and `Δt^{n-1/2}`
- nodal velocity output uses the reconstructed integer-step velocity `v^n`
- solved outputs are labeled with the actual converged time of the state

This is the temporal behavior followed today by the Comfor explicit dynamic
solver.
