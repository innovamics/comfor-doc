---
title: Solvers Architecture
---

## Solvers Architecture in COMFOR

COMFOR uses a **modular and extensible solver architecture** based on object-oriented programming principles. This section describes the current implementation and the underlying theory.

### Class Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                        Solver (Interface)                         │
├─────────────────────────────────────────────────────────────┤
│  + configure(const ObjectConfig&)                              │
│  + initialize(SimulationData&, SolverState&)                  │
│  + solve(SimulationData&, SolverState&)                        │
│  + type() -> SolverType                                        │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │
              ┌───────────────────────────────┴───────────────────────────────┐
              │                                                               │
              ▼                                                               ▼
   ┌─────────────────────────┐                         ┌─────────────────────────┐
   │    ExplicitSolver         │                         │     (Future) Implicit     │
   │                         │                         │        Solver            │
   │  # computeForces()        │                         │                         │
   │  # computeAccelerations()│                         │                         │
   │  # computeCriticalTimeStep()│                     │                         │
   │  # computeEnergies()      │                         │                         │
   │  # saveKinematics()       │                         │                         │
   │  # saveForces()           │                         │                         │
   └─────────────────────────┘                         └─────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                   ExplicitIntegrator (Interface)                 │
├─────────────────────────────────────────────────────────────┤
│  + updateKinematics(NodeContainer&, const StepContext&)         │
│  + updateVelocities(NodeContainer&, const StepContext&)         │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │
              ┌───────────────────────────────┴───────────────────────────────┐
              │                                                               │
              ▼                                                               ▼
   ┌─────────────────────────────┐               ┌─────────────────────────────┐
   │  CentralDifferenceIntegrator  │               │    (Future) Other Integrators │
   │                              │               │                             │
   │  Implementation of centered  │               │                             │
   │  differences for explicit   │               │                             │
   │  time integration           │               │                             │
   └─────────────────────────────┘               └─────────────────────────────┘
