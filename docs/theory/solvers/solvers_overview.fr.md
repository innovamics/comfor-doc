## Schéma de résolution utilisé : dynamique explicite

**Comfor** utilise un schéma d'intégration explicite pour résoudre les équations
du mouvement. Ce type de schéma permet une résolution incrémentale
conditionnelle des problèmes dynamiques, où les grandeurs mécaniques
(déplacements, vitesses, accélérations) sont calculées étape par étape dans le
temps, sans résolution globale de système linéaire à chaque incrément.

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

Pour appliquer un schéma d’intégration temporelle, le temps est discrétisé en
incréments $\Delta t$, appelés pas de temps. L’équation de la dynamique devient
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

Soit l’intervalle temporel de simulation $[t_0, t_e]$ subdivisé en $n_e$ pas de
temps $\Delta t^n$. L’instant $t^n$ est défini par :

$$
t^n = t_0 + \sum_{i=1}^{n} \Delta t^i
$$

Sans perte de généralité, on pose $t_0 = 0$. La position d’un point matériel
$\mathbf{x}$ à l’instant $t^{n+1}$ est donnée par :

$$
\mathbf{x}^{n+1} = \mathbf{x}^n + \mathbf{u}^{n+1}
$$

où $\mathbf{u}^{n+1}$ est le vecteur déplacement au temps $t^{n+1}$.

Ce déplacement est intégré à partir de la vitesse évaluée à l’instant
intermédiaire $t^{n+1/2} = t^n + \frac{1}{2} \Delta t^{n+1}$ :

$$
\mathbf{u}^{n+1} = \mathbf{u}^n + \Delta t^{n+1} \, \mathbf{v}^{n+1/2}
$$

La vitesse $\mathbf{v}^{n+1/2}$ est dite _décalée_ (ou _staggered_). Elle est
intégrée à partir de l’accélération connue à l’instant $t^n$ :

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

Ce schéma est **conditionnellement stable**, c’est-à-dire que la stabilité
dépend du pas de temps utilisé. Un pas trop grand entraîne une divergence de la
solution. La condition de stabilité impose :

$$
\Delta t \leq \alpha \, \Delta t_{\text{crit}} = \frac{2}{\omega_{\text{max}}}
$$

où :

- $\omega_{\text{max}}$ est la fréquence propre maximale du système (issue d'une
  analyse modale),
- $\alpha$ est un facteur de sécurité (généralement compris entre 0,8 et 0,95).

Afin d’éviter le calcul direct des valeurs propres, une estimation peut être
faite par analogie avec la première fréquence propre d’une barre élastique en
vibration longitudinale de longueur $l$ :

$$
\omega = \frac{2}{l} \sqrt{\frac{E}{\rho}} = \frac{2c}{l}
\quad \Rightarrow \quad
\Delta t_{\text{crit}} = \f---rac{l}{c}
$$

En deux ou trois dimensions, on utilise une longueur caractéristique $l_e$ et
une vitesse d’onde $c_e$ propre à chaque élément :

$$
\Delta t = \alpha \min_{e} \left( \frac{l_e}{c_e} \right)
$$

Valeurs typiques de $\alpha$ :

- $\alpha = 0.9$ pour des simulations standards,
- $\alpha = 0.25$ à $0.50$ pour des cas hautement transitoires (ondes de choc,
  explosifs).

## Schéma de Newmark

Le schéma de Newmark $\beta_2$ repose sur un développement en série de Taylor
des déplacements, tronqué à l’ordre deux ou trois selon les paramètres $\beta$
et $\gamma$ :

$$
\begin{aligned}
\mathbf{u}^{n+1} &= \mathbf{u}^{n} + \Delta t\,
\mathbf{v}^{n} + \frac{1}{2} \Delta t^2\, \mathbf{a}^{n} + \beta\, \frac{1}{2}
\Delta t^2 \left( \mathbf{a}^{n+1} - \mathbf{a}^{n} \right) \\
\mathbf{v}^{n+1} &= \mathbf{v}^{n} + \Delta t\,
\mathbf{a}^{n} + \gamma\, \Delta t \left(
\mathbf{a}^{n+1} - \mathbf{a}^{n} \right)
\end{aligned}
$$

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

L’accélération au pas $n+1$ est obtenue à partir de l’équation d’équilibre dynamique :

$$
\mathbf{a}^{n+1} = - \mathbf{A}^{-1} \left( \mathbf{f}_{\text{ext}}^{n+1} +
\mathbf{C}^{d} \tilde{\mathbf{v}}^{n+1} + \mathbf{K} \tilde{\mathbf{u}}^{n+1} \right)
$$

avec :

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
  linéaires.
- d'améliorer la précision sur les basses fréquences.

En revanche, les **schémas explicites** sont préférés dans des contextes
fortement non linéaires (grands déplacements, contact, onde de choc), car ils
permettent de s'affranchir de la résolution itérative au prix d’un pas de temps
plus petit.

## Matrice de masse lumpée

En dynamique explicite, les matrices de masse et d’amortissement sont souvent
supposées diagonales pour simplifier les calculs. On utilise une **condensation
de masse** (_mass lumping_[@ZIE05a]), consistant à répartir la masse totale de
chaque ligne sur sa diagonale :

$$
\tilde{M}_{ii} = \sum_j M_{ij}
$$

Cette approximation permet une inversion locale rapide, sans perte significative
de précision car les termes hors-diagonale sont généralement faibles et associés
à des degrés de liberté géométriquement proches[@BON08]. La perte de précision
est largement compensée par le gain en performance.

L’amortissement est souvent défini par un modèle simplifié de Rayleigh :

$$
\mathbf{C}^{d} = \alpha \mathbf{M}
$$

où $\alpha$ est un coefficient choisi pour modéliser une dissipation d’énergie
globale.

# References

\bibliography
