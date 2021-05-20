# Theory overview

In this section you will find the some details about the physical models and method behind Comfor. For further details, the reader is advised to refer to the articles cited in each section.

## Contents

- [Materials](materials/materials_overview.md)
- [Elements](materials/materials_overview.md)
- [Solvers](solvers/solvers_overview.md)

## Notation

Following the common usage in the finite element and continuum mechanics literature we adopt the following rules.

**Notation convention**

We adopt the following convention for variables notation.

| Notation                                  | Description                                                          |
| ----------------------------------------- | -------------------------------------------------------------------- |
| $\alpha,\beta,\gamma, ...$                | Lower greek case letters for **Scalars**                             |
| $\mathbf{a},\mathbf{b},\mathbf{c},...$    | Lowercase bold face letters for **vectors**                          |
| $\mathbf{A},\mathbf{B},\mathbf{C},...$    | Uppercase bold face letters for **second-order tensors**            |
| $\mathcal{A},\mathcal{B},\mathcal{C},...$ | Uppercase bold face calligraphic letters for **third-order tensors** |
| $\mathbb{A},\mathbb{B},\mathbb{C},...$    | Uppercase blackboard letters for **fourth-order tensors**            |

**Index notation**

The components of tensors are written with subscripted, regular face : $A_{ij}, e_i$ ...

We adopt the Einstein summation convention, where indices that are repeated exactly twice are summed over the appropriate range is used, unless otherwise specified. For example:

$$
	\mathbf{u} = u_i\mathbf{e}_i  = \sum_{n=1}^{3} u_i\mathbf{e}_i=   u_1\mathbf{e}_1 +  u_2\mathbf{e}_2 +u_3\mathbf{e}_3
$$

**Voigt notation**

Second order tensor are mapped into colum vectors according to the following convention.

$$
    A =
    \begin{pmatrix}
    a_{11} & a_{12} & a_{13} \\
    a_{21}& a_{22} & a_{23} \\
    a_{31}& a_{32} & a_{33}
    \end{pmatrix}
    =
    \begin{Bmatrix}
    a_{11}  \\
    a_{22}  \\
    a_{33}  \\
    a_{23}  \\
    a_{13}  \\
    a_{12}
    \end{Bmatrix}
$$

The two dimensional version is obtained dy deleting the appropriated components.

**Linear Algebra**

| Notation                      | Description                                                                             |
| ----------------------------- | --------------------------------------------------------------------------------------- |
| $\mathbf{a}\cdot\mathbf{b}$   | Dot product of the vectors $\mathbf{a}$ and $\mathbf{b}$                                |
| $\mathbf{a}\otimes\mathbf{b}$ | Tensor (or Dyadic) product of the vectors $\mathbf{a}$ and $\mathbf{b}$                 |
| $\mathbf{a}\times\mathbf{b}$  | Vectorial product of the vectors $\mathbf{a}$ and $\mathbf{b}$                          |
| $\mathbf{A}:\mathbf{B}$       | Double contracted product of the two tensors $\mathbf{A}$ and $\mathbf{B}$              |
| $\mathbf{A}^{T}$              | Transpose of a matrix or a vector.                                                      |
| $\dot \square$                | Time derivative of quantity $\square$                                                   |
| $\ddot \square$               | Second order time derivative of quantity $\square$                                      |
| $\mathsf{tr}\,\square$        | Trace of a matrix or a tensor $\square$ ($\mathsf{tr}\,\mathbf{A}=\sum\mathbf{A}_{ii}$) |
| $\delta_{ij}$                 | Kronecker delta identity                                                                |
| $\mathbf{I}$                  | Unity matrix or second order tensor                                                     |
| $\mathbb{I}$                  | Unity fourth order tensor                                                               |

**Continuum mechanics**

| Notation                             | Description                          |
| ------------------------------------ | ------------------------------------ |
| $t_0$                                | Time at initial configuration        |
| $t$                                  | Current time                         |
| $\Omega$                             | Arbitrary region                     |
| $\partial\Omega$                     | Boundary surface of $\Omega$         |
| $\mathbf{X}$                         | Material coordinates at initial time |
| $\mathbf{x}$                         | Material coordinates at current time |
| $\mathbf{F}$                         | Deformation gradient tensor          |
| $\mathbf{C}$                         | Right Cauchy-Green tensor            |
| $\mathbf{R}$                         | Rotation tensor                      |
| $\mathbf{U}$                         | Stretch tensor                       |
| $\mathbf{L}$                         | Velocity gradient tensor             |
| $\mathbf{D}$                         | Rate of deformation tensor           |
| $\mathbf{\omega}$                    | Spin tensor                          |
| $\mathbf{E}$                         | Green-Lagrange deformation tensor    |
| $\mathbf{S}$                         | First Piola-Kirchoff stress tensor   |
| $\mathbf{S}$                         | Second Piola-Kirchoff stress tensor  |
| $\mathbf{\sigma}$                    | Cauchy stress tensor                 |
| $\mathbf{\sigma}^{\bigtriangledown}$ | Jauman stress rate                   |
| $\mathbf{\sigma}^{\bigtriangleup}$   | Green-Naghdi stress rate             |
| $\mathbb{C}$                         | Material elasticity tensor           |
| $\mathbb{f}_v$                       | Volume density force                 |
| $\mathbb{t}$                         | Surface density forces               |

**Finite element analysis**

| Notation                         | Description                   |
| -------------------------------- | ----------------------------- |
| $\Delta t^n$                     | n-th time step                |
| $\mathbf{M}$                     | Mass matrix                   |
| $\mathbf{C}^{d}$                 | Damping matrix                |
| $\mathbf{f}_{int}$               | Vector of internal forces     |
| $\mathbf{f}_{ext}$               | Vector of the external force  |
| $\mathbf{u}$                     | Vector of nodal displacements |
| $\mathbf{v} = \dot{\mathbf{u}}$  | Vector of nodal velocities    |
| $\mathbf{a} = \ddot{\mathbf{u}}$ | Vector of nodal accelerations |
