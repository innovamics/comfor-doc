# Explicit dynamics 

The scheme used in Comfor is explicit dynamics. This type of scheme allows a conditional step by step resolution of a dynamics problem. The equation of the dynamics, valid at any time, is written in the form :

\begin{equation}
	\mathbf{M} \mathbf{a} + \mathbf{C}^{d} \mathbf{v} + \mathbf{f}_{int} = \mathbf{f}_{ext}
\end{equation}

In order to solve this equation using a time integration scheme, time is first discretized into increments, or time steps. The dynamics equation becomes :

\begin{equation}
	\mathbf{M} \mathbf{a}^i + \mathbf{C}^d \mathbf{v}^i + \mathbf{f}_{int}^i = \mathbf{f}_{ext}^i 
\end{equation}

The time integration scheme will define how displacements, velocities and accelerations are approximated from one increment to the next.

## Central difference scheme 

The most popular, and currently implemented method on comfor is the central difference method. This method is developed from the central difference formulas applied for acceleration and velocity[@BEL14] [@BEN17]. 

Let the time of the simulation be $t_0 \leq t \leq t_e$ be subdivided in time steps $\Delta t^n$ from $n=1$ to $n = n_e$ where $n_e$ is the number of time steps and $t_e$ the end time of the simulation. The time after the _n-th_ integration is $t^n$. 

\begin{equation}
t^n  = t_0 + \sum_{i=1}^{n} \Delta t^i
\end{equation}

Without lost of generality lets put $t_0 =0$. The coordinates of every point $\mathbf x$ at time $t^{n+1}$ is given by:

\begin{equation}
\mathbf x^{n+1} = \mathbf x^{n} + \mathbf u^{n+1} 
\end{equation}

The displacement vector at time $t+1$ are integrate using the velocities evaluated at time $t^{n+1/2} = t^n + \frac{1}{2} \Delta t^{n+1}$

$$
    \mathbf u^{n+1} = \mathbf u^{n} + \Delta t^{n+1} \mathbf{v} \left( t_{n+1/2} \right) = \mathbf u^{n} + \Delta t^{n+1} \mathbf{v}^{n+1/2} 
$$

The velocity $\mathbf{v}^{n+1/2}$ is often refereed as _staggered_ with respect ti the coordinate system. The velocity is integrated from de from the acceleration at time $t^n$

$$
    \mathbf{v}^{n+1/2} =  \mathbf{v}^{n-1/2} +   \Delta t^{n+1/2} \mathbf{a}^n
$$

where $\Delta t^{n+1/2} = \left( t^{n+1/2} - t^{n-1/2} \right)$, or:

$$
 \Delta t^{n+1/2} = \frac {\Delta t^{n+1} + \Delta t^{n}}{2} 
$$

Finally the acceleration  is obtained by solving the dynamic equilibrium at current time $t$:

\begin{equation}
	\mathbf{a} = \mathbf{a} = \mathbf{M}^{-1}(\mathbf{f}_{ext}^n - \mathbf{f}_{int}^n  - \mathbf{C}^{d}\mathbf{v}^{n-1/2}  )
\end{equation}

This scheme as all the explicit integrations methods is conditionally stable. If the time step exceeds a critical value $\Delta t_{crit}$ the solution will diverge. The stable time step of the dynamic system is given by:

$$
 \Delta t \leq  \alpha \Delta t_{crit} = \frac{2}{\omega_{max}}
$$

$\omega_{max}$ is the maximum frequency of the eigen value problem and $\alpha$ is a safety factor, typically used to guarantee that the time step is conservative. In order to avoid a calculation of eigenvalues, this value can be bounded by taking by analogy the calculation of the eigenvalues of an elastic bar of length $l$. The maximum frequency is given by:

$$
 \omega = \frac{2}{l} \sqrt{\frac{E}{\rho}} = \frac{2c}{l}
$$

The critical time step is then given by:

$$
 \Delta t_{crit} = \frac{l}{c}
$$

