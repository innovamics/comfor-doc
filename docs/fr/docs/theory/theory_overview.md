Dans cette section, vous trouverez des détails sur les modèles physiques et les
méthodes utilisés dans Comfor. Pour plus d'informations, le lecteur est invité à
consulter les articles cités dans chaque section.

# Notation

Conformément à l'usage courant dans la littérature sur les éléments finis et la
mécanique des milieux continus, nous adoptons les règles suivantes.

**Notation des variables**

| Notation                                  | Description                                                                   |
| ----------------------------------------- | ----------------------------------------------------------------------------- |
| $\alpha,\beta,\gamma, ...$                | Lettres grecques minuscules pour les **scalaires**                            |
| $\mathbf{a},\mathbf{b},\mathbf{c},...$    | Lettres minuscules en gras pour les **vecteurs**                              |
| $\mathbf{A},\mathbf{B},\mathbf{C},...$    | Lettres majuscules en gras pour les **tenseurs d’ordre deux**                 |
| $\mathcal{A},\mathcal{B},\mathcal{C},...$ | Lettres calligraphiées majuscules en gras pour les **tenseurs d’ordre trois** |
| $\mathbb{A},\mathbb{B},\mathbb{C},...$    | Lettres majuscules en double barre pour les **tenseurs d’ordre quatre**       |

**Notation indicielle**

Les composants des tenseurs sont écrits avec des sous-indexes: $A_{ij}, e_i$, ...

Nous adoptons la convention de sommation d'Einstein, où les indices qui sont
répétés exactement deux fois sont additionnés, sauf indication contraire. Par
exemple :

$$
	\mathbf{u} = u_i\mathbf{e}_i  = \sum_{n=1}^{3} u_i\mathbf{e}_i = u_1\mathbf{e}_1 + u_2\mathbf{e}_2 + u_3\mathbf{e}_3
$$

**Notation de Voigt**

Les tenseurs d’ordre deux sont transformés en vecteurs colonnes selon la
convention suivante :

$$
    A =
    \begin{pmatrix}
    a_{11} & a_{12} & a_{13} \\
    a_{21} & a_{22} & a_{23} \\
    a_{31} & a_{32} & a_{33}
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

**Algèbre linéaire**

| Notation                      | Description                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------------ |
| $\mathbf{a}\cdot\mathbf{b}$   | Produit scalaire des vecteurs $\mathbf{a}$ et $\mathbf{b}$                                       |
| $\mathbf{a}\otimes\mathbf{b}$ | Produit tensoriel (ou dyadique) des vecteurs $\mathbf{a}$ et $\mathbf{b}$                        |
| $\mathbf{a}\times\mathbf{b}$  | Produit vectoriel des vecteurs $\mathbf{a}$ et $\mathbf{b}$                                      |
| $\mathbf{A}:\mathbf{B}$       | Produit doublement contracté des deux tenseurs $\mathbf{A}$ et $\mathbf{B}$                      |
| $\mathbf{A}^{T}$              | Transposée d'une matrice ou d’un vecteur                                                         |
| $\dot \square$                | Dérivée temporelle de la quantité $\square$                                                      |
| $\ddot \square$               | Dérivée seconde en temps de la quantité $\square$                                                |
| $\mathsf{tr}\,\square$        | Trace d’une matrice ou d’un tenseur $\square$ ($\mathsf{tr}\,\mathbf{A} = \sum \mathbf{A}_{ii}$) |
| $\delta_{ij}$                 | Symbole de Kronecker                                                                             |
| $\mathbf{I}$                  | Matrice unité ou tenseur d’ordre deux                                                            |
| $\mathbb{I}$                  | Tenseur unité d’ordre quatre                                                                     |

**Mécanique des milieux continus**

| Notation                             | Description                                                                      |
| ------------------------------------ | -------------------------------------------------------------------------------- |
| $t_0$                                | Temps initial (configuration de référence)                                       |
| $t$                                  | Temps courant                                                                    |
| $\Omega$                             | Domaine arbitraire                                                               |
| $\partial\Omega$                     | Bord du domaine $\Omega$                                                         |
| $\mathbf{X}$                         | Coordonnées matérielles à $t_0$                                                  |
| $\mathbf{x}$                         | Coordonnées matérielles à l’instant $t$                                          |
| $\mathbf{F}$                         | Gradient de déformation                                                          |
| $\mathbf{C}$                         | Tenseur de Cauchy-Green à droite                                                 |
| $\mathbf{R}$                         | Tenseur de rotation                                                              |
| $\mathbf{U}$                         | Tenseur d’élongation                                                             |
| $\mathbf{L}$                         | Gradient de vitesse                                                              |
| $\mathbf{D}$                         | Tenseur des taux de déformation                                                  |
| $\mathbf{\omega}$                    | Tenseur de rotation instantanée                                                  |
| $\mathbf{E}$                         | Tenseur de Green-Lagrange                                                        |
| $\mathbf{S}$                         | Tenseur des contraintes de Piola-Kirchhoff (premier ou second selon le contexte) |
| $\mathbf{\sigma}$                    | Tenseur des contraintes de Cauchy                                                |
| $\mathbf{\sigma}^{\bigtriangledown}$ | Taux de Jaumann                                                                  |
| $\mathbf{\sigma}^{\bigtriangleup}$   | Taux de Green-Naghdi                                                             |
| $\mathbb{C}$                         | Tenseur d’élasticité du matériau                                                 |
| $\mathbb{f}_v$                       | Force volumique                                                                  |
| $\mathbb{t}$                         | Force surfacique                                                                 |

**Analyse par éléments finis**

| Notation                         | Description                       |
| -------------------------------- | --------------------------------- |
| $\Delta t^n$                     | Pas de temps au n-ième instant    |
| $\mathbf{M}$                     | Matrice de masse                  |
| $\mathbf{C}^{d}$                 | Matrice d’amortissement           |
| $\mathbf{f}_{int}$               | Vecteur des forces internes       |
| $\mathbf{f}_{ext}$               | Vecteur des forces externes       |
| $\mathbf{u}$                     | Vecteur des déplacements nodaux   |
| $\mathbf{v} = \dot{\mathbf{u}}$  | Vecteur des vitesses nodales      |
| $\mathbf{a} = \ddot{\mathbf{u}}$ | Vecteur des accélérations nodales |
