# Amortissement de Rayleigh explicite

Cette note résume la formulation d’amortissement de Rayleigh proportionnel à la
masse utilisée par le solveur explicite.

## Modèle d’amortissement

Comfor utilise le modèle de Rayleigh réduit à sa partie proportionnelle à la
masse :

$$
\mathbf{C}^d = \alpha \mathbf{M}
$$

où $\alpha$ est le coefficient d’amortissement nodal.

Le solveur explicite fait avancer la vitesse décalée avec un schéma en
différences centrées. Pour un pas variable, l’intervalle de kick vaut :

$$
\Delta t^n = \frac{1}{2}\left(\Delta t^{n-1/2} + \Delta t^{n+1/2}\right)
$$

## Mise à jour amortie en translation

À l’instant $t^n$, l’équilibre translationnel s’écrit :

$$
\mathbf{M}\mathbf{a}^n + \mathbf{C}^d \mathbf{v}^{n-1/2} = \mathbf{f}^n
$$

En utilisant $\mathbf{C}^d = \alpha \mathbf{M}$, on obtient :

$$
\mathbf{a}^n + \alpha \mathbf{v}^{n-1/2} = \mathbf{M}^{-1}\mathbf{f}^n
$$

Dans Comfor, les chargements de type accélération, comme la gravité, sont
assemblés dans le terme d’accélération physique :

$$
\mathbf{a}_{\mathrm{phys}}^n = \mathbf{M}^{-1}\mathbf{f}^n + \mathbf{a}_{\mathrm{load}}^n
$$

Le kick amorti s’écrit alors :

$$
\mathbf{a}_{\mathrm{alg}}^n =
\frac{\mathbf{a}_{\mathrm{phys}}^n - \alpha \mathbf{v}^{n-1/2}}
{1 + \frac{1}{2}\alpha \Delta t^n}
$$

La grandeur stockée par le solveur est donc l’accélération algorithmique
utilisée par le kick, et non seulement le terme physique non amorti.

## Mise à jour amortie en rotation

La même structure est appliquée au mouvement de rotation. Soient
$\boldsymbol{\omega}^{n-1/2}$ la vitesse angulaire décalée, $\mathbf{I}$ le
tenseur d’inertie nodal, et $\mathbf{m}^n$ le moment nodal. L’accélération
angulaire physique inclut le terme gyroscopique :

$$
\boldsymbol{\alpha}_{\mathrm{phys}}^n =
\mathbf{I}^{-1}\left(\mathbf{m}^n -
\boldsymbol{\omega}^{n-1/2} \times (\mathbf{I}\boldsymbol{\omega}^{n-1/2})\right)
+ \boldsymbol{\alpha}_{\mathrm{load}}^n
$$

Le kick amorti en rotation devient :

$$
\boldsymbol{\alpha}_{\mathrm{alg}}^n =
\frac{\boldsymbol{\alpha}_{\mathrm{phys}}^n - \alpha \boldsymbol{\omega}^{n-1/2}}
{1 + \frac{1}{2}\alpha \Delta t^n}
$$
