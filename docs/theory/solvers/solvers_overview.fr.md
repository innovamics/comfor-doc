## Schéma de résolution utilisé : dynamique explicite

**Comfor** utilise un schéma d'intégration explicite pour résoudre les équations
du mouvement. Ce type de schéma permet une résolution incrémentale
conditionnelle des problèmes dynamiques, où les grandeurs mécaniques
(déplacements, vitesses, accélérations) sont calculées étape par étape dans le
temps, sans inversion globale de matrice.

L’équation générale de la dynamique, valable à tout instant, s’écrit sous la
forme :

$$
\mathbf{M} \mathbf{a} + \mathbf{C}^{d} \mathbf{v} + \mathbf{f}_{\text{int}} =
\mathbf{f}_{\text{ext}}
$$

où :

- $\mathbf{M}$ est la matrice de masse (généralement diagonalisée),
- $\mathbf{C}^d$ est la matrice d’amortissement,
- $\mathbf{a}$, $\mathbf{v}$ représentent respectivement l’accélération et la
  vitesse du système,
- $\mathbf{f}_{\text{int}}$ est le vecteur des efforts internes,
- $\mathbf{f}_{\text{ext}}$ est le vecteur des efforts appliqués.

Pour appliquer un schéma d’intégration temporelle, on commence par discrétiser
le temps en incréments $\Delta t$, appelés pas de temps. L’équation devient
alors, à l’instant $t^i$ :

$$
\mathbf{M} \mathbf{a}^i + \mathbf{C}^d \mathbf{v}^i +
\mathbf{f}_{\text{int}}^i = \mathbf{f}_{\text{ext}}^i
$$


## Schéma des différences centrées

Le schéma des différences centrées est la méthode d’intégration explicite
actuellement implémentée dans **Comfor**. Il est basé sur les formules
classiques des différences centrées appliquées à la vitesse et à l’accélération
[@BEL14] [@BEN17].


Soit l’intervalle de temps de la simulation $[t_0, t_e]$ subdivisé en $n_e$ pas
de temps $\Delta t^n$. L’instant $t^n$ est défini par :

$$
t^n = t_0 + \sum_{i=1}^{n} \Delta t^i
$$

Sans perte de généralité, on pose $t_0 = 0$. La position d’un point matériel
$\mathbf{x}$ à l’instant $t^{n+1}$ est exprimée comme :

$$
\mathbf{x}^{n+1} = \mathbf{x}^n + \mathbf{u}^{n+1}
$$

où $\mathbf{u}^{n+1}$ est le vecteur déplacement au temps $t^{n+1}$

Le vecteur déplacement à l'instant $t^{n+1}$ est intégré à partir des vitesses
évaluées à $t^{n+1/2} = t^n + \frac{1}{2} \Delta t^{n+1}$ :

$$
\mathbf{u}^{n+1} = \mathbf{u}^n + \Delta t^{n+1} \, \mathbf{v}^{n+1/2}
$$

La vitesse $\mathbf{v}^{n+1/2}$ est une **vitesse évaluée à un demi‑pas de
temps** (_staggered_). Elle est calculée à partir de l’accélération au temps
$t^n$ :

$$
\mathbf{v}^{n+1/2} = \mathbf{v}^{n-1/2} + \Delta t^{n+1/2} \, \mathbf{a}^n
$$

avec :

$$
\Delta t^{n+1/2} = \frac{\Delta t^n + \Delta t^{n+1}}{2}
$$

Enfin, l’accélération est déterminée par la résolution de l’équation d’équilibre
dynamique à $t^n$ :

$$
\mathbf{a}^n = \mathbf{M}^{-1} \left( \mathbf{f}_{\text{ext}}^n - 
\mathbf{f}_{\text{int}}^n - \mathbf{C}^d \mathbf{v}^{n-1/2} \right)
$$

Ce schéma est **conditionnellement stable**. Cela signifie qu’un pas de temps
trop grand peut conduire à une instabilité numérique. La condition de stabilité
impose :

$$
\Delta t \leq \alpha \, \Delta t_{\text{crit}} = \frac{2}{\omega_{\text{max}}}
$$

où :

- $\omega_{\text{max}}$ est la fréquence propre maximale du système,
- $\alpha$ est un facteur de sécurité (typiquement $\alpha = 0.9$).

Afin d’éviter le calcul direct des valeurs propres, une estimation est faite par
analogie avec une barre élastique de longueur $l$ :

$$
\omega = \frac{2}{l} \sqrt{\frac{E}{\rho}} = \frac{2c}{l}
\quad \Rightarrow \quad
\Delta t_{\text{crit}} = \frac{l}{c}
$$

En 2D et 3D, on utilise une longueur caractéristique élémentaire $l_e$ et une
vitesse d’onde $c_e$ propre à chaque élément. Le pas de temps global est alors
défini par :

$$
\Delta t = \alpha \min_{e} \left( \frac{l_e}{c_e} \right)
$$

Les valeurs usuelles pour $\alpha$ :

- $\alpha = 0.9$ pour les simulations standards,
- $\alpha = 0.25$ à $0.50$ pour des cas à haute fréquence comme les ondes de
  choc ou les explosifs.


## Schéma de Newmark

