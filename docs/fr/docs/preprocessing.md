<style>
  .md-sidebar--secondary .md-nav__list .md-nav__list .md-nav__item .md-nav {
    display: none !important;
  }
</style>

COMFOR définit le modèle numérique à travers un fichier d'entrée structuré. L'environnement dispose d'une architecture de parser modulaire [^1] supportant à la fois le standard moderne **TOML** (recommandé pour sa modularité et sa lisibilité) et le format hérité **Fembic** (maintenu pour la rétrocompatibilité).

Contrairement aux versions précédentes, COMFOR découple désormais la définition géométrique des propriétés physiques, permettant l'import direct de formats de maillage externes tels qu'**Abaqus (.inp)** ou **Gmsh (.msh)**, en plus des définitions **Inline**.

De manière générale, un fichier d'entrée complet doit définir les piliers fondamentaux suivants :

  - **Géométrie & Assemblage** : Définition des sources de maillage (Mesh) et leur assemblage en composants physiques (Part).
  - **Propriétés Matérielles** : Lois de comportement et données physiques assignées aux pièces.
  - **Conditions aux Limites** : Contraintes cinématiques (Constraints) appliquées au modèle.
  - **Charges** : Sollicitations externes telles que des forces ponctuelles, des pressions ou la gravité.
  - **Contrôle de l'Analyse** : Plage temporelle de simulation, paramètres de pas de temps et fréquence de sortie.

# Unités

Il n'y a pas de système d'unités prédéfini dans COMFOR. L'utilisateur peut utiliser n'importe quel système d'unités cohérent [voir ici](https://femci.gsfc.nasa.gov/units/index.html){:target="_blank"}. Les unités doivent être cohérentes afin que les opérations mathématiques produisent directement les bonnes unités pour le résultat. Par exemple, pour la loi de Newton :

$$\mathbf{f} = \mathbf{M} \mathbf{a}$$

Si l'unité de force est le newton $N$, l'unité de longueur le $mm$ et l'unité de temps la seconde $s$, les unités de l'accélération sont $mm/s^2$ et l'unité de masse doit être $kg \cdot 10^{3} = t$ (tonne métrique).

# Structure de l'entrée

Le fichier de configuration est organisé en **Blocs**. Chaque bloc correspond à une catégorie spécifique de données (un label) et définit les propriétés d'un composant du modèle.

<h4>Nommage</h4>
La plupart des blocs dans COMFOR nécessitent un **Nom** unique. Ce nom sert d'identifiant permettant aux différentes parties de la simulation de communiquer entre elles. Par exemple, si vous définissez un `material` nommé "Acier", n'importe quelle `part` peut ensuite référencer cet "Acier" pour savoir quelle loi de comportement charger.

<h4>Syntaxe des Blocs</h4>

La manière de déclarer ces blocs et leurs noms diffère selon le format utilisé.

=== "TOML :simple-toml:"
    En TOML, nous recommandons fortement l'usage des **Tables à clés (Keyed Tables)**. Cette syntaxe est plus concise et met clairement en évidence le nom unique de l'objet dans l'en-tête.

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
        Bien que l'utilisation de la syntaxe de tableau `[[label]]` avec un champ interne `name = "..."` soit supportée, la version à clé `[label.Nom]` est préférée pour la clarté et la modularité.

=== "Fembic :material-text:"
    Dans le format hérité, le bloc commence par le label et le type de technologie. Les entrées suivent sur les lignes suivantes, en commençant par leur nom unique.

    ```xml
    LABEL TYPE TYPE_SPECIFIQUE
    NomUnique parametre = valeur
    ```

    *Exemple :*
    ```xml
    MATERIALS TYPE ELASTIC
    Acier_S235 YOUNG = 210000.0
    ```

!!! hint "Ordre des Opérations"
    L'ordre des blocs dans le fichier d'entrée n'impacte pas l'analyse. COMFOR charge toutes les définitions dans un registre avant de les "lier" entre elles. Cependant, maintenir un flux logique (Contrôle → Géométrie → Physique → Trackers) est recommandé pour la maintenance.

## Contrôle (Control)

Le bloc `control` définit les paramètres temporels globaux de la simulation, gérant la durée de l'analyse et la stratégie d'intégration temporelle.

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| `run_to` | Float | **Oui** | - | Temps final de simulation. Doit être non-négatif. |
| `run_from` | Float | Non | `0.0` | Temps de début de l'analyse. Doit être non-négatif. |
| `time_step` | Float | Non | `0.0` | Incrément de temps fixe. Si réglé sur `0.0`, COMFOR utilise un pas de temps stable automatique basé sur le maillage et les matériaux. |

!!! info "Règle de Validation"
    La valeur de `run_from` doit être strictement inférieure à `run_to`. Si cette condition n'est pas remplie, la simulation échouera lors de la phase de validation avec une erreur de type `ControlStep`.

### Exemples

