# Continuum mechanics in large transformations

## Description of the motion

The motion in any point of a solid region $\Omega$ in space with boundary surface $\partial\Omega$, is described by the bijective function $\Phi$:

$$
\mathbf{x} = \Phi \left(\mathbf{X},t\right)
$$

which gives the position vector $\mathbf{x}$ at time $t$ of any particle which previously occupied the position $\mathbf{X}$. For a fixed time $t$, this function defines the deformation at any point of a solid between a reference configuration $C_0$ and a current configuration $C_t$.

<!-- ::: {.center}
![Initial configuration $C_0$ and current distorted configuration $C_t$](coordonnees.pdf){#fig:coordonnees width="0.7\linewidth"}
::: -->

<div style="text-align:center;">
 <figure >
   <img src="../../assets/img/coordonnees.svg"  />
   <figcaption>Initial configuration and current distorted configuration</figcaption>
 </figure> 
</div>

In solid mechanics, the reference configuration $C_0$ is usually associated with the initial state of the undeformed solid, which allows the two configurations to be associated in the same axis system. Nevertheless, it is preferable to treat these two systems separately and to distinguish between Lagrangian or material coordinates for the $C_0$ configuration and Eulerian or spatial coordinates for the current $C\left(t\right)$ configuration. By abuse of language the time dependence t will be omitted in the following assuming $t > 0$.

## Deformation gradient tensor

In order to describe the kinematics in the vicinity of a given point $\mathbf{X}$, we introduce the gradient tensor of the transformation, also called the linear tangent application, defined as the Jacobian of the application $\Phi$ . The vector $d\mathbf{x}$ then takes the form:

$$
d\mathbf{x} \left(\mathbf{X},t \right) =\frac{\partial \Phi }{\partial \mathbf{X}}d\mathbf{X}=\mathbf{F}d\mathbf{X}
$$

$$
\mathbf{F} = \frac{\partial \mathbf{x} }{\partial \mathbf{X}}
$$

The gradient tensor of the transformation $\mathbf{F}$, is thus an application which transforms a given elementary material vector $d\mathbf{X}$ into its Eulerian counterpart $d\mathbf{x}$. This tensor gives a local description, to the first order, of the solid transformation.

We also define the transformation of an elementary volume element. Let be a volume element in the reference configuration, $d\Omega_0 \in C_0$. Its deformed counterpart in the current configuration, $d\Omega \in C_t$, is given by the determinant of the Jacobian matrix of the gradient tensor of the transformation, called Jacobian:

$$
dv=JdV \quad \mathrm{with} \quad J=\mathrm{det} \left( \mathbf{F} \right)
$$

The local condition of impenetrability of matter requires that:

$$
J\left( X\right) > 0
$$

We also define the transformation of a surface element $dS$ of normal $\mathbf{N}$ in initial configuration into
a surface element $ds$ of normal $\mathbf{n}$ using the Nanson formula:

$$
\mathbf{n} ds =J\mathbf{F}^{-T}\mathbf{N}dS
$$

## Strain measurement

In order to define its deformation, it is necessary to characterize the changes in shape, i.e. the variations in length and angle. These are in fact the variations of the scalar products of material vectors $d\mathbf{X}$ and $\delta \mathbf{X}$, becoming $d\mathbf{x}$ and $\delta \mathbf{x}$ after transformation:

$$
d \mathbf{x} \cdot \delta \mathbf{x} = \left( \mathbf{F} d\mathbf{X} \right)^{T} \cdot \left( \mathbf{F} \delta \mathbf{X} \right) = d \mathbf{X}  \cdot \mathbf{ C}   \cdot \delta \mathbf{X}
$$

where $\mathbf{C}$ denotes the right Cauchy-Green expansion tensor and $\mathbf{B}$ the left Cauchy-Green tensor defined by :

$$
\mathbf{C}=\mathbf{F}^{T}\mathbf{F}
$$

From the variation of these scalar products, we obtain the associated deformation:

$$
\begin{align}
d\mathbf{x} \cdot \delta \mathbf{x} - d\mathbf{X} \cdot\delta \mathbf{X}
&= d\mathbf{X} \cdot \mathbf{ C} \delta \mathbf{X} - d\mathbf{X} \cdot\delta \mathbf{X} \\
&=d\mathbf{X} \cdot \left( \mathbf{ C} - \mathbf{I} \right) \delta \mathbf{X} \\
&=d\mathbf{X} \cdot 2 \mathbf{ E}\, \delta \mathbf{X}
\end{align}
$$

$\mathbf{E}$ is the Green-Lagrange deformation tensor given by :

$$
\mathbf{E} = \frac{1}{2} \left( \mathbf{C} - \mathbf{I} \right)
$$

In small deformations, this tensor merges with the linearized deformation tensor $\mathbf{\varepsilon}$. The tensors $\mathbf{C}$ and $\mathbf{E}$ are defined with respect to the initial configuration and to variations of elementary material vectors. As such, they are qualified as Lagrangian. By repeating the same process, expressing $d\mathbf{X} \cdot\delta \mathbf{X}$ and then the variation of the scalar products in the spatial basis, we obtain their Eulerian equivalents in the current configuration:

$$
\begin{align}
\mathbf{b} &= \mathbf{F} \mathbf{F}^{T} \\
\mathbf{e} &= \frac{1}{2}\left( \mathbf{C} - \mathbf{B}^{-1} \right)
\end{align}
$$

with $\mathbf{b}$ the left Cauchy-Green tensor and $\mathbf{e}$ the Euler-Almansi tensor of deformations.

The writing of the principle of virtual powers, as well as some behavioral laws (hypoelastic, viscoelastic), requires to define the notion of strain rate.

$$
\begin{align}
d \dot{\mathbf{x}}
&= \dot{\mathbf{F}} d\mathbf{X} \\
&= \dot{\mathbf{F}} \mathbf{F}^{-1} d\mathbf{x} \\
&= \mathbf{L} d \mathbf{x}
\end{align}
$$

$$
 \mathbf{L} = \dot{\mathbf{F}} \mathbf{F}^{-1} = \frac{\partial \mathbf{v}}{\partial \mathbf{x}}= \mathrm{grad} \mathbf{v}
$$

The $\mathbf{L}$ tensor is called the _velocity gradient_ tensor. It is classically decomposed into a symmetric term $\mathbf{D}$ (_deformation rate_ tensor) and an antisymmetric term $\mathbf{\omega}$ (_spin_ tensor):

$$
\begin{aligned}
\mathbf{D} &= \mathbf{L}^\mathrm{S} = \frac{1}{2} \left( \mathbf{L}+ \mathbf{L}^{T} \right) \\
\mathbf{\omega} &= \mathbf{L}^\mathrm{A} = \frac{1}{2} \left( \mathbf{L}-\mathbf{L}^{T} \right)
\end{aligned}
$$

The strain rate describes the rate of deformation of the considered solid. This measure is associated with the current configuration. To be measured in the initial configuration, $\mathbf{D}$ is pull back:

$$
\dot{\mathbf{E}} =\mathbf{F}^{T} \mathbf{D} \mathbf{F}
$$

where $\dot{\mathbf{E}}$ is the Lagrangian strain rate.

## Polar decomposition

The deformation gradient tensor can be expressed as the product of a rotation tensor $\mathbf{R}$ time the stretch tensor $\mathbf{U}$.

$$
\mathbf{F} = \mathbf{R} \mathbf{U}
$$

The rotation tensor being orthogonal $\mathbf{R}^{T} \mathbf{R} = \mathbf{I}$, the definition of the stretch tensor can be deduced from the definition of the right Cauchy-Green tensor:

$$
\mathbf{C}= \mathbf{U}^{T}\mathbf{R}^{T} \mathbf{R} \mathbf{U} = \mathbf{U}^2
$$

An eigenvalue analysis of $\mathbf{C}$ gives the principal directions $\mathbf{N}_{i}$ and the corresponding eigen values $\lambda_{i}$.

$$
\mathbf{C}= \lambda_{i}^2 \mathbf{N}_{i} \otimes \mathbf{N}_{i}
$$

The material stretch tensor $\mathbf{U}^2$ can be deduced:

$$
\mathbf{U}= \lambda_{i} \mathbf{N}_{i} \otimes \mathbf{N}_{i}
$$

## Stress measurement

Let a deformable solid be virtually cut into two subdomains, before and after transformation. The equilibrium of each of the two subdomains thus defined imposes the existence of internal forces at the boundary. As in the case of small deformations, we define in the present configuration the stress vector $\mathbf{t}$ which characterizes the internal cohesive forces $\mathbf{f}$ exerted on a part of the solid through the surface $ds$ of external normal $\mathbf{n}$:

$$
\mathbf{t}=\frac{d\mathbf{f}}{ds}
$$

<!-- ::: {.center}
![Stress vector definition](stress.pdf){#stress width="0.7\linewidth"}
::: -->

<div style="text-align:center;">
 <figure >
   <img src="../../assets/img/stress.svg"  />
   <figcaption>Stress vector definition</figcaption>
 </figure> 
</div>

According to Cauchy's theorem, for a given point, the stress vector depends linearly on the normal vector $\mathbf{n}$. Then there exists a tensor of order two, called the Cauchy stress tensor $\mathbf{sigma}$, such that:

$$
\mathbf{t} = \mathbf{\sigma} \mathbf{n}
$$

The fundamental principle of dynamics allows us to demonstrate that this Cauchy stress tensor is symmetric. The force exerted on the elementary surface is given by:

$$
d\mathbf{f} = \mathbf{\sigma} \mathbf{n} ds
$$

The Cauchy tensor thus represents the internal forces expressed in the current configuration. In the same way as for the different measures of deformation established previously, it is possible to define other measures of internal forces. Thus, noting $d\mathbf{F}$, $dS$ and $\mathbf{N}$ the internal force, the surface and its normal in the initial configuration, we define the two tensors $\mathbf{P}$ and $\mathbf{S}$ as follows:

$$
\begin{align}
d\mathbf{f} & = \mathbf{P} \mathbf{N} dS \\
d\mathbf{F} & = \mathbf{S} \mathbf{N} dS
\end{align}
$$

These tensors are respectively called first Piola-Kirchhoff tensor (PK1) (or Boussinesq tensor), second Piola-Kirchhoff tensor (PK2) or Piola Lagrange tensor. In small deformations, these tensors are identical. On the other hand, we introduce the Eulerian tensor $\mathbf{\tau}=J\mathbf{\sigma}$, called Kirchoff stress tensor; it is a symmetrical tensor which plays an important role for the variational formulation of problems in large deformation.

The links between these different tensors are given by:

$$
\begin{aligned}
\mathbf{\tau} &= J\mathbf{\sigma} = \mathbf{F}\mathbf{S}\mathbf{F}^{T} = \mathbf{P}\mathbf{F}^{T} \\
\mathbf{P} &= \mathbf{F} \mathbf{S} = \mathbf{\tau} \mathbf{F}^{-T} = J \mathbf{\sigma} \mathbf{F}^{-T} \\
\mathbf{S} &= \mathbf{F}^{-1} \mathbf{P} = \mathbf{F}^{-1} \mathbf{\tau} \mathbf{F}^{-T} = J \mathbf{F}^{-1} \mathbf{\sigma} \mathbf{F}^{-T} \\
\mathbf{\sigma} &= J^{-1} \mathbf{\tau} = J^{-1} \mathbf{P}\mathbf{F}^{T} = J^{-1} \mathbf{F} \mathbf{S} \mathbf{F}^{T}
\end{aligned}
$$

The Cauchy tensor $\mathbf{\sigma}$ will be said to be Eulerian (i.e. current configuration), while the second Piola-Kirchhoff tensor $\mathbf{S}$ will be said to be Lagrangian (i.e. initial configuration). The Piola-Kirchhoff $\mathbf{P}$ and Kirchhoff $\mathbf{\tau}$ tensors, neither Eulerian nor Lagrangian, will be called two-point tensor.

## Constitutive behavior models and the objectivity principle

Constitutive behavior models describes the relationship between deformation and the evolution of stresses. We can distinguish three main types of constitutive behavior models [SID82]:

- _Hypoelastic_: the strain rate is related to a stress rate. These laws are frequently used for materials with a low anisotropic response. They are easy to implement and suitable for updated resolutions. The stresses and strain energies may not be independent of the deformation history;

- _Elastic_ (or elastic Cauchy): a measure of strain is related to a measure of stress. The stresses are independent of the deformation history while the strain energy may not be. These formulations are very little used in the context of large transformations.

- _Hyperelastic_: a strain energy density is defined as a stress potential. The stresses and strain energies are independent of the deformation history.

A constitutive behavior model must verify the principle of material indifference or objectivity, i.e. it must be invariant in any change of reference frame. Indeed, the objectivity translates the independence of these quantities from the chosen observer. It is therefore necessary to define and work with objective quantities. It is thus necessary to distinguish among the previously introduced quantities those which are objective[@LEM09]:

- Any tensor written in the reference configuration $C_0$ (such the Green-Lagrange deformation tensor $\mathbf{E}$ and the second Piola-Kirchhoff stress tensor $\mathbf{S}$).

- Any time derivative of a tensor defined in the reference configuration $C_0$ (like $\dot{\mathbf{E}}$ and $\dot{\mathbf{S}}$).

- Any scalar.

However, it is important to note that:

- The time derivatives of the quantities defined in the current deformed configuration $C_t$ are not objective. Thus, the derivative of the Cauchy stress tensor $\dot{\mathbf{\sigma}}$ is not objective.

- The time derivatives $\dot{\mathbf{F}}$ of the transformation gradient and $\dot{\mathbf{P}}$ of the first Piola-Kirchhoff stress tensor are also not objective.

However, several objective time derivatives exist, such as the _Jaumann stress rate_,

$$
\mathbf{\sigma}^{\bigtriangledown} = \dot{\mathbf{\sigma}} + \mathbf{\sigma} \mathbf{\omega} - \mathbf{\omega}\mathbf{\sigma}
$$

or the _Green-Naghdi stress rate_[@BON08],

$$
\mathbf{\sigma}^{\bigtriangleup} = \dot{\mathbf{\sigma}} + \mathbf{\sigma} \dot{\mathbf{R}} \mathbf{R}^T - \dot{\mathbf{R}} \mathbf{R}^T\mathbf{\sigma}
$$

## Thermodynamics of continuous media

The thermodynamic laws associated with the mechanics of continuous media is necessary to introduce the coupling between thermal phenomena and mechanical effects. However, even in the absence of any mechanical coupling, the second principle of thermodynamics allows the introduction of the fundamental principle related to dissipation, leading to the fact that the mechanical energy supplied to a system is lost as heat.

### First principle of thermodynamics

The first principle of thermodynamics or law of conservation of energy expresses that the total energy variation (i.e. internal energy plus kinetic energy) is equal to the sum of the power of the external forces plus the quantity of heat supplied to the system per unit of time, that is to say:

$$
\frac{d}{dt}\left( E_{int} + E_{cin} \right) = P_{ext} + \dot Q
$$

with the internal energy of the system $E_{int}$ is a function of the specific energy $e$,

$$
E_{int} = \int_\Omega \rho e dv
$$

the kinetic energy,

$$
E_{cin} = \frac{1}{2} \int_\Omega \rho \mathbf{v} \cdot \mathbf{v}  dv
$$

the external power,

$$
P_{ext} = \int_\Omega \mathbf{f}_{v} \cdot \mathbf{v} dv + \int_{\partial\Omega} \mathbf{t} \cdot \mathbf{v}  ds
$$

the heat rate supplied to the system:

$$
Q = \int_\Omega r dv - \int_{\partial\Omega}  \mathbf{q} \cdot \mathbf{n}  ds
$$

Taking into account the definition of each energy term, the first principle of thermodynamics becomes :

$$
 \frac{d}{dt} \int_\Omega{\rho \left( e + \frac{1}{2} \mathbf{v} \cdot \mathbf{v} \right) \,dv}  = \int_\Omega \left( \mathbf{f}_{v} \cdot \mathbf{v} + r \right) dv + \int_{\partial\Omega} \left( \mathbf{t} \cdot \mathbf{v} - \mathbf{q} \cdot \mathbf{n} \right)  ds
$$

Or, using the balance of mechanical energy,

$$
\begin{align}
P_{ext} &= P_{a} - P_{int} \\
P_{ext} &= \int_\Omega \rho \mathbf{\gamma} \cdot \mathbf{v} dv  - \int_\Omega \rho \mathbf{\sigma} : \mathbf{D} dv
\end{align}
$$

The nex form of the first principle is given by:

$$
 \int_\Omega{\frac{d}{dt}\rho e \,dv}  = \int_\Omega  {\mathbf{\sigma} : \mathbf{D} \;dv}  + \int_\Omega{\left( r - \mathrm{div} \mathbf{q} \right)\, dv}
$$

where the divergence theorem has been applied to $Q$ and the Reynolds transport theorem to left hand side [@LEM09]. This equation is verified for any point on $\Omega$ domain considered. Thus, the _local_ Eulerian form is:

$$
\frac{d}{dt} \rho e = \mathbf{\sigma} : \mathbf{D}  + r - \mathrm{div} \mathbf{q}
$$

### Second principle of thermodynamics

The second principle of thermodynamics involves two new variables: the temperature ${T}(\mathbf{x},t)$ and the entropy $S$. The entropy expresses a variation of internal energy associated with a variation of the temperature, its definition in function of the specific entropy $\eta$ is given by:

$$
S = \int_\Omega \rho \, \eta \, dv
$$

The second principle of thermodynamics translates the non-conservation of entropy in an irreversible (non-dissipative) framework. It postulates that the rate of entropy production is always greater than or equal to the rate of heat received divided by the temperature:

$$
\begin{aligned}
\frac{dS}{dt} &\ge \frac{{\dot Q}}{T}\\
\int_\Omega \rho \, \dot{\eta} \, dv &\ge \int_\Omega \frac{r}{T} dv - \int_{\partial\Omega}  \frac{\mathbf{q}\cdot \mathbf{n}  }{T} ds
\end{aligned}
$$

using the divergence theorem,

$$
\int_\Omega   \left( \rho \dot{\eta }  + \mathrm{div}\left( \frac{\underline q}{T} \right) - \frac{r}{T} \right) dv \ge 0
$$

This hold for any point in $\Omega$, therefore the local form is given by:

$$
  \rho \dot{\eta }  + \mathrm{div}\left( \frac{\underline q}{T} \right) - \frac{r}{T}  \ge 0
$$

By replacing the volume energy sources $r$ with the first principle and noticing that :

$$
\mathrm{div}\left( \frac{\underline q}{T} \right) = \frac{1}{T}\mathrm{div}(\mathbf{q}) - \frac{1}{T ^2}\mathbf{q} \cdot \frac{\partial T}{\partial \mathbf{x}}
$$

The first and second principles define the dissipation function $\Phi$. This potential can be divided into two parts, the intrinsic dissipation $\Phi_{int}$ (i.e. internal production of entropy) and the thermal dissipation by conduction $\Phi_{th}$ :

$$
\Phi  = \underbrace {\rho \left( {{T} \,\dot \eta  - \frac{d}{dt}e} \right) + \mathbf{ \sigma } :\mathbf{D}}_{\Phi _{\mathrm int}} - \underbrace {\frac{1}{T}\mathbf{q} \cdot \frac{\partial T}{{\partial \underline X }}}_{\Phi _{\mathrm{th}}} \ge 0
$$

Finally by introducing the notion of specific free energy $\psi = e - T \eta$, we obtain the local form of the second principle known as the _Clausius-Duheim inequality_, in its Eulerian form:

$$
\Phi =-\rho \left(\dot{\psi} - \dot{{T} }\,\eta  \right)+\mathbf{\sigma}:\mathbf{D}-\frac{1}{T}\mathbf{q} \cdot \frac{\partial T }{\partial \mathbf{X}}\ge 0
$$

or Lagrangian:

$$
\Phi_{0}=-{{\rho }_{0}}\left( \dot{\psi }-\dot{{T} }\,\eta  \right)+\mathbf{{S}}:\mathbf{{{\dot{E}}}}-\frac{1}{T} \mathbf{q} \cdot \frac{\partial {T} }{\partial \mathbf{X}} \ge 0
$$

### State variables and thermodynamic potentials

The thermodynamic state of a medium for a given point and at a fixed time is completely defined by the knowledge of a certain number of scalar and tensor variables, the state variables. The evolution of a system can then be considered as a succession of equilibrium states corresponding to the different points of the medium [@LEM09]. These state or thermodynamic variables can be observable or internal.

The observable variables (i.e. deformation, temperature) as its name indicates can be directly measured and fully describe the evolution of reversible phenomena, this is the case for elastic phenomena.

The internal variables are involved when considering a dissipative phenomenon, which depends not only on the current state but also on the history of transformation undergone by the material. These variables do not appear directly in the equations of motion and therefore are not directly measurable. But from a physical point of view, they allow to give a macroscopic characterization of the microscopic state of the material (e.g. dislocations, crystallization, cracks). The choice of these variables, their type and number, requires a deep knowledge of the physical meaning of the problem and conditions the accuracy of the modeling of the phenomenon.

### Rational thermodynamics

In the general case, a law of behavior should provide: the free energy of the system $\Phi$, the specific entropy $\eta$, the stress tensor $\mathbf{{sigma}}$ and the heat flux vector $\mathbf{q}$ as a function of the state variables. The physical content of the theory results from the list of available state variables. Thermodynamics is then used to restrict the possible laws of behavior and to keep only those which are compatible with the second principle of thermodynamics, i.e. compatible with the Clausius-Duheim inequality.

The rational thermodynamics method consists in assuming the existence of a thermodynamic potential as a function of a certain number of well-defined state variables (observables or internal). Generally we postulate the existence and the form of the free energy $\Phi$. The equations of state of the system are then deduced from the Clausius-Duheim inequality and from the application of certain hypotheses specific to the physical phenomenon (e.g.: an isothermal $T =const$ and homogeneous $\frac{\partial {T} }{\partial \mathbf{x}}=0$ process).

### Thermodynamics of irreversible processes

In the case of an irreversible (dissipative) processes, the Clausius-Duheim inequality will allow us to determine the _dissipation_ function of the system, the associated forces (e.g. stresses) and thermodynamic flows (e.g. deformation rates) and to deduce the equations of evolution of the internal variables. This second method is more physical because its assumptions (nature of state variables and nature of dissipations) are directly related to the mechanisms of the phenomenon.

In summary, when one wishes to describe the behavior of a given material on which one has a minimum of physical knowledge, it is preferable to use the method of thermodynamics of irreversible processes which is more restrictive than rational thermodynamics. Otherwise the rational thermodynamics will be used to give a general structure without referring to a particular material.

## Hyperelastic constitutive models

### Generalities

The Clausius-Duhem inequality is the basis for the definition of hyperelastic laws of behavior. These laws differ from elastic models and hypoelastic laws which have no thermodynamic basis.

In "pure mechanical" framework, it is common to ignore thermal effects, in other words to consider the temperature to be homogeneous and the transformation isothermal. The dissipations are then written :

$$
\begin{align}
\Phi_{0} & = -\rho_0 \dot{\psi} + \mathbf{S}:\mathbf{\dot{E}} \\
\Phi & = -\rho \dot{\psi} + \mathbf{\sigma}:\mathbf{D}
\end{align}
$$

A hyperelastic material is a material whose strain energy per unit of initial volume $w$ depends only on the current state of deformation and is non-dissipative, i.e which produce locally no entropy ($\Phi = 0$).

$$
\begin{align}
w\left( \mathbf{F} \right) & = \rho_0 \psi \\
\Phi_{0} & = 0 \\
\end{align}
$$

The strain-energy potential $w$ is admissible only if it satisfies the following conditions :

- $w$ it is zero when the material is not subjected to any stress:

$$w\left(\mathbf{I}\right) = 0 $$

- $w$ increase with deformation

$$w\left(\mathbf{F}\right) \geq 0 $$

- $w$ respects the principle of material indifference

$$
w\left(\mathbf{F} \right) = w\left(\mathbf{Q}\mathbf{F} \right) \,   \forall\mathbf{F}, \mathrm{det} \mathbf{F}  \geq 0
$$

- $w$ respects the material symmetries.

Using the [polar decomposition]() definition we can shows that the strain-energy potential depends only on the stretching part of $\mathbf{F}$ [@CIA88]:

$$
w\left(\mathbf{F} \right) = w\left(\mathbf{R^T}\mathbf{F} \right) = w\left(\mathbf{R}^T\mathbf{R}\mathbf{U} \right) =w\left(\mathbf{U} \right)
$$

Therefore that the strain-energy remains objective if it is expressed as a function of the right Cauchy-Green tensor or the Green-Lagrange tensor:

$$
w\left(\mathbf{F} \right) = w\left(\mathbf{C} \right) = w\left(\mathbf{E} \right)
$$

Using the right Cauchy-Green tensor, we then deduce the basic relations of hyperelastic constitutive models:

$$
\begin{aligned}
\dot{w} & = \mathbf{S}:\mathbf{\dot{E}} \\
\dot{w} \left( \mathbf{C} \right) & =\mathbf{S}:\frac{1}{2} \frac{\partial }{\partial t} \left(\mathbf{C} - \mathbf{I} \right) \\
\frac{\partial w}{\partial \mathbf{C}}:\frac{\partial \mathbf{C}}{\partial t} & = \frac{1}{2}\mathbf{S}:\frac{\partial \mathbf{C}}{\partial t} \\
\therefore \frac{\partial w}{\partial \mathbf{C}} & =\frac{1}{2}\mathbf{S}  \\
\mathbf{S}&=2 \frac{\partial w}{\partial \mathbf{C}}
\end{aligned}
$$

The previous expression is the general form of the hyperelastic behavior models. It only requires the definition of the strain-energy potential $w$ related to the mechanical behavior of the material.

### Isotropic hyperelasticity

An hyperelastic material is isotropic relative to the reference configuration if the strain-energy :

$$
w\left(\mathbf{C} \right) = w\left(\mathbf{Q}\mathbf{C}\mathbf{Q}^T \right)
$$

holds for all the orthogonal tensors $\mathbf{Q}$. In particular, $w$ can expressed as a function of three invariants of the Right Cauchy-Green tensor:

$$
\begin{align}
w\left(\mathbf{C} \right) & = w\left(I_1 ,I_2 ,I_3  \right) \\
I_1 & = \mathrm{tr}  \left( \mathbf{C} \right) \\
I_2 & =  \dfrac{1}{2} \left( \mathrm{tr} \left( \mathbf{C} \right)^2 - \mathrm{tr} \left( \mathbf{C}^2 \right)\right)\\
I_3 & =  \mathrm{det} \left( \mathbf{C} \right)
\end{align}
$$

The potential can also be expressed as a function of stretching values, that is:

$$
\begin{align}
w\left(\mathbf{C} \right) & = w\left(\lambda_1 ,\lambda_2 ,\lambda_3  \right) \\
I_1 & = \lambda_1^2 +  \lambda_2^2 + \lambda_3^2 \\
I_2 & = \lambda_1^2 \lambda_2^2 +  \lambda_1^2 \lambda_3^2+ \lambda_2^2 \lambda_3^2\\
I_3 & =  \lambda_1^2 \lambda_2^2 \lambda_3^2
\end{align}
$$

Several invariant expressions of the potential exist for isotropic hyperelastic materials, the most widespread have been proposed by Mooney [@MOO40], Ogden [@OGD97] and Rivlin [@RIV48].

Using the classical invariant representation, the Second Piola-Kirchhoff stress tensor is given by:

$$
\mathbf{S} = 2 \frac{\partial w}{\partial \mathbf{C}} = 2 \sum_{a=1}^3  \frac{\partial w}{\partial I_i} \frac{\partial I_i}{\partial \mathbf{C}}
$$

The derivatives of the invariants with respect to $\mathbf{C}$ are given by:

$$
\begin{align}
\frac{\partial I_1}{\partial \mathbf{C}} & = \mathbf{I} \\
\frac{\partial I_2}{\partial \mathbf{C}} & = I_1\mathbf{I} - \mathbf{C} \\
\frac{\partial I_3}{\partial \mathbf{C}} & = I_3\mathbf{C}^{-1}
\end{align}
$$

### Transverse isotropic hyperelasticity

A transverse isotropic material is characterized by a preferred direction $\mathbf{l}_1$ in its initial configuration. This type of material has rotational symmetry about this direction, and therefore the response of the material is also invariant to any arbitrary rotation about this axis. In this case, the strain energy potential can be expressed in terms of five independent scalars defined from the right-hand Cauchy-Green tensor. The common representation of this potential (see for example [@SPE72] [@SPE84]) is as follows:

$$
w = w \left( I_{1},I_{2},I_{3},I_{4},I_{5}\right)
$$

Where $I_{1},I_{2},I_{3}$ correspond to the classical right Cauchy-Green invariants. Whereas, $I_{4},I_{5}$ are pseudo-invariants associated with the principal direction by [@SPE72] [@BOE78] [@BOE87] [@QUA94] [@ITS04]:

$$
\begin{aligned}
I_4 \left(\mathbf{C},\mathbf{l}_1  \right) & = \mathbf{l}_1 \cdot \mathbf{C} \mathbf{l}_1 = \mathbf{C}:\mathbf{L}_{11} \\
I_5 \left(\mathbf{C},\mathbf{l}_1  \right) & = \mathbf{l}_1 \cdot \mathbf{C}^2 \mathbf{l}_1 = \mathbf{C}^2:\mathbf{L}_{11}
\end{aligned}
$$

where $\mathbf{L}_{11}$ is the structural tensor defined by :

$$
\mathbf{L}_{11}  = \mathbf{l}_1 \otimes \mathbf{l}_1
$$

Ising this invariant definition, the Second Piola-Kirchhoff stress tensor is given by:

$$
\mathbf{S} = 2 \frac{\partial w}{\partial \mathbf{C}} = 2 \sum_{a=1}^5  \frac{\partial w}{\partial I_i} \frac{\partial I_i}{\partial \mathbf{C}}
$$

The derivatives of the pseudo-invariants with respect to $\mathbf{C}$ are given by:

$$
\begin{aligned}
\frac{\partial I_4}{\partial \mathbf{C}} & = \mathbf{L}_{11} \\
\frac{\partial I_5}{\partial \mathbf{C}} & = \mathbf{l}_1 \otimes  \mathbf{C}\mathbf{l}_1 +  \mathbf{C}\mathbf{l}_1 \otimes \mathbf{l}_1 \\
\end{aligned}
$$

### Orthotropic hyperelasticity

An orthotropic material is defined, in the initial configuration, by three preferred directions $\mathbf{l_1}$, $\mathbf{l_2}$ and $\mathbf{l_3}$ (unit base vector). These directions allow to define the structural tensors [@BOE78] :

$$
\mathbf{L}_{ij}  = \mathbf{l}_i \otimes \mathbf{l}_j
$$

The representation theorem allows us to postule the strain energy density as a function of the twelve invariants for an orthotropic behavior [@QUA94] [@ITS04] :

$$
w =w \left( I_{1},I_{2},I_{3},I_{41},I_{42},I_{43},I_{412},I_{413},I_{423},I_{51},I_{52},I_{53} \right)
$$

Defined by:

$$
\begin{aligned}
I_{4i} & = \mathbf{l}_i \cdot \mathbf{C} \mathbf{l}_i = \mathbf{C}:\mathbf{L}_{ii} \\
I_{4ij} & = \mathbf{l}_i \cdot \mathbf{C} \mathbf{l}_j = \mathbf{C}:\mathbf{L}_{ij} \\
I_{5i} & = \mathbf{l}_i \cdot \mathbf{C}^2 \mathbf{l}_i = \mathbf{C}^2:\mathbf{L}_{ii}
\end{aligned}
$$

$$
\mathbf{S} = 2 \frac{\partial w}{\partial \mathbf{C}} = 2 \sum_{i=1}^3  \left( \frac{\partial w}{\partial I_i} \frac{\partial I_i}{\partial \mathbf{C}} +  \frac{\partial w}{\partial I_{4i}} \frac{\partial I_{4i}}{\partial \mathbf{C}} + \frac{\partial w}{\partial I_{5i}} \frac{\partial I_{5i}}{\partial \mathbf{C}} \right) + 2 \sum_{i,j=1}^3  \left(  \frac{\partial w}{\partial I_{4ij}} \frac{\partial I_{4ij}}{\partial \mathbf{C}}  \right)
$$

the derivate are given by:

$$
\begin{aligned}
\frac{\partial I_{4i}}{\partial \mathbf{C}} & = \mathbf{L}_{ii}  \\
\frac{\partial I_{4ij}}{\partial \mathbf{C}} & = \frac{1}{2} \left( \mathbf{l}_i \otimes \mathbf{l}_j +  \mathbf{l}_j \otimes \mathbf{l}_i \right) \\
\frac{\partial I_{5i}}{\partial \mathbf{C}} & = \mathbf{l}_i \otimes  \mathbf{C}\mathbf{l}_i +  \mathbf{C}\mathbf{l}_i \otimes \mathbf{l}_i
\end{aligned}
$$

## References

\bibliography