Le schéma de Newmark $\beta_2$ repose sur un développement en série de Taylor
des déplacements, tronqué à l'ordre de la dérivée troisième (jerk), avec des
coefficients de pondération $\beta$ et $\gamma$ :

$$
\begin{aligned} 
\mathbf{u}^{n+1} &= \mathbf{u}^{n} + \Delta t\,
\mathbf{v}^{n} + \frac{1}{2} \Delta t^2\, \mathbf{a}^{n} + \beta\, \frac{1}{2}
\Delta t^2 \left( \mathbf{a}^{n+1} - \mathbf{a}^{n} \right) \\ 
\mathbf{v}^{n+1} &= \mathbf{v}^{n} + \Delta t\, 
\mathbf{a}^{n} + \gamma\, \Delta t \left(
\mathbf{a}^{n+1} - \mathbf{a}^{n} \right) 
\end{aligned} $$

Ces équations peuvent être reformulées pour séparer les **termes de prédiction**
(utilisant uniquement les grandeurs connues à l’instant $n$) et les **termes de
correction**, dépendants de l'accélération à l'instant $n+1$ :

- **Étape de prédiction** :

$$
\begin{aligned}
\tilde{\mathbf{u}}^{n+1} &= \mathbf{u}^{n} + \Delta t \, 
\mathbf{v}^{n} + \frac{1}{2} \Delta t^2 (1 - \beta) \, \mathbf{a}^{n} \\
\tilde{\mathbf{v}}^{n+1} &= \mathbf{v}^{n} + \Delta t (1 - \gamma) \, \mathbf{a}^{n}
\end{aligned}
$$

- **Étape de correction** :

$$
\begin{aligned}
\mathbf{u}^{n+1} &= \tilde{\mathbf{u}}^{n+1} + \beta 
\frac{1}{2} \Delta t^2 \, \mathbf{a}^{n+1} \\
\mathbf{v}^{n+1} &= \tilde{\mathbf{v}}^{n+1} + \gamma \Delta t \, \mathbf{a}^{n+1}
\end{aligned}
$$

Le but est maintenant de déterminer $\mathbf{a}^{n+1}$ en imposant l’équilibre
dynamique au pas suivant. En réinjectant les prédictions dans l’équation du
mouvement, on obtient :

$$
\mathbf{a}^{n+1} = - \mathbf{A}^{-1} \left( \mathbf{f}_{\text{ext}}^{n+1} + \mathbf{C}^{d} \tilde{\mathbf{v}}^{n+1} + \mathbf{K} \tilde{\mathbf{u}}^{n+1} \right)
$$

où la matrice effective $\mathbf{A}$ du système dynamique est donnée par :

$$
\mathbf{A} = \mathbf{M} + \gamma \Delta t \, \mathbf{C}^{d} + \beta \Delta t^2 \, \mathbf{K}
$$


### Propriétés du schéma de Newmark

- Si $\beta = 0$ et $\gamma = \frac{1}{2}$ : on retrouve un schéma **explicite
  conditionnellement stable**, proche des différences centrées.
- Si $\beta \geq \frac{1}{4}(1 + \gamma)^2$ : le schéma devient
  **inconditionnellement stable** (utilisé pour les formulations implicites
  robustes).
- Le schéma de Newmark permet de moduler la **dissipation numérique** et la
  **stabilité** selon le choix de $\beta$ et $\gamma$.

Contrairement aux schémas purement explicites, le schéma de Newmark en
formulation implicite nécessite la résolution d’un système d’équations à chaque
pas de temps. Cela le rend plus coûteux en calcul, mais lui permet :

- d'accepter des pas de temps plus grands ;
- d’assurer la convergence numérique même en présence de comportements non
  linéaires (plasticité, contact) ;
- d'améliorer la précision sur les basses fréquences.

En revanche, les **schémas explicites** sont préférés dans des contextes
fortement non linéaires (grands déplacements, contact, onde de choc), car ils
permettent de s'affranchir de la résolution itérative au prix d’un pas de temps
plus petit.


## Matrice de masse lumpée

En dynamique explicite, les matrices de masse et d’amortissement sont prises
**diagonales**, ce qui permet une inversion très rapide. Une technique appelée
**condensation de masse** (*mass lumping*[@ZIE05a]) est utilisée. La
condensation de la matrice est faite en sommant sur la diagonale les termes
d'une même ligne :

$$
\tilde{M}_{ii} = \sum_j M_{ij}
$$

L'utilisation de la matrice diagonale permet d'accélérer le calcul, tout en étant
raisonnable puisque globalement ${M}_{ij} \neq 0$ est en faible nombre pour
chaque ligne $i$ et est associé à des degrés de libertés proches géométriquement
[@BON08].

La perte de précision est largement compensée par le gain en performance. De
plus, la matrice d’amortissement est souvent calculée à partir de la matrice de
masse via une forme particulière d’amortissement de Rayleigh :

$$
\mathbf{C}^{d} = \alpha \mathbf{M}
$$

où $\alpha$ est un coefficient d’amortissement choisi selon le comportement
viscoélastique du matériau. Cela permet de modéliser simplement la dissipation
d’énergie, tout en maintenant une structure diagonale favorable au calcul
explicite.

# References

\bibliography
