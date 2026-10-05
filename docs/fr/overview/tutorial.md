---
title: Tutoriel - Benchmark Double Dome
---

<style>
  .md-sidebar--secondary .md-nav__list .md-nav__list .md-nav__item .md-nav {
    display: none !important;
  }

  .md-typeset td:first-child, .md-typeset th:first-child {
    white-space: nowrap;
  }
</style>

# Tutoriel Complet : Benchmark Double Dome

Ce tutoriel vous guide pas à pas dans la création et l'exécution d'une simulation **Double Dome** avec COMFOR. Le benchmark Double Dome est un test standard dans la communauté de la mise en forme des composites, utilisé pour évaluer la capacité des codes de simulation à modéliser le formage de structures complexes en matériaux composites.

## Introduction au Benchmark Double Dome

### Qu'est-ce que le Double Dome ?

Le **Double Dome** (Double Dôme) est un benchmark numérique largement utilisé dans le domaine de la simulation de la mise en forme des matériaux composites. Il consiste en une plaque plane qui est formée en un double dôme par un poinçon central. Ce test permet d'évaluer :

- La capacité du code à gérer les grandes déformations
- La précision de la modélisation du comportement des matériaux composites
- La gestion du contact entre le poinçon, la matrice et la plaque
- La stabilité numérique pour des simulations explicites

### Configuration du Benchmark

| Paramètre | Valeur |
| :--- | :--- |
| **Matériau** | Composite textile (HYPERTEXTILE) |
| **Épaisseur de la plaque** | 1.0 mm |
| **Vitesse du poinçon** | 10 mm/s (atteinte après une rampe de 1 s) |
| **Course du poinçon** | 65 mm |
| **Durée de simulation** | 7 secondes |
| **Frottement** | Coefficient de Coulomb = 0.1 |

### Géométrie

- **Plaque** : Feuille textile plane, maillée en triangles à 3 nœuds
- **Poinçon** : Outil rigide en forme de double dôme
- **Matrice** : Cavité rigide correspondante

---

## Fichiers Nécessaires

Pour suivre ce tutoriel, vous aurez besoin des fichiers de maillage :

### Maillages Disponibles

COMFOR fournit deux versions du benchmark :

#### 1. Modèle Complet (Full)
- **Géométrie complète**, sans symétrie
- Contient : `die.inp`, `plate.inp`, `punch.inp`
- **Téléchargement** : [full/die.inp](../assets/tutorial/full/die.inp), [full/plate.inp](../assets/tutorial/full/plate.inp), [full/punch.inp](../assets/tutorial/full/punch.inp)

#### 2. Modèle Quart (Recommandé pour le tutoriel)
- **Simulations plus rapides** en exploitant la double symétrie du benchmark
- Contient : `die.inp`, `plate.inp`, `punch.inp`, `plate.msh`
- Taille : 1 892 nœuds et 3 492 éléments une fois les trois pièces assemblées
- **Téléchargement** : [quart/die.inp](../assets/tutorial/quart/die.inp), [quart/plate.inp](../assets/tutorial/quart/plate.inp), [quart/plate.msh](../assets/tutorial/quart/plate.msh), [quart/punch.inp](../assets/tutorial/quart/punch.inp)

!!! tip "Recommandation"
    Pour ce tutoriel, nous utilisons le modèle **quart** qui est plus rapide à exécuter tout en démontrant toutes les fonctionnalités.

---

## Étape 1 : Comprendre la Structure du Fichier TOML

Le fichier `double-dome.toml` est structuré en plusieurs blocs qui définissent la simulation complète. Examinons chaque section :

### Structure Globale

```
double-dome.toml
├── [model]          # Métadonnées de la simulation (informatives)
├── [control]        # Paramètres temporels
├── [output.*]       # Configuration de sortie (1)
├── [mesh.*]         # Sources de maillage (3)
├── [part.*]         # Composants physiques (3)
├── [set.*]          # Groupes d'entités (5)
├── [material.*]     # Lois de comportement (1)
├── [section.*]      # Propriétés physiques (2)
├── [[section_assignments]] # Associations (3)
├── [amplitude.*]    # Fonctions temporelles (1)
├── [constraint.*]   # Conditions aux limites (4)
├── [contact_behaviour.*] # Lois de contact (2)
└── [contact.*]      # Définition du contact (1)
```

---