For three and three dimension, similar results apply by choosing a characteristic element length $l_e$ and the current elastic wave speed in the element $c_e$. During the update loop over the elements, the stable time step for each element is computed, and the minimum step time becomes the time step for the whole system.

$$
 \Delta t = \alpha \min_{e} \frac{l_e}{c_e}
$$

Usually a safety factor $\alpha$ of 0.9 is used to guarantee convergence. Or, 0.25 to 0.50 in the case of problems involving explosives. 

## Newmark scheme

The Newmark $\beta_2$ and corresponds to a Taylor series development of the displacements, truncated at the jerk, with weighting coefficients $\beta$ and $\gamma$ :

\begin{align}
	\mathbf{u}^{n+1} & = \mathbf{u}^{n} + \Delta t \mathbf{v}^{n} + \frac{1}{2} \Delta t^2 \mathbf{a}^{n} + \beta \frac{1}{2} \Delta t^2 \left(\mathbf{a}^{n+1} - \mathbf{a}^{n} \right) \\
	\mathbf{v}^{n+1} & = \mathbf{v}^{n} + \Delta t \mathbf{a}^{n} + \gamma \Delta t \left(\mathbf{a}^{n+1} - \mathbf{a}^{n} \right)
\end{align}

From these expression we can write two sets, called prediction terms:

\begin{align}
	\tilde{\mathbf{u}}^{n+1} & = \mathbf{u}^{n} + \mathbf{v}^{n} + \frac{1}{2} \Delta t^2 \left( 1 - \beta \right) \mathbf{a}^{n} \\
	\tilde{\mathbf{v}}^{n+1} & = \mathbf{v}^{n} + \Delta t \left( 1 - \gamma \right) \mathbf{a}^{n} 
\end{align}

and correction:

\begin{align}
	\mathbf{u}^{i+1} & = \tilde{\mathbf{u}}^{i+1} + \beta \frac{1}{2} \Delta t^2 \mathbf{a}^{i+1} \\
	\mathbf{v}^{i+1} & = \tilde{\mathbf{v}}^{i+1} + \gamma \Delta t \mathbf{a}^{i+1} 
\end{align}

The objective is now to find the acceleration at the new time step:

$$
	\mathbf{a}^{n+1} = - \mathbf{A}^{-1} \left( \mathbf{f}_{ext}^{n+1} + \mathbf{C}^{d} \tilde{\mathbf{v}}^{n+1} + \mathbf{K} \tilde{\mathbf{u}}^{n+1} \right) 
$$

where:

\begin{equation}
	\mathbf{A} = \mathbf{M} + \gamma \Delta t \mathbf{C}^{d} + \frac{1}{2} \beta \Delta t^2 \mathbf{K}
\end{equation}

The parameters $\gamma$ and $\beta$ of the algorithm allow to obtain different integration schemes, adapted to a given problem. Two types of resolution are then possible. The explicit resolution which allows to know the displacement at the next increment only with the help of the displacement, the speed and the acceleration at the previous step. Conversely, when this is not possible, the resolution is called implicit. The latter are generally stable for large time steps and ensure by construction the convergence of the dynamics equation. The explicit schemes are conditionally stable. Their stabilization implies the use of small time steps depending on the mesh and the material used. On the other hand, the absence of convergence verification allows to solve more easily non linear problems (geometrical, material or contact). 

## Lumped mass matrix 

In explicit dynamics, the mass and damping matrices are taken diagonally. The inversion of these matrices is then extremely simplified. A method of mass matrix condensation is used (mass lumping[@ZIE05]). The condensation of the matrix is done by summing on the diagonal the terms of the same row:

\begin{equation}
	\tilde{M}_{ii} = \sum_j {M}_{ij}
\end{equation}

This method using a diagonal approximation speeds up the calculation, while being reasonable since globally $M_{ij} \neq 0$ is small for each row $i$ and is associated with geometrically close degrees of freedom. The loss of accuracy is largely compensated by the gain in computation time. In addition, the damping matrix is computed as a function of the mass matrix using a special case of Rayleigh damping, such that $\mathbf{C}^d=\alpha \mathbf{M}$.


## References

\bibliography