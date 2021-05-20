# Materials overview 

This section concisely describes the mechanical models implemented in Comfor. For a more detailed introduction, the reader is recommended to refer to the following links, as well as to consult the cited papers. 

- [Nonlinear continuum mechanics](../continuum_mechanics.md)
- [Composite material introduction](composite_materials.md)

## Comfor constitutive models

Comfor includes the following constitutive models.

- Elasticity
    - Kirchhoff isotropic 
- Hyper-elasticity     
    - Ogden
    - Textile elasticity

The following parameter must be set for all the materials:

**Necessary parameters**

- `material_name` is the custom name for the material
- $\rho$ the mass density of the material.  
 
**Optional parameters**

- $\alpha$ is the mass proportional damping. This factor introduces damping forces caused by the absolute velocities of the model. This parameter is optional.

**Example**

```
MATERIALS TYPE <material_type_1>
<material_name> RHO = <mass density> DAMPING = <damping_value> ...
```

## Elastic materials

In order to model elastic materials with small strain are large rotations we use a Saint-Venant-Kirchoff material model. The general expression is given by:

$$
\mathbf{S} =  \mathbb{C} \mathbf{E}
$$

where $\mathbb{C}$ _elastic tensor_ or _elastic moduli_. 

### Isotropic Kirchhoff 

In tha case of an isotropic material the elastic moduli is given simply by :

$$
\mathbb{C} = \lambda \mathbf{I} \otimes \mathbf{I} + 2\mu \mathbf{I}
$$

where $\lambda$ and $\mu$ are the Lamé constants related to the $E$ Young's modulus and $\nu$ Poisson's ratio.

$$
\begin{aligned}
\lambda &=  \frac{\nu E}{\left( 1 + \nu \right)\left( 1 - 2 \nu \right)} \\ 
\mu &= \frac{E}{2\left( 1 + \nu \right)}
\end{aligned}
$$ 

The stress-strain relation is given simply by:

$$
\mathbf{S} = \mathbb{C}:\mathbf{E}
$$
**Expected parameters**

- $E$ : Young's modulus
- $\nu$ : Poisson's ratio.

**Example**

```
MATERIALS TYPE ELASTIC
<material_name> RHO = <rho> DAMPING = <material_damping> E = <young_modulus> NU = <poissons_ratio>
```

## Hyperelastic materials 

Two families of hyperelastic materials are currently implemented:

- Isotropic to model vacuum bags, rubbery like membrane materials ...
- Anisotropic textiles models.

The general form for the strain-stress relation is given by:


$$
\mathbf{S} = 2 \frac{\partial w}{\partial \mathbf{C}} 
$$

where $w$ is the strain-energy potential of the material.

### Isotropic hyperelastic materials

**Ogden**

The strain energy potential for this constitutive model is defined by a polynomial series as a function of the principal stretches. 

$$
w \left( \lambda_1, \lambda_2, \lambda_3 \right) = \sum_{p=1}^N \frac{\mu_p}{\alpha_p} \left( \lambda_1^{\alpha_p}+ \lambda_2^{\alpha_p} + \lambda_3^{\alpha_p} - 3 \right)
$$

Where N is a positive integer generally taken equal to 3, and $\mu_p$ and $\alpha_p$ are the material parameters to be identified. In the case of hyperelastic membranes, an assumption of incompressibility is generally made. The conservation of volume can be expressed in terms of the principal elongations:

$$
\lambda_1 \lambda_2 \lambda_3 = 1 
$$

This allows us to express the thickness evolution as a function of the membrane strains: 

$$
\lambda_3 = \frac{1}{\lambda_1 \lambda_2} = \frac{h}{h_0}
$$
Finally, the stress state expressed in the initial configuration under the assumption of an incompressible material is given by:


$$
\mathbf{S} = 2 \frac{\partial w \left( \lambda_1, \lambda_2, \lambda_3 \right) }{\partial \mathbf{C}} - p\mathbf{C}^{-1}
$$

With p being the Lagrange multiplier associated with the incompressibility condition of the material (hydrostatic pressure).

**Expected parameters**

- `potential type`: Ogden
- $\mu_i$ : shear moduli constant values.
- $\alpha_i$ : constant dimensionless values associated to each $\mu_i$.

**Example**

```
MATERIALS TYPE HYPERELASTIC
<material_name> RHO = <rho> DAMPING = <material_damping> TYPE = OGDEN MU = <mu_1 mu_2 mu_3 mu_n> ALPHA = <alpha_1 alpha_2 alpha_3 alpha_n>
```
!!! note
    - $N$ is deduced automatically from the number of parameters given in the material entry.
    - The initial thickness $h_0$ is deduced from the element definition 

