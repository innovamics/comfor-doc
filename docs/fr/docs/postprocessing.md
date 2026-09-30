<style>
  .md-sidebar--secondary .md-nav__list .md-nav__list .md-nav__item .md-nav {
    display: none !important;
  }

  .md-typeset td:first-child, .md-typeset th:first-child {
    white-space: nowrap;
  }
</style>

# Post-traitement

Après l'exécution réussie d'une simulation COMFOR, les résultats sont disponibles dans différents formats pour l'analyse et la visualisation. Cette section explique comment accéder à vos résultats, les visualiser et les analyser.

---

## Fichiers de Résultats Générés

### Structure des Répertoires

Pour un fichier d'entrée `simulation.toml` avec une sortie nommée `fields` et deux trackers nommés `PunchForce` et `CenterPosition` :

```
Dossier_Projet/
├── simulation.toml              # Fichier d'entrée
├── simulation.md                # Journal du job
└── Results_simulation/          # Racine des résultats (ou le chemin donné avec -o)
    ├── manifest.toml            # Statut du calcul et liste des fichiers
    ├── fields/                  # Un dossier par [[output]], portant son nom
    │   ├── fields_000000.vtu
    │   ├── fields_000001.vtu
    │   └── ...
    ├── PunchForce.csv           # Un fichier CSV par [tracker], portant son nom
    └── CenterPosition.csv
```