## Étape 2 : Créer le Fichier d'Entrée

Créez un fichier `double-dome.toml` avec le contenu suivant. Nous allons expliquer chaque section en détail.

### Section 1 : Métadonnées du Modèle

```toml
# --- Model ---
[model]
name = "Double-dome"
author = "Innovamics"
date = "2026-08-05"
description = "Double-dome Benchmark"
```

Ce bloc est optionnel et purement informatif : il documente le modèle mais n'est pas utilisé par le solveur.

### Section 2 : Contrôle de la Simulation

```toml
# --- Control ---
[control]
run_from = 0.0
run_to = 7.0
```

- `run_from` : Temps de début (généralement 0.0)
- `run_to` : Temps final de la simulation (7 secondes pour la course complète du poinçon)

!!! info "Pas de temps"
    Le pas de temps n'est pas spécifié ici. COMFOR le calcule automatiquement en fonction des propriétés du maillage et des matériaux.

### Section 3 : Configuration de Sortie

```toml
# --- Output ---
[output.vtus]
type = "VTU"
frequency = 0.1
format = "BINARY"
```

| Paramètre | Valeur | Description |
| :--- | :--- | :--- |
| `vtus` | (nom) | Nom de la sortie, donné par l'en-tête de table `[output.vtus]`. Utilisé aussi comme nom du sous-dossier et des fichiers de résultats |
| `type` | `"VTU"` | Format de sortie (recommandé) |
| `frequency` | `0.1` | Écrire les résultats toutes les 0.1 secondes |
| `format` | `"BINARY"` | Format binaire pour des fichiers plus petits |

!!! tip "Dossier de sortie"
    Par défaut, les résultats sont écrits dans `Results_double-dome/`, à côté du fichier d'entrée. Les frames de cette sortie sont stockées dans `Results_double-dome/vtus/`.

### Section 4 : Importation des Maillages

```toml
# --- Mesh import ---
[mesh.punch]
type = "ABAQUS"
file = "quart/punch.inp"

[mesh.die]
type = "ABAQUS"
file = "quart/die.inp"

[mesh.plate]
type = "GMSH"
file = "quart/plate.msh"
```

**Explications :**
- **`punch`** : Poinçon hémisphérique (format Abaqus `.inp`)
- **`die`** : Matrice/cavité (format Abaqus `.inp`)
- **`plate`** : Plaque à former (format Gmsh `.msh`)

!!! warning "Chemin des fichiers"
    Les chemins relatifs des maillages sont résolus depuis le dossier contenant le fichier TOML. Assurez-vous que les fichiers de maillage sont dans un dossier `quart/` à côté de `double-dome.toml`, ou ajustez les chemins en conséquence.

### Section 5 : Définition des Pièces (Parts)

```toml
# --- Parts ---
[part.punch]
mesh = "punch"
element_mapping = { "S3" = "CONTACT_TRIANGLE" }
translation = [-1.0, -1.0, 10.0]

[part.die]
mesh = "die"
element_mapping = { "S3" = "CONTACT_TRIANGLE" }
translation = [-1.0, -1.0, 0.0]

[part.plate]
mesh = "plate"
element_mapping = { "2" = "DKT18" }
translation = [0.0, 0.0, 1.0]
```

**Explications :**

| Pièce | Maillage | Mapping | Translation | Rôle |
| :--- | :--- | :--- | :--- | :--- |
| `punch` | `punch` | S3 → CONTACT_TRIANGLE | [-1, -1, 10] | Poinçon mobile |
| `die` | `die` | S3 → CONTACT_TRIANGLE | [-1, -1, 0] | Matrice fixe |
| `plate` | `plate` | 2 → DKT18 | [0, 0, 1] | Plaque à former |

