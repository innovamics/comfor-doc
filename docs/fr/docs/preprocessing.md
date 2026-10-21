<style>
  .md-sidebar--secondary .md-nav__list .md-nav__list .md-nav__item .md-nav {
    display: none !important;
  }

  .md-typeset td:first-child, .md-typeset th:first-child {
    white-space: nowrap;
  }
</style>

COMFOR définit le modèle numérique à travers un fichier d'entrée structuré. Le logiciel intègre une architecture de parser modulaire [^1] supportant à la fois le standard moderne **TOML** (recommandé pour sa modularité et sa lisibilité) et le format hérité **Fembic** (maintenu pour la rétrocompatibilité).

Contrairement aux versions précédentes, COMFOR découple désormais la définition géométrique des propriétés physiques. Cela permet d'importer directement des fichiers de maillage externes au format **Abaqus (.inp)** ou **Gmsh (.msh)**, en plus des définitions **INLINE**.

De manière générale, un fichier d'entrée complet s'articule autour des piliers fondamentaux suivants :

- **Géométrie & Assemblage** : Définition des sources de maillage (`mesh`) et assemblage en composants physiques (`part`).
- **Propriétés Matérielles & Sections** : Lois de comportement (`material`) et propriétés de section (`section`) assignées aux éléments.
- **Conditions aux Limites** : Contraintes cinématiques (`constraint`) appliquées au modèle.
- **Charges** : Sollicitations externes (`load`) telles que des forces ponctuelles, des pressions ou des accélérations.
- **Contrôle de l'Analyse** : Plage temporelle de simulation, paramètres de pas de temps et fréquence d'export des résultats.

# Unités