- Les frames sont écrites toutes les [`frequency`](preprocessing.md#sorties_output) unités de temps et numérotées sur 6 chiffres, à partir de `000000` (état initial).
- Lorsque plusieurs blocs `[[output]]` sont définis, chacun écrit dans son propre dossier.

### Manifeste du Calcul

`manifest.toml` est mis à jour pendant le calcul. Son `status` vaut `running` pendant la simulation, puis `completed` ou `failed`. Il liste aussi chaque fichier écrit (chemin, format et taille) :

```toml
schema_version = 1
status = 'completed'

[[artifacts]]
channel_id = 'fields'
format = 'vtu'
path = 'fields/fields_000000.vtu'
size = 34305
```

Vérifier `status = 'completed'` est un moyen simple de s'assurer, dans un script, qu'une simulation s'est terminée normalement.

### Journal du Job

Le journal du job `simulation.md` est un fichier Markdown écrit à côté du fichier d'entrée. Il contient les informations du fichier, le rapport de validation (avec la liste des erreurs le cas échéant), le résumé du modèle et les énergies affichées à chaque frame de sortie. Voir [Exécution](analysis.md#fichiers_generes).

---

## Formats de Sortie

### Format VTU (Recommandé)

[VTU (XML Unstructured Grid)](https://docs.vtk.org/en/latest/vtk_file_formats/vtkxml_file_format.html#unstructuredgrid){:target="_blank"} est le format de sortie **recommandé** pour COMFOR. Le format VTK historique reste pris en charge. Ces deux formats sont des standards pour la visualisation scientifique.

| Caractéristique | VTU | VTK (historique) |
| :--- | :---: | :---: |
| Encodage `ASCII` | Oui | Oui |
| Encodage `BINARY` (compressé zlib) | Oui | Non |
| Tenseurs de contraintes/déformations | Tableaux à 6 composantes | Un scalaire par composante |
| Résultats composites (fibres, cisaillement, résultantes) | Oui | Non |

**Exemple de configuration :**

```toml
[[output]]
name = "fields"
type = "VTU"
format = "BINARY"  # ou "ASCII"
frequency = 0.1    # Écriture toutes les 0.1 unités de temps
```

!!! tip "Recommandation"
    Utilisez **BINARY** pour les simulations de production afin de réduire la taille des fichiers. Utilisez **ASCII** pour inspecter les fichiers avec un éditeur de texte.

---

## Données Incluses dans les Fichiers VTU

### Données Nodales (Point Data)

| Donnée | Composantes | Description |
| :--- | :---: | :--- |
| `Displacement` | 3 | Déplacement $[u_x, u_y, u_z]$ |
| `Velocity` | 3 | Vitesse $[v_x, v_y, v_z]$ |
| `Acceleration` | 3 | Accélération $[a_x, a_y, a_z]$ |
| `Force` | 3 | Force nodale résultante |
| `ContactForce` | 3 | Force de contact nodale |
| `SlidingVelocity` | 3 | Vitesse de glissement du contact |

Les coordonnées des nœuds sont stockées comme points du maillage (`Position` dans le fichier).

### Données Élémentaires (Cell Data)

| Donnée | Composantes | Description |
| :--- | :---: | :--- |
| `MaterialID` | 1 | Identifiant du matériau |
| `PartID` | 1 | Identifiant de la pièce (ordre des blocs `part`) |
| `PartInstanceID` | 1 | Identifiant de l'instance au sein d'une pièce (voir [`pattern`](preprocessing.md#piece_part)) |
| `Stress` | 6 | Tenseur des contraintes dans le repère local de l'élément |
| `Strain` | 6 | Tenseur des déformations dans le repère local de l'élément |
| `FiberStress` | 2 | Contrainte dans les directions chaîne et trame (matériaux composites) |
| `FiberStrain` | 2 | Déformation dans les directions chaîne et trame (matériaux composites) |
| `ShearAngle` | 1 | Angle de cisaillement plan entre les directions de fibres (matériaux composites) |
| `ShearStress` | 1 | Contrainte de cisaillement plan (matériaux composites) |
| `ResultantN` | 3 | Efforts résultants de membrane (sections coques) |
| `ResultantM` | 3 | Moments résultants de flexion (sections coques) |
| `ResultantQ` | 2 | Efforts tranchants résultants (sections coques) |

Les valeurs qui ne s'appliquent pas à un type d'élément sont écrites à zéro.

### Composantes des Tenseurs

`Stress` et `Strain` sont stockés avec 6 composantes, dans cet ordre :

| Indice | Composante | Description |
| :---: | :--- | :--- |
| 0 | `C11` | Normale dans la direction 1 |
| 1 | `C22` | Normale dans la direction 2 |
| 2 | `C33` | Normale dans la direction 3 |
| 3 | `C12` | Cisaillement dans le plan 1-2 |
| 4 | `C13` | Cisaillement dans le plan 1-3 |
| 5 | `C23` | Cisaillement dans le plan 2-3 |

!!! warning "Noms des composantes dans ParaView"
    ParaView nomme les tableaux à 6 composantes selon sa propre convention de tenseur symétrique (`XX`, `YY`, `ZZ`, `XY`, `YZ`, `XZ`). Utilisez l'indice ci-dessus pour identifier une composante : par exemple la 5e composante (indice 4) est `C13`, même si ParaView la nomme `YZ`.

Dans les fichiers VTK historiques, chaque composante est écrite comme un scalaire séparé : `E11` ... `E23` pour la déformation et `S11` ... `S23` pour la contrainte.

---

## Visualisation avec ParaView

[ParaView](https://www.paraview.org/){:target="_blank"} est l'outil de visualisation **recommandé** pour les résultats de COMFOR.

### Charger les Fichiers

Cliquez sur **File → Open** et naviguez jusqu'au dossier de votre sortie (par ex. `Results_simulation/fields/`). Comme **COMFOR** nomme les fichiers par ordre croissant (`fields_..vtu`), ParaView propose automatiquement de les ouvrir comme un **groupe de fichiers** (série temporelle).

<div style="text-align:center;">
    <figure>
        <img src="../../assets/img/open_vtk.gif" alt="Chargement des fichiers dans ParaView">
        <figcaption>Chargement des fichiers</figcaption>
    </figure>
</div>

### Lire l'Animation

Après ouverture, les fichiers apparaissent dans le **Pipeline Browser**. Cliquez sur le bouton **Apply** de la section Properties pour afficher le maillage.

!!! tip "Astuce"
    Pour gagner du temps, activez **Auto Apply** dans *Edit → Settings → General → Properties Panel Options*.

Pour lire l'animation, utilisez le bouton **Play** de la barre VCR. Vous pouvez naviguer image par image, lire en boucle ou aller directement à un instant donné avec la barre de temps.

La donnée affichée se choisit dans le menu **Coloring** du panneau Properties. Vous pouvez visualiser des données nodales (par ex. `Displacement`) ou élémentaires (par ex. `Stress`, `ShearAngle`), et choisir la composante ou la norme.

<div style="text-align:center;">
    <figure>
        <img src="../../assets/img/play_vtk.gif" alt="Lecture de l'animation">
        <figcaption>Lecture de l'animation</figcaption>
    </figure>
</div>

!!! info "Géométrie déformée"
    Les points du maillage sont écrits à leur position **courante** : la géométrie affichée dans ParaView est déjà la géométrie déformée. Le champ `Displacement` peut servir à colorer le maillage, ou être utilisé avec le filtre **`Warp By Vector`** pour amplifier la déformation.

### Appliquer des Filtres

ParaView propose un large éventail de [filtres](https://docs.paraview.org/en/latest/Tutorials/ClassroomTutorials/beginningSourcesAndFilters.html){:target="_blank"} pour traiter et analyser les données de simulation. Les filtres peuvent être empilés dans le Pipeline Browser pour combiner leurs effets.

Filtres couramment utilisés pour les simulations **COMFOR** :

| Filtre | Utilisation |
| :--- | :--- |
| **`Threshold`** | Extraire les éléments dont la valeur est dans une plage (par ex. `PartID` pour isoler une pièce, ou `ShearAngle` pour trouver les zones fortement cisaillées) |
| **`Connectivity`** | Identifier les régions connexes, par ex. pour séparer les outils des plaques composites |
| **`Cell Data to Point Data`** | Moyenner les données élémentaires aux nœuds (cartes de couleurs plus lisses) |
| **`Warp By Vector`** | Amplifier une déformation à partir d'un champ vectoriel |
| **`Temporal Interpolator`** | Interpoler entre les frames, pour des animations fluides |
| **`Plot Data Over Time`** | Tracer l'évolution temporelle d'une sélection |
| **`Plot Data`** | Tracer des tableaux de données, par ex. le contenu d'un fichier CSV de tracker |

<div style="text-align:center;">
    <figure>
        <img src="../../assets/img/filter_vtk.gif" alt="Application de filtres">
        <figcaption>Application de filtres</figcaption>
    </figure>
</div>

---

## Fichiers CSV (Trackers)

Les [trackers](modules/trackers.md) enregistrent l'historique temporel de variables spécifiques dans des fichiers **CSV**, un fichier par tracker : `<racine_résultats>/<nom_tracker>.csv`. Une ligne est écrite à chaque écriture d'une frame de sortie.

### Format des Fichiers CSV

- **Ligne d'en-tête** : `Time`, une colonne par entité suivie, puis `Total`
- **Séparateur** : virgule suivie d'un espace (`, `)
- **Total** : somme des valeurs de toutes les entités suivies

**Exemple (tracker NODE, `variable = "FORCE"`, `direction = "Z"`) :**

```csv
Time, Node 101, Node 102, Node 103, Total
0, 0, 0, 0, 0
0.1, 50.2, 48.7, 52.1, 151
0.2, 100.5, 95.3, 105.8, 301.6
```

**Exemple (tracker ELEMENT, `variable = "STRESS"`, `component = "C11"`) :**

```csv
Time, Element 50, Element 51, Element 52, Total
0, 0, 0, 0, 0
0.1, 15.2, 18.1, 14.5, 47.8
0.2, 20.1, 22.5, 19.8, 62.4
```

### Analyse des CSV avec Python

```python
import pandas as pd
import matplotlib.pyplot as plt

# skipinitialspace supprime l'espace après chaque virgule
df = pd.read_csv('Results_simulation/PunchForce.csv', skipinitialspace=True)

plt.plot(df['Time'], df['Total'], label='Force du poinçon')
plt.xlabel('Temps')
plt.ylabel('Force')
plt.grid(True)
plt.legend()
plt.show()
```

**Courbe force-déplacement**, avec un tracker `NODE` sur la force du poinçon et un tracker `POSITION` sur un nœud du poinçon :

```python
force = pd.read_csv('Results_simulation/PunchForce.csv', skipinitialspace=True)
position = pd.read_csv('Results_simulation/PunchPosition.csv', skipinitialspace=True)

# Déplacement du poinçon depuis sa position initiale
displacement = position['Total'].iloc[0] - position['Total']

plt.plot(displacement, force['Total'])
plt.xlabel('Déplacement du poinçon')
plt.ylabel('Force du poinçon')
plt.show()
```

Les trackers correspondants :

```toml
[tracker.PunchForce]
type = "NODE"
variable = "FORCE"
direction = "Z"
set = "PunchNodes"

[tracker.PunchPosition]
type = "NODE"
variable = "POSITION"
direction = "Z"
nodes = [50]
```

Les fichiers CSV peuvent aussi être ouverts directement dans ParaView (avec le filtre **Plot Data**), Excel ou LibreOffice Calc.

---

## Dépannage

| Problème | Solution |
| :--- | :--- |
| Pas de série temporelle détectée dans ParaView | Ouvrir les fichiers depuis le dossier de la sortie (`Results_<nom>/<nom_output>/`) et sélectionner le groupe `..vtu` |
| Une composante de contrainte/déformation n'est pas celle attendue | Utiliser l'indice de la composante, pas le libellé ParaView (voir [Composantes des Tenseurs](#composantes_des_tenseurs)) |
| Les champs composites sont nuls | `FiberStress`, `ShearAngle`, etc. ne sont calculés que pour les matériaux composites |
| `KeyError: 'Total'` avec pandas | Utiliser `skipinitialspace=True` dans `read_csv` |
| Le `status` de `manifest.toml` est `failed` | Lire l'erreur à la fin du journal du job (`<nom_entrée>.md`) |

---

## Ressources

Pour une formation approfondie à ParaView, consultez ces ressources :

  - [Tutoriel officiel ParaView](https://www.paraview.org/Wiki/The_ParaView_Tutorial){:target="\_blank"}
  - [Documentation ParaView](https://docs.paraview.org/){:target="\_blank"}
  - [Cyprien Rusu - ParaView for FEA](https://youtube.com/playlist?list=PLvkU6i2iQ2fpcVsqaKXJT5Wjb9_ttRLK-){:target="\_blank"}
