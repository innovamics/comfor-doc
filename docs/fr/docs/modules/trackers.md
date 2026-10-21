<style>
  .md-sidebar--secondary .md-nav__list .md-nav__list .md-nav__item .md-nav {
    display: none !important;
  }
</style>

<div class="grid cards" style="grid-template-columns: repeat(auto-fit, minmax(200px, 320px))" markdown>

- :material-vector-point:{ .lg .middle }
  [<span style="color: #76B900; font-weight: bold;">Trackers Nodaux</span>](#trackers_nodaux_node)

- :material-shape-polygon-plus:{ .lg .middle }
  [<span style="color: #c73131ff; font-weight: bold;">Trackers d'Éléments</span>](#trackers_delements_element)

</div>

Cette section présente une **vue d'ensemble pratique** des modules de suivi (trackers) disponibles dans **COMFOR**. Les trackers enregistrent l'historique temporel de données spécifiques à des nœuds ou à des éléments dans des fichiers **CSV** dédiés pendant la simulation.

# Types de Trackers Disponibles

## Paramètres Communs à Tous les Trackers

Chaque bloc de tracker nécessite ces paramètres de base :

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Oui** | - | Type d'entité à suivre : `NODE` ou `ELEMENT`. |
| **`variable`** | String | **Oui** | - | Grandeur physique à exporter. |
| `set` | String | Oui* | - | Nom du [Set](../preprocessing.md#ensemble_set) cible. *Requis si une liste explicite d'IDs n'est pas utilisée.* |

!!! warning "Exclusivité de la Cible"
    Les entités cibles doivent être définies en utilisant **soit** un nom de `set`, **soit** une liste explicite d'IDs (`nodes` / `elements`), mais **jamais les deux**.

---

## Trackers Nodaux (NODE)

Suivent les données cinématiques, cinétiques ou de contact pour un groupe ou une liste de nœuds au cours du temps.

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`direction`** | String | **Oui** | - | Direction de la composante dans le repère cartésien global : `"X"`, `"Y"` ou `"Z"`. |
| `nodes` | Array | Oui* | - | Liste explicite d'IDs de nœuds. *Requis si `set` n'est pas renseigné.* |

### Variables Supportées

| Mot-clé | Description |
| :--- | :--- |
| **`FORCE`** | Force nodale interne résultante. |
| **`MOMENT`** | Moment nodal interne résultant. |
| **`POSITION`** | Coordonnée nodale actuelle ($x, y$ ou $z$). |
| **`VELOCITY`** | Vitesse de translation nodale actuelle. |
| **`ACCELERATION`** | Accélération de translation nodale actuelle. |
| **`CONTACTFORCE`** | Composante du vecteur de force de réaction de contact nodale. |
| **`CONTACTSLIDING`** | Vitesse de glissement relatif de contact nodale *(Alias : `CONTACTSLIDINGVELOCITY`)*. |

### Format de Sortie
Le fichier CSV `<racine_résultats>/<nom_tracker>.csv` contient une ligne par frame de [sortie](../preprocessing.md#sorties_output). Les colonnes sont séparées par `, ` (virgule et espace). Les colonnes représentent :
1. **Temps**
2. Les valeurs individuelles par nœud (`Nœud N1`, `Nœud N2`, ...)
3. **Total** : Somme de toutes les valeurs nodales suivies.

### Exemples

=== "TOML :simple-toml:"
    ```toml
    # Suivi des forces de réaction selon la direction Z sur un groupe de nœuds contraints
    [tracker.ForceReaction]
    type = "NODE"
    variable = "FORCE"
    direction = "Z"
    set = "NoeudsBaseFixe"

    # Suivi de la position Z sur des IDs de nœuds explicites
    [tracker.DeplacementPoincon]
    type = "NODE"
    variable = "POSITION"
    direction = "Z"
    nodes = [101, 102, 103]
    ```

=== "Fembic :material-text:"
    ```xml
    TRACKERS TYPE NODE
    ForceReaction SET = NoeudsBaseFixe VARIABLE = FORCE DIRECTION = Z

    TRACKERS TYPE NODE
    DeplacementPoincon NODES = [101, 102, 103] VARIABLE = POSITION DIRECTION = Z
    ```

---

## Trackers d'Éléments (ELEMENT)

Suit dans le temps une composante d'un champ de résultat élémentaire pour un set ou une liste d'éléments.

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`component`** | String | **Oui** | - | Composante de la variable, voir le tableau ci-dessous. |
| `elements` | Array | Oui* | - | Liste explicite d'identifiants d'éléments. *Requis si `set` n'est pas fourni.* |

### Variables Supportées

| Mot-clé | Composantes | Description |
| :--- | :--- | :--- |
| **`STRAIN`** | `C11`, `C22`, `C33`, `C23`, `C13`, `C12` | Déformation de l'élément dans le repère local. |
| **`GREEN_LAGRANGE_STRAIN`** | `xx`, `yy`, `zz`, `xy`, `yz`, `xz` | Tenseur des déformations de Green-Lagrange. |
| **`DEFORMATION_GRADIENT`** | `xx`, `xy`, `xz`, `yx`, `yy`, `yz`, `zx`, `zy`, `zz` | Gradient de la transformation $\mathbf{F}$. |
| **`CAUCHY_STRESS`** | `xx`, `yy`, `zz`, `xy`, `yz`, `xz` | Tenseur des contraintes de Cauchy. |
| **`SHEAR_ANGLE`** | `value` | Angle de cisaillement plan du renfort (matériaux composites). |
| **`FIBER_STRAIN`** | `warp`, `weft` | Déformation selon les directions des fibres (matériaux composites). |
| **`FIBER_STRESS`** | `warp`, `weft` | Contrainte selon les directions des fibres (matériaux composites). |
| **`FIBER_CURVATURE`** | `warp`, `weft` | Courbure selon les directions des fibres (matériaux composites). |
| **`FIBER_ORIENTATION_WARP`** | `x`, `y`, `z` | Direction courante de la chaîne (matériaux composites). |
| **`FIBER_ORIENTATION_WEFT`** | `x`, `y`, `z` | Direction courante de la trame (matériaux composites). |

!!! warning "Disponibilité"
    La variable doit être disponible pour **chaque** élément suivi. Les éléments de contact rigides n'ont ni contrainte ni déformation, et les variables de fibres ne sont définies que pour les matériaux composites (`HYPERTEXTILE`) : choisissez les éléments suivis en conséquence, sinon la simulation s'arrête avec une erreur lors de l'écriture du tracker.

### Format de Sortie
Le fichier CSV `<racine_résultats>/<nom_tracker>.csv` contient une ligne par frame de [sortie](../preprocessing.md#sorties_output). Les colonnes sont séparées par `, ` (virgule et espace). Les colonnes représentent :
1. **Time**
2. Les valeurs de chaque élément (`Element E1`, `Element E2`, ...)
3. **Total** : Somme de toutes les valeurs des éléments suivis.

### Exemples

=== "TOML :simple-toml:"
    ```toml
    # Suivi de l'angle de cisaillement sur un set d'éléments du renfort
    [tracker.CisaillementRenfort]
    type = "ELEMENT"
    variable = "SHEAR_ANGLE"
    component = "value"
    set = "ElementsRenfort"

    # Suivi de la contrainte dans la chaîne sur des éléments explicites
    [tracker.ContrainteChaine]
    type = "ELEMENT"
    variable = "FIBER_STRESS"
    component = "warp"
    elements = [50, 51, 52]
    ```

=== "Fembic :material-text:"
    ```xml
    TRACKERS TYPE ELEMENT
    CisaillementRenfort SET = ElementsRenfort VARIABLE = SHEAR_ANGLE COMPONENT = value

    TRACKERS TYPE ELEMENT
    ContrainteChaine ELEMENTS = [50, 51, 52] VARIABLE = FIBER_STRESS COMPONENT = warp
    ```

---

# Choisir un Type de Tracker

- Utilisez le tracker **`NODE`** avec `variable = "FORCE"` ou `variable = "CONTACTFORCE"` sur les nœuds de support pour exporter les courbes de charge totale du poinçon en fonction du temps.
- Utilisez le tracker **`ELEMENT`** avec `variable = "SHEAR_ANGLE"`, `"FIBER_STRAIN"` ou `"FIBER_STRESS"` pour extraire l'historique local du cisaillement, de la chaîne ou de la trame d'un renfort.
