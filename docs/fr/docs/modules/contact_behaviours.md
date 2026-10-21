<style>
  .md-sidebar--secondary .md-nav__list .md-nav__list .md-nav__item .md-nav {
    display: none !important;
  }
</style>

<div class="grid cards" style="grid-template-columns: repeat(auto-fit, minmax(200px, 320px))" markdown>

- :material-arrow-down-bold:{ .lg .middle }
  [<span style="color: #76B900; font-weight: bold;">Lois Normales</span>](#lois_normales_normal_contact_laws)

- :material-arrow-expand-horizontal:{ .lg .middle }
  [<span style="color: #c73131ff; font-weight: bold;">Lois Tangentielles</span>](#lois_tangentielles_tangential_contact_laws)

</div>

Cette section présente une **vue d'ensemble pratique** des lois physiques régissant l'interaction entre surfaces dans **COMFOR**. Les comportements de contact sont définis de manière indépendante et référencés par les blocs [Contact](../preprocessing.md#contact).

# Types de Comportements de Contact Disponibles

## Paramètres Communs à Tous les Comportements de Contact

Chaque bloc de comportement de contact nécessite ce paramètre de base :

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Oui** | - | Mot-clé de la loi de contact (`LINEAR_PENALTY`, `PENALTY_ADHESION`, `COULOMB`). |

---

## Lois Normales (Normal Contact Laws)

Les lois normales calculent les forces de réaction perpendiculaires à l'interface pour empêcher la pénétration ou gérer l'adhésion.

### LINEAR_PENALTY

Un modèle de ressort de pénalité linéaire qui applique une force de compression normale proportionnelle à la distance de pénétration (*gap*).

| Paramètre | Type | Requis | Description |
| :--- | :--- | :---: | :--- |
| **`stiffness`** | Float | **Oui** | Raideur du ressort de pénalité. Doit être strictement positive. *(Alias: `factor`)* |

#### Exemples

=== "TOML :simple-toml:"
    ```toml
    [contact_behaviour.NormalDur]
    type = "LINEAR_PENALTY"
    stiffness = 1.0e6
    ```

=== "Fembic :material-text:"
    ```xml
    CONTACT_BEHAVIOURS TYPE LINEAR_PENALTY
    NormalDur STIFFNESS = 1.0e6
    ```

---

### PENALTY_ADHESION

Une loi normale qui gère à la fois les forces de pénalité en compression lors de la pénétration et les forces adhésives en traction lors de la séparation.

| Paramètre | Type | Requis | Description |
| :--- | :--- | :---: | :--- |
| **`stiffness`** | Float | **Oui** | Raideur de pénalité en compression. Doit être strictly positive. *(Alias: `factor`)* |
| **`strength`** | Float | **Oui** | Intensité de la force adhésive par unité d'surface. Doit être non-négative. *(Alias: `adhesive_strength`)* |
| `threshold` | Float | Non | Distance tolérée pour l'adhésion. Par défaut : l'épaisseur de l'élément ($t$). *(Alias: `adhesion_threshold`)* |

#### Exemples

=== "TOML :simple-toml:"
    ```toml
    [contact_behaviour.OutilAdhesif]
    type = "PENALTY_ADHESION"
    stiffness = 1.0e6
    strength = 50.0
    threshold = 0.5
    ```

=== "Fembic :material-text:"
    ```xml
    CONTACT_BEHAVIOURS TYPE PENALTY_ADHESION
    OutilAdhesif STIFFNESS = 1.0e6 STRENGTH = 50.0 THRESHOLD = 0.5
    ```

---

## Lois Tangentielles (Tangential Contact Laws)

Les lois tangentielles calculent les forces de frottement parallèles au plan de contact.

### COULOMB

Loi de frottement de Coulomb classique. Elle applique une force tangentielle proportionnelle à la force normale de contact et au coefficient de frottement $\mu$.

| Paramètre | Type | Requis | Description |
| :--- | :--- | :---: | :--- |
| **`friction`** | Float | **Oui** | Coefficient de frottement $\mu$. Doit être non-négatif. *(Alias: `mu`)* |

!!! info "Régularisation & Facteur de Lissage"
    Afin de minimiser les oscillations numériques lors de changements brusques de direction de glissement, l'implémentation de `COULOMB` utilise un facteur de lissage continu dérivé du produit scalaire des vecteurs de glissement consécutifs.

#### Exemples

=== "TOML :simple-toml:"
    ```toml
    [contact_behaviour.FrottementAcier]
    type = "COULOMB"
    friction = 0.15
    ```

=== "Fembic :material-text:"
    ```xml
    CONTACT_BEHAVIOURS TYPE COULOMB
    FrottementAcier FRICTION = 0.15
    ```

---

# Choisir un Comportement de Contact

- Utilisez **`LINEAR_PENALTY`** (Loi normale) + **`COULOMB`** (Loi tangentielle) pour les interfaces classiques outil-pièce ou l'auto-contact.
- Utilisez **`PENALTY_ADHESION`** (Loi normale) pour les outils collants, les analyses de poisse (tack) ou le formage de composites riches en résine.