COMFOR n'impose aucun système d'unités prédéfini. Vous pouvez utiliser n'importe quel système d'unités cohérent [voir cette référence](https://femci.gsfc.nasa.gov/units/index.html){:target="_blank"}. Les unités choisies doivent être homogènes afin que les équations de la mécanique fournissent directement des résultats corrects. Par exemple, pour la deuxième loi de Newton :

$$ \mathbf{f} = \mathbf{M} \mathbf{a} $$

Si la force est exprimée en newtons ($N$), la longueur en millimètres ($mm$) et le temps en secondes ($s$), l'unité d'accélération est le $mm/s^2$, et l'unité de masse doit impérativement être la tonne métrique ($kg \cdot 10^{3} = t$).

# Structure du fichier d'entrée

Le fichier de configuration est organisé en **Blocs**. Chaque bloc correspond à une catégorie de données spécifique (un label) et définit les propriétés d'un composant de la simulation.

<h4>Nommage</h4>
Tous les blocs nécessitent un **Nom**, sauf `control` et `solver`. Ce nom sert d'identifiant permettant aux différents modules de communiquer entre eux. Par exemple, si vous définissez un bloc `material` nommé `"Acier"`, le bloc `section` pourra ensuite référencer cet `"Acier"` pour charger la loi de comportement associée.

Les noms doivent être uniques au sein d'un même type de bloc (deux matériaux ne peuvent pas avoir le même nom, mais un set et une surface le peuvent). Certains noms servent aussi à nommer les fichiers de résultats : le nom d'un `output` est le nom de son dossier de résultats, et le nom d'un `tracker` est le nom de son fichier CSV.

<h4>Blocs Disponibles</h4>

| Bloc | Syntaxe | Requis | Multiple | Description |
| :--- | :--- | :---: | :---: | :--- |
| [`control`](#controle_control) | `[control]` | **Oui** | Non | Plage de temps et pas de temps de la simulation |
| [`solver`](#solveur_solver) | `[solver]` | Non | Non | Paramètres de l'intégration temporelle |
| [`output`](#sorties_output) | `[[output]]` | **Oui** | Oui | Fichiers de résultats (VTU/VTK) |
| [`mesh`](#maillage_mesh) | `[mesh.Nom]` | Oui* | Oui | Sources géométriques |
| [`part`](#piece_part) | `[part.Nom]` | Oui* | Oui | Composants physiques construits à partir des maillages |
| [`set`](#ensemble_set) | `[set.Nom]` | Non | Oui | Groupes de nœuds ou d'éléments |
| [`surface`](#surface) | `[surface.Nom]` | Non | Oui | Sets fusionnés utilisés par les contacts |
| [`material`](#materiau_material) | `[material.Nom]` | Non | Oui | Lois de comportement |
| [`section`](#section) | `[section.Nom]` | Non | Oui | Propriétés physiques (épaisseur, rayon...) |
| [`section_assignments`](#assignation_de_section_section_assignment) | `[[section_assignments]]` | Non | Oui | Associe les sections aux sets d'éléments |
| [`amplitude`](#amplitude) | `[amplitude.Nom]` | Non | Oui | Fonctions du temps |
| [`constraint`](#contrainte_constraint) | `[constraint.Nom]` | Non | Oui | Conditions aux limites |
| [`load`](#charge_load) | `[load.Nom]` | Non | Oui | Forces, pressions, accélérations volumiques |
| [`contact_behaviour`](#comportement_de_contact_contact_behaviour) | `[contact_behaviour.Nom]` | Non | Oui | Lois de contact normales et tangentielles |
| [`contact`](#contact) | `[contact.Nom]` | Non | Oui | Interactions de contact |
| [`tracker`](#tracker) | `[tracker.Nom]` | Non | Oui | Historiques temporels dans des fichiers CSV |

*Au moins un `mesh` et une `part` sont nécessaires pour définir la géométrie du modèle.

!!! note
    `section_assignments` est le seul nom de bloc écrit au pluriel.

!!! tip "Nombres"
    Écrivez les paramètres réels sous forme de nombres à virgule flottante (`10.0` plutôt que `10`), comme dans tous les exemples de cette documentation.

<h4>Syntaxe des Blocs</h4>

La déclaration des blocs et de leurs identifiants dépend du format utilisé :

=== "TOML :simple-toml:"
    En TOML, nous recommandons fortement l'utilisation des **Tables à clés (Keyed Tables)**. Cette syntaxe est concise et met clairement en valeur le nom de l'objet dans l'en-tête du bloc.

    ```toml
    # Syntaxe recommandée (Table à clés)
    [label.NomUnique]
    type = "TYPE_SPECIFIQUE"
    parametre = valeur
    ```

    *Exemple :*
    ```toml
    [material.Acier_S235]
    type = "ELASTIC"
    young = 210000.0
    ```

    !!! tip "Syntaxe Alternative"
        Vous pouvez aussi utiliser la syntaxe de tableau `[[label]]` avec un champ `name = "..."` à l'intérieur. Les deux syntaxes sont équivalentes et peuvent être mélangées dans un même fichier. La version à clé `[label.Nom]` est préférable pour sa clarté, tandis que la syntaxe de tableau est couramment utilisée pour `[[output]]` et `[[section_assignments]]`.

        ```toml
        [[material]]
        name = "Acier_S235"
        type = "ELASTIC"
        young = 210000.0
        ```

=== "Fembic :material-text:"
    Dans le format hérité Fembic, le bloc débute par le label et le type de technologie. Les entités sont ensuite répertoriées sur les lignes suivantes en commençant par leur nom unique.

    ```xml
    LABEL TYPE TYPE_SPECIFIQUE
    NomUnique parametre = valeur
    ```

    *Exemple :*
    ```xml
    MATERIALS TYPE ELASTIC
    Acier_S235 YOUNG = 210000.0
    ```

!!! hint "Ordre d'Écriture"
    L'ordre des blocs dans le fichier d'entrée n'a pas d'impact sur la lecture : COMFOR charge l'ensemble des définitions dans un registre avant de résoudre les liaisons. Conserver un ordre logique (Contrôle → Géométrie → Physique → Trackers) reste toutefois conseillé pour la lisibilité.

---

## Contrôle (Control)

Le bloc `control` définit les paramètres temporels globaux de la simulation, notamment la durée de l'analyse et la stratégie d'intégration temporelle.

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`run_to`** | Float | **Oui** | - | Temps final de simulation. Doit être non-négatif. |
| `run_from` | Float | Non | `0.0` | Temps de début de l'analyse. Doit être non-négatif. |
| `time_step` | Float | Non | - | Incrément de temps fixe. Doit être strictement positif si renseigné. Si omis, COMFOR calcule automatiquement un pas de temps stable basé sur le maillage et les matériaux. |

!!! info "Règle de Validation"
    La valeur de `run_from` doit être strictement inférieure à celle de `run_to`. Si cette condition n'est pas respectée, la simulation s'arrêtera lors de la phase de validation avec une erreur `ControlStep`.

### Exemples

=== "TOML :simple-toml:"
    ```toml
    # Configuration standard avec pas de temps automatique
    [control]
    run_from = 0.0
    run_to = 15.0

    # Configuration avec pas de temps manuel fixe
    [control]
    run_to = 10.0
    time_step = 0.0001
    ```

=== "Fembic :material-text:"
    ```txt
    CONTROLS
    RUN FROM 0.0 TO 15.0

    CONTROLS
    RUN TO 10.0 STEP 0.0001
    ```

---

## Sorties (Output)

Le bloc `output` définit les paramètres de génération des résultats (format, fréquence d'écriture). Au moins une sortie est requise. Il est possible de déclarer plusieurs sorties pour exporter simultanément dans différents formats ou à différentes fréquences.

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`name`** | String | **Oui** | - | Nom de la sortie. Les frames sont écrites dans `<racine_résultats>/<name>/<name>_000000.vtu`, `..._000001.vtu`, etc. |
| **`frequency`** | Float | **Oui** | - | Intervalle de temps entre deux fichiers de résultats. Doit être strictement positif. |
| `type` | String | Non | `"VTU"` | Format d'export. Valeurs disponibles : `"VTU"` (recommandé) ou `"VTK"`. |
| `format` | String | Non | `"ASCII"` | Encodage des données. Valeurs disponibles : `"ASCII"` ou `"BINARY"`. |

La racine des résultats est `Results_<nom_entrée>/` à côté du fichier d'entrée, ou le répertoire donné avec l'[option de ligne de commande](analysis.md#options_de_la_ligne_de_commande) `-o`.

!!! warning "Compatibilité des Formats"
    Le format hérité `VTK` ne prend **pas** en charge l'encodage `BINARY`. Si vous souhaitez exporter en binaire pour réduire la taille des fichiers et optimiser les temps d'écriture, utilisez le format `VTU`.

### Exemples

=== "TOML :simple-toml:"
    ```toml
    # Sortie binaire standard, écrite dans Results_<nom_entrée>/fields/
    [[output]]
    name = "fields"
    type = "VTU"
    format = "BINARY"
    frequency = 0.1

    # Export ASCII supplémentaire pour le débogage, écrit dans Results_<nom_entrée>/debug/
    [[output]]
    name = "debug"
    type = "VTU"
    format = "ASCII"
    frequency = 0.5
    ```

=== "Fembic :material-text:"
    ```xml
    OUTPUT
    TYPE = VTU FREQUENCY = 0.1 FORMAT = BINARY

    OUTPUT
    TYPE = VTU FREQUENCY = 0.5 FORMAT = ASCII
    ```

---

## Maillage (Mesh)

!!! info "TOML Uniquement"
    Ce bloc est spécifique au format de configuration **TOML**. Dans le format hérité Fembic, la géométrie et les propriétés physiques sont définies directement au sein des blocs `NODES` et `ELEMENTS`.

Le bloc `mesh` définit la source géométrique du modèle. COMFOR peut lire des maillages générés par des préprocesseurs externes ou traiter des définitions "inline" pour les cas simples.

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Oui** | - | Lecteur de maillage : `ABAQUS`, `GMSH`, `FEMBIC` ou `INLINE`. |
| `file` | String | Oui* | - | Chemin vers le fichier externe, absolu ou relatif au dossier du fichier d'entrée. *Requis pour `GMSH` et `ABAQUS`.* |
| `nodes` | Array | Oui* | - | Tableau des nœuds `[id, x, y, z]`. *Requis uniquement pour le type `INLINE`.* |
| `elements` | Array | Non | - | Tableau des éléments `[id, "TYPE", n1, n2, ...]`. Voir le [Module Éléments](modules/elements.md). *Uniquement pour le type `INLINE`.* |

### Traduction des Types d'Éléments

Les lecteurs externes traduisent les types d'éléments natifs en types d'éléments COMFOR (traduction par défaut). Tout type d'élément peut être modifié pour chaque pièce avec [`element_mapping`](#piece_part).

=== "ABAQUS"
    | Type Abaqus (`*ELEMENT, TYPE=`) | Type COMFOR |
    | :--- | :--- |
    | `T3D2` | `ROD_2` |
    | `M3D3` | `MEMBRANE_3` |
    | `S3`, `S3R` | `S3L_C0` |
    | `STRI3` | `DKT18` |
    | Tout autre type | Pas de traduction par défaut : doit être mappé avec `element_mapping` (ex: `R3D3`) |

    Seuls les mots-clés `*NODE` et `*ELEMENT` sont lus ; les autres mots-clés sont ignorés.

=== "GMSH"
    | Type d'élément Gmsh | Type COMFOR |
    | :--- | :--- |
    | `1` (ligne à 2 nœuds) | `ROD_2` |
    | `2` (triangle à 3 nœuds) | `MEMBRANE_3` |

    Les autres types d'éléments Gmsh n'ont pas de traduction par défaut et doivent être mappés avec `element_mapping`.

=== "INLINE"
    Le type d'élément est écrit directement dans le tableau `elements` et doit être un type d'élément COMFOR.

### Exemples

=== "Fichier Externe"
    ```toml
    [mesh.MaillageChassis]
    type = "GMSH"
    file = "models/chassis.msh"
    ```

=== "Définition Inline"
    ```toml
    [mesh.CarreSimple]
    type = "INLINE"
    nodes = [
        [1, 0.0, 0.0, 0.0],
        [2, 1.0, 0.0, 0.0],
        [3, 1.0, 1.0, 0.0],
        [4, 0.0, 1.0, 0.0]
    ]
    elements = [
        [1, "MEMBRANE_3", 1, 2, 3],
        [2, "MEMBRANE_3", 3, 4, 1]
    ]
    ```

---

## Pièce (Part)

!!! info "TOML Uniquement"
    Ce bloc est spécifique au format de configuration **TOML**. Dans le format hérité Fembic, les propriétés géométriques et matérielles sont attribuées directement dans le bloc `ELEMENTS`.

Une `part` représente un composant physique. Elle instancie une source géométrique définie dans un bloc `[mesh]` et lui applique d'éventuelles transformations spatiales globales ou des correspondances de types d'éléments (`element_mapping`).

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`mesh`** | String | **Oui** | - | Nom du bloc `[mesh]` à instancier. |
| `translation` | Array | Non* | `[0,0,0]` | Vecteur de translation globale `[tx, ty, tz]`. *Incompatible avec `pattern`.* |
| `pattern` | Array | Non* | - | Liste de configurations de répétition pour dupliquer la pièce. *Incompatible avec `translation`.* |
| `element_mapping` | Map | Non | - | Dictionnaire `{ "DE" = "VERS" }` attribuant un [type d'élément COMFOR](modules/elements.md) aux types d'éléments du maillage. |

!!! warning "Règle d'Exclusivité"
    Les paramètres `translation` et `pattern` sont mutuellement exclusifs. Renseigner les deux dans un même bloc `part` déclenchera une erreur de validation.

### Paramètres des Répétitions (Pattern)

Lors de l'utilisation du tableau `pattern`, chaque motif de répétition prend en charge les clés suivantes :

| Paramètre | Type | Requis | Description |
| :--- | :--- | :---: | :--- |
| **`type`** | String | **Oui** | Type de motif géométrique. Valeur supportée : `LINEAR`. |
| **`translation`** | Array | **Oui** | Vecteur de translation d'origine `[tx, ty, tz]` pour le motif. |
| **`count`** | Integer | **Oui** | Nombre d'instances à générer (doit être strictement positif). |
| **`spacing`** | Float | **Oui** | Distance entre deux instances consécutives (doit être strictement positive). |
| **`direction`** | Array | **Oui** | Vecteur directionnel `[dx, dy, dz]` pour la propagation du motif (non nul, normalisé en interne). |

L'instance `i` (à partir de 0) est placée en `translation + i × spacing × direction`. Plusieurs motifs peuvent être listés dans une même pièce ; leurs instances s'additionnent. Les sets qui référencent une pièce répétée avec `ids` ou `range` sélectionnent ces identifiants dans **chaque** instance.

### Syntaxe du Mapping d'Éléments

Les clés de `element_mapping` sont les types d'éléments **tels qu'écrits dans le fichier de maillage** : le type Abaqus (`"S3"`, `"R3D3"`...) ou le numéro de type Gmsh sous forme de chaîne (`"2"`). Le type COMFOR issu de la [traduction](#traduction_des_types_delements) par défaut (ex: `"MEMBRANE_3"`) est également accepté comme clé. Si les deux correspondent, le type du fichier de maillage est prioritaire. Les types absents du mapping conservent leur traduction par défaut.

Le dictionnaire `element_mapping` peut être déclaré de deux manières en TOML :

1. **Table Inline** : Pratique pour les correspondances courtes.
2. **Table Imbriquée** : Plus lisible lorsqu'il y a de nombreux types d'éléments à mapper.

=== "1. Table Inline"
    ```toml
    [part.Outil]
    mesh = "AbaqusInp"
    element_mapping = { "S3" = "CONTACT_TRIANGLE", "R3D3" = "CONTACT_TRIANGLE" }
    ```

=== "2. Table Imbriquée"
    ```toml
    [part.Outil]
    mesh = "AbaqusInp"

    [part.Outil.element_mapping]
    "S3"   = "CONTACT_TRIANGLE"
    "R3D3" = "CONTACT_TRIANGLE"
    ```

### Exemples

=== "TOML :simple-toml:"
    ```toml
    # Définition d'une pièce physique avec translation à partir d'une source de maillage
    [part.PlaquePrincipale]
    mesh = "GeometriePlaque"
    translation = [0.0, 0.0, 50.0]

    # Duplication d'un maillage via un motif linéaire (5 instances selon X)
    [part.Renforts]
    mesh = "MaillageRenfort"
    [[part.Renforts.pattern]]
    type = "LINEAR"
    translation = [0.0, 0.0, 0.0]
    count = 5
    spacing = 20.0
    direction = [1.0, 0.0, 0.0]

    # Mapping de types d'éléments pour un maillage importé
    # (les triangles Gmsh à 3 nœuds sont de type 2)
    [part.Chassis]
    mesh = "MaillageGmsh"
    [part.Chassis.element_mapping]
    "2" = "S3L_C0"
    ```

=== "Fembic :material-text:"
    !!! note "Pièces Implicites"
        En Fembic, les pièces ne sont pas définies explicitement. Les propriétés telles que le matériau et l'épaisseur sont assignées directement au sein du bloc `ELEMENTS`.

    ```xml
    ELEMENTS TYPE MEMBRANE_3
    1 NODES = [1, 2, 3] MATERIAL = Acier_S235 T = 1.2
    ```

---

## Section

!!! info "TOML Uniquement"
    Ce bloc est spécifique au format de configuration **TOML**. Dans le format hérité Fembic, la géométrie et les propriétés physiques sont définies directement au sein des blocs `NODES` et `ELEMENTS`.

Le bloc `section` définit des propriétés physiques spécifiques (telles que l'épaisseur, les points d'intégration ou le rayon) associées à un modèle de matériau. Les sections physiques sont ensuite attribuées à des groupes d'éléments via la liste `[[section_assignments]]`.

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Oui** | - | Type de formulation de section : `ROD`, `MEMBRANE`, `SHELL_GAUSS`, `SHELL_GENERALIZED` ou `RIGID`. |
| `material` | String | Oui* | - | Nom du [Matériau](#materiau_material). *Requis pour tous les types sauf `RIGID`.* |

Les autres paramètres (`thickness`, `radius`, `nip`, `integration`, `geometry`) dépendent du type : voir le [Module Sections](modules/sections.md). Le type de section doit être compatible avec les types d'éléments du set auquel elle est assignée (par ex. `ROD` pour `ROD_2`, `RIGID` pour les éléments de contact).

### Exemples

=== "TOML :simple-toml:"
    ```toml
    # Définition d'une section coque de Gauss
    [section.SEC_COQUE]
    type = "SHELL_GAUSS"
    material = "MateriauComposite"
    thickness = 2.5
    nip = 5
    integration = "GAUSS"

    # Assignation de la section à un groupe d'éléments
    [[section_assignments]]
    name = "AssignationCoque"
    section = "SEC_COQUE"
    set = "ZoneRenforcee"
    ```

=== "Fembic :material-text:"
    !!! note "Logique Implicite"
        Fembic n'a pas de concept de "Section". Les variations de propriétés doivent être définies ligne par ligne au sein du bloc `ELEMENTS`.

    ```xml
    ELEMENTS TYPE MEMBRANE_3
    1 NODES=[1,2,3] MATERIAL=Acier T=1.2
    2 NODES=[4,5,6] MATERIAL=Acier T=5.0  # Équivalent à un changement manuel de section
    ```

---

## Assignation de Section (Section Assignment)

!!! info "TOML Uniquement"
    Ce bloc est spécifique au format de configuration **TOML**. Dans le format hérité Fembic, les propriétés physiques sont définies directement dans le bloc `ELEMENTS`.

Le bloc `section_assignments` lie une [Section](#section) définie à un [Set](#ensemble_set) d'éléments. Il sert de couche d'association pour appliquer des définitions géométriques et comportementales à des régions spécifiques du maillage.

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`name`** | String | **Oui** | - | Nom unique de l'assignation. |
| **`section`** | String | **Oui** | - | Nom de la [Section](#section) à assigner. |
| **`set`** | String | **Oui** | - | Nom du [Set](#ensemble_set) d'éléments cible. Doit être un set de type `ELEMENT`. |

!!! info "Règle de Validation"
    Le set référencé doit exister et être de type `ELEMENT`. Référencer un set de type `NODE` déclenchera une erreur de validation lors de la phase d'association.

### Exemples

=== "TOML :simple-toml:"
    ```toml
    # Assignation de section via la syntaxe de tableau de tables
    [[section_assignments]]
    name = "AssignationMembrane"
    section = "SEC_MEMBRANE"
    set = "ElementsCorpsPrincipal"

    # La syntaxe sous forme de table à clé est également supportée
    [section_assignments.AssignationFlexion]
    section = "SEC_COQUE"
    set = "ElementsRenfort"
    ```

=== "Fembic :material-text:"
    !!! note "Logique Implicite"
        En Fembic, les assignations de section n'existent pas sous forme de blocs séparés. Les propriétés physiques sont spécifiées ligne par ligne dans le bloc `ELEMENTS`.

    ```xml
    ELEMENTS TYPE MEMBRANE_3
    1 NODES = [1, 2, 3] MATERIAL = Acier T = 1.0
    ```

---

## Nœuds (Nodes - Legacy)

!!! info "Fembic Uniquement"
    Ce bloc est spécifique au format hérité **Fembic**. En TOML, les nœuds sont généralement définis dans un bloc `[mesh]` ou via le tableau `nodes` d'un maillage `INLINE`.

Le bloc `NODES` définit les coordonnées de chaque point du modèle et peut, optionnellement, leur assigner des conditions aux limites ou des charges directement.

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`ID`** | Entier | **Oui** | - | Identifiant unique du nœud (premier jeton). |
| **`X`, `Y`, `Z`** | Float | **Oui** | - | Coordonnées spatiales du nœud. |
| `CONSTRAINT` | String | Non | - | Nom d'une [Contrainte](#contrainte_constraint) à appliquer à ce nœud. |
| `LOAD` | String | Non | - | Nom d'une [Charge](#charge_load) nodale à appliquer à ce nœud. |

### Exemple

```xml
NODES
1   X = 0.0  Y = 0.0  Z = 0.0  CONSTRAINT = BaseFixe
2   X = 10.0 Y = 0.0  Z = 0.0  LOAD = ForcePonctuelle
3   X = 5.0  Y = 5.0  Z = 0.0
```

!!! tip "Sets Implicites"
    Lorsque vous assignez une `CONSTRAINT` ou une `LOAD` directement dans le bloc `NODES`, COMFOR crée automatiquement un **Set** interne contenant tous les nœuds partageant le même nom de contrainte ou de charge.

---

## Éléments (Elements - Legacy)

!!! info "Fembic Uniquement"
    Ce bloc est spécifique au format hérité **Fembic**. Les éléments en Fembic sont "physiques" : ils contiennent à la fois la connectivité et les propriétés physiques (matériau, épaisseur).

Le bloc `ELEMENTS` définit la connectivité et le comportement physique du maillage. Tous les éléments d'un même bloc doivent partager le même **Type de Technologie**.

### En-tête du Bloc

```xml
ELEMENTS TYPE <TECHNOLOGIE>
```

Voir le [Module Éléments](modules/elements.md) pour les technologies disponibles (ex: `MEMBRANE_3`, `S3L_C0`, `ROD_2`).

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| --- | --- | --- | --- | --- |
| **`ID`** | Entier | **Oui** | - | Identifiant unique de l'élément (premier jeton). |
| **`NODES`** | Array | **Oui** | - | Liste des IDs de nœuds, ex: `[1, 2, 3]`. |
| **`MATERIAL`** | String | **Oui** | - | Nom du [Matériau](modules/materials.md) à assigner. |
| `T` | Float | Non* | - | Alias pour **thickness** (épaisseur). Requis pour Coques/Membranes. |
| `R` | Float | Non* | - | Alias pour **radius** (rayon). Requis pour les Barres (Rods). |
| `LOAD` | String | Non | - | Nom d'une [Charge](#charge_load) d'élément (ex: Pression). |
| `CONTACT` | String | Non | - | Mode de détection de contact : `BASIC` ou `EDGE`. |
| `FRICTION` | Float | Non | `0.0` | Coefficient de frottement de Coulomb. |
| `FACTOR` | Float | Non | `1.0` | Facteur de raideur de pénalité pour le contact. |

### Exemple

```xml
ELEMENTS TYPE MEMBRANE_3
1  NODES = [1, 2, 3]  MATERIAL = Acier  T = 1.0  CONTACT = EDGE  FRICTION = 0.1
2  NODES = [3, 4, 1]  MATERIAL = Acier  T = 1.0  CONTACT = EDGE  FRICTION = 0.1

ELEMENTS TYPE ROD_2
101 NODES = [10, 11]  MATERIAL = Nylon  R = 0.5
```

!!! note "Alias"
    Le parser Fembic traduit automatiquement les clés courtes héritées comme `T` en `thickness` et `R` en `radius` pour maintenir la compatibilité avec le moteur central.

---

## Ensemble (Set)

Les Sets sont des groupes nommés d'entités (nœuds ou éléments) utilisés pour appliquer des conditions aux limites, des charges ou pour définir des [Sections](#section). Ils ciblent les entités au sein d'une ou plusieurs [Pièces](#piece_part) physiques à l'aide de listes d'IDs explicites, de plages ou d'une sélection complète de pièce.

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| --- | --- | --- | --- | --- |
| **`type`** | String | **Oui** | - | Type d'entité : `NODE` ou `ELEMENT`. |
| `part` | String | Oui* | - | Nom de la [Pièce](#piece_part) cible. *Requis si `parts` n'est pas utilisé.* |
| `parts` | Array | Oui* | - | Liste de noms de [Pièces](#piece_part) cibles. *Requis si `part` n'est pas utilisé.* |
| `ids` | Array | Non | - | Liste explicite d'IDs de nœuds ou d'éléments. Incompatible avec `range`. |
| `range` | Array | Non | - | Définition par plage `[début, fin, pas]`. Incompatible avec `ids`. |

!!! warning "Règles de Validation"
    - Vous devez spécifier soit `part`, soit `parts`, mais **pas les deux**.
    - Vous pouvez spécifier soit `ids`, soit `range`, mais **pas les deux**. Si aucun des deux n'est renseigné, le set inclut automatiquement **toutes** les entités du type spécifié dans la ou les pièces référencées.
    - Pour le paramètre `range`, le pas (troisième valeur) **ne peut pas être nul**.

### Syntaxe de Plage (Range)

Le tableau `range` suit le format : `[id_debut, id_fin, pas]`.

*Exemple :* `range = [1, 10, 2]` sélectionnera les IDs : **1, 3, 5, 7, 9**.

### Exemples

=== "TOML :simple-toml:"
    ```toml
    # Set de nœuds défini par des IDs explicites au sein d'une seule pièce
    [set.NoeudsFixes]
    type = "NODE"
    part = "PlaquePrincipale"
    ids = [1, 2, 10, 15]

    # Set d'éléments défini par une plage au sein d'une seule pièce
    [set.ElementsBase]
    type = "ELEMENT"
    part = "PlaquePrincipale"
    range = [1, 100, 1]

    # Set ciblant tous les nœuds de plusieurs pièces
    [set.TousLesNoeudsPiece]
    type = "NODE"
    parts = ["PlaquePrincipale", "Renfort"]
    ```

=== "Fembic :material-text:"
    ```xml
    SETS TYPE NODE
    NoeudsFixes NODES = [1, 2, 10, 15]

    SETS TYPE ELEMENT
    ElementsBase RANGE = [1, 100, 1]
    ```

---

## Surface

Les Surfaces sont des entités topologiques créées par la fusion d'un ou plusieurs [Sets](#ensemble_set) existants. Elles sont principalement utilisées pour définir des frontières d'interaction, telles que les zones de contact.

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Oui** | - | Type d'entité : `NODE` ou `ELEMENT`. |
| `node_sets` | Array | Non* | - | Liste des noms de sets de nœuds à fusionner. *Requis pour le type `NODE`.* |
| `element_sets` | Array | Non* | - | Liste des noms de sets d'éléments à fusionner. *Requis pour le type `ELEMENT`.* |

!!! info "Logique de Fusion"
    Lorsque vous renseignez plusieurs sets dans le tableau, COMFOR les fusionne automatiquement en une seule surface continue. Tous les sets référencés doivent exister et correspondre au `type` de la surface (par exemple, vous ne pouvez pas inclure un Set de Nœuds dans une Surface d'Éléments).

### Exemples

=== "TOML :simple-toml:"
    ```toml
    # Création d'une surface de contact maître en fusionnant deux sets d'éléments
    [surface.SurfaceContactMaitre]
    type = "ELEMENT"
    element_sets = ["ElementsSemelleHaute", "ElementsAme"]

    # Création d'une surface nodale pour des sorties ou contraintes spécifiques
    [surface.InterfaceLimite]
    type = "NODE"
    node_sets = ["NoeudsBordGauche", "NoeudsBordDroit"]
    ```

=== "Fembic :material-text:"
    ```xml
    SURFACES TYPE ELEMENT
    SurfaceContactMaitre ELEMENT_SETS = ["ElementsSemelleHaute", "ElementsAme"]

    SURFACES TYPE NODE
    InterfaceLimite NODE_SETS = ["NoeudsBordGauche", "NoeudsBordDroit"]
    ```

---

## Matériau (Material)

Le bloc `material` définit les lois de comportement et les propriétés physiques assignées aux composants du modèle. COMFOR prend en charge divers modèles, allant de l'élasticité linéaire classique aux lois textiles non linéaires avancées.

### Paramètres communs

Ces paramètres sont partagés par tous les modèles de matériaux :

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Oui** | - | Mot-clé du modèle de matériau : `ELASTIC`, `HYPERELASTIC` ou `HYPERTEXTILE`. Voir le [Module Matériaux](modules/materials.md) pour les paramètres spécifiques. |
| **`density`** | Float | **Oui** | - | Masse volumique ($\rho$). Doit être strictement positive. |
| `damping` | Float | Non | `0.0` | Coefficient d'amortissement de Rayleigh proportionnel à la masse ($\alpha$). Doit être non-négatif. |

### Exemples

=== "TOML :simple-toml:"
    ```toml
    # Définition d'un matériau acier standard
    [material.Acier_S235]
    type = "ELASTIC"
    density = 7.8e-9
    young = 210000.0
    poisson = 0.3
    damping = 0.1
    ```

=== "Fembic :material-text:"
    ```xml
    MATERIALS TYPE ELASTIC
    Acier_S235 DENSITY = 7.8e-9 YOUNG = 210000.0 POISSON = 0.3 DAMPING = 0.1
    ```

---

## Amplitude

Le bloc `amplitude` définit des fonctions temporelles $y = f(t)$ utilisées pour moduler des charges, des conditions aux limites ou d'autres paramètres évolutifs.

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Oui** | - | Modèle d'amplitude : `TABULAR`. Voir le [Module Amplitudes](modules/amplitudes.md). |
| **`values`** | Array | **Oui** | - | Paires `[temps, valeur]` (au moins 2), interpolées linéairement. |

### Exemples

=== "TOML :simple-toml:"
    ```toml
    # Fonction rampe simple de 0 à 10 sur 1 seconde, maintenue à 10 jusqu'à 2s
    [amplitude.RampeMontante]
    type = "TABULAR"
    values = [
        [0.0, 0.0],
        [1.0, 10.0],
        [2.0, 10.0]
    ]
    ```

=== "Fembic :material-text:"
    !!! note "Format des données"
        En Fembic, le paramètre `values` est fourni sous forme de liste plate. Le parser regroupe automatiquement les valeurs par paires `[temps, valeur]`.

    ```xml
    AMPLITUDES TYPE TABULAR
    RampeMontante VALUES = [0.0, 0.0, 1.0, 10.0, 2.0, 10.0]
    ```

---

## Contrainte (Constraint)

Le bloc `constraint` est utilisé pour prescrire des valeurs cinématiques sur des degrés de liberté spécifiques pour un groupe de nœuds (liaisons fixes, vitesses imposées, accélérations).

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Oui** | - | Technologie de contrainte : `BOUNDARY_CONDITION`. Voir le [Module Contraintes](modules/constraints.md). |
| **`set`** | String | **Oui** | - | Nom du [Set de Nœuds](#ensemble_set) auquel la contrainte s'applique. |
| `preset` | String | Non* | - | `"FIXED"` bloque les 6 vitesses. |
| `vx`, `vy`, `vz` | Float ou Map | Non* | - | Vitesses de translation imposées. |
| `vrx`, `vry`, `vrz` | Float ou Map | Non* | - | Vitesses de rotation imposées. |
| `ax`, `ay`, `az` | Float ou Map | Non* | - | Accélérations de translation imposées. |
| `amplitude` | String | Non | - | Nom d'une [Amplitude](modules/amplitudes.md) globale pour moduler toutes les composantes définies. |

*Au moins `preset` ou une composante est requis. Une composante est soit un nombre (`vx = 0.0`), soit une table avec sa propre amplitude (`vx = { value = -10.0, amplitude = "Rampe" }`).

### Exemples

=== "TOML :simple-toml:"
    ```toml
    # Encastrement simple utilisant un preset
    [constraint.BaseFixe]
    type = "BOUNDARY_CONDITION"
    set = "NoeudsBase"
    preset = "FIXED"

    # Vitesse imposée avec amplitude locale
    [constraint.PlateauMobile]
    type = "BOUNDARY_CONDITION"
    set = "NoeudsHaut"
    vy = { value = -10.0, amplitude = "RampeMontante" }
    ```

=== "Fembic :material-text:"
    ```xml
    CONSTRAINTS TYPE BOUNDARY_CONDITION
    BaseFixe SET = NoeudsBase PRESET = FIXED
    PlateauMobile SET = NoeudsHaut VY = -10.0 AMP = RampeMontante
    ```

---

## Charge (Load)

Le bloc `load` définit les efforts externes appliqués au modèle : forces ou moments ponctuels sur les nœuds, pressions distribuées sur les surfaces ou accélérations volumiques.

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`set`** | String | **Oui** | - | Nom du [Set](#ensemble_set) sur lequel la charge s'applique. |
| `amplitude` | String | Non | - | Nom de l'[Amplitude](modules/amplitudes.md) utilisée pour moduler les valeurs. |
| `p` | Float | Non | `0.0` | Pression distribuée (principalement pour les éléments Coque/Membrane). |
| `fx`, `fy`, `fz` | Float | Non | `0.0` | Composantes de force ponctuelle selon les axes globaux X, Y et Z. |
| `mx`, `my`, `mz` | Float | Non | `0.0` | Composantes de moment ponctuel autour des axes globaux X, Y et Z. |
| `ax`, `ay`, `az` | Float | Non | `0.0` | Composantes d'accélération volumique linéaire. |
| `arx`, `ary`, `arz`| Float | Non | `0.0` | Composantes d'accélération volumique rotationnelle. |

### Logique d'évaluation

L'intensité d'une composante de charge à un instant $t$ est calculée comme le produit de la valeur de base et du facteur d'amplitude :

$$F_{\text{appliquée}}(t) = F_{\text{base}} \times \text{Amplitude}(t)$$

Si aucune `amplitude` n'est spécifiée, le facteur d'échelle par défaut est de **1.0**.

### Set Cible

- Les composantes nodales (`fx`...`mz`, `ax`...`arz`) s'appliquent aux nœuds d'un set `NODE`.
- La pression `p` s'applique aux éléments d'un set `ELEMENT` (éléments coques et membranes).

### Exemples

=== "TOML :simple-toml:"
    ```toml
    # Application d'une force ponctuelle verticale sur un set spécifique
    [load.ForcePoincon]
    set = "NoeudsHaut"
    fz = -500.0
    amplitude = "RampeDescendante"

    # Application d'une pression constante sur un set d'éléments
    [load.PressionInterne]
    set = "ElementsInternes"
    p = 10.5

    # Gravité (accélération volumique) sur tous les nœuds d'une pièce
    [load.Gravite]
    set = "TousLesNoeuds"
    az = -9810.0
    ```

=== "Fembic :material-text:"
    ```xml
    LOADS
    ForcePoincon SET = NoeudsHaut FZ = -500.0 AMPLITUDE = RampeDescendante

    LOADS
    PressionInterne SET = ElementsInternes P = 10.5
    ```

!!! tip "Charges multi-composantes"
    Un même bloc `load` peut définir plusieurs composantes (par exemple `fx`, `fy` et `fz`) simultanément. Toutes les composantes d'un même bloc partagent la même `amplitude`.

---

## Comportement de Contact (Contact Behaviour)

Le bloc `contact_behaviour` définit les lois physiques (normales et tangentielles) qui régissent l'interaction entre les surfaces. Ces lois sont déclarées indépendamment puis associées à un bloc [Contact](#contact).

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Oui** | - | Mot-clé de technologie. Lois normales : `LINEAR_PENALTY`, `PENALTY_ADHESION`. Loi tangentielle : `COULOMB`. Voir le [Module Contacts](modules/contact_behaviours.md) pour leurs paramètres. |

### Exemples

=== "TOML :simple-toml:"
    ```toml
    # Définition d'une loi de pénalité normale
    [contact_behaviour.ContactDur]
    type = "LINEAR_PENALTY"
    stiffness = 1.0e6

    # Définition d'une loi de frottement tangentielle
    [contact_behaviour.FrottementAcier]
    type = "COULOMB"
    friction = 0.15
    ```

=== "Fembic :material-text:"
    ```xml
    CONTACT_BEHAVIOURS TYPE LINEAR_PENALTY
    ContactDur STIFFNESS = 1.0e6

    CONTACT_BEHAVIOURS TYPE COULOMB
    FrottementAcier FRICTION = 0.15
    ```

---

## Contact

Le bloc `contact` définit l'interaction géométrique entre surfaces ou à l'échelle globale du domaine, en leur associant les lois physiques déclarées dans les blocs [Comportement de Contact](#comportement_de_contact_contact_behaviour).

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Oui** | - | Technologie d'interaction : `PAIR` ou `GENERAL`. |
| `master` | String | Oui* | - | Nom de la première [Surface](#surface) (Maître). *Requis pour le type `PAIR` si `surfaces` n'est pas utilisé.* |
| `slave` | String | Oui* | - | Nom de la seconde [Surface](#surface) (Esclave). *Requis pour le type `PAIR` si `surfaces` n'est pas utilisé.* |
| `surfaces` | Array | Oui* | - | Liste de deux surfaces `["Surf1", "Surf2"]`. *Syntaxe alternative pour le type `PAIR`.* |
| **`normal`** | String | **Oui** | - | Nom du [Comportement de Contact](modules/contact_behaviours.md#lois_normales_normal_contact_laws) normal assigné. |
| **`tangential`**| String | **Oui** | - | Nom du [Comportement de Contact](modules/contact_behaviours.md#lois_tangentielles_tangential_contact_laws) tangentiel assigné. |
| `edge` | Boolean | Non | `false` | Si `true`, active la détection de contact sur les bords pour un contact de type `PAIR`. |

La même surface peut être utilisée comme `master` et `slave` pour définir un auto-contact.

!!! info "Règles de Définition des Surfaces"
    - Pour un contact **`PAIR`**, spécifiez les surfaces soit avec le couple `master`/`slave`, soit avec le tableau `surfaces`.
    - Pour un contact **`GENERAL`**, la définition de surfaces est omise car le contact s'applique globalement. Un **seul** contact `GENERAL` peut être défini par modèle ; il peut être combiné avec des contacts `PAIR`.

### Exemples

=== "TOML :simple-toml:"
    ```toml
    # Paire de contact définie via les mots-clés Master/Slave
    [contact.OutilVersPiece]
    type = "PAIR"
    master = "SurfaceOutil"
    slave = "NoeudsPiece"
    normal = "PenaliteDure"
    tangential = "FrottementAcier"

    # Définition d'un contact général
    [contact.ContactGlobal]
    type = "GENERAL"
    normal = "PenaliteDouce"
    tangential = "FrottementTissu"
    ```

=== "Fembic :material-text:"
    ```xml
    CONTACTS TYPE PAIR
    OutilVersPiece MASTER = SurfaceOutil SLAVE = NoeudsPiece NORMAL = PenaliteDure TANGENTIAL = FrottementAcier

    CONTACTS TYPE GENERAL
    ContactGlobal NORMAL = PenaliteDouce TANGENTIAL = FrottementTissu
    ```

---

## Tracker

Le bloc `tracker` enregistre l'historique temporel de variables nodales ou d'éléments dans des fichiers **CSV** dédiés, nommés `<racine_résultats>/<nom_tracker>.csv`. Les valeurs sont écrites à chaque écriture d'une frame de [sortie](#sorties_output).

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Oui** | - | Type d'entité à suivre : `NODE` ou `ELEMENT`. |
| **`variable`** | String | **Oui** | - | Quantité physique à enregistrer. Voir le [Module Trackers](modules/trackers.md). |
| `set` | String | Oui* | - | Nom du [Set](#ensemble_set) cible. *Incompatible avec `nodes`/`elements`.* |
| `nodes` | Array | Oui* | - | Identifiants explicites des nœuds (trackers `NODE`). |
| `elements` | Array | Oui* | - | Identifiants explicites des éléments (trackers `ELEMENT`). |
| `direction` | String | Oui* | - | `"X"`, `"Y"` ou `"Z"`. *Requis pour les trackers `NODE`.* |
| `component` | String | Oui* | - | Composante de la variable (ex: `"xx"`, `"warp"`, `"value"`). *Requis pour les trackers `ELEMENT`.* Voir le [Module Trackers](modules/trackers.md). |

### Exemples

=== "TOML :simple-toml:"
    ```toml
    # Suivi de la force de réaction d'un set de nœuds selon la direction Z
    [tracker.ForceReaction]
    type = "NODE"
    variable = "FORCE"
    direction = "Z"
    set = "NoeudsBase"

    # Suivi de la contrainte de Cauchy xx sur des éléments explicites
    [tracker.ContrainteCoeur]
    type = "ELEMENT"
    variable = "CAUCHY_STRESS"
    component = "xx"
    elements = [101, 102]
    ```

=== "Fembic :material-text:"
    ```xml
    TRACKERS TYPE NODE
    ForceReaction SET = NoeudsBase VARIABLE = FORCE DIRECTION = Z

    TRACKERS TYPE ELEMENT
    ContrainteCoeur ELEMENTS = [101, 102] VARIABLE = CAUCHY_STRESS COMPONENT = xx
    ```

---

## Solveur (Solver)

!!! info "TOML Uniquement"
    Ce bloc est spécifique au format de configuration **TOML**. Le format Fembic utilise des paramètres implicites de solveur.

Le bloc optionnel `solver` configure le solveur de dynamique utilisé pour l'intégration temporelle. COMFOR implémente actuellement un **solveur explicite** avec intégration par différences centrées. Si le bloc est omis, le solveur explicite est utilisé avec les valeurs par défaut ci-dessous. Un seul bloc `solver` est autorisé.

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| `type` | String | Non | `"EXPLICIT"` | Type de solveur. Valeur supportée : `"EXPLICIT"`. |
| `integrator` | String | Non | `"central_difference"` | Type d'intégrateur temporel. Valeur supportée : `"central_difference"`. |
| `time_step_factor` | Float | Non | `0.9` | Facteur de sécurité pour le calcul automatique du pas de temps. |
| `energy_balance_epsilon` | Float | Non | `1.0e-2` | Tolérance pour la vérification du bilan énergétique. |

!!! info "Calcul Automatique du Pas de Temps"
    Si le pas de temps n'est pas spécifié dans le bloc [`control`](#controle_control), COMFOR calcule automatiquement un pas de temps stable basé sur les propriétés du maillage et des matériaux. Le facteur `time_step_factor` est appliqué à ce pas de temps critique : $\Delta t = \alpha \cdot \Delta t_{crit}$ où $\alpha$ est le facteur de sécurité.

### Exemples

=== "TOML :simple-toml:"
    ```toml
    # Configuration avec solveur explicite et pas de temps automatique
    [solver]
    type = "EXPLICIT"
    integrator = "central_difference"
    time_step_factor = 0.9
    energy_balance_epsilon = 1.0e-2

    # Modifier uniquement le facteur de sécurité, les autres valeurs gardent leur défaut
    [solver]
    time_step_factor = 0.8
    ```

=== "Fembic :material-text:"
    !!! note "Paramètres Implicites"
        En Fembic, le solveur explicite est utilisé par défaut avec des paramètres prédéfinis. Il n'est pas possible de configurer explicitement le solveur dans ce format.

---

## Validation

COMFOR valide l'ensemble du fichier d'entrée avant de construire le modèle et signale **toutes** les erreurs trouvées en une seule fois (dans le terminal et dans le journal du job). Pour valider un fichier sans lancer la simulation :

```bash
comfor -j simulation.toml --validate
```

La validation vérifie :

- la syntaxe TOML (avec le numéro de ligne de l'erreur) ;
- la présence des blocs requis (`control`, au moins un `output`) et du `name` de chaque bloc ;
- l'unicité des noms au sein de chaque type de bloc ;
- les paramètres obligatoires de chaque bloc, leurs types et leurs valeurs ou plages autorisées (par ex. `thickness > 0`, `poisson` dans $[0, 0.5]$, `run_from < run_to`) ;
- les options exclusives (`translation`/`pattern`, `ids`/`range`, `part`/`parts`, `set`/`nodes`...).

Les références croisées entre blocs (une section qui référence un matériau, une assignation qui référence un set, un contact qui référence des surfaces...) et la compatibilité entre types d'éléments et sections sont vérifiées lors de la construction du modèle, au début de la simulation. Voir [Exécution](analysis.md#validation) pour plus de détails.

[^1]: L'analyse syntaxique (ou *parsing*) est le processus d'analyse d'une séquence de symboles selon les règles d'une grammaire formelle. [Wikipédia](https://fr.wikipedia.org/wiki/Analyse_syntaxique){:target="_blank"}
