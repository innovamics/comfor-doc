# Mécanique des milieux continus

## Description du mouvement

Le mouvement en tout point d\'une région solide $\Omega$ dans l\'espace
avec surface frontière $\partial\Omega$, est décrit par la fonction
bijective $\Phi$ :

$$\mathbf{x} = \Phi \left(\mathbf{X},t\right)$$

Ce qui nous permet d\'obtenir le vecteur position $\mathbf{x}$ au moment
$t$ de toute particule qui occupait précédemment la position
$\mathbf{X}$. Pour un instant $t$ fixé, cette fonction définit la
déformation en tout point d\'un solide entre une configuration de
référence $C_0$ et une configuration actuelle $C\left(t\right)$
(`img_coord`{.interpreted-text role="numref"}).

::: {#img_coord}
<figure class="align-center">
<img src="_images/coordonnees.svg" width="400"
alt="_images/coordonnees.svg" />
<figcaption>Configurations initiale et déformée.</figcaption>
</figure>
:::

En mécanique des solides, la configuration de référence $C_0$ est
généralement associée à l\'état initial du solide non déformé, ce qui
permet d\'associer les deux configurations dans le même système d\'axe.
Les coordonnées dans la configuration $C_0$ sont alors nommées
coordonnées lagrangiennes ou matérielles, tandis que celles associées à
la configuration courante $C_t$ sont appelées coordonnées eulériennes ou
spatiales. Les différentes quantités présentées dans la suite seront
écrites par rapport à l\'un ou l\'autre de ces référentiels. Par abus de
langage la dépendance au temps $t$ sera omise dans la suite en supposant
$t > 0$.

## Tenseur gradient de la transformation

Afin de décrire la cinématique au voisinage d\'un point $X$ donné, on
introduit le tenseur `gradient de la transformation`{.interpreted-text
role="index"}. Ce tenseur est une application qui transforme un vecteur
matériel élémentaire donné $\text{d}\mathbf{X}$ en sa contrepartie
eulérienne $\text{d}\mathbf{x}$. [\|F\|](##SUBST##|F|) donne une
description locale, au premier ordre :

$$d\mathbf{x} \left(\mathbf{X},t \right) =\frac{\partial \Phi }{\partial 
\mathbf{X}}d\mathbf{X}=\mathbf{F}d\mathbf{X}$$

[$$\mathbf{F} = \frac{\partial \mathbf{x} }{\partial \mathbf{X}}$$]{label="eq_gradF"}

On définit aussi la transformation d\'un élément de volume élémentaire.
Soit un élément de volume dans la configuration de référence,
$dV \in C_0$. Sa contrepartie déformée dans la configuration courante,
$dv \in C_t$, est donnée par le déterminant de la matrice jacobienne du
tenseur gradient de la transformation, appelé
`jacobien`{.interpreted-text role="index"} $J$.

$$dv=JdV \quad \mathrm{avec} \quad J=\mathrm{det} \left( \mathbf{F} \right)$$

La condition locale d\'impénétrabilité de la matière exige que:

$$J\left( X\right) > 0$$

:::: note
::: title
Note
:::

L\'application $\Phi$ étant bijective, le jacobien $j$ est strictement
positif. Physiquement, il serait incohérent de trouver un volume
élémentaire nul ou négatif.
::::

Nous définissons également la transformation d\'un élément de surface
$dS$ de normale $\mathbf{N}$ en configuration initiale en un élément de
surface $ds$ de normale $\mathbf{n}$ en utilisant la formule de
`Nanson`{.interpreted-text role="index"} :

$$\mathbf{n} ds =J\mathbf{F}^{-T}\mathbf{N}dS$$

## Mesure des déformations

Afin de définir la déformation d\'un solide, il est nécessaire de
caractériser les changements de forme, c\'est-à-dire les variations de
longueur et d\'angle. Il s\'agit en fait des variations des produits
scalaires de vecteurs matériels $d\mathbf{X}$ et $\delta \mathbf{X}$,
devenant $d\mathbf{x}$ et $\delta \mathbf{x}$ après transformation :

$$d\mathbf{x} \cdot \delta \mathbf{x} = \left( \mathbf{F} d\mathbf{X} \right)^{T} 
\cdot \left( \mathbf{F} \delta \mathbf{X} \right) 
= d \mathbf{X}  \cdot \mathbf{ C}   \cdot \delta \mathbf{X}$$

où [\|C\|](##SUBST##|C|) dénote le tenseur de dilatations
`Cauchy-Green droit`{.interpreted-text role="index"} et $\mathbf{B}$ le
tenseur de Cauchy-Green gauche définis par :

$$\begin{aligned}
\mathbf{C} &= \mathbf{F}^{T}\mathbf{F} \\
\mathbf{B} &= \mathbf{F}\mathbf{F}^{T}
\end{aligned}$$

À partir de la variation de ces produits scalaires, on obtient la
déformation associée :

$$\begin{aligned}
d\mathbf{x} \cdot \delta \mathbf{x} - d\mathbf{X} \cdot\delta \mathbf{X}
&= d\mathbf{X} \cdot \mathbf{ C} \delta \mathbf{X} - d\mathbf{X} \cdot\delta \mathbf{X} \\
&=d\mathbf{X} \cdot \left( \mathbf{ C} - \mathbf{I} \right) \delta \mathbf{X} \\
&=d\mathbf{X} \cdot 2 \mathbf{ E}\, \delta \mathbf{X}
\end{aligned}$$

$\mathbf{E}$ est le tenseur des déformations de
`Green-Lagrange`{.interpreted-text role="index"} donné par :

$$\mathbf{E} = \frac{1}{2} \left( \mathbf{C} - \mathbf{I} \right)$$

:::: note
::: title
Note
:::

En petites déformations, ce tenseur se confond avec le tenseur des
déformations linéarisées $\mathbf{\varepsilon}$. Les tenseurs
[\|C\|](##SUBST##|C|) et $\mathbf{E}$ sont définis par rapport à la
configuration initiale et à des variations de vecteurs matériels
élémentaires.
::::

### Décomposition polaire {#sec_polaire}

Le tenseur de gradient de déformation peut être exprimé comme le produit
du `tenseur de rotation`{.interpreted-text role="index"}
[\|R\|](##SUBST##|R|) et du
`tenseur des déformations pures droit`{.interpreted-text role="index"}
[\|U\|](##SUBST##|U|)

[$$\mathbf{F} = \mathbf{R} \mathbf{U}$$]{label="eq_Polar"}

Le `tenseur de rotation`{.interpreted-text role="index"} étant
orthogonal $\mathbf{R}^{T} \mathbf{R} = \mathbf{I}$, la définition du
tenseur [\|U\|](##SUBST##|U|) peut être déduite de la définition du
tenseur de Cauchy-Green droit :

$$\mathbf{C}= \mathbf{U}^{T}\mathbf{R}^{T} \mathbf{R} \mathbf{U} = \mathbf{U}^2$$

Une analyse des valeurs propres de [\|C\|](##SUBST##|C|) donne les
directions principales $\mathbf{N}_{i}$ et les valeurs propres
correspondantes $\lambda_{i}$.

$$\mathbf{C}= \lambda_{i}^2 \mathbf{N}_{i} \otimes \mathbf{N}_{i}$$

D\'où :

[$$\mathbf{U}= \lambda_{i} \mathbf{N}_{i} \otimes \mathbf{N}_{i}$$]{label="eq_U"}

### Vitesses de déformation

Le tenseur du gradient de vitesse $\mathbf{L}$ est defini par :

$$\mathbf{L} =  \dot{\mathbf{F}} \mathbf{F}^{-1}$$

La décomposition de L en partie symétrique et antisymétrique permet de
définir le tenseur taux de déformation D et le tenseur taux de rotation
W :

$$\begin{aligned}
\mathbf{D} =& \mathbf{L}^S = \frac{1}{2} ( \mathbf{L} + \mathbf{L}^T ) \\ 
\mathbf{W} =& \mathbf{L}^A = \frac{1}{2} ( \mathbf{L} - \mathbf{L}^T )
\end{aligned}$$

Le tenseur W correspond au rotationnel du champ des vitesses V , et
décrit donc la vitesse de rotation du solide, tandis que D décrit la
vitesse de déformation.

La vitesse de déformation est donnée dans [\|C0\|](##SUBST##|C0|) par
[\|Edot\|](##SUBST##|Edot|), et dans [\|Ct\|](##SUBST##|Ct|) par
[\|D\|](##SUBST##|D|), ces deux tenseurs étant *transportés* l\'un de
l\'autre par la relation :

$$\dot{\mathbf{E}} =  \mathbf{F}^{T} \mathbf{D} \mathbf{F} = \frac{1}{2} \dot{\mathbf{C}}$$

## Mesures des contraintes

Soit un solide déformable découpé virtuellement en deux sous-domaines,
avant et après transformation. L\'équilibre de chacun des deux
sous-domaines implique l\'existence de forces internes à l\'interface.
On définit dans la configuration actuelle $C_f$ le vecteur actuelle
$\mathbf{t}$ qui caractérise les forces de cohésion interne
[\|F\|](##SUBST##|F|) exercées sur une partie du solide à travers la
surface $ds$ de normale externe $\mathbf{n}$ :

$$\mathbf{t}=\frac{d\mathbf{f}}{ds}$$

::: {#img_stress}
<figure class="align-center">
<img src="_images/stress.svg" width="400" alt="_images/stress.svg" />
<figcaption>Configurations initiale et déformée.</figcaption>
</figure>
:::

Selon le `théorème de Cauchy`{.interpreted-text role="index"}, pour un
point donné, le vecteur contrainte dépend linéairement du vecteur normal
$\mathbf{n}$. Il existe alors un tenseur d\'ordre deux, nommé tenseur
des contraintes de Cauchy [\|sigma\|](##SUBST##|sigma|) , tel que :

$$\mathbf{t} = \mathbf{\sigma} \mathbf{n}$$

soit :

$$d\mathbf{f} = \mathbf{\sigma} \mathbf{n} ds$$

:::: note
::: title
Note
:::

L\'écriture de l\'équation du principe fondamental de la dynamique
permet de démontrer que le tenseur des contraintes de Cauchy est
symétrique.
::::

Le `tenseur de Cauchy`{.interpreted-text role="index"} représente donc
les efforts internes exprimés dans la configuration actuelle. De même
que pour les différentes mesures de déformation établies précédemment,
il est possible de définir d\'autres mesures des efforts internes.
Ainsi, en notant $d\mathbf{F}$, $dS$ et $\mathbf{N}$ les effort
internes, la surface et sa normale ramenés en configuration initiale,
les trois tenseurs suivants sont définis :

$$\begin{aligned}
d\mathbf{f} & = \mathbf{P} \mathbf{N} dS \\
d\mathbf{F} & = \mathbf{S} \mathbf{N} dS \\
d\mathbf{F} & = \mathbf{\tau} \mathbf{n} ds
\end{aligned}$$

Ces tenseurs sont nommés le
`tenseur de Piola-Kirchhoff`{.interpreted-text role="index"}
$\mathbf{P}$, le tenseur de `Piola-Kirchhoff`{.interpreted-text
role="index"} 2 [\|S\|](##SUBST##|S|) et le
`tenseur de Kirchhoff`{.interpreted-text role="index"} $\mathbf{\tau}$.

Les liens entre ces différents tenseurs sont donnés par :

$$\begin{aligned}
\mathbf{\tau} &= J\mathbf{\sigma} = \mathbf{F}\mathbf{S}\mathbf{F}^{T} 
= \mathbf{P}\mathbf{F}^{T} \\
\mathbf{P} &= \mathbf{F} \mathbf{S} = \mathbf{\tau} \mathbf{F}^{-T}
= J \mathbf{\sigma} \mathbf{F}^{-T} \\
\mathbf{S} &= \mathbf{F}^{-1} \mathbf{P} = \mathbf{F}^{-1} \mathbf{\tau} \mathbf{F}^{-T} 
= J \mathbf{F}^{-1} \mathbf{\sigma} \mathbf{F}^{-T} \\
\mathbf{\sigma} &= J^{-1} \mathbf{\tau} = J^{-1} \mathbf{P}\mathbf{F}^{T} 
= J^{-1} \mathbf{F} \mathbf{S} \mathbf{F}^{T}
\end{aligned}$$

:::: note
::: title
Note
:::

En petites déformations, ces tenseurs sont identiques.
::::

## Dualités contraintes-déformations

::: {#sec_puissance}
La puissance des efforts intérieurs peut être exprimée de trois façons
différentes :
:::

$$\begin{aligned}
P_{int} =&  \int_\Omega \mathbf{\sigma} : \mathbf{D} dv \\
        =&  \int_{\Omega_0} \mathbf{\tau} : \dot{\mathbf{F}} dv_0 \\
        =&  \int_{\Omega_0} \mathbf{S} : \dot{\mathbf{E}} dv_0
\end{aligned}$$

Ainsi, il ressort que les tenseurs [\|sigma\|](##SUBST##|sigma|),
[\|tau\|](##SUBST##|tau|) et [\|S\|](##SUBST##|S|) sont respectivement
duaux des tenseurs cinématiques [\|D\|](##SUBST##|D|),
[\|F\|](##SUBST##|F|) et [\|E\|](##SUBST##|E|).

$$\mathbf{S} : \dot{\mathbf{E}} = \mathbf{\tau}: \dot{\mathbf{F}} =
\mathbf{\sigma} : \mathbf{D} = \frac{1}{2}\mathbf{S} : \dot{\mathbf{C}}$$

## Théorème des puissances virtuelles

::: {#sec_puissance_virtuelle}
Dans un champ de vitesses virtuelles $\hat{\mathbf v}$, la puissance
virtuelle des quantités d\'accélération $\hat{P}_{acc}$ est égale à la
somme de la puissance virtuelle des efforts extérieurs $\hat{P}_{ext}$
(efforts à distance et efforts de contact) et de la puissance virtuelle
des efforts intérieurs $\hat{P}_{int}$.
:::

$$\hat{P}_{acc}  = \hat{P}_{int} + \hat{P}_{ext}$$

si $\mathbf{a}$ est le vecteur d\'accélération **réelle** en chaque
point, $\rho$ la masse volumique et $\rho \mathbf{a}$ la quantité de
mouvement, la puissance virtuelle des accelerations s\'exprime par:

$$\hat{P}_{acc}  = \int_{\Omega} \rho \mathbf{a} \cdot \hat{\mathbf v} dv$$

L\'expression des efforts externes depends des efforts exercés à
distance $\mathbf f_v$ et des efforts de contact schématisés par une
densité de forces $\mathbf t$.

$$\hat{P}_{ext}  = \int_{\Omega} \mathbf{f_v} \cdot \hat{\mathbf v} dv + 
\int_{\partial \Omega} \mathbf{t} \cdot \hat{\mathbf v} ds$$

La puissance virtuelle des efforts intérieurs est donnée à partir de la
dualités contraintes-déformations (virtuelles) de la section précédente.

::: {#sec_energie_cinetique}
Ce théorème est valable pour tout champ de vitesses virtuelles et en
prenant le champ de vitesses réel $\hat{\mathbf v} = \mathbf v$, on
obtient le théorème de l\'énergie cinétique.
:::

$$P_{acc}  = \int_{\Omega} \rho \mathbf{a} \cdot \mathbf v dv = 
           \int_{\Omega} \frac{1}{2} \rho \frac{d}{dt} \mathbf v ^2 dv  =
           \frac{d}{dt}  \int_{\Omega} \frac{1}{2} \rho \mathbf v ^2 =
           \frac{d}{dt} E_{cin}$$

d\'où on obtient :

$$\frac{d}{dt}  E_{cin}  = P_{int} + P_{ext}$$

:::: important
::: title
Important
:::

Cette relation est très utile pour déduire les expressions théoriques
nécessaires pour l\'identification des paramètres à partir des essais.
::::

## Thermodynamique des milieux continus

Les lois thermodynamiques associées à la mécanique des milieux continus
sont nécessaires pour introduire le couplage entre les phénomènes
thermiques et les effets mécaniques. Cependant, même en l\'absence de
tout couplage Thermo-mécanique, le second principe de la thermodynamique
permet d\'introduire le principe fondamental de conservation de
l\'énergie.

Le premier principe de la thermodynamique exprime que la variation
totale d\'énergie (c\'est-à-dire l\'énergie interne plus l\'énergie
cinétique) est égale à la somme de la puissance des forces externes plus
la quantité de chaleur fournie au système par unité de temps,
c\'est-à-dire :

$$\frac{d}{dt}\left( E_{int} + E_{cin} \right) = P_{ext} + \dot Q$$

Avec :

> - $E_{int}$ : l\'énergie interne du système (en fonction de l\'énergie
>   spécifique $e$) ;
>
> $$E_{int} = \int_\Omega \rho e dv$$
>
> - $Q$ le taux de chaleur fourni au système ;
>
> $$Q = \int_\Omega r dv - \int_{\partial\Omega}  \mathbf{q} \cdot \mathbf{n}  ds$$

En tenant compte de la définition de chaque terme énergétique, le
premier principe de la thermodynamique devient :

$$\frac{d}{dt} \int_\Omega{\rho \left( e + \frac{1}{2} \mathbf{v} \cdot \mathbf{v} \right) \,dv}  
= \int_\Omega \left( \mathbf{f}_{v} \cdot \mathbf{v} + r \right) dv + \int_{\partial\Omega} 
\left( \mathbf{t} \cdot \mathbf{v} - \mathbf{q} \cdot \mathbf{n} \right)  ds$$

Ou avec :

$$P_{ext} = \int_\Omega \rho \mathbf{\gamma} \cdot \mathbf{v} dv  - 
\int_\Omega \rho \mathbf{\sigma} : \mathbf{D} dv$$

La nouvelle forme du premier principe est donnée par :

$$\int_\Omega{\frac{d}{dt}\rho e \,dv}  = \int_\Omega  {\mathbf{\sigma} : 
\mathbf{D} \;dv}  + \int_\Omega{\left( r - \mathrm{div} \mathbf{q} \right)\, dv}$$

où le théorème de divergence a été appliqué à $Q$ et le théorème de
transport de Reynolds au membre de gauche. Cette équation est vérifiée
pour tout point du domaine $\Omega$ considéré. Ainsi, la **forme
eulérienne locale** est :

$$\frac{d}{dt} \rho e = \mathbf{\sigma} : \mathbf{D}  + r - \mathrm{div} \mathbf{q}$$

### Deuxième principe de la thermodynamique

Le deuxième principe de la thermodynamique fait intervenir deux
nouvelles variables: la température ${T}(\mathbf{x},t)$ et l\'entropie
$S$. L\'entropie exprime une variation d\'énergie interne associée à une
variation de la température, sa définition en fonction de l\'entropie
spécifique $\eta$ est donnée par:

$$S = \int_\Omega \rho \, \eta \, dv$$

Le second principe de la thermodynamique traduit la non-conservation de
l\'entropie dans un cadre irréversible (non dissipatif). Il postule que
le taux de production d\'entropie est toujours supérieur ou égale au
taux de chaleur reçue divisé par la température :

$$\begin{aligned}
\frac{dS}{dt} &\ge \frac{{\dot Q}}{T}\\
\int_\Omega \rho \, \dot{\eta} \, dv &\ge \int_\Omega \frac{r}{T} dv - 
\int_{\partial\Omega}  \frac{\mathbf{q}\cdot \mathbf{n}  }{T} ds
\end{aligned}$$

en utilisant le théorème de divergence,

$$\int_\Omega   \left( \rho \dot{\eta }  + 
\mathrm{div}\left( \frac{\underline q}{T} \right) - \frac{r}{T} \right) dv \ge 0$$

Ceci est valable pour tout point de $\Omega$, par conséquent la forme
locale est donnée par :

$$\rho \dot{\eta }  + \mathrm{div}\left( \frac{\underline q}{T} \right) - \frac{r}{T}  \ge 0$$

En remplaçant les sources d\'énergie volumique $r$ à l\'aide du premier
principe et en remarquant que :

$$\mathrm{div}\left( \frac{\underline q}{T} \right) = 
\frac{1}{T}\mathrm{div}(\mathbf{q}) - \frac{1}{T ^2}\mathbf{q} 
\cdot \frac{\partial T}{\partial \mathbf{x}}$$

Le premier et second principe définissent la fonction dissipation
$\Phi$. Ce potentiel peut être divisé en deux parties, la dissipation
intrinsèque $\Phi_{int}$ (i.e production interne d\'entropie) et la
dissipation thermique par conduction $\Phi_{th}$ :

$$\Phi  = \underbrace {\rho \left( {{T} \,\dot \eta  - \frac{d}{dt}e} \right) + 
\mathbf{ \sigma } :\mathbf{D}}_{\Phi _{\mathrm int}} - \underbrace 
{\frac{1}{T}\mathbf{q} \cdot \frac{\partial T}
{{\partial \underline X }}}_{\Phi _{\mathrm{th}}} \ge 0$$

Finalement en introduisant la notion d\'énergie libre spécifique
$\psi = e - {T}\eta$, on obtient la forme locale du deuxième principe
connue sous le nom de **inégalite de Clausius-Duheim** sous sa forme
eulérienne:

$$\Phi =-\rho \left(\dot{\psi} - \dot{{T} }\,\eta  \right)+\mathbf{\sigma}:
\mathbf{D}-\frac{1}{T}\mathbf{q} \cdot \frac{\partial T }{\partial \mathbf{X}}\ge 0$$

ou Lagrangienne:

[$$\Phi_{0}=-{{\rho }_{0}}\left( \dot{\psi }-\dot{{T} }\,\eta  \right)+\mathbf{{S}}:
\mathbf{{{\dot{E}}}}-\frac{1}{T} \mathbf{q}
\cdot \frac{\partial {T} }{\partial \mathbf{X}} \ge 0$$]{label="eq_ICD_lagrange"}

## Modèle de comportement

Les modèles de comportement décrivent les relations entre les
déformations et l\'évolution des contraintes. On peut distinguer trois
grands types de modèles de comportement

- Les lois hypoélastiques où une vitesse de déformation est liée à un
  taux de contrainte. Ces lois sont fréquemment utilisées pour des
  matériaux à la réponse peu anisotrope. Elles sont faciles à mettre en
  place et adaptées aux résolutions réactualisées. Les contraintes et
  énergies de déformation peuvent ne pas être indépendantes de
  l\'historique de déformation ;
- Les lois élastiques (ou Cauchy élastique) où une mesure de la
  déformation est liée à une mesure de la contrainte. Les contraintes
  sont indépendantes de l\'historique de déformation tandis que
  l\'énergie de déformation peut ne pas l\'être. Ces formulations sont
  très peu utilisées dans le cadre des grandes transformations ;
- Les lois hyperélastiques où une densité d\'énergie de déformation est
  définie comme étant un potentiel des contraintes. Les contraintes et
  énergies de déformation sont indépendantes de l\'historique de
  déformation.

## Principe d\'objectivité {#sec_objectivity}

Un modèle de comportement constitutif doit vérifier le principe
d\'indifférence matérielle ou d\'objectivité, autrement dit, il doit
être invariant dans tout changement de référentiel.

Quelques tenseurs objectifs :

> - Tout tenseur écrit dans la configuration de référence $C_0$ (tels
>   sont les cas du tenseur de déformation de Green-Lagrange
>   $\mathbf{E}$ et le tenseur des contraintes de Piola-Kirchhoff 2
>   [\|S\|](##SUBST##|S|)).
> - Toute dérivée temporelle d\'un tenseur défini dans la configuration
>   de référence $C_0$ ($\dot{\mathbf{E}}$ et $\dot{\mathbf{S}}$).
> - Tout scalaire.

Cependant, il est important de noter que :

> - Les dérivées temporelles des quantités définies dans la
>   configuration déformée actuelle $C_t$ ne sont pas objectives. Ainsi,
>   la dérivée du tenseur des contraintes de Cauchy
>   $\dot{\mathbf{\sigma}}$ n\'est pas objective.
> - Les dérivées temporelles $\dot{\mathbf{F}}$ du gradient de la
>   transformation et $\dot{\mathbf{P}}$ du premier tenseur des
>   contraintes de Piola-Kirchhoff ne sont pas non plus objectives.

Cependant, plusieurs dérivées temporelles objectives existent, comme
**la dérivée de Jaumann** :

$$\mathbf{\sigma}^{\bigtriangledown} = \dot{\mathbf{\sigma}} + \mathbf{\sigma} 
\mathbf{\omega} - \mathbf{\omega}\mathbf{\sigma}$$

ou **la dérivée de Green-Naghdi** :

$$\mathbf{\sigma}^{\bigtriangleup} = \dot{\mathbf{\sigma}} + \mathbf{\sigma} 
\dot{\mathbf{R}} \mathbf{R}^T - \dot{\mathbf{R}} \mathbf{R}^T\mathbf{\sigma}$$

## Modèles hyperélastiques

L\' `inégalité de Clausius-Duhem`{.interpreted-text role="index"} (
`eq_ICD_lagrange`{.interpreted-text role="math:numref"}) constitue le
point de départ de la définition des lois de comportement
hyperélastiques. Ces lois diffèrent en ce point des lois élastiques et
des lois hypoélastiques qui sont dépourvues de fondements
thermodynamiques.

En théorie *purement mécanique*, il est courant de s\'affranchir des
effets thermiques. Les dissipations s\'écrivent alors :

$$\begin{aligned}
\Phi_{0} & = -\rho_0 \dot{\psi} + \mathbf{S}:\mathbf{\dot{E}} \\
\Phi & = -\rho \dot{\psi} + \mathbf{\sigma}:\mathbf{D}
\end{aligned}$$

Un matériau hyperélastique est un matériau dont l\'énergie de
déformation par unité de volume initial $w$ ne dépend que de l\'état
actuel de déformation et qui est non dissipatif, c\'est-à-dire qui ne
produisent localement aucune entropie ($\Phi =
0$).

$$\begin{aligned}
w\left( \mathbf{F} \right) & = \rho_0 \psi \\
\Phi_{0} & = 0 \\
\end{aligned}$$

::: {#ref_admin_w}
**Admissibilité**
:::

Le potentiel d\'énergie de déformation $w$ n\'est admissible que s\'il
satisfait aux conditions suivantes :

- $w$ il est nul lorsque le matériau n\'est soumis à aucune
  sollicitation : $w\left(\mathbf{I}\right) = 0$ ;
- $w$ augmente avec la déformation : $w\left(\mathbf{F}\right) \geq 0$ ;
- $w$ respecte le principe d\'indifférence matérielle (voir `Objectivité
  <sec_objectivity>`{.interpreted-text role="ref"}) :
  $w\left(\mathbf{F} \right) = w\left(\mathbf{Q}\mathbf{F}
  \right) \, \forall\mathbf{F}, \mathrm{det} \mathbf{F} \geq 0$ ;
- $w$ respecte les symétries matérielles ;
- La fonction du potentiel d\'énergie doit être de classe
  $\mathcal{C}^2$ ( $w$, sa première dérivée et sa seconde dérivée
  doivent être continues).

En utilisant la définition de la
`décomposition polaire <sec_polaire>`{.interpreted-text role="ref"}, on
peut montrer que le potentiel d\'énergie de déformation ne dépend que de
la partie associée aux deformations pures de [\|F\|](##SUBST##|F|)
[@CIA88] :

$$w\left(\mathbf{F} \right) = w\left(\mathbf{R^T}\mathbf{F} \right) = 
w\left(\mathbf{R}^T\mathbf{R}\mathbf{U} \right) =w\left(\mathbf{U} \right)$$

Par conséquent, l\'énergie de déformation **reste objective** si elle
est exprimée en fonction du tenseur de Cauchy-Green droit ou du tenseur
de Green-Lagrange.

$$w\left(\mathbf{F} \right) = w\left(\mathbf{C} \right) = w\left(\mathbf{E} \right)$$

En utilisant le tenseur de Cauchy-Green droit, on en déduit la relation
de base des modèles constitutifs hyperélastiques :

$$\begin{aligned}
\dot{w} & = \mathbf{S}:\mathbf{\dot{E}} \\
\dot{w} \left( \mathbf{C} \right) & =\mathbf{S}:\frac{1}{2} \frac{\partial }
{\partial t} \left(\mathbf{C} - \mathbf{I} \right) \\
\frac{\partial w}{\partial \mathbf{C}}:\frac{\partial \mathbf{C}}{\partial t} 
& = \frac{1}{2}\mathbf{S}:\frac{\partial \mathbf{C}}{\partial t} \\
\therefore \frac{\partial w}{\partial \mathbf{C}} & =\frac{1}{2}\mathbf{S}
\end{aligned}$$

soit :

[$$\mathbf{S}=2 \frac{\partial w}{\partial \mathbf{C}}$$]{label="eq_pk2"}

## Hyperélasticité isotrope {#sec_hyper_ortho}

Un matériau hyperélastique est isotrope est défini par un potentiel de
la forme:

$$w\left(\mathbf{C} \right) = w\left(I_1 ,I_2 ,I_3  \right)$$

où $I_i$ sont les invariants classiques du tenseur de Cauchy-Green droit
définis par:

$$\begin{aligned}
I_1 & = \mathrm{tr}  \left( \mathbf{C} \right) = \mathbf{C} : \mathbf{I} \\
I_2 & = \dfrac{1}{2} \left( \mathrm{tr} \left( \mathbf{C} \right)^2 - 
\mathrm{tr} \left( \mathbf{C}^2 \right)\right) = \mathbf{C} : \mathbf{C} \\
I_3 & = \mathrm{det} \left( \mathbf{C} \right) = J^2
\end{aligned}$$

Le potentiel peut également être exprimé en fonctions des élongations
principales:

$$\begin{aligned}
w\left(\mathbf{C} \right) & = w\left(\lambda_1 ,\lambda_2 ,\lambda_3  \right) \\
I_1 & = \lambda_1^2 +  \lambda_2^2 + \lambda_3^2 \\
I_2 & = \lambda_1^2 \lambda_2^2 +  \lambda_1^2 \lambda_3^2+ \lambda_2^2 \lambda_3^2\\
I_3 & =  \lambda_1^2 \lambda_2^2 \lambda_3^2
\end{aligned}$$

Plusieurs expressions invariantes du potentiel existent pour les
matériaux hyperélastiques isotropes, les plus répandues ont été
proposées par [@MOO40], [@OGD97] et [@RIV48].

Le tenseur PK2 est donc de la forme:

$$\mathbf{S} = 2 \frac{\partial w}{\partial \mathbf{C}} = 
2 \sum_{a=1}^3  \frac{\partial w}{\partial I_i} \frac{\partial I_i}{\partial \mathbf{C}}$$

Les dérivées des invariants par rapport à $\mathbf{C}$ sont données par
:

$$\begin{aligned}
\frac{\partial I_1}{\partial \mathbf{C}} & = \mathbf{I} \\
\frac{\partial I_2}{\partial \mathbf{C}} & = I_1\mathbf{I} - \mathbf{C} \\
\frac{\partial I_3}{\partial \mathbf{C}} & = I_3\mathbf{C}^{-1}
\end{aligned}$$

## Hyperélasticité orthotrope

Un matériau orthotrope est caractérisé, dans la configuration initiale,
par trois directions privilégiées $\mathbf{l_1}$, $\mathbf{l_2}$ et
$\mathbf{l_3}$ (normées). Ces directions permettent de définir les
tenseurs de structure caractéristiques du groupe de symétrie du matériau
[@BOE78] :

$$\mathbf{L}_{ij}  = \mathbf{l}_i \otimes \mathbf{l}_j$$

Le théorème de représentation permet alors l\'écriture de la fonction
densité d\'énergie de déformation en fonction d\'invariants de la
transformation pour un comportement orthotrope :

$$w =w \left( I_{1},I_{2},I_{3},I_{41},I_{42},I_{43},I_{412},
I_{413},I_{423},I_{51},I_{52},I_{53} \right)$$

définis par :

$$\begin{aligned}
I_{4i} & = \mathbf{l}_i \cdot \mathbf{C} \mathbf{l}_i = \mathbf{C}:\mathbf{L}_{ii} \\
I_{4ij} & = \mathbf{l}_i \cdot \mathbf{C} \mathbf{l}_j = \mathbf{C}:\mathbf{L}_{ij} \\
I_{5i} & = \mathbf{l}_i \cdot \mathbf{C}^2 \mathbf{l}_i = \mathbf{C}^2:\mathbf{L}_{ii}
\end{aligned}$$

$$\mathbf{S} = 2 \frac{\partial w}{\partial \mathbf{C}} = 
2 \sum_{i=1}^3 \left( \frac{\partial w}{\partial I_i} \frac{\partial I_i}{\partial \mathbf{C}} +
\frac{\partial w}{\partial I_{4i}} \frac{\partial I_{4i}}{\partial \mathbf{C}} + 
\frac{\partial w}{\partial I_{5i}} \frac{\partial I_{5i}}{\partial \mathbf{C}} \right) + 
2 \sum_{i,j=1}^3 \left( \frac{\partial w}{\partial I_{4ij}}
\frac{\partial I_{4ij}}{\partial \mathbf{C}}  \right)$$

où les dérivées des tenseurs sont données par:

$$\begin{aligned}
\frac{\partial I_{4i}}{\partial \mathbf{C}} & = \mathbf{L}_{ii}  \\
\frac{\partial I_{4ij}}{\partial \mathbf{C}} & = \frac{1}{2} 
\left( \mathbf{l}_i \otimes \mathbf{l}_j +  \mathbf{l}_j \otimes \mathbf{l}_i \right) \\
\frac{\partial I_{5i}}{\partial \mathbf{C}} & = \mathbf{l}_i \otimes  
\mathbf{C}\mathbf{l}_i +  \mathbf{C}\mathbf{l}_i \otimes \mathbf{l}_i
\end{aligned}$$
