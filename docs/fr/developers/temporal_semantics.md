# Sémantique temporelle du solveur explicite

Cette page définit la signification temporelle des principales grandeurs
nodales utilisées par le solveur explicite. Elle complète la présentation
théorique du [schéma de résolution](../docs/theory/solvers/solvers_overview.md)
par le contrat de temporalité utilisé par l’implémentation.

Comfor utilise un **schéma de différences centrées à pas variable sous forme
leapfrog** :

- les positions, déplacements, rotations, efforts et accélérations vivent aux
  **instants entiers** `t^n`
- la vitesse principale est décalée sur les **demi-pas**
  `t^{n-1/2}` et `t^{n+1/2}`

## Contexte d’incrément

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

La première quantité est l’intervalle de kick utilisé pour mettre à jour la
vitesse décalée. La seconde est l’instant auquel les conditions limites de
vitesse au demi-pas sont appliquées.

## Temporalité des champs nodaux

Le solveur explicite utilise l’interprétation suivante :

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
- `velocity_at_n` est utilisée pour les sorties nodales et pour l’énergie
  cinétique

## Un incrément explicite

Un appel à `ExplicitSolver::solve()` fait avancer la solution de `t^n` à
`t^{n+1}`.

La séquence est la suivante :

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

## Temporalité des lois de comportement

Les mises à jour constitutives suivent deux schémas fréquents.

### Voie basée sur la configuration

Les matériaux et sections qui dépendent de la géométrie courante ou du gradient
de déformation sont évalués sur la configuration `d^n`. Ils assemblent donc
les contraintes et les efforts internes à l’instant `t^n`.

### Voie basée sur le taux

Les formulations dépendantes du taux utilisent la vitesse décalée à l’entrée de
l’incrément :

- `v^{n-1/2}`
- avec `Δt^{n-1/2}`

Cela définit l’incrément de déformation qui se ferme à `t^n`, puis sert à
assembler l’état d’effort `f^n`.

## Conventions de vitesse

- `velocity_half` est la grandeur cinématique principale de la mise à jour
  explicite
- `velocity_at_n` est la vitesse reconstruite au pas entier utilisée pour les
  sorties et l’évaluation énergétique

Il convient d’éviter d’introduire une grandeur `velocity` non qualifiée si sa
localisation temporelle n’est pas explicite.

## État initial

Avant le premier incrément :

- l’état nodal est réinitialisé sur la configuration de référence
- les conditions limites de vitesse prescrites à `t = 0` sont appliquées
- les conditions limites d’accélération prescrites à `t = 0` sont appliquées

Le premier état écrit correspond à cette configuration initialisée.

Les chargements pilotés par une accélération, comme la gravité, sont assemblés
pendant le premier incrément. La sortie écrite à `t = 0` correspond donc à un
état de référence initialisé, et non à un état dynamique entièrement assemblé
pour ces chargements.

## Temporalité des sorties

Comfor écrit :

- une sortie initiale à `t = 0`
- une sortie après chaque incrément résolu, selon la fréquence configurée

Chaque état écrit est étiqueté avec son temps convergé réel.

Les trackers de vitesse nodale utilisent la vitesse reconstruite au pas entier
`v^n`, et non la vitesse décalée au demi-pas.

## Diagnostics d’énergie

Le solveur explicite suit :

- l’énergie interne
- l’énergie externe
- l’énergie cinétique
- des indicateurs de résidu et de balance

Ces quantités sont utiles, mais la dissipation par amortissement et le travail
associé aux conditions cinématiques prescrites ne sont pas encore isolés comme
termes séparés.

## Résumé

Le contrat du solveur explicite peut être résumé ainsi :

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
