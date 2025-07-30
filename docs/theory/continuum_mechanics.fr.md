# Description du mouvement

Le mouvement en tout point d'une région solide $\Omega$ dans l'espace avec
surface frontière $\partial\Omega$ est décrit par la fonction bijective $\Phi$ :

$$\mathbf{x} = \Phi (\mathbf{X},t)$$

Cela permet d'obtenir le vecteur position $\mathbf{x}$ au moment $t$ de toute
particule qui occupait précédemment la position $\mathbf{X}$. Pour un instant
$t$ fixé, cette fonction définit la déformation en tout point d'un solide entre
une configuration de référence $C_0$ et une configuration actuelle $C(t)$.

<div style="text-align:center;">
 <figure>
   <img src="../../assets/img/coordonnees.svg" />
   <figcaption>Configurations initiale et déformée</figcaption>
 </figure>
</div>

En mécanique des solides, la configuration de référence $C_0$ est généralement
associée à l'état initial du solide non déformé, ce qui permet d'associer les
deux configurations dans le même système d'axes. Les coordonnées dans la
configuration $C_0$ sont alors nommées coordonnées lagrangiennes ou matérielles,
tandis que celles associées à la configuration courante $C_t$ sont appelées
coordonnées eulériennes ou spatiales. Les différentes quantités présentées dans
la suite seront écrites par rapport à l'un ou l'autre de ces référentiels. Par
abus de langage, la dépendance au temps $t$ sera omise dans la suite en
supposant $t > 0$.

# Tenseur gradient de déformation

Afin de décrire la cinématique au voisinage d'un point $\mathbf{X}$ donné, on
introduit le tenseur gradient de la transformation. Ce tenseur est une
application qui transforme un vecteur matériel élémentaire
$\mathrm{d}\mathbf{X}$ en sa contrepartie eulérienne $\mathrm{d}\mathbf{x}$. Le
tenseur $\mathbf{F}$ fournit une description locale au premier ordre :

$$
\mathrm{d}\mathbf{x} = \frac{\partial \Phi}{\partial \mathbf{X}}
\mathrm{d}\mathbf{X} = \mathbf{F} \mathrm{d}\mathbf{X}
$$

$$
\mathbf{F} = \frac{\partial \mathbf{x}}{\partial \mathbf{X}}
$$

On définit aussi la transformation d'un élément de volume élémentaire. Soit un
élément de volume dans la configuration de référence, $dV \in C_0$. Sa
contrepartie déformée dans la configuration courante, $dv \in C_t$, est donnée
par le déterminant de la matrice jacobienne du tenseur gradient de la
transformation, appelé le jacobien $J$.

$$
\mathrm{d}v = J \mathrm{d}V \quad \text{avec} \quad J = \det(\mathbf{F})
$$

La condition locale d'impénétrabilité de la matière exige que :

$$
J(\mathbf{X}) > 0
$$

> **Note** : L'application $\Phi$ étant bijective, le jacobien $J$ est
> strictement positif. Physiquement, il serait incohérent de trouver un volume
> élémentaire nul ou négatif.

La transformation d'un élément de surface $\mathrm{d}S$ de normale $\mathbf{N}$
en configuration initiale en un élément de surface $\mathrm{d}s$ de normale
$\mathbf{n}$ est donnée par la formule de Nanson :

$$
\mathbf{n} \, \mathrm{d}s = J \mathbf{F}^{-T} \mathbf{N} \, \mathrm{d}S
$$

# Mesure des déformations

Pour définir la déformation d'un solide, il est nécessaire de caractériser les
changements de forme, c'est-à-dire les variations de longueurs et d'angles. Cela
correspond en fait aux variations des produits scalaires de vecteurs matériels
$\mathrm{d}\mathbf{X}$ et $\delta \mathbf{X}$, devenant $\mathrm{d}\mathbf{x}$
et $\delta \mathbf{x}$ après transformation :

