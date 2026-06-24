# Explicit Rayleigh Damping

This note summarizes the mass-proportional Rayleigh damping formulation used by
the explicit solver.

## Damping model

Comfor uses the Rayleigh model restricted to its mass-proportional part:

$$
\mathbf{C}^d = \alpha \mathbf{M}
$$

where $\alpha$ is the nodal damping coefficient.

The explicit solver advances the staggered velocity with a central-difference
scheme. For a variable time step, the kick interval is:

$$
\Delta t^n = \frac{1}{2}\left(\Delta t^{n-1/2} + \Delta t^{n+1/2}\right)
$$

## Damped translational update

At time $t^n$, the translational equilibrium is written as:

$$
\mathbf{M}\mathbf{a}^n + \mathbf{C}^d \mathbf{v}^{n-1/2} = \mathbf{f}^n
$$

Using $\mathbf{C}^d = \alpha \mathbf{M}$ gives:

$$
\mathbf{a}^n + \alpha \mathbf{v}^{n-1/2} = \mathbf{M}^{-1}\mathbf{f}^n
$$

In Comfor, acceleration-type loads such as gravity are assembled in the
physical acceleration term:

$$
\mathbf{a}_{\mathrm{phys}}^n = \mathbf{M}^{-1}\mathbf{f}^n + \mathbf{a}_{\mathrm{load}}^n
$$

The damped kick is then written as:

$$
\mathbf{a}_{\mathrm{alg}}^n =
\frac{\mathbf{a}_{\mathrm{phys}}^n - \alpha \mathbf{v}^{n-1/2}}
{1 + \frac{1}{2}\alpha \Delta t^n}
$$

The quantity stored by the solver is therefore the algorithmic acceleration
used by the kick, not only the undamped physical term.

## Damped rotational update

The same structure is applied to rotational motion. Let
$\boldsymbol{\omega}^{n-1/2}$ be the staggered angular velocity, $\mathbf{I}$
the nodal inertia tensor, and $\mathbf{m}^n$ the nodal moment. The physical
angular acceleration includes the gyroscopic term:

$$
\boldsymbol{\alpha}_{\mathrm{phys}}^n =
\mathbf{I}^{-1}\left(\mathbf{m}^n -
\boldsymbol{\omega}^{n-1/2} \times (\mathbf{I}\boldsymbol{\omega}^{n-1/2})\right)
+ \boldsymbol{\alpha}_{\mathrm{load}}^n
$$

The damped rotational kick becomes:

$$
\boldsymbol{\alpha}_{\mathrm{alg}}^n =
\frac{\boldsymbol{\alpha}_{\mathrm{phys}}^n - \alpha \boldsymbol{\omega}^{n-1/2}}
{1 + \frac{1}{2}\alpha \Delta t^n}
$$

## Remarks

- The formulation is consistent with the leapfrog central-difference update.
- Translation and rotation use the same damping denominator.
- The stored nodal accelerations are algorithmic quantities tied to the
  explicit update.
