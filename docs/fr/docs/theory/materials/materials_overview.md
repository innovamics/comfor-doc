Cette section présente en détail les modèles de comportement mécanique
implémentés dans **Comfor**. Pour une introduction complémentaire sur les
fondements théoriques, il est recommandé de consulter les documents suivants,
ainsi que les publications scientifiques associées.

- [Mécanique des milieux continus ](../continuum_mechanics.md)
- [Matériaux composites](composite_materials.md)

# Modèles de comportement dans Comfor

Comfor intègre plusieurs modèles pour décrire le comportement matériel dans des
contextes de grandes déformations, notamment :

- **Matériaux élastiques**
  - Modèle de type Kirchhoff isotrope (Saint-Venant Kirchhoff)

- **Matériaux hyperélastiques**
  - Modèle d’Ogden (isotrope, incompressible)
  - Modèle textile non linéaire anisotrope

Les paramètres suivants sont requis pour tout matériau :

**Paramètres nécessaires**

- `material_name` : nom assigné au matériau
- $\rho$ : densité massique du matériau

**Paramètres optionnels**

- $\alpha$ : coefficient d’amortissement proportionnel à la masse. Il modélise des forces d’amortissement visqueuses linéaires, proportionnelles aux vitesses absolues.

**Exemple** :

```xml
MATERIALS TYPE <material_type_1>
<material_name> RHO = <mass density> DAMPING = <damping_value> ...
```

# Matériaux élastiques

Le modèle élastique utilisé dans Comfor repose sur une loi de Saint-Venant
Kirchhoff, adaptée aux petites déformations et aux grandes rotations. La loi
constitutive est exprimée dans le cadre lagrangien par :

$$
\mathbf{S} = \mathbb{C} \mathbf{E}
$$

où $\mathbf{S}$ est le tenseur de contrainte de Piola-Kirchhoff d'ordre 2,
$\mathbf{E}$ est le tenseur des déformations de Green-Lagrange, et $\mathbb{C}$
le tenseur d’élasticité du matériau.

## Matériau isotrope de Kirchhoff

Pour un matériau isotrope, $\mathbb{C}$ s’exprime en fonction des constantes de
Lamé $\lambda$ et $\mu$ :

$$
\mathbb{C} = \lambda \mathbf{I} \otimes \mathbf{I} + 2\mu \mathbf{I}
$$

où $\lambda$ et $\mu$ sont les constantes de Lamé, exprimées en fonction du
module de Young $E$ et du coefficient de Poisson $\nu$ :

$$
\begin{aligned}
\lambda &= \frac{\nu E}{(1 + \nu)(1 - 2\nu)} \\
\mu &= \frac{E}{2(1 + \nu)}
\end{aligned}
$$

**Paramètres attendus** :

- $E$ : module de Young
- $\nu$ : coefficient de Poisson

**Exemple** :

```xml
MATERIALS TYPE ELASTIC
<material_name> RHO = <rho> DAMPING = <material_damping> E = <young_modulus> NU = <poissons_ratio>
```

# Matériaux hyperélastiques

Les matériaux hyperélastiques sont modélisés à partir d’un potentiel d’énergie
de déformation $w(\mathbf{C})$, fonction du tenseur des déformations à droite
$\mathbf{C} = \mathbf{F}^T \mathbf{F}$. La loi de comportement est alors :

$$
\mathbf{S} = 2 \frac{\partial w}{\partial \mathbf{C}}
$$

Ce cadre permet de définir des matériaux isotropes ou anisotropes, compressibles ou incompressibles, à partir d’un unique potentiel scalaire.

Deux familles sont disponibles :

- Matériaux isotropes (caoutchouc, poches à vide, membranes)
- Matériaux textiles anisotropes

## Hyperélasticité isotrope

### Modèle d'Ogden

Le potentiel d’énergie du modèle d’Ogden s’exprime en fonction des allongements
principaux $\lambda_1$, $\lambda_2$, $\lambda_3$ :

$$
w = \sum_{p=1}^N \frac{\mu_p}{\alpha_p} \left( \lambda_1^{\alpha_p} + \lambda_2^{\alpha_p} + \lambda_3^{\alpha_p} - 3 \right)
$$

- $N$ : degré du modèle (souvent $N = 3$)
- $\mu_p$, $\alpha_p$ : paramètres à calibrer

En cas d’incompressibilité (hypothèse courante pour les membranes) :

$$
\lambda_1 \lambda_2 \lambda_3 = 1
$$

Cela permet d'exprimer l'évolution de l'épaisseur en fonction des déformations
dans le plan de la membrane :

$$
\lambda_3 = \frac{1}{\lambda_1 \lambda_2} = \frac{h}{h_0}
$$

où $h$ est l’épaisseur actuelle et $h_0$ l’épaisseur initiale. Cette relation
est utilisée dans Comfor pour mettre à jour l’épaisseur des éléments de membrane
en fonction de la déformation.

