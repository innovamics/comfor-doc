# Sémantique temporelle du solveur explicite

Cette page décrit la manière dont le solveur explicite actuel de **Comfor**
interprète les grandeurs nodales dépendantes du temps. Elle complète la
présentation générale du [schéma de résolution](../docs/theory/solvers/solvers_overview.md)
par les conventions effectivement utilisées par l’implémentation.

Comfor utilise un **schéma de différences centrées à pas variable sous forme
leapfrog** :

- les positions, déplacements, rotations, efforts et accélérations vivent aux
  **instants entiers** `t^n`
- la vitesse principale est décalée sur les **demi-pas**
  `t^{n-1/2}` et `t^{n+1/2}`

## Grandeurs temporelles utilisées par le solveur

L’incrément courant est représenté par :

- `time_n` : temps courant du solveur `t^n`
- `dt_forward` : intervalle de dérive avant `Δt^{n+1/2}`
- `dt_backward` : intervalle de dérive précédent `Δt^{n-1/2}`

Deux quantités dérivées sont utilisées en permanence :

$$
\Delta t^n = \frac{1}{2}\left(\Delta t^{n-1/2} + \Delta t^{n+1/2}\right)
$$

et

$$
t^{n+1/2} = t^n + \frac{1}{2}\Delta t^{n+1/2}
$$

La première quantité est l’**intervalle de kick** utilisé pour mettre à jour la
vitesse décalée. La seconde est l’instant auquel les conditions limites de
vitesse au demi-pas sont appliquées.

## Principales grandeurs nodales

Le solveur explicite actuel utilise l’interprétation suivante :

| Grandeur | Signification | Instant |
|---|---|---|
| `position`, `displacement`, `rotation` | configuration courante | `t^n` |
| `velocity_half` | vitesse décalée | `t^{n-1/2}` à l’entrée, `t^{n+1/2}` après le kick |
| `velocity_at_n` | vitesse reconstruite au pas entier | `t^n` |
| `acceleration` | accélération de kick utilisée par le solveur | `t^n` |
| `internal_force`, `external_force`, `contact_force`, `total_force` | efforts nodaux assemblés | `t^n` |
| champs historiques `*_prev` | valeurs au pas précédent | `t^{n-1}` |

La distinction entre `velocity_half` et `velocity_at_n` est essentielle :

- `velocity_half` est utilisée par l’intégrateur explicite et par les mises à
  jour constitutives dépendantes du taux
- `velocity_at_n` est utilisée pour les sorties de vitesse nodale et pour
  l’énergie cinétique

## Séquence d’un incrément explicite

Un appel à `ExplicitSolver::solve()` fait avancer la solution de `t^n` à
`t^{n+1}`.

La séquence actuelle dans Comfor est la suivante :

1. choisir la valeur courante de `dt_forward`
2. assembler les efforts nodaux sur la configuration courante `d^n`
3. calculer les accélérations nodales à `t^n`
4. reconstruire la vitesse au pas entier `v^n`
5. évaluer les diagnostics d’énergie courants
6. sauvegarder l’état convergé au pas `n`, nécessaire pour l’incrément suivant
7. effectuer le kick de la vitesse au demi-pas avec `Δt^n`
8. appliquer les conditions limites de vitesse prescrites à `t^{n+1/2}`
9. dériver la configuration jusqu’à `d^{n+1}` avec `Δt^{n+1/2}`
10. sauvegarder l’historique des efforts
11. avancer l’horloge du solveur à `t^{n+1}`

## Assemblage des efforts et temporalité des lois de comportement

Les mises à jour constitutives dans Comfor suivent deux schémas fréquents.

### Mises à jour basées sur la configuration

Les matériaux et sections qui dépendent de la géométrie courante ou du gradient
de déformation sont évalués sur la configuration `d^n`. Ils assemblent donc
les contraintes et les efforts internes à l’instant `t^n`.

### Mises à jour basées sur le taux

Les formulations dépendantes du taux utilisent la vitesse décalée à l’entrée de
l’incrément :

- `v^{n-1/2}`
- avec `Δt^{n-1/2}`

Cela fournit l’incrément de déformation qui se ferme à `t^n`, puis sert à
assembler l’état d’effort `f^n`.

## Convention actuelle pour l’amortissement

Le solveur actuel utilise un **coefficient d’amortissement de Rayleigh nodal
proportionnel à la masse** `alpha`.

