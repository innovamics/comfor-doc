<style>
  .md-sidebar--secondary .md-nav__list .md-nav__list .md-nav__item .md-nav {
    display: none !important;
  }
</style>

<div class="grid cards" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))" markdown>

- :material-vector-line:{ .lg .middle }
  [<span style="color: #76B900; font-weight: bold;">Éléments 1D</span>](#elements_1d)

- :material-vector-triangle:{ .lg .middle }
  [<span style="color: #c73131ff; font-weight: bold;">Coque & Membrane</span>](#elements_2d_coque_membrane)

- :material-hand-pointing-right:{ .lg .middle }
  [<span style="color: #2B17E5; font-weight: bold;">Éléments de Contact</span>](#elements_de_contact)

</div>

Cette section présente une **vue d'ensemble pratique** des formulations d'éléments finis disponibles dans **COMFOR**. Les propriétés physiques (telles que le matériau ou l'épaisseur) sont assignées indirectement aux éléments via les [Sections](sections.md) et les [Assignations de Section](../preprocessing.md#assignation_de_section_section_assignment).

# Types d'Éléments Disponibles

## Paramètres Communs à Tous les Éléments

Toutes les définitions d'éléments nécessitent le tableau `nodes` pour définir la connectivité.

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Oui** | - | Mot-clé de la formulation de l'élément. |
| **`nodes`** | Array | **Oui** | - | Tableau des IDs de nœuds définissant la connectivité de l'élément. |
| `contact` | String | Non | - | Déclencheur interne de détection de contact : `"BASIC"` ou `"EDGE"`. |
| `load` | String | Non | - | Nom optionnel d'une [Charge](../preprocessing.md#charge_load) cible. |

!!! note "TOML"
    En TOML, les éléments sont créés à partir d'un [maillage](../preprocessing.md#maillage_mesh) : le type provient du lecteur de maillage (éventuellement modifié avec `element_mapping`) et la connectivité du fichier de maillage. Les charges sont appliquées avec des blocs [load](../preprocessing.md#charge_load) sur des sets d'éléments, et le contact avec des blocs [contact](../preprocessing.md#contact). Les paramètres d'élément `contact` et `load` ne sont utilisés que par l'ancien format Fembic.

---

## Éléments 1D

Les éléments structuraux 1D modélisent le comportement de barre/treillis axial le long d'une connectivité linéaire.

### ROD_2

Élément barre/treillis linéaire à 2 nœuds supportant la traction et la compression axiales.

| Paramètre | Valeur / Plage | Description |
| :--- | :--- | :--- |
| **Nœuds** | 2 | Tableau de connectivité des nœuds `[N1, N2]`. |
| **Section Requise** | `ROD` | Nécessite une section avec un `radius` et un `material` définis. |
| **Support du Contact** | `"EDGE"` | Génère un `CONTACT_LINE` interne pour la détection de contact sur les bords. |

#### Exemple

=== "TOML :simple-toml:"
    ```toml
    [mesh.BarreInline]
    type = "INLINE"
    nodes = [ [1, 0.0, 0.0, 0.0], [2, 10.0, 0.0, 0.0] ]
    elements = [ [1, "ROD_2", 1, 2] ]
    ```

---

## Éléments 2D Coque & Membrane

Formulations d'éléments surfaciques 2D pour les membranes et les coques minces.

### MEMBRANE_3

Élément membrane triangulaire à 3 nœuds avec rigidité dans le plan et sans résistance à la flexion.

| Paramètre | Valeur / Plage | Description |
| :--- | :--- | :--- |
| **Nœuds** | 3 | Tableau de connectivité des nœuds `[N1, N2, N3]`. |
| **Section Requise** | `MEMBRANE` | Nécessite une section avec `thickness` et `material`. |
| **Support du Contact** | `"BASIC"`, `"EDGE"` | Génère des `CONTACT_TRIANGLE` internes (et `CONTACT_LINE` pour `"EDGE"`). |

---

### S3L_C0

Élément coque triangulaire à 3 nœuds avec formulation de flexion linéaire continue $C^0$.

| Paramètre | Valeur / Plage | Description |
| :--- | :--- | :--- |
| **Nœuds** | 3 | Tableau de connectivité des nœuds `[N1, N2, N3]`. |
| **Section Requise** | `SHELL_GAUSS`, `SHELL_GENERALIZED` | Nécessite une section coque avec `thickness` et `material` (plus `nip` pour `SHELL_GAUSS`). |
| **Support du Contact** | `"BASIC"`, `"EDGE"` | Génère des entités de contact internes. |

---

### DKT18

Élément triangle de Kirchhoff discret (DKT) à 3 nœuds pour l'analyse de flexion de coques minces.

| Paramètre | Valeur / Plage | Description |
| :--- | :--- | :--- |
| **Nœuds** | 3 | Tableau de connectivité des nœuds `[N1, N2, N3]`. |
| **Section Requise** | `SHELL_GAUSS`, `SHELL_GENERALIZED` | Nécessite une section coque avec `thickness` et `material` (plus `nip` pour `SHELL_GAUSS`). |
| **Support du Contact** | `"BASIC"`, `"EDGE"` | Génère des entités de contact internes. |

#### Exemples

=== "TOML :simple-toml:"
    ```toml
    [mesh.Plaque]
    type = "INLINE"
    nodes = [
        [1, 0.0, 0.0, 0.0],
        [2, 1.0, 0.0, 0.0],
        [3, 1.0, 1.0, 0.0]
    ]
    elements = [
        [1, "DKT18", 1, 2, 3]
    ]
    ```

=== "Fembic :material-text:"
    ```xml
    ELEMENTS TYPE DKT18
    1 NODES = [1, 2, 3]
    ```

---

## Éléments de Contact

Éléments de contact spécialisés générés automatiquement ou définis explicitement pour imposer les conditions aux limites de contact.

### CONTACT_TRIANGLE

Élément triangle de contact surfacique à 3 nœuds.

| Paramètre | Valeur / Plage | Description |
| :--- | :--- | :--- |
| **Nœuds** | 3 | Tableau de connectivité des nœuds `[N1, N2, N3]`. |
| **Section Requise** | `RIGID` | Lié à une section rigide définissant l'épaisseur physique (`thickness`) et la géométrie (`geometry` : `"SHELL"` ou `"SOLID"`). |

---

### CONTACT_LINE

Élément de contact linéaire à 2 nœuds pour l'interaction bord-à-bord ou nœud-à-bord.

| Paramètre | Valeur / Plage | Description |
| :--- | :--- | :--- |
| **Nœuds** | 2 | Tableau de connectivité des nœuds `[N1, N2]`. |
| **Section Requise** | `RIGID` | Lié à une section rigide définissant l'épaisseur (`thickness`, utilisée comme rayon de contact $r = t/2$). |

!!! warning "Obsolescence des Paramètres de Contact"
    Dans COMFOR TOML, les facteurs de pénalité (`factor`) et les coefficients de frottement (`friction`) ne sont plus spécifiés directement sur les éléments. Ils doivent être configurés dans les blocs [Comportement de Contact](contact_behaviours.md) et assignés via les [Paires de Contact](../preprocessing.md#contact).

---

# Choisir un Type d'Élément

- Utilisez **`MEMBRANE_3`** pour les tissus secs minces ou les films où la rigidité en flexion est négligeable.
- Utilisez **`DKT18`** ou **`S3L_C0`** pour les structures de coques minces nécessitant des calculs de flexion hors-plan et de courbure.
- Utilisez **`ROD_2`** pour les éléments structuraux 1D ou les renforts de bord.
- Utilisez **`contact = "BASIC"`** ou **`contact = "EDGE"`** sur les éléments structuraux pour instancier automatiquement la géométrie de contact sous-jacente.