$$ 
\mathrm{d} \mathbf{x} \cdot \delta \mathbf{x} = \left( \mathbf{F} \,
\mathrm{d}\mathbf{X} \right)^{T} \cdot \left( \mathbf{F} \, \delta \mathbf{X}
\right) = \mathrm{d} \mathbf{X} \cdot \mathbf{C} \cdot \delta \mathbf{X}
$$

où $\mathbf{C}$ désigne le tenseur des dilatations de Cauchy-Green droit, défini
par :

$$\mathbf{C} = \mathbf{F}^T \mathbf{F}$$

À partir de la variation des produits scalaires, on obtient la déformation
associée :

$$
\begin{align} \mathrm{d}\mathbf{x} \cdot \delta \mathbf{x} -
\mathrm{d}\mathbf{X} \cdot \delta \mathbf{X} &= \mathrm{d}\mathbf{X} \cdot
(\mathbf{C} - \mathbf{I}) \delta \mathbf{X} \\ &= \mathrm{d}\mathbf{X} \cdot 2
\mathbf{E} \, \delta \mathbf{X} \end{align}
$$

où $\mathbf{E}$ est le tenseur des déformations de Green-Lagrange :

$$
\mathbf{E} = \frac{1}{2} (\mathbf{C} - \mathbf{I})
$$

> **Note** : En petites déformations, ce tenseur se confond avec le tenseur des
> déformations linéarisées $\mathbf{\varepsilon}$. Les tenseurs $\mathbf{C}$
> et $\mathbf{E}$ sont définis dans la configuration de référence.

## Décomposition polaire

Le tenseur gradient de déformation $\mathbf{F}$ peut être exprimé comme le
produit d'un tenseur de rotation $\mathbf{R}$ et d'un tenseur des déformations
pures droit $\mathbf{U}$ :

$$\mathbf{F} = \mathbf{R} \mathbf{U}$$

Le tenseur $\mathbf{R}$ étant orthogonal, $\mathbf{R}^T \mathbf{R} =
\mathbf{I}$, la définition du tenseur $\mathbf{U}$ découle de celle de
$\mathbf{C}$ :

$$\mathbf{C} = \mathbf{F}^T \mathbf{F} = \mathbf{U}^T \mathbf{R}^T \mathbf{R}
\mathbf{U} = \mathbf{U}^2$$

Une analyse spectrale de $\mathbf{C}$ fournit les directions principales
$\mathbf{N}_i$ et les valeurs propres associées $\lambda_i$ :

$$\mathbf{C} = \sum_i \lambda_i^2 \, \mathbf{N}_i \otimes \mathbf{N}_i$$

et donc :

$$\mathbf{U} = \sum_i \lambda_i \, \mathbf{N}_i \otimes \mathbf{N}_i$$

où $\lambda_i$ sont les elongations dans les directions principales.

## Vitesses de déformation

Le tenseur gradient de vitesse $\mathbf{L}$ est défini par :

$$\mathbf{L} = \dot{\mathbf{F}} \mathbf{F}^{-1}$$

Sa décomposition en partie symétrique et antisymétrique permet de définir le
tenseur taux de déformation $\mathbf{D}$ et le tenseur taux de rotation
$\mathbf{W}$ :

$$
\begin{aligned}
\mathbf{D} &= \frac{1}{2} (\mathbf{L} + \mathbf{L}^T) \\
\mathbf{W} &= \frac{1}{2} (\mathbf{L} - \mathbf{L}^T)
\end{aligned}
$$

Le tenseur $\mathbf{W}$ correspond au rotationnel du champ des vitesses
$\mathbf{v}$, et décrit la vitesse de rotation du solide, tandis que
$\mathbf{D}$ décrit la vitesse de déformation.

La vitesse de déformation est donnée, dans $C_0$, par $\dot{\mathbf{E}}$ et,
dans $C_t$, par $\mathbf{D}$, ces deux tenseurs étant reliés par :

$$
\dot{\mathbf{E}} = \mathbf{F}^T \mathbf{D} \mathbf{F} = \frac{1}{2} \dot{\mathbf{C}}
$$

# Mesures des contraintes