!!! warning
    The number of $\mu_p$ and $\alpha_p$ parameters must be equal. 

### Textile composite hyperelastic materials

The mechanical behavior of textile composite materials can modelled using a non-linear hyperelastic model[@GUZ15] [@GUZ16]. The membrane and bending contributions to the strain energy potential are decoupled given the fibrous nature of one single ply.

$$
\begin{equation}
	w = {w_{mem}} + {w_{ben}}
\end{equation}
$$

The membrane strain energy is expressed as a function of the physical invariants associated with the different deformation modes of the reinforcement. 

$$
\begin{equation}
    w_{mem}\left( I_{\lambda_1} ,I_{\lambda_2} ,I_{\gamma}  \right) = w_{\lambda_1}\left( I_{\lambda_1}\right) + w_{\lambda_2}\left(I_{\lambda_2}\right) + w_{\gamma}\left(I_{\gamma}\right)
\end{equation}
$$

with:

$$
\begin{aligned}
I_{\lambda_1} & = \frac{1}{2}\ln\left( I_{41} \right) =   \ln \left( {\lambda_1} \right) \\
I_{\lambda_2} & = \frac{1}{2}\ln\left( I_{42} \right) =   \ln \left( {\lambda_2} \right) \\
I_{\gamma} &= \frac{I _{412}}{\sqrt{I _{41}  I _{42}}} = \sin\left( \gamma \right) 
\end{aligned}
$$

$I_{4i}=\mathbf{C}:\mathbf{L}_{ii}$ and $I_{4ij} = \mathbf{C}:\mathbf{L}_{ij}$ and $\mathbf{L}_{ij} = \mathbf{l}_i \otimes \mathbf{l}_j$ the structural tensor defined from the initial material warp $\mathbf{l}_1$ and weft $\mathbf{l}_2$ directions. 

The Piola-Kirchhoff II stress tensor is given by:

$$
\begin{aligned}
    \mathbf{S} &= \frac{1}{2} \frac{\partial w_{mem}}{\partial \mathbf{C}} \\
    &=  \frac{1}{2} \frac{\partial w_{\lambda_1}}{\partial I_{\lambda_1} } \frac{\partial I_{\lambda_1}}{\partial \mathbf{C}} + \frac{1}{2} \frac{\partial w_{\lambda_2}}{\partial I_{\lambda_2} } \frac{\partial I_{\lambda_2}}{\partial \mathbf{C}} + \frac{1}{2} \frac{\partial w_{\gamma}}{\partial I_{\gamma} } \frac{\partial I_{\gamma}}{\partial \mathbf{C}} \\
    &= \mathbf{S}_{\lambda_1} + \mathbf{S}_{\lambda_2} + \mathbf{S}_{\gamma}
\end{aligned}
$$

Therefore, we only needs to define the strain-potential for each contribution. By default Comfor assumes that each potential can be represented by a polynomial function of the form:

$$
w_p  = \sum_{i=1}^{n}  {k_{i}^p (I_{p} )^{2i}} 
$$

**Expected parameters**

- `warp_ori`: initial warp orientation defined by the components `l1_x, l1_y, l1_z` in the global base.
- `weft_ori`: initial weft orientation defined by the components `l2_x, l2_y, l2_z` in the global base.
- `kelongwarp`: warp elongation strain-potential defined by the $n$ coefficients $k_1^{\lambda_1},k_2^{\lambda_1} ... k_n^{\lambda_1}$.
- `kelongweft`: weft elongation strain-potential defined by the $n$ coefficients $k_1^{\lambda_2},k_2^{\lambda_2} ... k_n^{\lambda_2}$.
- `kshear`: in-plane shear strain-potential defined by the $n$ coefficients $k_1^{\gamma},k_2^{\gamma} ... k_n^{\gamma}$.

**Example**

```
MATERIALS TYPE HYPERTEXTILE
<material_name> RHO = <rho> DAMPING = <material_damping> WARPORI = <l1_x, l1_y, l1_z> WEFTORI = <l2_x, l2_y, l2_z> KELONGWARP = <kelong1_1, kelong1_2, kelong1_n> KELONGWEFT = <kelong2_1, kelong2_2, kelong2_n> KSHEAR = <kshear_1, kshear_2, kshear_n>
```

## References

\bibliography