!!! note "Mapping d'éléments"
    Les clés de `element_mapping` sont les types d'éléments **tels qu'écrits dans le fichier de maillage** :

    - Les triangles Abaqus `S3` (lus comme `S3L_C0` par défaut) sont mappés en `CONTACT_TRIANGLE` pour le poinçon et la matrice (surfaces de contact rigides).
    - Les triangles Gmsh (type `2`, lus comme `MEMBRANE_3` par défaut) sont mappés en `DKT18` pour la plaque (triangle coque avec flexion).

    Voir le [bloc Mesh](../docs/preprocessing.md#maillage_mesh) pour les tables de traduction complètes.

!!! note "Translation"
    Les translations positionnent les pièces dans l'espace. Le poinçon commence au-dessus de la plaque (z=10.0), la plaque est à z=1.0 et la matrice en dessous (z=0.0).

### Section 6 : Définition des Sets (Groupes)

```toml
# --- Sets ---
[set.punchNodes]
type = "NODE"
part = "punch"

[set.punchElements]
type = "ELEMENT"
part = "punch"

[set.dieNodes]
type = "NODE"
part = "die"

[set.dieElements]
type = "ELEMENT"
part = "die"

[set.plateElements]
type = "ELEMENT"
part = "plate"

[set.plateXNodes]
type = "NODE"
part = "plate"
range = [1, 666, 35]

[set.plateYNodes]
type = "NODE"
part = "plate"
range = [1, 35, 1]
```

**Explications :**

| Set | Type | Part | Sélection | Utilisation |
| :--- | :--- | :--- | :--- | :--- |
| `punchNodes` | NODE | punch | Tous les nœuds | Contrainte de vitesse |
| `punchElements` | ELEMENT | punch | Tous les éléments | Assignation de section |
| `dieNodes` | NODE | die | Tous les nœuds | Contrainte fixe |
| `dieElements` | ELEMENT | die | Tous les éléments | Assignation de section |
| `plateElements` | ELEMENT | plate | Tous les éléments | Assignation de section |
| `plateXNodes` | NODE | plate | Nœuds 1, 36, 71,... | Contrainte en X |
| `plateYNodes` | NODE | plate | Nœuds 1-35 | Contrainte en Y |

!!! info "Sélection par plage"
    - `range = [1, 666, 35]` : Sélectionne les nœuds 1, 36, 71, 106, ... 666 (incrément de 35)
    - `range = [1, 35, 1]` : Sélectionne les nœuds 1 à 35 (incrément de 1)

### Section 7 : Matériaux

```toml
# --- Materials ---
[material.HyperTex]
type = "HYPERTEXTILE"
density = 1e-6
damping = 5.0
warp_orientation = [1.0, 0.0, 0.0]
weft_orientation = [0.0, 1.0, 0.0]
k_elong_warp = [100.0]
k_elong_weft = [100.0]
k_shear = [0.0185, 0.0464, -0.0213]
k_bend_warp = [5.0]
k_bend_weft = [5.0]
k_bend_twist = [0.0]
```

**Propriétés du Matériau Composite :**

| Paramètre | Valeur | Description |
| :--- | :--- | :--- |
| `type` | `"HYPERTEXTILE"` | Modèle de matériau composite |
| `density` | `1e-6` | Masse volumique (tonne/mm³) |
| `damping` | `5.0` | Amortissement de Rayleigh |
| `warp_orientation` | [1,0,0] | Direction des fibres de chaîne |
| `weft_orientation` | [0,1,0] | Direction des fibres de trame |
| `k_elong_warp` | [100.0] | Rigidité en traction (chaîne) |
| `k_elong_weft` | [100.0] | Rigidité en traction (trame) |
| `k_shear` | [0.0185, 0.0464, -0.0213] | Rigidité en cisaillement |
| `k_bend_warp` | [5.0] | Rigidité en flexion (chaîne) |
| `k_bend_weft` | [5.0] | Rigidité en flexion (trame) |
| `k_bend_twist` | [0.0] | Rigidité en torsion |

### Section 8 : Sections

```toml
# --- Sections ---
[section.toolSection]
type = "RIGID"
thickness = 2.0

[section.plateSection]
type = "SHELL_GENERALIZED"
material = "HyperTex"
thickness = 1.0

[[section_assignments]]
name = "AssignPunch"
section = "toolSection"
set = "punchElements"

[[section_assignments]]
name = "AssignDie"
section = "toolSection"
set = "dieElements"

[[section_assignments]]
name = "AssignPlate"
section = "plateSection"
set = "plateElements"
```

**Explications :**

| Section | Type | Matériau | Épaisseur | Utilisation |
| :--- | :--- | :--- | :--- | :--- |
| `toolSection` | RIGID | - | 2.0 mm | Pour le poinçon et la matrice (corps rigides) |
| `plateSection` | SHELL_GENERALIZED | HyperTex | 1.0 mm | Pour la plaque déformable |

**Assignations :**
- Le poinçon utilise `toolSection` (rigide)
- La matrice utilise `toolSection` (rigide)
- La plaque utilise `plateSection` (composite déformable)

### Section 9 : Amplitudes

```toml
# --- Amplitudes ---
[amplitude.punchAmplitude]
type = "TABULAR"
values = [[0.0, 0.0],
          [1.0, 1.0],
          [10.0, 1.0]]
```

**Explications :**
- `type = "TABULAR"` : Fonction définie par des points
- `values` : Paires [temps, valeur]
  - À t=0.0s : valeur = 0.0 (départ immobile)
  - À t=1.0s : valeur = 1.0 (vitesse pleine)
  - À t=10.0s : valeur = 1.0 (vitesse maintenue)

Cette amplitude est utilisée pour moduler la vitesse du poinçon.

### Section 10 : Contraintes (Conditions aux Limites)

```toml
# --- constraints ---
[constraint.fixX]
type = "BOUNDARY_CONDITION"
set = "plateXNodes"
vx = 0.0

[constraint.fixY]
type = "BOUNDARY_CONDITION"
set = "plateYNodes"
vy = 0.0
vrx = 0.0

[constraint.fixPunch]
type = "BOUNDARY_CONDITION"
set = "punchNodes"
vx = 0.0
vy = 0.0
vz = {value = -10.0, amplitude = "punchAmplitude" }

[constraint.fixDie]
type = "BOUNDARY_CONDITION"
set = "dieNodes"
preset = "FIXED"
```

**Explications :**

| Contrainte | Set | Degrés de liberté | Valeur |
| :--- | :--- | :--- | :--- |
| `fixX` | plateXNodes | vx | 0.0 (bloqué en X) |
| `fixY` | plateYNodes | vy, vrx | 0.0 (bloqué en Y et rotation X) |
| `fixPunch` | punchNodes | vx, vy | 0.0 (bloqué latéralement) |
| `fixPunch` | punchNodes | vz | -10.0 avec amplitude (vitesse vers le bas) |
| `fixDie` | dieNodes | tous | FIXED (complètement fixe) |

!!! note "Preset FIXED"
    Le preset `"FIXED"` bloque tous les degrés de liberté (vx, vy, vz, vrx, vry, vrz).

!!! info "Vitesse du poinçon"
    Le poinçon descend à une vitesse de 10 mm/s (négatif = vers le bas), modulée par l'amplitude qui passe de 0 à 1 pendant la première seconde. En 7 s, le poinçon parcourt donc 0.5 × 10 × 1 + 10 × 6 = 65 mm.

### Section 11 : Comportements de Contact

```toml
# --- Contact Behaviours ---
[contact_behaviour.PENALTY_GENERAL]
type = "LINEAR_PENALTY"
stiffness = 10.0

[contact_behaviour.COULOMB_GENERAL]
type = "COULOMB"
friction = 0.1
```

**Explications :**

| Comportement | Type | Paramètre | Valeur |
| :--- | :--- | :--- | :--- |
| `PENALTY_GENERAL` | LINEAR_PENALTY | stiffness | 10.0 (raideur de pénalité) |
| `COULOMB_GENERAL` | COULOMB | friction | 0.1 (coefficient de frottement) |

### Section 12 : Contact

```toml
# --- Contacts (General) ---
[contact.GENERAL_CONTACT]
type = "GENERAL"
normal = "PENALTY_GENERAL"
tangential = "COULOMB_GENERAL"
```

**Explications :**
- `type = "GENERAL"` : Contact général entre toutes les surfaces
- `normal = "PENALTY_GENERAL"` : Loi de contact normale (pénalité)
- `tangential = "COULOMB_GENERAL"` : Loi de contact tangentielle (frottement de Coulomb)

!!! info "Contact Général"
    Le contact général ne nécessite pas de définir de surfaces : les interactions sont détectées sur l'ensemble du modèle. Un seul contact `GENERAL` peut être défini par modèle.

---

## Étape 3 : Valider le Fichier

Avant d'exécuter la simulation, il est fortement recommandé de valider le fichier d'entrée :

```bash
comfor -j double-dome.toml --validate
```

**Sortie attendue** (après la bannière) :

```
 Logging job double-dome
 =======================================
 File info
  > File name: double-dome.toml
  > Extension: .toml
 Parse validation
  > Validation successful. No errors found.
 Exit Comfor
```

Les mêmes informations sont écrites dans `double-dome.md`, à côté du fichier d'entrée. Lorsque des erreurs sont trouvées, elles sont toutes listées dans ce fichier sous **Validation Errors**.

!!! warning "Portée de la validation"
    `--validate` vérifie la syntaxe, les paramètres obligatoires, les valeurs autorisées et l'unicité des noms. Certaines vérifications nécessitent la construction du modèle (par ex. la compatibilité élément/section, qui dépend de `element_mapping`) ; elles sont effectuées au démarrage de la simulation.

!!! warning "Résolution des erreurs"
    Si des erreurs sont rapportées :

    1. Vérifiez que tous les chemins des fichiers de maillage sont corrects
    2. Vérifiez que toutes les références existent (ex: `material.HyperTex` est référencé dans `section.plateSection`)
    3. Vérifiez que chaque bloc qui l'exige possède un nom (ex: `[output.vtus]`, ou `name = ...` dans `[[output]]` et `[[section_assignments]]`)

---

## Étape 4 : Exécuter la Simulation

Une fois la validation réussie, exécutez la simulation :

```bash
comfor -j double-dome.toml
```

**Options :**

- `-j double-dome.toml` : Spécifie le fichier d'entrée (obligatoire)
- `-o <chemin>` : Optionnel, écrit les résultats dans un autre répertoire (voir [Exécution](../docs/analysis.md))

**Sortie pendant l'exécution** (extrait) :

```
 Model info
  > Number of objects instances
   - Nodes: 1892
   - Elements: 3492
   ...
  > Automatic step time: true
   - Step time: 0.000446
 Running info
 =======================================
  > Writing output file 1
   - Elapsed time: 0.395195
   - Current time: 0.100326
   - Time step: 0.000446
   - Internal energy: 0.000000
   - Kinetic energy: 0.000000
   - Ek/Ei (%): ...
 =======================================
 ...
 =======================================
  > Writing output file 70
   - Elapsed time: 34.176837
   - Current time: 7.000105
   - Time step: 0.000273
   - Internal energy: 77.677680
   - Kinetic energy: 5.454920
   - Ek/Ei (%): 7.022506
 =======================================
 Solving took : 34.225519
 Exit Comfor
```

Un bloc est affiché à chaque écriture d'une frame de sortie (toutes les 0.1 s ici). En fin de mise en forme, l'énergie cinétique représente environ 7 % de l'énergie interne : la simulation reste quasi statique. Le pas de temps est calculé automatiquement et peut diminuer pendant la mise en forme, lorsque les éléments se distordent.

!!! info "Temps d'exécution"
    Avec le modèle quart, la simulation prend environ 30 secondes sur un ordinateur portable récent (exécution séquentielle).

!!! warning "Résultats existants"
    Le répertoire de résultats ne doit pas exister avant le calcul. Pour relancer le même fichier, supprimez `Results_double-dome/` ou utilisez `-o` pour choisir un autre répertoire.

---

## Étape 5 : Analyser les Résultats

### Structure des Résultats

Après l'exécution, les fichiers suivants sont disponibles :

```
double-dome.toml
double-dome.md                  # Journal du job
Results_double-dome/
├── manifest.toml               # Statut du calcul et liste des fichiers générés
└── vtus/                       # Un dossier par sortie (son nom)
    ├── vtus_000000.vtu
    ├── vtus_000001.vtu
    │   ... (1 fichier toutes les 0.1 secondes)
    └── vtus_000070.vtu
```

### Visualisation avec ParaView

1. **Lancer ParaView**
2. **Ouvrir les fichiers** : Sélectionnez le groupe `vtus_..vtu` dans `Results_double-dome/vtus/`
3. **Appliquer** : Cliquez sur le bouton Apply pour afficher le maillage

#### Visualisation de la Déformation

- Le maillage est écrit à sa position courante : la géométrie affichée est déjà la géométrie déformée
- Colorez-le avec `Displacement` (norme ou composante `Z`)
- Utilisez la barre VCR pour jouer l'animation

<figure>
  <img src="../../assets/img/deformed_vtk.gif" alt="Visualisation de la déformation">
  <figcaption>Plaque déformée en fin de simulation</figcaption>
</figure>

#### Visualisation du Renfort

- Sélectionnez `ShearAngle` pour voir le cisaillement plan du renfort (le résultat clé du benchmark double dôme)
- Sélectionnez `FiberStress` ou `FiberStrain` (2 composantes : chaîne et trame) pour voir la tension des fibres
- `FiberOrientationWarp` / `FiberOrientationWeft` donnent les directions courantes des fibres (par ex. avec le filtre **Glyph**)
- Ajustez l'échelle de couleurs pour voir la distribution

#### Sélection des Pièces

- Appliquez un filtre **`Threshold`** sur `PartID` pour n'afficher que la plaque (les outils la masquent en fin de mise en forme). Ici `PartID` vaut 0 pour la matrice, 1 pour la plaque et 2 pour le poinçon
- Les outils rigides n'ont ni contrainte ni déformation : leurs valeurs d'élément valent `NaN`, affichées par ParaView avec la *NaN color*

### Analyse des Trackers

Si vous ajoutez des trackers (non inclus dans cet exemple de base), un fichier CSV par tracker est écrit dans `Results_double-dome/` (ex: `Results_double-dome/PunchForce.csv`). Voir [Trackers](../docs/modules/trackers.md).

---

## Étape 6 : Interprétation des Résultats

### Vérification de la Simulation

1. **Statut du calcul** : `Results_double-dome/manifest.toml` doit contenir `status = 'completed'`
2. **Énergies** : Dans une simulation de mise en forme quasi statique, l'énergie cinétique doit rester faible devant l'énergie interne. Surveillez le rapport `Ek/Ei (%)` affiché à chaque sortie
3. **Pas de temps** : Doit rester stable (pas de réduction drastique)

### Problèmes Courants

| Problème | Cause | Solution |
| :--- | :--- | :--- |
| `Directory already exists` | Résultats d'un calcul précédent | Supprimer le répertoire de résultats ou utiliser `-o` |
| `assigned section must be of type ...` | Type d'élément et section incompatibles | Vérifier `element_mapping` (clés = types du fichier de maillage) et `section_assignments` |
| `Ek/Ei (%)` élevé | Effets dynamiques trop importants | Réduire la vitesse du poinçon ou augmenter `damping` |
| Simulation lente | Maillage trop fin ou petit pas de temps | Utiliser le modèle quart ou déraffiner le maillage |
| Pénétration du poinçon | Raideur de contact insuffisante | Augmenter `stiffness` dans `PENALTY_GENERAL` |

---

## Fichier Complet

Vous pouvez télécharger le fichier complet ici : [double-dome.toml](../assets/tutorial/double-dome.toml)

---

## Exercice : Personnaliser la Simulation

Essayez de modifier les paramètres suivants et observez les différences :

1. **Vitesse du poinçon** : Modifiez `vz = -10.0` à `-5.0` ou `-20.0`
2. **Amplitude** : Modifiez `punchAmplitude` pour avoir une accélération progressive
3. **Frottement** : Modifiez `friction = 0.1` à `0.0` ou `0.2`
4. **Raideur du matériau** : Modifiez `k_elong_warp` et `k_elong_weft`
5. **Épaisseur de la plaque** : Modifiez `thickness = 1.0` à `0.5` ou `2.0`

---

## Résumé

Vous avez maintenant :
- ✅ Compris le benchmark Double Dome
- ✅ Créé un fichier d'entrée TOML complet
- ✅ Importé des maillages externes (Abaqus, Gmsh)
- ✅ Défini des matériaux composites
- ✅ Configuré des contacts avec frottement
- ✅ Exécuté une simulation explicite
- ✅ Visualisé les résultats avec ParaView

Le benchmark Double Dome est un excellent point de départ pour explorer les capacités de COMFOR dans la simulation de la mise en forme des composites. Ce cas test est largement utilisé dans la communauté pour la validation et la comparaison des codes de simulation numérique [@SAR10;@KHA10;@HAR13a].

---

## Références

\bibliography

---

## Prochaines Étapes

- [ ] Essayer avec le modèle complet (`full/*.inp`) ; le poinçon complet utilise des éléments Abaqus `R3D3`, mappés avec `element_mapping = { "R3D3" = "CONTACT_TRIANGLE" }`
- [ ] Ajouter des trackers pour enregistrer la force du poinçon
- [ ] Modifier la géométrie pour créer un nouveau benchmark
- [ ] Essayer avec différents types de matériaux (ELASTIC, etc.)
- [ ] Explorer d'autres exemples dans la documentation