Considérons un solide déformable découpé virtuellement en deux sous-domaines,
avant et après transformation. L'équilibre de chacun des deux sous-domaines
implique l'existence de forces internes à l'interface. On définit dans la
configuration actuelle $C_t$ le vecteur contrainte $\mathbf{t}$ qui caractérise
les forces de cohésion interne $\mathrm{d}\mathbf{f}$ exercées sur une partie du
solide à travers la surface $\mathrm{d}s$ de normale externe $\mathbf{n}$ :

$$
\mathbf{t} = \frac{\mathrm{d}\mathbf{f}}{\mathrm{d}s}
$$

<div style="text-align:center;">
 <figure>
   <img src="../../assets/img/stress.svg" />
   <figcaption>Définition du vecteur contrainte</figcaption>
 </figure>
</div>

Selon le théorème de Cauchy, pour un point donné, le vecteur contrainte dépend
linéairement du vecteur normal $\mathbf{n}$. Il existe alors un tenseur d'ordre
deux, nommé tenseur des contraintes de Cauchy $\mathbf{\sigma}$, tel que :

$$
\mathbf{t} = \mathbf{\sigma} \mathbf{n}
$$

soit aussi :

$$
\mathrm{d}\mathbf{f} = \mathbf{\sigma} \mathbf{n} \, \mathrm{d}s
$$

> **Note** : L'équation du principe fondamental de la dynamique permet de
> démontrer que le tenseur des contraintes de Cauchy est symétrique.

Le tenseur de Cauchy représente les efforts internes exprimés dans la
configuration actuelle. De même que pour les différentes mesures de déformation
établies précédemment, il est possible de définir d'autres mesures des efforts
internes dans la configuration de référence. En notant $\mathrm{d}\mathbf{F}$,
$\mathrm{d}S$ et $\mathbf{N}$ les forces internes, la surface et sa normale
ramenées en configuration initiale, on définit les trois tenseurs suivants :

$$
\begin{aligned}
\mathrm{d}\mathbf{f} &= \mathbf{P} \mathbf{N} \, \mathrm{d}S \\
\mathrm{d}\mathbf{F} &= \mathbf{S} \mathbf{N} \, \mathrm{d}S \\
\mathrm{d}\mathbf{F} &= \mathbf{\tau} \mathbf{n} \, \mathrm{d}s
\end{aligned}
$$

Ces tenseurs sont nommés respectivement :

- $\mathbf{P}$ : tenseur de Piola-Kirchhoff premier,
- $\mathbf{S}$ : tenseur de Piola-Kirchhoff second,
- $\mathbf{\tau}$ : tenseur de Kirchhoff.

Les relations entre ces différents tenseurs sont données par :

$$
\begin{aligned}
\mathbf{\tau} &= J \mathbf{\sigma} = \mathbf{F} \mathbf{S} \mathbf{F}^T = \mathbf{P} \mathbf{F}^T \\
\mathbf{P} &= \mathbf{F} \mathbf{S} = \mathbf{\tau} \mathbf{F}^{-T} = J \mathbf{\sigma} \mathbf{F}^{-T} \\
\mathbf{S} &= \mathbf{F}^{-1} \mathbf{P} = \mathbf{F}^{-1} \mathbf{\tau} \mathbf{F}^{-T} = J \mathbf{F}^{-1} \mathbf{\sigma} \mathbf{F}^{-T} \\
\mathbf{\sigma} &= J^{-1} \mathbf{\tau} = J^{-1} \mathbf{P} \mathbf{F}^T = J^{-1} \mathbf{F} \mathbf{S} \mathbf{F}^T
\end{aligned}
$$

> **Note** : En petites déformations, ces tenseurs sont identiques.

# Dualités contraintes–déformations

La puissance des efforts intérieurs peut s'exprimer selon différentes formes
équivalentes :