Le tenseur des contraintes devient alors :

$$
\mathbf{S} = 2 \frac{\partial w}{\partial \mathbf{C}} - p \mathbf{C}^{-1}
$$

où $p$ est un multiplicateur de Lagrange (pression hydrostatique).

**Paramètres attendus** :

- `TYPE = OGDEN`
- $\mu_i$ : coefficients de cisaillement
- $\alpha_i$ : exposants sans dimension

**Exemple** :

```xml
MATERIALS TYPE HYPERELASTIC
<material_name> RHO = <rho> DAMPING = <material_damping> TYPE = OGDEN MU = <mu_1 mu_2 mu_3 ...> ALPHA = <alpha_1 alpha_2 alpha_3 ...>
```

!!! note
    $N$ est déterminé automatiquement à partir du nombre de paires $(\mu_i, \alpha_i)$.

!!! warning "Avertissement"
    Le nombre de coefficients $\mu_i$ et $\alpha_i$ doit être identique.

---

### Matériaux textiles hyperélastiques

Le comportement non linéaire des matériaux composites tissés est modélisé à
l’aide d’un modèle hyperélastique spécifique [@GUZ15] [@GUZ16a]. L’énergie de
déformation est décomposée en contributions **membranaires** et **en flexion** :

$$
w = w_{\text{mem}} + w_{\text{ben}}
$$

La partie membranaire dépend d’invariants physiques associés aux modes de 
déformation du tissé:

$$
w_{\text{mem}}(I_{\lambda_1}, I_{\lambda_2}, I_\gamma) = w_{\lambda_1}(I_{\lambda_1}) + w_{\lambda_2}(I_{\lambda_2}) + w_\gamma(I_\gamma)
$$

où :

$$
\begin{aligned}
I_{\lambda_1} &= \ln(\lambda_1) = \frac{1}{2} \ln(I_{41}) \\
I_{\lambda_2} &= \ln(\lambda_2) = \frac{1}{2} \ln(I_{42}) \\
I_\gamma &= \frac{I_{412}}{\sqrt{I_{41} I_{42}}} = \sin(\gamma)
\end{aligned}
$$

Les invariants sont calculés à partir du tenseur des déformations à droite
$\mathbf{C}$ et des tenseurs de structure $\mathbf{L}_{ij} = \mathbf{l}_i
\otimes \mathbf{l}_j$, avec $\mathbf{l}_1$, $\mathbf{l}_2$ les directions
initiales de chaîne et trame:


- $I_{4i} = \mathbf{C} : \mathbf{L}_{ii}$
- $I_{4ij} = \mathbf{C} : \mathbf{L}_{ij}$

La contrainte de Piola-Kirchhoff est donnée par :

$$
\begin{aligned}
    \mathbf{S} &= \frac{1}{2} \frac{\partial w_{mem}}{\partial \mathbf{C}} \\
    &=  \frac{1}{2} \frac{\partial w_{\lambda_1}}{\partial I_{\lambda_1} } \frac{\partial I_{\lambda_1}}{\partial \mathbf{C}} + \frac{1}{2} \frac{\partial w_{\lambda_2}}{\partial I_{\lambda_2} } \frac{\partial I_{\lambda_2}}{\partial \mathbf{C}} + \frac{1}{2} \frac{\partial w_{\gamma}}{\partial I_{\gamma} } \frac{\partial I_{\gamma}}{\partial \mathbf{C}} \\
    &= \mathbf{S}_{\lambda_1} + \mathbf{S}_{\lambda_2} + \mathbf{S}_{\gamma}
\end{aligned}
$$


Chaque potentiel $w_p$ est exprimé par défaut sous forme polynomiale :

$$
w_p(I_p) = \sum_{i=1}^{n} k_i^p (I_p)^{2i}
$$

**Paramètres attendus** :

- `WARPORI` : orientation initiale de la chaîne (`l1_x, l1_y, l1_z`)
- `WEFTORI` : orientation initiale de la trame (`l2_x, l2_y, l2_z`)
- `KELONGWARP` : coefficients $k_i^{\lambda_1}$ (élongation chaîne)
- `KELONGWEFT` : coefficients $k_i^{\lambda_2}$ (élongation trame)
- `KSHEAR` : coefficients $k_i^\gamma$ (cisaillement dans le plan)

**Exemple** :

```xml
MATERIALS TYPE HYPERTEXTILE
<material_name> RHO = <rho> DAMPING = <material_damping> WARPORI = <l1_x, l1_y, l1_z> WEFTORI = <l2_x, l2_y, l2_z> KELONGWARP = <kelong1_1, kelong1_2, ...> KELONGWEFT = <kelong2_1, kelong2_2, ...> KSHEAR = <kshear_1, kshear_2, ...>
```

## Références

\bibliography
