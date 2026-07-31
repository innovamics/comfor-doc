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
Dans le fichier CSV généré, chaque ligne correspond à un pas de temps. Les colonnes représentent :
1. **Temps**
2. Les valeurs individuelles par nœud (`Nœud N1`, `Nœud N2`, ...)
3. **Total** : Somme cumulée de toutes les valeurs nodales suivies à ce pas de temps.

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

Suivent les composantes du tenseur des contraintes ou des déformations internes pour un groupe ou une liste d'éléments au cours du temps.

### Paramètres

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`component`** | String | **Oui** | - | Composante du tenseur : `"C11"`, `"C22"`, `"C33"`, `"C12"`, `"C13"` ou `"C23"`. |
| `elements` | Array | Oui* | - | Liste explicite d'IDs d'éléments. *Requis si `set` n'est pas renseigné.* |

### Variables Supportées

| Mot-clé | Description |
| :--- | :--- |
| **`STRAIN`** | Composante locale du tenseur de déformation de l'élément. |
| **`STRESS`** | Composante locale du tenseur de contrainte de Cauchy de l'élément. |

### Format de Sortie
Dans le fichier CSV généré, chaque ligne correspond à un pas de temps. Les colonnes représentent :
1. **Temps**
2. Les valeurs individuelles par élément (`Élément E1`, `Élément E2`, ...)
3. **Total** : Valeur moyenne sur l'ensemble des éléments suivis à ce pas de temps.

### Exemples

=== "TOML :simple-toml:"
    ```toml
    # Suivi de la composante de déformation axiale C11 sur un groupe d'éléments de tissu
    [tracker.DeformationChaine]
    type = "ELEMENT"
    variable = "STRAIN"
    component = "C11"
    set = "ElementsTissu"

    # Suivi de la contrainte de cisaillement C12 sur des éléments spécifiques
    [tracker.ContrainteCisaillement]
    type = "ELEMENT"
    variable = "STRESS"
    component = "C12"
    elements = [50, 51, 52]
    ```

=== "Fembic :material-text:"
    ```xml
    TRACKERS TYPE ELEMENT
    DeformationChaine SET = ElementsTissu VARIABLE = STRAIN COMPONENT = C11

    TRACKERS TYPE ELEMENT
    ContrainteCisaillement ELEMENTS = [50, 51, 52] VARIABLE = STRESS COMPONENT = C12
    ```

---

# Choisir un Type de Tracker

- Utilisez le tracker **`NODE`** avec `variable = "FORCE"` ou `variable = "CONTACTFORCE"` sur les nœuds de support pour exporter les courbes de charge totale du poinçon en fonction du temps.
- Utilisez le tracker **`ELEMENT`** avec `variable = "STRAIN"` et `component = "C11"` / `"C22"` / `"C12"` pour extraire l'historique des déformations locales en chaîne, trame ou cisaillement.