$$
\begin{aligned}
P_{\text{int}} &= \int_\Omega \mathbf{\sigma} : \mathbf{D} \, \mathrm{d}v \\
               &= \int_{\Omega_0} \mathbf{\tau} : \dot{\mathbf{F}} \, \mathrm{d}v_0 \\
               &= \int_{\Omega_0} \mathbf{S} : \dot{\mathbf{E}} \, \mathrm{d}v_0
\end{aligned}
$$

Il en résulte que les tenseurs $\mathbf{\sigma}$, $\mathbf{\tau}$ et
$\mathbf{S}$ sont respectivement duaux des tenseurs cinématiques $\mathbf{D}$,
$\dot{\mathbf{F}}$ et $\dot{\mathbf{E}}$ :

$$ \mathbf{S} : \dot{\mathbf{E}} = \mathbf{\tau} : \dot{\mathbf{F}} =
\mathbf{\sigma} : \mathbf{D} = \frac{1}{2} \mathbf{S} : \dot{\mathbf{C}} $$
# Thermodynamique des milieux continus

Les lois de la thermodynamique associées à la mécanique des milieux continus
sont nécessaires pour introduire le couplage entre phénomènes thermiques et
effets mécaniques. Même en l'absence de couplage thermomécanique, le second
principe permet d'introduire la conservation de l'énergie.

## Premier principe de la thermodynamique

Le premier principe exprime que la variation totale d'énergie (interne +
cinétique) est égale à la somme de la puissance des forces extérieures et de la
chaleur fournie au système :

$$
\frac{d}{dt} \left( E_{\text{int}} + E_{\text{cin}} \right) = P_{\text{ext}}
+ \dot{Q}
$$

où :

- $E_{int}$ est lénergie interne du système (en fonction de lénergie spécifique $e$) ;

$$E_{int} = \int_\Omega \rho e dv$$

- $\dot{Q}$ : taux de chaleur fourni ;

$$
\dot{Q} = \int_\Omega r \, \mathrm{d}v - \int_{\partial\Omega} \mathbf{q} \cdot
\mathbf{n} \, \mathrm{d}s
$$

La forme développée du premier principe devient :

$$
\frac{d}{dt} \int_\Omega \rho \left( e + \frac{1}{2} \mathbf{v} \cdot
\mathbf{v} \right) \, \mathrm{d}v = \int_\Omega \left( \mathbf{f}_v \cdot
\mathbf{v} + r \right) \, \mathrm{d}v + \int_{\partial\Omega} \left( \mathbf{t}
\cdot \mathbf{v} - \mathbf{q} \cdot \mathbf{n} \right) \, \mathrm{d}s
$$

ou, en posant :

$$
P_{\text{ext}} = \int_\Omega \rho \mathbf{\gamma} \cdot \mathbf{v} \, \mathrm{d}v -
\int_\Omega \mathbf{\sigma} : \mathbf{D} \, \mathrm{d}v
$$

On obtient la forme locale eulérienne :

$$
\int_\Omega \frac{d}{dt} \rho e \, \mathrm{d}v =
\int_\Omega \mathbf{\sigma} : \mathbf{D} \, \mathrm{d}v +
\int_\Omega \left( r - \mathrm{div}\, \mathbf{q} \right) \, \mathrm{d}v
$$

Et donc, sous forme locale :

$$
\frac{d}{dt} \rho e = \mathbf{\sigma} : \mathbf{D} + r - \mathrm{div}\, \mathbf{q}
$$

## Deuxième principe de la thermodynamique

Le second principe introduit la température $T(\mathbf{x},t)$ et l'entropie $S$.
Cette dernière mesure la variation d'énergie interne associée à la température.
Avec :

$$
S = \int_\Omega \rho \eta \, \mathrm{d}v
$$

où $\\eta$ est l'entropie spécifique.

Le second principe de la thermodynamique traduit la non-conservation de
lentropie dans un cadre irréversible (non dissipatif). Il postule que le taux de
production d'entropie est toujours supérieur ou égale au taux de chaleur reçue
divisé par la température :

