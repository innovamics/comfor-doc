<style>
  .md-sidebar--secondary .md-nav__list .md-nav__list .md-nav__item .md-nav {
    display: none !important;
  }

  .md-typeset td:first-child, .md-typeset th:first-child {
    white-space: nowrap;
  }
</style>

<div class="grid cards" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))" markdown>

- :material-vector-line:{ .lg .middle }
  [<span style="color: #76B900; font-weight: bold;">Section Barre 1D</span>](#sections_barres_rod_sections)

- :material-vector-triangle:{ .lg .middle }
  [<span style="color: #c73131ff; font-weight: bold;">Coque & Membrane</span>](#sections_coque_membrane_shell_membrane_sections)

- :material-cube-outline:{ .lg .middle }
  [<span style="color: #2B17E5; font-weight: bold;">Section Rigide</span>](#sections_rigides_rigid_sections)

</div>

Cette section présente une **vue d'ensemble pratique** des formulations de sections disponibles dans **COMFOR**. Les sections font le lien entre les éléments finis structuraux et les lois de comportement des matériaux en définissant les sections transversales géométriques, les règles d'intégration et les dimensions physiques.

# Types de Sections Disponibles

## Paramètres Communs à Toutes les Sections

La plupart des types de sections assignent une loi de comportement et nécessitent les paramètres de base suivants :

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Oui** | - | Mot-clé de la formulation de la section. |
| **`material`** | String | Oui* | - | Nom du [Matériau](materials.md) assigné. *Requis pour tous les types de sections sauf `RIGID`.* |

---

## Sections Barres (Rod Sections)

Sections conçues pour les éléments 1D de type treillis et ligne.

### ROD

Définit une section transversale circulaire 1D pour les éléments barres/treillis axiaux (`ROD_2`).

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`radius`** | Float | **Oui** | - | Rayon de la section transversale $r$. Doit être strictement positif. |

#### Exemples

=== "TOML :simple-toml:"
    ```toml
    [section.SEC_BARRE]
    type = "ROD"
    material = "Acier_S235"
    radius = 2.5
    ```

---

## Sections Coque & Membrane (Shell & Membrane Sections)

Sections conçues pour les membranes structurales 2D et les coques minces.

### MEMBRANE

Définit une section membrane 2D avec rigidité dans le plan et une résistance à la flexion nulle (utilisée par `MEMBRANE_3`).

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`thickness`** | Float | **Oui** | - | Épaisseur physique de la membrane $h$. Doit être strictement positive. |

---

### SHELL_GAUSS

Définit une section coque mince/épaisses utilisant une intégration numérique dans l'épaisseur (axe $z$). Convient aux matériaux 3D tels que les modèles élastiques isotropes ou hyperélastiques.

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`thickness`** | Float | **Oui** | - | Épaisseur physique de la coque $h$. Doit être strictement positive. |
| **`nip`** | Integer | **Oui** | - | Nombre de points d'intégration dans l'épaisseur. |
| `integration` | String | Non | `"GAUSS"` | Règle d'intégration dans l'épaisseur : `"GAUSS"`, `"LOBATTO"` ou `"SIMPSON"`. |

!!! info "Contraintes des Règles d'Intégration"
    - **`GAUSS`** : Supporte un nombre de points `nip` de **1 à 5**.
    - **`LOBATTO`** : Supporte un nombre de points `nip` de **2 à 5** (inclut les points sur les surfaces supérieure et inférieure).
    - **`SIMPSON`** : Supporte un nombre de points `nip` de **3 ou 5**.

---

### SHELL_GENERALIZED

Définit une section coque généralisée où les résultantes de contrainte (efforts membranes $N$ et moments de flexion $M$) sont évaluées directement sur le plan moyen. Idéal pour les matériaux composites (`HYPERTEXTILE`) où les lois de comportement fournissent explicitement les équations de résultantes.

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`thickness`** | Float | **Oui** | - | Épaisseur physique de la coque $h$. Doit être strictement positive. |

#### Exemples

=== "TOML :simple-toml:"
    ```toml
    # Section coque avec intégration numérique (pour matériaux Élastiques ou Hyperélastiques)
    [section.SEC_SHELL_GAUSS]
    type = "SHELL_GAUSS"
    material = "Acier_S235"
    thickness = 1.5
    nip = 5
    integration = "GAUSS"

    # Section coque généralisée (pour matériaux composites Hypertextile)
    [section.SEC_COMPOSITE]
    type = "SHELL_GENERALIZED"
    material = "TissuCarbone"
    thickness = 0.25
    ```

---

## Sections Rigides (Rigid Sections)

Sections utilisées pour les corps rigides et les surfaces de contact.

### RIGID

Définit l'épaisseur géométrique pour les surfaces d'outils rigides ou les éléments de contact (`CONTACT_TRIANGLE`, `CONTACT_LINE`). Aucune assignation de loi de matériau n'est requise.

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`thickness`** | Float | **Oui** | - | Décalage de contact physique ou épaisseur de surface rigide $h$. |
| `geometry` | String | Non | - | Contexte géométrique structural du contact : `"SHELL"` ou `"SOLID"`. |

#### Exemples

=== "TOML :simple-toml:"
    ```toml
    [section.SEC_OUTIL_RIGIDE]
    type = "RIGID"
    thickness = 1.0
    geometry = "SHELL"
    ```

---

# Choisir un Type de Section

- Utilisez **`ROD`** pour les éléments barres 1D (`ROD_2`).
- Utilisez **`MEMBRANE`** pour les éléments membranes 2D sans rigidité en flexion (`MEMBRANE_3`).
- Utilisez **`SHELL_GAUSS`** pour les éléments coques isotropes/hyperélastiques 3D (`DKT18`, `S3L_C0`) nécessitant une intégration dans l'épaisseur.
- Utilisez **`SHELL_GENERALIZED`** pour les renforts textiles composites (`HYPERTEXTILE`) utilisant des formulations en résultantes de contraintes.
- Utilisez **`RIGID`** pour les outils rigides et les surfaces maîtresse/esclave de contact.