=== "TOML :simple-toml:"
    ```toml
    # Configuration typique avec pas de temps automatique
    [control]
    run_from = 0.0
    run_to = 15.0

    # Configuration avec un pas de temps manuel fixe
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

Le bloc `output` définit les paramètres de génération des résultats, incluant le format, l'emplacement de stockage et la fréquence des fichiers de sortie. Vous pouvez définir plusieurs canaux de sortie en TOML pour exporter différents formats simultanément.

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| `frequency` | Float | **Oui** | - | Intervalle de temps entre deux résultats. Doit être positif. |
| `type` | String | Non | `VTU` | Format d'export. Disponibles : `VTU` (recommandé) ou `VTK`. |
| `format` | String | Non | `ASCII` | Encodage des données. Disponibles : `ASCII` ou `BINARY`. |
| `directory` | String | Non | `""` | Sous-répertoire où les résultats seront stockés. |

!!! warning "Compatibilité des Formats"
    Le type hérité `VTK` ne supporte **pas** l'encodage `BINARY`. Si vous avez besoin d'exports binaires pour de meilleures performances et des fichiers plus légers, veuillez utiliser le type `VTU`.

### Exemples

=== "TOML :simple-toml:"
    ```toml
    # Sortie binaire standard dans un dossier spécifique
    [[output]]
    type = "VTU"
    format = "BINARY"
    frequency = 0.1
    directory = "results"

    # Sortie ASCII supplémentaire pour le débogage
    [[output]]
    type = "VTU"
    format = "ASCII"
    frequency = 0.5
    ```

=== "Fembic :material-text:"
    ```xml
    OUTPUT
    TYPE = VTU FREQUENCY = 0.1 FORMAT = BINARY DIRECTORY = results

    OUTPUT
    TYPE = VTU FREQUENCY = 0.5 FORMAT = ASCII
    ```

---

## Maillage (Mesh)

!!! info "TOML Uniquement"
    Ce bloc est spécifique au format de configuration **TOML**. Dans le format hérité Fembic, la géométrie et les propriétés physiques sont définies directement dans les blocs `NODES` et `ELEMENTS`.

Le bloc `mesh` définit la source géométrique de votre modèle. COMFOR peut lire des fichiers externes provenant de pré-processeurs standards ou définir la géométrie "inline" pour des cas simples.

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| `type` | String | **Oui** | - | Moteur de lecture : `ABAQUS`, `GMSH`, `FEMBIC` ou `INLINE`. |
| `mesh` | String | Oui\* | - | Chemin vers le fichier externe. *Requis pour tous sauf `INLINE`.* |
| `nodes` | Array | Oui\* | - | Liste de nœuds `[id, x, y, z]`. *Requis uniquement pour `INLINE`.* |
| `elements` | Array | Oui\* | - | Liste d'éléments `[id, "TYPE", n1, n2, ...]`. Voir [Bibliothèque d'Éléments](#bibliotheque_delements). *Requis uniquement pour `INLINE`.* |

### Exemples

=== "Fichier Externe"
    ```toml
    [mesh.MaillageChassis]
    type = "GMSH"
    mesh = "models/chassis.msh"
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
    Ce bloc est spécifique au format de configuration **TOML**. Dans le format hérité Fembic, les propriétés physiques sont assignées directement dans le bloc `ELEMENTS`.