$$
\begin{aligned}
\frac{dS}{dt} &\ge \frac{\dot{Q}}{T} \\\\
\int_\Omega \rho \dot{\eta} \, \mathrm{d}v &\ge \int_\Omega \frac{r}{T} \,
\mathrm{d}v - \int_{\partial\Omega} \frac{\mathbf{q} \cdot \mathbf{n}}{T} \,
\mathrm{d}s
\end{aligned}
$$

En utilisant le théorème de divergence :

$$
\int_\Omega \left( \rho \dot{\eta} + \mathrm{div} \left( \frac{\mathbf{q}}{T}
\right) - \frac{r}{T} \right) \, \mathrm{d}v \ge 0
$$

Ceci est valable pour tout point de $\Omega$, par conséquent la forme
locale est donnée par :

$$
\rho \dot{\eta} + \mathrm{div} \left( \frac{\mathbf{q}}{T} \right) - \frac{r}{T} \ge 0
$$

En remplaçant $r$ via le premier principe et en utilisant :

$$
\mathrm{div} \left( \frac{\mathbf{q}}{T} \right) = 
\frac{1}{T} \mathrm{div}(\mathbf{q}) - \frac{1}{T^2} \mathbf{q} \cdot \nabla T
$$

On définit la **fonction de dissipation** $\\Phi$, qui se décompose en :