```

### Solver Type Enumeration

```cpp
enum class SolverType { Explicit, Implicit };
```

---

## SolverState: Transient State

The `SolverState` structure encapsulates the transient state of the solver during time integration.

### Fields

| Field | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `auto_step` | `bool` | `false` | Indicates if solver automatically calculates time step |
| `step` | `StepContext` | - | Current time context |
| `energy` | `EnergyBalance` | - | Global energy diagnostics |

### StepContext: Time Context

The `StepContext` structure stores the staggered time values used by the centered differences family:

| Field | Type | Description |
| :--- | :--- | :--- |
| `time_n` | `double` | Time at integer instant $t^n$ |
| `dt_forward` | `double` | Forward derivative interval $\Delta t^{n+\frac{1}{2}} = t^{n+1} - t^n$ |
| `dt_backward` | `double` | Backward derivative interval $\Delta t^{n-\frac{1}{2}} = t^n - t^{n-1}$ |

#### Utility Methods

- **`dtCentral()`**: Returns the central interval $\Delta t^n = \frac{1}{2}(\Delta t^{n-\frac{1}{2}} + \Delta t^{n+\frac{1}{2}})$
- **`timeHalf()`**: Returns the half-time $t^{n+\frac{1}{2}} = t^n + \frac{1}{2}\Delta t^{n+\frac{1}{2}}$

---

## EnergyBalance: Energy Balance

The `EnergyBalance` structure provides diagnostics on the energy equilibrium of the system:

| Field | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `internal` | `double` | `0.0` | Accumulated internal work |
| `external` | `double` | `0.0` | Accumulated external work |
| `kinetic` | `double` | `0.0` | Instantaneous kinetic energy $E_k^n$ |
| `residual` | `double` | `0.0` | Signed energy balance defect |
| `balance` | `double` | `0.0` | Absolute defect $\| \text{residual} \|$ |
| `tolerance` | `double` | `0.0` | User tolerance for interpreting the defect |
| `conservation` | `bool` | `true` | True when $\| \text{residual} \| \le \text{tolerance}$ |

---

## ExplicitSolver: Explicit Solver Implementation

The `ExplicitSolver` class is the current implementation of the explicit dynamics solver. It inherits from the `Solver` interface and orchestrates the resolution process.

### Responsibilities

1. **Clock management**: Maintain simulation time and intervals
2. **Force assembly**: Combine contributions from elements, loads, and contacts
3. **Acceleration calculation**: Evaluate algorithmic acceleration for each node
4. **Integrator delegation**: Hand off kinematic update to the integrator
5. **Critical time step calculation**: Determine $\Delta t_{\text{crit}}$ for the system
6. **Energy diagnostics**: Update and verify energy balance

### Configuration Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `integrator` | `string` | `"central_difference"` | Type of integrator to use |
| `time_step_factor` | `double` | `0.9` | Safety factor for automatic time step |
| `energy_balance_epsilon` | `double` | `1.0e-2` | Tolerance for energy balance check |

### Main Methods

| Method | Description |
| :--- | :--- |
| `computeForces()` | Assemble internal, external, and contact node force states |
| `computeAccelerations()` | Calculate algorithmic accelerations for each node |
| `computeCriticalTimeStep()` | Return the minimum critical time step across all active elements |
| `computeEnergies()` | Update global energy diagnostics |
| `saveKinematics()` | Save converged kinematics for next increment |
| `saveForces()` | Save assembled forces for next working increment |

---

## CentralDifferenceIntegrator: Centered Differences Integrator

The `CentralDifferenceIntegrator` class implements the centered differences time integration scheme for explicit dynamics.

### Algorithm

1. **Velocity update**: $\mathbf{v}^{n+\frac{1}{2}} = \mathbf{v}^{n-\frac{1}{2}} + \Delta t^{n+\frac{1}{2}} \, \mathbf{a}^n$
2. **Position update**: $\mathbf{u}^{n+1} = \mathbf{u}^n + \Delta t^{n+1} \, \mathbf{v}^{n+\frac{1}{2}}$
3. **Coordinate update**: $\mathbf{x}^{n+1} = \mathbf{x}^n + \mathbf{u}^{n+1}$

### Collaboration with ExplicitSolver

The integrator works in close collaboration with `ExplicitSolver`:

1. `ExplicitSolver` assembles forces and calculates accelerations
2. `CentralDifferenceIntegrator` uses these accelerations to update velocities and positions
3. The cycle repeats for each time increment

---

## Explicit Resolution Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        EXPLICIT RESOLUTION CYCLE                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. INITIALIZATION                                                     │
│     ├── Load model (mesh, materials, sections, etc.)                  │
│     ├── Configure solver (ExplicitSolver)                             │
│     ├── Initialize integrator (CentralDifferenceIntegrator)           │
│     └── Prepare initial state (SolverState)                            │
│                                                                         │
│  2. TIME LOOP (t^n → t^{n+1})                                           │
│     ├── computeForces()                                               │
│     │   ├── Assemble internal forces (elements)                       │
│     │   ├── Assemble external forces (loads)                         │
│     │   └── Assemble contact forces                                   │
│     │                                                                 │
│     ├── computeAccelerations()                                        │
│     │   └── a^n = M^{-1}(f_ext^n - f_int^n - C^d v^{n-1/2})           │
│     │                                                                 │
│     ├── computeCriticalTimeStep()                                     │
│     │   └── Δt_crit = α min_e(l_e / c_e)                              │
│     │                                                                 │
│     ├── integrator->updateVelocities()                                │
│     │   └── v^{n+1/2} = v^{n-1/2} + Δt^{n+1/2} a^n                     │
│     │                                                                 │
│     ├── integrator->updateKinematics()                                │
│     │   ├── u^{n+1} = u^n + Δt^{n+1} v^{n+1/2}                         │
│     │   └── x^{n+1} = x^n + u^{n+1}                                   │
│     │                                                                 │
│     ├── computeEnergies()                                              │
│     │   ├── Calculate kinetic energy                                   │
│     │   ├── Calculate internal work                                    │
│     │   ├── Calculate external work                                    │
│     │   └── Verify energy conservation                                 │
│     │                                                                 │
│     ├── saveKinematics()                                               │
│     │   └── Save x^{n+1}, v^{n+1/2} for next iteration                  │
│     │                                                                 │
│     ├── saveForces()                                                   │
│     │   └── Save f_int^n, f_ext^n for next iteration                  │
│     │                                                                 │
│     └── state.advanceClock()                                           │
│         ├── dt_backward = dt_forward                                  │
│         └── time_n += dt_forward                                       │
│                                                                         │
│  3. OUTPUT (if needed)                                                 │
│     ├── Write VTU/VTK results                                          │
│     ├── Write tracker data (CSV)                                       │
│     └── Verify convergence if final time reached                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Advantages of Current Architecture

1. **Modularity**: Clear separation between solver, integrator, and business logic
2. **Extensibility**: Easy to extend with new solver types (implicit, etc.)
3. **Maintainability**: Well-structured and documented code
4. **Performance**: Optimized for large-scale explicit simulations
5. **Diagnostics**: Integrated energy balance to verify numerical stability

---

## TOML Configuration Example

```toml
[control]
run_from = 0.0
run_to = 10.0

# Explicit configuration with automatic time step
[solver]
type = "EXPLICIT"
integrator = "central_difference"
time_step_factor = 0.9
energy_balance_epsilon = 1.0e-2

# Configuration with fixed time step
[solver]
type = "EXPLICIT"
integrator = "central_difference"
time_step = 0.001
energy_balance_epsilon = 1.0e-3
```

---

## References

- [Temporal Semantics](../../../developers/temporal_semantics.md) - Time conventions in COMFOR
- [Explicit Rayleigh Damping](explicit_rayleigh_damping.md) - Damping treatment

\bibliography