Une `part` représente un composant physique. Elle instancie une source géométrique et lui assigne des propriétés physiques. Les paramètres définis ici (comme `material` ou `thickness`) agissent comme une surcharge globale pour toute la pièce.

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`mesh`** | String | **Oui** | - | Nom du bloc `[mesh]` à utiliser. |
| `material` | String | Non | - | Matériau assigné à tous les éléments. Si omis, doit être défini dans une [Section](#section). |
| `thickness` | Float | Non | - | Épaisseur pour les éléments Coque/Membrane. Si omis, doit être défini dans une [Section](#section). |
| `id_offset` | Integer | Non | `0` | Valeur d'offset ajoutée à tous les IDs de Nœuds et Éléments. |
| `translation` | Array | Non | `[0,0,0]` | Vecteur de translation globale `[tx, ty, tz]`. |
| `element_mapping` | Map | Non | - | Dictionnaire pour mapper les types d'éléments du maillage vers les [Technologies COMFOR](#bibliotheque_delements). |

### Syntaxe du Mapping d'Éléments

Il existe deux façons de définir l' `element_mapping` en TOML :

1.  **Table Inline** : Utile pour des mappings courts.
2.  **Table Imbriquée** : Préférable pour la clarté lors du mapping de nombreux types d'éléments.

=== "1. Table Inline"
    ```toml
    [part.Aile]
    mesh = "AbaqusInp"
    material = "Composite"
    element_mapping = { "S3R" = "S3L_C0", "STRI3" = "DKT18" }
    ```

=== "2. Table Imbriquée"
    ```toml
    [part.Aile]
    mesh = "AbaqusInp"
    material = "Composite"

    [part.Aile.element_mapping]
    "S3R"   = "S3L_C0"
    "STRI3" = "DKT18"
    ```

### Exemples

=== "TOML :simple-toml:"
    ```toml
    # Définition d'une pièce physique à partir d'une source de maillage
    [part.PlaquePrincipale]
    mesh = "GeometriePlaque"
    material = "Acier_S235"
    thickness = 1.2
    id_offset = 10000
    translation = [0.0, 0.0, 50.0]

    # Réutilisation du même maillage pour une seconde pièce avec des propriétés différentes
    [part.Renfort]
    mesh = "GeometriePlaque"
    material = "Acier_S355"
    thickness = 2.5
    id_offset = 20000
    ```

=== "Fembic :material-text:"
    !!! note "Pièces Implicites"
        En Fembic, les pièces ne sont pas explicitement définies. Les propriétés comme le matériau et l'épaisseur sont assignées directement dans le bloc `ELEMENTS`.

    ```xml
    ELEMENTS TYPE MEMBRANE_3
    1 NODES = [1, 2, 3] MATERIAL = Acier_S235 T = 1.2
    ```

---

## Section

!!! info "TOML Uniquement"
    Ce bloc est spécifique au format **TOML**. En Fembic, les variations de propriétés sont définies ligne par ligne dans le bloc `ELEMENTS`.

Le bloc `section` permet d'assigner des propriétés physiques spécifiques à un sous-ensemble d'éléments au sein d'une Pièce. Il est utilisé pour définir des variations locales de matériaux, d'épaisseurs ou de paramètres d'intégration en ciblant un **Set** d'éléments.

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`set`** | String | **Oui** | - | Nom du [Set](#ensemble_set) d'éléments auquel cette section s'applique. |
| **`type`** | String | **Oui** | - | Technologie de section (ex: `SHELL`, `SOLID`). |
| `material` | String | Oui | - | Nom du [Matériau](#bibliotheque_de_materiaux). Surcharge le matériau au niveau Part. |
| `thickness` | Float | Non\* | - | Requis pour les types Coque. Surcharge l'épaisseur au niveau Part. |
| `nip` | Integer | Non | `3` | Nombre de points d'intégration dans l'épaisseur. |

### Exemples

Les sections sont définies comme une liste d'objets. Elles servent de pont entre un groupe d'éléments (un Set) et leur comportement physique.

=== "TOML :simple-toml:"
    ```toml
    # Assignation d'une épaisseur spécifique à une zone de renfort
    [section.ZoneRenforcee]
    set = "ElementsCentraux"
    type = "SHELL"
    thickness = 5.0
    nip = 5

    # Surcharge du matériau pour un set spécifique au sein d'une pièce
    [section.ZoneDeConnexion]
    set = "NoeudsBoulonnes"
    type = "SOLID"
    material = "AcierHauteResistance"
    ```

=== "Fembic :material-text:"
    !!! note "Logique Implicite"
        Fembic n'a pas de concept de "Section". Les variations de propriétés doivent être définies ligne par ligne dans le bloc `ELEMENTS`.

    ```xml
    ELEMENTS TYPE MEMBRANE_3
    1 NODES=[1,2,3] MATERIAL=Acier T=1.2
    2 NODES=[4,5,6] MATERIAL=Acier T=5.0  # Équivalent à un changement manuel de section
    ```

---

## Nœuds (Nodes - Legacy)

!!! info "Fembic Uniquement"
    Ce bloc est spécifique au format hérité **Fembic**. En TOML, les nœuds sont généralement définis dans un bloc `[mesh]` ou via le tableau `nodes` d'un maillage `INLINE`.

Le bloc `NODES` définit les coordonnées de chaque point du modèle et peut, optionnellement, leur assigner des conditions aux limites ou des charges directement.

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`ID`** | Entier | **Oui** | - | Identifiant unique du nœud. |
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

Voir la [Bibliothèque d'Éléments](#bibliotheque_delements) pour les technologies disponibles (ex: `MEMBRANE_3`, `S3L_C0`, `ROD_2`).

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`ID`** | Entier | **Oui** | - | Identifiant unique de l'élément. |
| **`NODES`** | Array | **Oui** | - | Liste des IDs de nœuds, ex: `[1, 2, 3]`. |
| **`MATERIAL`** | String | **Oui** | - | Nom du [Matériau](#materiau_material) à assigner. |
| `T` | Float | Non\* | - | Alias pour **thickness** (épaisseur). Requis pour Coques/Membranes. |
| `R` | Float | Non\* | - | Alias pour **radius** (rayon). Requis pour les Barres (Rods). |
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

Les Sets sont des groupes nommés d'entités (nœuds ou éléments) utilisés pour appliquer des conditions aux limites, des charges ou pour définir des [Sections](#section). Ils permettent une sélection modulaire des parties du modèle sans redéfinir la connectivité.

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Oui** | - | Type d'entité : `NODE` ou `ELEMENT`. |
| `nodes` | Array | Non\* | - | Liste d'IDs de nœuds. *Requis pour le type `NODE`.* |
| `elements` | Array | Non\* | - | Liste d'IDs d'éléments. *Requis pour le type `ELEMENT`.* |
| `range` | Array | Non\* | - | Définition par plage : `[début, fin, pas]`. |

!!! warning "Règles de Validation"
    - Vous devez fournir soit une liste (`nodes`/`elements`), soit une plage (`range`), mais **pas les deux**.
    - Pour le paramètre `range`, le pas (troisième valeur) **ne peut pas être nul**.

### Syntaxe de Plage (Range)

Le tableau `range` suit le format : `[id_debut, id_fin, pas]`.

*Exemple :* `range = [1, 10, 2]` sélectionnera les IDs : **1, 3, 5, 7, 9**.

### Exemples

=== "TOML :simple-toml:"
    ```toml
    # Set de nœuds spécifiques
    [set.NoeudsFixes]
    type = "NODE"
    nodes = [1, 2, 10, 15]

    # Set d'éléments définis par une plage
    [set.ElementsBase]
    type = "ELEMENT"
    range = [1, 100, 1]
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

Les Surfaces sont des entités topologiques créées par la fusion d'un ou plusieurs [Sets](#ensemble_set) existants. Elles sont principalement utilisées pour définir des limites d'interaction, telles que les zones de contact.

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Oui** | - | Type d'entité : `NODE` ou `ELEMENT`. |
| `node_sets` | Array | Non\* | - | Liste de noms de sets de nœuds à fusionner. *Requis pour le type `NODE`.* |
| `element_sets` | Array | Non\* | - | Liste de noms de sets d'éléments à fusionner. *Requis pour le type `ELEMENT`.* |

!!! info "Logique de Fusion"
    Lorsque vous fournissez plusieurs sets dans le tableau, COMFOR les fusionne automatiquement en une seule surface continue. Tous les sets référencés doivent exister et correspondre au `type` de la surface (ex: vous ne pouvez pas mettre un Set de Nœuds dans une Surface d'Éléments).

### Exemples

=== "TOML :simple-toml:"
    ```toml
    # Création d'une surface de contact maître en fusionnant deux sets d'éléments
    [surface.SurfaceContactMaitre]
    type = "ELEMENT"
    element_sets = ["ElementsFlasqueHaut", "ElementsAme"]

    # Création d'une surface nodale pour des sorties ou contraintes spécifiques
    [surface.InterfaceLimite]
    type = "NODE"
    node_sets = ["NoeudsBord_Gauche", "NoeudsBord_Droit"]
    ```

=== "Fembic :material-text:"
    ```xml
    SURFACES TYPE ELEMENT
    SurfaceContactMaitre ELEMENT_SETS = ["ElementsFlasqueHaut", "ElementsAme"]

    SURFACES TYPE NODE
    InterfaceLimite NODE_SETS = ["NoeudsBord_Gauche", "NoeudsBord_Droit"]
    ```

---

## Matériau (Material)

Le bloc `material` définit les lois de comportement et les propriétés physiques assignées aux pièces du modèle. COMFOR supporte une variété de modèles allant de l'élasticité linéaire standard aux lois textiles non linéaires avancées.

### Paramètres communs

Ces paramètres sont partagés par tous les modèles de matériaux.

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Oui** | - | Mot-clé du modèle de matériau. Voir la [Bibliothèque de Matériaux](#bibliotheque_de_materiaux). |
| **`density`** | Float | **Oui** | - | Densité du matériau ($\rho$). Doit être positive. |
| `damping` | Float | Non | `0.0` | Coefficient d'amortissement de Rayleigh proportionnel à la masse ($\alpha$). |

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
    MATERIALS TYPE ELASTIC Steel_S235  DENSITY=7.8E-9  YOUNG=210000.0  POISSON=0.3  DAMPING=0.1
    ```

---

## Amplitude

Le bloc `amplitude` définit des fonctions dépendantes du temps $y = f(t)$ utilisées pour mettre à l'échelle les charges, les conditions aux limites ou d'autres paramètres sensibles au temps.

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Oui** | - | Modèle d'amplitude. Voir la [Bibliothèque d'Amplitudes](#bibliotheque_damplitudes). |

### Exemples

=== "TOML :simple-toml:"
    ```toml
    # Une fonction rampe simple de 0 à 10 sur 1 seconde
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
        En Fembic, les `values` sont fournies sous forme de liste plate. Le parser apparie automatiquement les valeurs sous la forme `[temps, valeur]`.

    ```xml
    AMPLITUDES TYPE TABULAR
    RampeMontante VALUES = [0.0, 0.0, 1.0, 10.0, 2.0, 10.0]
    ```

---

## Contrainte (Constraint)

Le bloc `constraint` est utilisé pour imposer des valeurs à des degrés de liberté spécifiques pour un groupe de nœuds. C'est ainsi que vous définissez les conditions aux limites telles que les appuis fixes, les vitesses imposées ou les rotations prescrites.

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Oui** | - | Technologie de contrainte. Voir la [Bibliothèque de Contraintes](#bibliotheque_de_contraintes). |
| **`set`** | String | **Oui** | - | Nom du [Set de Nœuds](#ensemble_set) où la contrainte est appliquée. |
| `amplitude` | String | Non | - | Nom d'une [Amplitude](#amplitude) globale pour mettre à l'échelle tous les composants définis. |

### Exemples

=== "TOML :simple-toml:"
    ```toml
    # Appui fixe simple utilisant un preset
    [constraint.BaseFixe]
    type = "BOUNDARY_CONDITION"
    set = "NoeudsBase"
    preset = "FIXED"

    # Vitesse imposée avec une amplitude locale
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

Le bloc `load` définit les efforts externes appliqués au modèle. Il peut s'agir de forces/moments ponctuels sur les nœuds, de pressions distribuées sur les surfaces ou d'accélérations volumiques imposées.

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`set`** | String | **Oui** | - | Nom du [Set](#ensemble_set) ou de la [Surface](#surface) auquel appliquer la charge. |
| `amplitude` | String | Non | - | Nom de l'[Amplitude](#amplitude) utilisée pour mettre à l'échelle les valeurs. |
| `p` | Float | Non | `0.0` | Pression distribuée (généralement pour les éléments Coque/Membrane). |
| `fx`, `fy`, `fz` | Float | Non | `0.0` | Composantes de force ponctuelle selon les axes globaux X, Y et Z. |
| `mx`, `my`, `mz` | Float | Non | `0.0` | Composantes de moment ponctuel autour des axes globaux X, Y et Z. |
| `ax`, `ay`, `az` | Float | Non | `0.0` | Composantes d'accélération volumique linéaire. |
| `arx`, `ary`, `arz`| Float | Non | `0.0` | Composantes d'accélération volumique rotationnelle. |

### Logique d'évaluation

L'amplitude d'une composante de charge à un temps de simulation donné $t$ est calculée comme le produit de la valeur de base et du facteur d'amplitude :

$$F_{appliquee}(t) = F_{base} \times Amplitude(t)$$

Si aucune `amplitude` n'est spécifiée, le facteur d'échelle est par défaut de **1.0**.

### Exemples

=== "TOML :simple-toml:"
    ```toml
    # Application d'une force ponctuelle verticale à un set spécifique
    [load.ForcePoincon]
    set = "NoeudsHaut"
    fz = -500.0
    amplitude = "RampeDescendante"

    # Application d'une pression constante à une surface
    [load.PressionInterne]
    set = "SurfaceInterne"
    p = 10.5
    ```

=== "Fembic :material-text:"
    ```xml
    LOADS
    ForcePoincon SET = NoeudsHaut FZ = -500.0 AMPLITUDE = RampeDescendante

    LOADS
    PressionInterne SET = SurfaceInterne P = 10.5
    ```

!!! tip "Charges multi-composantes"
    Un seul bloc `load` peut définir plusieurs composantes (ex : `fx`, `fy` et `fz`) simultanément. Toutes les valeurs du bloc partagent la même `amplitude`.

---

## Comportement de Contact (Contact Behaviour)

Le bloc `contact_behaviour` définit les lois physiques (Normales et Tangentielles) qui régissent l'interaction entre deux surfaces. Ces lois doivent être définies par leur nom afin de pouvoir être assignées à une paire de [Contact](#contact) spécifique.

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Oui** | - | Mot-clé de technologie. Voir la [Bibliothèque de Comportements de Contact](#bibliotheque_de_comportements_de_contact). |

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
    mu = 0.15
    ```

=== "Fembic :material-text:"
    ```xml
    CONTACT_BEHAVIOURS TYPE LINEAR_PENALTY
    ContactDur STIFFNESS = 1.0e6

    CONTACT_BEHAVIOURS TYPE COULOMB
    FrottementAcier MU = 0.15
    ```

---

## Contact

Le bloc `contact` définit l'interaction entre les entités géométriques. Il apparie deux surfaces et leur assigne des lois physiques spécifiques définies dans la section [Comportement de Contact](#comportement_de_contact_contact_behaviour).

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Oui** | - | Technologie d'interaction. Actuellement supporté : `PAIR`. |
| `master` | String | Oui\* | - | Nom de la première [Surface](#surface) (Maître). |
| `slave` | String | Oui\* | - | Nom de la seconde [Surface](#surface) (Esclave). |
| `surfaces` | Array | Oui\* | - | Syntaxe alternative : Liste de deux surfaces `["Surf1", "Surf2"]`. |
| **`normal`** | String | **Oui** | - | Nom du comportement de [Contact Normal](#bibliotheque_de_comportements_de_contact) assigné. |
| **`tangential`**| String | **Oui** | - | Nom du comportement de [Contact Tangentiel](#bibliotheque_de_comportements_de_contact) assigné. |

!!! info "Définition de la Surface"
    Vous devez définir les surfaces impliquées en utilisant soit la paire `master`/`slave`, soit le tableau `surfaces`. L'utilisation simultanée des deux entraînera une erreur de validation.

### Exemples

=== "TOML :simple-toml:"
    ```toml
    # Interaction définie à l'aide des mots-clés Master/Slave
    [contact.OutilVersPiece]
    type = "PAIR"
    master = "SurfaceOutil"
    slave = "NoeudsPiece"
    normal = "PenaliteDure"
    tangential = "FrottementAcier"

    # Interaction définie à l'aide du tableau surfaces
    [contact.AutoContact]
    type = "PAIR"
    surfaces = ["SurfaceTissu", "SurfaceTissu"]
    normal = "PenaliteDouce"
    tangential = "FrottementTissu"
    ```

=== "Fembic :material-text:"
    ```xml
    CONTACTS TYPE PAIR
    OutilVersPiece MASTER = SurfaceOutil SLAVE = NoeudsPiece NORMAL = PenaliteDure TANGENTIAL = FrottementAcier

    CONTACTS TYPE PAIR
    AutoContact SURFACES = ["SurfaceTissu", "SurfaceTissu"] NORMAL = PenaliteDouce TANGENTIAL = FrottementTissu
    ```

---

## Tracker

Le bloc `tracker` enregistre des données de simulation discrètes dans des fichiers **CSV** séparés. C'est l'outil principal pour extraire l'historique nodal ou les variables d'état des éléments au fil du temps.

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Oui** | - | Type d'entité à suivre : `NODE` ou `ELEMENT`. |
| **`variable`** | String | **Oui** | - | Quantité physique à enregistrer. Voir la [Bibliothèque de Trackers](#bibliotheque_de_trackers). |

### Exemples

=== "TOML :simple-toml:"
    ```toml
    # Suivi de la force de réaction d'un set de nœuds selon la direction Z
    [tracker.ForceReaction]
    type = "NODE"
    variable = "FORCE"
    direction = "Z"
    nodes = [1, 2, 3, 4]

    # Suivi de la contrainte axiale dans un élément spécifique
    [tracker.ContrainteCoeur]
    type = "ELEMENT"
    variable = "STRESS"
    component = "C11"
    elements = [101]
    ```

=== "Fembic :material-text:"
    ```xml
    TRACKERS TYPE NODE
    ForceReaction NODES = [1, 2, 3, 4] VARIABLE = FORCE DIRECTION = Z

    TRACKERS TYPE ELEMENT
    ContrainteCoeur ELEMENTS = [101] VARIABLE = STRESS COMPONENT = C11
    ```

---

# Référence des Bibliothèques

## Bibliothèque d'Éléments

Le tableau suivant liste les technologies d'éléments finis disponibles. L'obligation de définir certains paramètres géométriques (comme `thickness` ou `radius`) dépend de la technologie de l'élément.

| Mot-clé | Nœuds | Catégorie | Paramètres Clés | Description |
| :--- | :---: | :--- | :--- | :--- |
| **`ROD_2`** | 2 | Barre | `radius`, `material` | Barre 1D supportant uniquement la traction et la compression axiale. |
| **`MEMBRANE_3`** | 3 | Coque | `thickness`, `material` | Membrane triangulaire à 3 nœuds (rigidité membranaire, pas de flexion). |
| **`S3L_C0`** | 3 | Coque | `thickness`, `material`, `nip` | Élément de coque à 3 nœuds avec flexion linéaire (continuité C0). |
| **`DKT18`** | 3 | Coque | `thickness`, `material`, `nip` | Triangle de Kirchhoff Discret (DKT) pour l'analyse de flexion de coques minces. |
| **`HEXA8`** | 8 | Solide | `material` | Élément brique isoparamétrique linéaire à 8 nœuds pour continuum 3D. |
| **`CONTACT_TRIANGLE`** | 3 | Contact | `thickness`, `factor`, `subtype` | Élément de contact de surface. Sous-types : `SOLID` ou `SHELL`. |
| **`CONTACT_LINE`** | 2 | Contact | `radius`, `factor` | Élément 1D pour la détection de contact bord-à-bord ou nœud-à-bord. |

### Détails des Paramètres

* **`material`** : Nom du matériau assigné à l'élément. Requis pour tous les éléments structurels.
* **`thickness`** : Épaisseur physique de la coque, de la membrane ou de la surface de contact.
* **`radius`** : Rayon de la section transversale pour `ROD_2` ou `CONTACT_LINE`.
* **`nip`** : Nombre de points d'intégration dans l'épaisseur (généralement de 1 à 5).
* **`factor`** : Facteur de pénalité utilisé pour imposer les contraintes de contact (rigidité).
* **`friction`** : Coefficient de frottement de Coulomb pour les interactions de contact.

!!! tip "Logique de Contact"
    Les éléments structurels comme `MEMBRANE_3` ou `DKT18` peuvent déclencher une détection de contact interne si le paramètre `contact` est réglé sur `BASIC` ou `EDGE` dans leur définition. Cela crée automatiquement des entités sous-jacentes `CONTACT_TRIANGLE` ou `CONTACT_LINE`.

---

## Bibliothèque de Matériaux

Cette section liste les paramètres spécifiques requis pour chaque technologie de matériau.

### ELASTIC (Élastique)
Élasticité linéaire isotrope standard basée sur la loi de Hooke. Elle suppose un état de contraintes planes pour les éléments 2D.

| Paramètre | Type | Requis | Plage | Description |
| :--- | :--- | :---: | :---: | :--- |
| `young` | Float | **Oui** | $>0$ | Module de Young ($E$). |
| `poisson` | Float | **Oui** | $[0, 0.5]$ | Coefficient de Poisson ($\nu$). |

### HYPERELASTIC (Hyperélastique)
Modèle élastique non linéaire pour l'analyse des grandes déformations (caoutchoucs, tissus mous). Supporte actuellement le potentiel d'**Ogden** pour les matériaux incompressibles.

| Paramètre | Type | Requis | Description |
| :--- | :--- | :---: | :--- |
| `potential` | String | **Oui** | Type de potentiel. Supporté : `OGDEN`. |
| `mu` | Array | **Oui** | Liste des modules de cisaillement $\mu_i$. |
| `alpha` | Array | **Oui** | Liste des exposants non linéaires $\alpha_i$. |

!!! note "Cohérence des Tableaux"
    Les tableaux `mu` et `alpha` doivent avoir le même nombre d'entrées. Chaque paire $( \mu_i, \alpha_i )$ définit un terme du potentiel d'énergie de déformation d'Ogden.

### HYPERTEXTILE
Modèle avancé basé sur les invariants, spécifiquement conçu pour les renforts textiles secs ou imprégnés. Il découple l'allongement dans les directions chaîne/trame du cisaillement plan.

| Paramètre | Type | Requis | Description |
| :--- | :--- | :---: | :--- |
| **`warp_orientation`**| Array | **Oui** | Vecteur unitaire $[x, y, z]$ pour la direction initiale des fibres de chaîne (warp). |
| **`weft_orientation`**| Array | **Oui** | Vecteur unitaire $[x, y, z]$ pour la direction initiale des fibres de trame (weft). |
| **`k_shear`** | Array | **Oui** | Coefficients polynomiaux pour la rigidité en cisaillement. |
| **`k_elong_warp`** | Array | **Oui** | Coefficients polynomiaux pour l'allongement chaîne. |
| **`k_elong_weft`** | Array | **Oui** | Coefficients polynomiaux pour l'allongement trame. |
| `k_bend_warp` | Array | Non | Coefficients pour les moments de flexion chaîne. |
| `k_bend_weft` | Array | Non | Coefficients pour les moments de flexion trame. |
| `k_bend_twist` | Array | Non | Coefficients pour les moments de torsion. |

!!! tip "Projection de l'Orientation"
    Lors de l'initialisation, COMFOR projette automatiquement les vecteurs d'orientation globaux sur la base locale de chaque élément. Si une direction de fibre est perpendiculaire au plan d'un élément, la simulation s'arrêtera avec une erreur.

---

## Bibliothèque d'Amplitudes

### TABULAR (Tabulaire)
Le type `TABULAR` définit une fonction via une série de paires discrètes temps/valeur. COMFOR effectue une **interpolation linéaire** entre les points fournis.

| Paramètre | Type | Requis | Description |
| :--- | :--- | :---: | :--- |
| **`values`** | Array | **Oui** | Liste de paires `[temps, valeur]`. |

!!! info "Logique Opérationnelle"
    * **Interpolation** : Linéaire entre les points définis.
    * **Hors Limites** : Si le temps actuel de simulation est en dehors de la plage définie $[t_{min}, t_{max}]$, l'amplitude renvoie **0.0**.
    * **Tri** : COMFOR trie automatiquement les paires par temps croissant lors de l'initialisation.

---

## Bibliothèque de Contraintes

### BOUNDARY_CONDITION (Condition aux Limites)

Cette technologie prescrit des vitesses nodales ($v$) et des accélérations ($a$). Vous pouvez définir les composantes comme de simples valeurs numériques ou comme des maps complexes pour inclure des amplitudes locales.

#### Syntaxe des Composantes

Chaque composante (ex: `vx`, `vry`, `az`) peut être définie de deux manières :

1.  **Numérique** : `vx = 1.0` (Mise à l'échelle par l'amplitude globale de la contrainte si fournie).
2.  **Map** : `vx = { value = 1.0, amplitude = "MonAmp" }` (Utilise une amplitude spécifique pour cette composante).

#### Paramètres Disponibles

| Paramètre | Catégorie | Description |
| :--- | :--- | :--- |
| `preset` | Spécial | Utilisez `FIXED` pour fixer toutes les vitesses (linéaires et rotationnelles) à 0.0. |
| `vx`, `vy`, `vz` | Vitesse Linéaire | Vitesse prescrite selon les axes X, Y ou Z. |
| `vrx`, `vry`, `vrz`| Vitesse Rot. | Vitesse angulaire prescrite autour des axes X, Y ou Z. |
| `ax`, `ay`, `az` | Accélération | Accélération prescrite selon les axes X, Y ou Z. |

!!! info "Vitesse vs Accélération"
    Si une composante de vitesse (ex : `vx`) est définie, toute accélération prescrite pour le même axe (`ax`) est ignorée et forcée à $0.0$ pour garantir la cohérence cinématique.

#### Évaluation de la Valeur
La valeur appliquée à un temps $t$ donné est calculée comme suit :

$$V_{appliquee}(t) = Valeur \times Amplitude(t)$$

Si aucune amplitude locale n'est définie pour la composante, elle utilise par défaut l'`amplitude` globale définie au niveau du bloc. Si aucune des deux n'est présente, le facteur est de $1.0$.

---

## Bibliothèque de Comportements de Contact

Cette référence liste les paramètres spécifiques requis pour chaque technologie de contact.

### LINEAR_PENALTY (Normal)

Un modèle de ressort linéaire qui applique une force de réaction proportionnelle à la distance de pénétration (*gap*).

| Paramètre | Type | Requis | Description |
| :--- | :--- | :---: | :--- |
| `stiffness` | Float | **Oui** | Raideur de pénalité (Alias : `factor`). |

### PENALTY_ADHESION (Normal)

Une loi normale qui gère à la fois la compression (pénalité) et les forces adhésives (tension) lorsque les surfaces tentent de se séparer.

| Paramètre | Type | Requis | Description |
| :--- | :--- | :---: | :--- |
| `stiffness` | Float | **Oui** | Raideur en compression (Alias : `factor`). |
| `strength` | Float | **Oui** | Magnitude de la force adhésive (Alias : `adhesive_strength`). |
| `threshold` | Float | Non | Distance limite pour l'adhésion (Alias : `adhesion_threshold`). Par défaut : l'épaisseur de l'élément. |

### COULOMB (Tangentiel)

Modèle de frottement standard. Il inclut une régularisation par *facteur de lissage* (smooth factor) pour assurer la stabilité numérique lors des changements de direction de glissement.

| Paramètre | Type | Requis | Description |
| :--- | :--- | :---: | :--- |
| `friction` | Float | **Oui** | Coefficient de frottement $\mu$ (Alias : `mu`). |

!!! info "Régularisation"
    L'implémentation `COULOMB` utilise un facteur de lissage basé sur le produit scalaire des vecteurs de glissement actuel et précédent. Cela minimise les oscillations numériques lorsque la direction de glissement change brusquement.

---

## Bibliothèque de Trackers

### NODE (Nœud)

Suit les données cinématiques ou cinétiques pour une liste spécifique de nœuds.

| Paramètre | Type | Requis | Description |
| :--- | :--- | :---: | :--- |
| **`nodes`** | Array | **Oui** | Liste des IDs de nœuds à suivre. |
| **`direction`**| String | **Oui** | Direction de la composante globale : `X`, `Y` ou `Z`. |
| **`variable`** | String | **Oui** | Supporté : `FORCE`, `MOMENT`, `POSITION`, `VELOCITY`, `ACCELERATION`, `CONTACTFORCE`, `CONTACTSLIDING`. |

!!! info "Alias"
    Le mot-clé `CONTACTSLIDINGVELOCITY` peut être utilisé comme alias pour `CONTACTSLIDING`.

### ELEMENT (Élément)

Suit les variables d'état internes pour une liste spécifique d'éléments.

| Paramètre | Type | Requis | Description |
| :--- | :--- | :---: | :--- |
| **`elements`** | Array | **Oui** | Liste des IDs d'éléments à suivre. |
| **`component`** | String | **Oui** | Composante du tenseur : `C11`, `C22`, `C33`, `C12`, `C13`, `C23`. |
| **`variable`** | String | **Oui** | Supporté : `STRAIN` (Déformation), `STRESS` (Contrainte). |

!!! tip "Valeurs Totales"
    Dans le CSV généré, la dernière colonne est automatiquement calculée comme la **Somme** (pour les trackers de nœuds) ou la **Moyenne** (pour les trackers d'éléments) de toutes les entités suivies.

[^1]: L'analyse syntaxique, ou analyse syntaxique, est le processus qui consiste à analyser une chaîne de symboles, qu'il s'agisse d'un langage naturel, d'un langage informatique ou d'une structure de données, conformément aux règles d'une grammaire formelle. [Wikipedia](https://en.wikipedia.org/wiki/Parsing){:target="_blank"}