- $\Phi_{\text{int}}$ : dissipation intrinsèque (production d'entropie interne)
- $\Phi_{\text{th}}$ : dissipation thermique par conduction

$$\Phi  = \underbrace {\rho \left( {{T} \,\dot \eta  - \frac{d}{dt}e} \right) + 
\mathbf{ \sigma } :\mathbf{D}}_{\Phi _{\mathrm int}} - \underbrace 
{\frac{1}{T}\mathbf{q} \cdot \frac{\partial T}
{{\partial \underline X }}}_{\Phi _{\mathrm{th}}} \ge 0$$

En introduisant l'énergie libre spécifique $\\psi = e - T\eta$, on obtient
l'inégalité de Clausius-Duhem sous forme locale eulérienne :

$$\Phi =-\rho \left(\dot{\psi} - \dot{{T} }\,\eta  \right)+\mathbf{\sigma}:
\mathbf{D}-\frac{1}{T}\mathbf{q} \cdot \frac{\partial T }{\partial \mathbf{X}}\ge 0$$

ou sous forme lagrangienne :

$$
\Phi_{0}=-{{\rho }_{0}}\left( \dot{\psi }-\dot{{T} }\,\eta  \right)+\mathbf{{S}}:\mathbf{{{\dot{E}}}}-\frac{1}{T} \mathbf{q} \cdot \frac{\partial {T} }{\partial \mathbf{X}} \ge 0
$$

## Variables d'état et potentiels thermodynamiques

L’état thermodynamique d’un milieu, en un point donné et à un instant fixé, est
entièrement défini par la connaissance d’un certain nombre de variables
scalaires et tensorielles appelées **variables d’état**. L’évolution d’un
système peut alors être vue comme une succession d’états d’équilibre
correspondant aux différents points du domaine [@LEM90].

Ces variables thermodynamiques peuvent être **observables** ou **internes**.

- Les **variables observables** (comme la déformation ou la température) peuvent
  être directement mesurées et suffisent à décrire l’évolution des phénomènes
  réversibles, comme dans le cas de l’élasticité.

- Les **variables internes** interviennent lorsqu’on considère un phénomène
  dissipatif. Elles dépendent non seulement de l’état actuel, mais aussi de
  l’histoire de la transformation du matériau. Ces variables ne figurent pas
  explicitement dans les équations du mouvement et ne sont donc pas mesurables
  directement. Cependant, elles permettent une description macroscopique de
  l’état microscopique du matériau (exemples : dislocations, cristallisation,
  endommagement).

Le choix de ces variables, leur type et leur nombre, nécessite une bonne
compréhension physique du problème étudié, et conditionne la précision du
modèle.

## Rational thermodynamics

In the general case, a law of behavior should provide: the free energy of the
system $\Phi$, the specific entropy $\eta$, the stress tensor $\mathbf{{sigma}}$
and the heat flux vector $\mathbf{q}$ as a function of the state variables. The
physical content of the theory results from the list of available state
variables. Thermodynamics is then used to restrict the possible laws of behavior
and to keep only those which are compatible with the second principle of
thermodynamics, i.e. compatible with the Clausius-Duheim inequality.

The rational thermodynamics method consists in assuming the existence of a
thermodynamic potential as a function of a certain number of well-defined state
variables (observables or internal). Generally we postulate the existence and
the form of the free energy $\Phi$. The equations of state of the system are
then deduced from the Clausius-Duheim inequality and from the application of
certain hypotheses specific to the physical phenomenon (e.g.: an isothermal $T
=const$ and homogeneous $\frac{\partial {T} }{\partial \mathbf{x}}=0$ process).

## Thermodynamics of irreversible processes

In the case of an irreversible (dissipative) processes, the Clausius-Duheim
inequality will allow us to determine the _dissipation_ function of the system,
the associated forces (e.g. stresses) and thermodynamic flows (e.g. deformation
rates) and to deduce the equations of evolution of the internal variables. This
second method is more physical because its assumptions (nature of state
variables and nature of dissipations) are directly related to the mechanisms of
the phenomenon.

In summary, when one wishes to describe the behavior of a given material on
which one has a minimum of physical knowledge, it is preferable to use the
method of thermodynamics of irreversible processes which is more restrictive
than rational thermodynamics. Otherwise the rational thermodynamics will be used
to give a general structure without referring to a particular material.

# Modèle de comportement

Les modèles de comportement décrivent les relations entre les déformations et
lévolution des contraintes. On peut distinguer trois grands types de modèles de
comportement

- Les lois hypoélastiques où une vitesse de déformation est liée à un taux de
  contrainte. Ces lois sont fréquemment utilisées pour des matériaux à la
  réponse peu anisotrope. Elles sont faciles à mettre en place et adaptées aux
  résolutions réactualisées. Les contraintes et énergies de déformation peuvent
  ne pas être indépendantes de lhistorique de déformation ;
- Les lois élastiques (ou Cauchy élastique) où une mesure de la déformation est
  liée à une mesure de la contrainte. Les contraintes sont indépendantes de
  lhistorique de déformation tandis que lénergie de déformation peut ne pas
  lêtre. Ces formulations sont très peu utilisées dans le cadre des grandes
  transformations ;
- Les lois hyperélastiques où une densité dénergie de déformation est définie
  comme étant un potentiel des contraintes. Les contraintes et énergies de
  déformation sont indépendantes de lhistorique de déformation.

## Principe dobjectivité

Un modèle de comportement constitutif doit vérifier le principe dindifférence
matérielle ou dobjectivité, autrement dit, il doit être invariant dans tout
changement de référentiel.

Quelques tenseurs objectifs :

- Tout tenseur écrit dans la configuration de référence $C_0$ (tels sont les cas
  du tenseur de déformation de Green-Lagrange $\mathbf{E}$ et le tenseur des
  contraintes de Piola-Kirchhoff 2 $\mathbf{S}$)
- Toute dérivée temporelle dun tenseur défini dans la configuration de référence
  $C_0$ ($\dot{\mathbf{E}}$ et $\dot{\mathbf{S}}$).
- Tout scalaire.

Cependant, il est important de noter que :

- Les dérivées temporelles des quantités définies dans la configuration déformée
  actuelle $C_t$ ne sont pas objectives. Ainsi, la dérivée du tenseur des
  contraintes de Cauchy $\dot{\mathbf{\sigma}}$ nest pas objective.
- Les dérivées temporelles $\dot{\mathbf{F}}$ du gradient de la transformation
  et $\dot{\mathbf{P}}$ du premier tenseur des contraintes de Piola-Kirchhoff ne
  sont pas non plus objectives.

Cependant, plusieurs dérivées temporelles objectives existent, comme
**la dérivée de Jaumann** :

$$\mathbf{\sigma}^{\bigtriangledown} = \dot{\mathbf{\sigma}} + \mathbf{\sigma} 
\mathbf{\omega} - \mathbf{\omega}\mathbf{\sigma}$$

ou **la dérivée de Green-Naghdi** :

$$\mathbf{\sigma}^{\bigtriangleup} = \dot{\mathbf{\sigma}} + \mathbf{\sigma} 
\dot{\mathbf{R}} \mathbf{R}^T - \dot{\mathbf{R}} \mathbf{R}^T\mathbf{\sigma}$$


## Modèles de comportement hyperélastiques

L'inégalité de Clausius-Duhem constitue le point de départ de la définition des
lois de comportement hyperélastiques. Ces lois diffèrent en ce point des lois
élastiques et des lois hypoélastiques qui sont dépourvues de fondements
thermodynamiques.

En théorie *purement mécanique*, il est courant de saffranchir des effets
thermiques. Les dissipations sécrivent alors :

$$
\begin{align}
\Phi_{0} & = -\rho_0 \dot{\psi} + \mathbf{S}:\mathbf{\dot{E}} \\
\Phi & = -\rho \dot{\psi} + \mathbf{\sigma}:\mathbf{D}
\end{align}
$$

Un matériau hyperélastique est un matériau dont lénergie de déformation par
unité de volume initial $w$ ne dépend que de létat actuel de déformation et qui
est non dissipatif, cest-à-dire qui ne produisent localement aucune entropie
($\Phi =0$).

$$
\begin{align}
w\left( \mathbf{F} \right) & = \rho_0 \psi \\
\Phi_{0} & = 0 \\
\end{align}
$$

Le potentiel dénergie de déformation $w$ nest admissible que sil satisfait aux
conditions suivantes :

- $w$ il est nul lorsque le matériau nest soumis à aucune sollicitation :
  $w\left(\mathbf{I}\right) = 0$ ;
- $w$ augmente avec la déformation : $w\left(\mathbf{F}\right) \geq 0$ ;
- $w$ respecte le principe dindifférence matérielle.
  $w\left(\mathbf{F} \right) = w\left(\mathbf{Q}\mathbf{F}
  \right) \, \forall\mathbf{F}, \mathrm{det} \mathbf{F} \geq 0$ ;
- $w$ respecte les symétries matérielles ;
- La fonction du potentiel dénergie doit être de classe $\mathcal{C}^2$ ( $w$,
  sa première dérivée et sa seconde dérivée doivent être continues).

En utilisant la définition de la
[décomposition polaire](#decomposition_polaire), on peut montrer que le
potentiel d\'énergie de déformation ne dépend que de la partie associée aux
deformations pures de $\mathbf{F}$ [@CIA21]:

$$ w\left(\mathbf{F} \right) = w\left(\mathbf{R^T}\mathbf{F} \right) =
w\left(\mathbf{R}^T\mathbf{R}\mathbf{U} \right) =w\left(\mathbf{U} \right) $$

Par conséquent, l\'énergie de déformation **reste objective** si elle est
exprimée en fonction du tenseur de Cauchy-Green droit ou du tenseur de
Green-Lagrange.

$$
w\left(\mathbf{F} \right) = w\left(\mathbf{C} \right) = w\left(\mathbf{E} \right)
$$

En utilisant le tenseur de Cauchy-Green droit, on en déduit la relation de base
des modèles constitutifs hyperélastiques :

$$
\begin{aligned}
\dot{w} & = \mathbf{S}:\mathbf{\dot{E}} \\
\dot{w} \left( \mathbf{C} \right) & =\mathbf{S}:\frac{1}{2} \frac{\partial }{\partial t} \left(\mathbf{C} - \mathbf{I} \right) \\
\frac{\partial w}{\partial \mathbf{C}}:\frac{\partial \mathbf{C}}{\partial t} & = \frac{1}{2}\mathbf{S}:\frac{\partial \mathbf{C}}{\partial t} \\
\therefore \frac{\partial w}{\partial \mathbf{C}} & =\frac{1}{2}\mathbf{S}  \\
\mathbf{S}&=2 \frac{\partial w}{\partial \mathbf{C}}
\end{aligned}
$$


### Hyperélasticité isotrope 

Un matériau hyperélastique est isotrope est défini par un potentiel de la forme:

$$w\left(\mathbf{C} \right) = w\left(I_1 ,I_2 ,I_3  \right)$$

où $I_i$ sont les invariants classiques du tenseur de Cauchy-Green droit définis
par:

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

Plusieurs expressions invariantes du potentiel existent pour les matériaux
hyperélastiques isotropes, les plus répandues ont été proposées par [@MOO40],
[@OGD97] et [@RIV48].

Le tenseur PK2 est donc de la forme:

$$\mathbf{S} = 2 \frac{\partial w}{\partial \mathbf{C}} = 
2 \sum_{a=1}^3  \frac{\partial w}{\partial I_i} \frac{\partial I_i}{\partial \mathbf{C}}$$

Les dérivées des invariants par rapport à $\mathbf{C}$ sont données par:

$$\begin{aligned}
\frac{\partial I_1}{\partial \mathbf{C}} & = \mathbf{I} \\
\frac{\partial I_2}{\partial \mathbf{C}} & = I_1\mathbf{I} - \mathbf{C} \\
\frac{\partial I_3}{\partial \mathbf{C}} & = I_3\mathbf{C}^{-1}
\end{aligned}$$

### Transverse isotropic hyperelasticity

A transverse isotropic material is characterized by a preferred direction
$\mathbf{l}_1$ in its initial configuration. This type of material has
rotational symmetry about this direction, and therefore the response of the
material is also invariant to any arbitrary rotation about this axis. In this
case, the strain energy potential can be expressed in terms of five independent
scalars defined from the right-hand Cauchy-Green tensor. The common
representation of this potential (see for example [@SPE84]) is as follows:

$$
w = w \left( I_{1},I_{2},I_{3},I_{4},I_{5}\right)
$$

Where $I_{1},I_{2},I_{3}$ correspond to the classical right Cauchy-Green
invariants. Whereas, $I_{4},I_{5}$ are pseudo-invariants associated with the
principal direction by [@SPE84] [@BOE87] [@QUA94] [@ITS04]:

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

Ising this invariant definition, the Second Piola-Kirchhoff stress tensor is
given by:

$$ \mathbf{S} = 2 \frac{\partial w}{\partial \mathbf{C}} = 2 \sum_{a=1}^5
\frac{\partial w}{\partial I_i} \frac{\partial I_i}{\partial \mathbf{C}} $$

The derivatives of the pseudo-invariants with respect to $\mathbf{C}$ are given
by:

$$
\begin{aligned}
\frac{\partial I_4}{\partial \mathbf{C}} & = \mathbf{L}_{11} \\
\frac{\partial I_5}{\partial \mathbf{C}} & = \mathbf{l}_1 \otimes  \mathbf{C}\mathbf{l}_1 +  \mathbf{C}\mathbf{l}_1 \otimes \mathbf{l}_1 \\
\end{aligned}
$$

### Orthotropic hyperelasticity

Un matériau orthotrope est caractérisé, dans la configuration initiale, par
trois directions privilégiées $\mathbf{l_1}$, $\mathbf{l_2}$ et $\mathbf{l_3}$
(normées). Ces directions permettent de définir les tenseurs de structure
caractéristiques du groupe de symétrie du matériau [@BOE87] :

$$
\mathbf{L}_{ij}  = \mathbf{l}_i \otimes \mathbf{l}_j
$$

Le théorème de représentation permet alors l\'écriture de la fonction densité
d\'énergie de déformation en fonction d\'invariants de la transformation pour un
comportement orthotrope [@QUA94] [@ITS04] :

$$
w =w \left( I_{1},I_{2},I_{3},I_{41},I_{42},I_{43},I_{412},I_{413},I_{423},I_{51},I_{52},I_{53} \right)
$$

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

# References

\bibliography