Cet amortissement est appliqué :

- au mouvement de translation
- au mouvement de rotation

L’accélération stockée dans les champs nodaux est l’**accélération algorithmique
de kick** utilisée par la mise à jour amortie en différences centrées. Elle ne
correspond donc pas simplement à la grandeur physique brute `M^{-1}f`.

Le kick amorti actuel utilise le dénominateur :

$$
1 + \frac{1}{2}\alpha \Delta t^n
$$

Les chargements de type accélération, comme la gravité, sont inclus dans le
second membre physique avant l’application de ce facteur d’amortissement.

## Reconstruction de la vitesse au pas entier

Le solveur fait avancer la vitesse au demi-pas puis reconstruit `v^n` pour les
grandeurs qui doivent être associées à l’état au pas entier.

Dans l’implémentation actuelle :

- `velocity_at_n` est la vitesse au pas entier utilisée pour les sorties
  nodales
- cette même vitesse reconstruite est utilisée dans l’évaluation de l’énergie
  cinétique

Lorsque l’amortissement est actif, cette vitesse reconstruite reste cohérente
avec la mise à jour algorithmique utilisée par le solveur.

## État initial à `t = 0`

Avant le premier incrément :

- l’état nodal est réinitialisé sur la configuration de référence
- les conditions limites de vitesse prescrites à `t = 0` sont appliquées
- les conditions limites d’accélération prescrites à `t = 0` sont appliquées

La première sortie écrite par le solveur correspond à cet état initialisé.

À ce stade, les chargements pilotés par une accélération, comme la gravité, ne
sont évalués qu’à l’intérieur du solveur pendant le premier incrément. La
sortie écrite à `t = 0` correspond donc à un état de référence initialisé, mais
pas encore à un état dynamique complètement assemblé pour ces chargements.

## Convention des sorties

Comfor écrit :

- une sortie initiale à `t = 0`
- puis une sortie après chaque incrément résolu, selon la fréquence configurée

La convention actuelle est la suivante :

- après résolution d’un incrément, l’état est écrit avec son **temps convergé
  réel**

Chaque étiquette temporelle correspond donc bien au temps de l’état réellement
écrit.

Les trackers qui rapportent la vitesse nodale utilisent la vitesse reconstruite
au pas entier `v^n`, et non la vitesse décalée au demi-pas.

## Diagnostics d’énergie

Le solveur explicite suit actuellement :

- l’énergie interne
- l’énergie externe
- l’énergie cinétique
- des indicateurs de résidu et de balance

Ces diagnostics sont utiles, mais doivent encore être interprétés avec
précaution :

- l’amortissement introduit une dissipation qui n’est pas encore séparée
  complètement dans le bilan actuel
- les conditions limites cinématiques prescrites peuvent injecter un travail
  qui n’est pas encore représenté par une contribution dédiée du travail externe

Pour cette raison, le journal public met actuellement en avant des grandeurs
simples comme l’énergie interne, l’énergie cinétique et `Ek/Ei (%)`.

## Limites actuelles

La sémantique temporelle décrite ici correspond au comportement actuel du
solveur. Certaines limites connues restent présentes :

- l’état écrit à `t = 0` n’est pas encore un état d’accélération complètement
  assemblé pour les chargements de type accélération
- le bilan d’énergie actuel reste incomplet pour l’amortissement et pour le
  travail des conditions cinématiques prescrites
- la régularisation de la masse et de l’inertie est un sujet séparé de
  robustesse, distinct du contrat temporel lui-même

## Résumé

Le solveur explicite actuel de Comfor peut être résumé ainsi :

- la géométrie et les efforts sont évalués aux instants entiers `t^n`
- la vitesse principale est stockée sur des demi-pas décalés
- un incrément assemble sur `d^n`, effectue le kick de la vitesse au demi-pas,
  puis dérive jusqu’à `d^{n+1}`
- les mises à jour dépendantes du taux utilisent `v^{n-1/2}` et
  `Δt^{n-1/2}`
- les sorties de vitesse nodale utilisent la vitesse reconstruite au pas entier
  `v^n`
- les sorties après résolution sont étiquetées avec le temps convergé réel de
  l’état

Il s’agit du comportement temporel suivi aujourd’hui par le solveur dynamique
explicite de Comfor.
