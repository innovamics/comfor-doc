<style>
  .md-sidebar--secondary .md-nav__list .md-nav__list .md-nav__item .md-nav {
    display: none !important;
  }
</style>

<div class="grid cards" style="grid-template-columns: repeat(auto-fit, minmax(200px, 300px))" markdown>

- :material-ray-vertex:{ .lg .middle }
  [<span style="color: #76B900; font-weight: bold;">Condition aux Limites</span>](#condition_aux_limites_boundary_condition)

</div>

Cette section présente une **vue d'ensemble pratique** des formulations de contraintes disponibles dans **COMFOR**. Les contraintes permettent d'imposer des conditions aux limites (vitesses ou accélérations) sur des ensembles de nœuds spécifiés.

# Types de Contraintes Disponibles

## Paramètres Communs à Toutes les Contraintes

Chaque bloc de contrainte nécessite ces paramètres de base :

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Oui** | - | Mot-clé de la formulation de contrainte (ex: `BOUNDARY_CONDITION`). |
| **`set`** | String | **Oui** | - | Nom du [Set de Nœuds](../preprocessing.md#ensemble_set) cible. |
| `amplitude` | String | Non | - | Nom d'une [Amplitude](amplitudes.md) globale appliquée à toutes les composantes. |

---

## Condition aux Limites (BOUNDARY_CONDITION)

La contrainte `BOUNDARY_CONDITION` prescrit des vitesses nodales ($v$) et des accélérations ($a$). Les valeurs des composantes peuvent être définies sous forme de chiffres simples ou de tables imbriquées (inline maps) pour assigner des amplitudes locales individuelles.

### Syntaxe des Composantes

Chaque composante cinématique (ex: `vx`, `vry`, `az`) peut être spécifiée de deux manières :

1. **Numérique** : `vx = 1.0` (Modulée par l'`amplitude` globale du bloc si elle est définie).
2. **Table Imbriquée** : `vx = { value = 1.0, amplitude = "LocalAmp" }` (Surchargée par une amplitude locale spécifique).

### Paramètres

| Paramètre | Catégorie | Description |
| :--- | :--- | :--- |
| `preset` | Spécial | Définir sur `"FIXED"` pour bloquer les 6 degrés de liberté ($v_x, v_y, v_z, v_{rx}, v_{ry}, v_{rz} = 0.0$). |
| `vx`, `vy`, `vz` | Vitesse Linéaire | Vitesse prescrite selon les axes globaux X, Y ou Z. |
| `vrx`, `vry`, `vrz`| Vitesse Rotationnelle | Vitesse angulaire prescrite autour des axes globaux X, Y ou Z. |
| `ax`, `ay`, `az` | Accélération | Accélération linéaire prescrite selon les axes globaux X, Y ou Z. |

!!! info "Priorité Vitesse vs. Accélération"
    Si une composante de vitesse (ex: `vx`) est définie pour un axe donné, toute accélération prescrite pour ce même axe (`ax`) est ignorée et forcée à $0.0$ afin de garantir la cohérence cinématique.

### Logique d'Évaluation

La valeur prescrite pour une composante donnée au temps de simulation $t$ est calculée comme suit :

$$V_{\text{appliquée}}(t) = \text{Valeur} \times \text{Amplitude}(t)$$

- Si une composante spécifie sa propre `amplitude` locale, cette amplitude locale est évaluée.
- Si aucune amplitude locale n'est définie, elle utilise par défaut l'`amplitude` globale du bloc.
- Si aucune des deux n'est fournie, le facteur d'échelle est de **`1.0`** par défaut.

### Exemples

=== "TOML :simple-toml:"
    ```toml
    # Encastrement de la base via le preset FIXED
    [constraint.BaseFixe]
    type = "BOUNDARY_CONDITION"
    set = "NoeudsBase"
    preset = "FIXED"

    # Déplacement imposé du plateau avec amplitudes locale et globale
    [constraint.PlateauMobile]
    type = "BOUNDARY_CONDITION"
    set = "NoeudsHaut"
    amplitude = "RampeGlobale"
    vy = { value = -10.0, amplitude = "RampeLocale" }
    vz = 0.0
    ```

=== "Fembic :material-text:"
    ```xml
    CONSTRAINTS TYPE BOUNDARY_CONDITION
    BaseFixe SET = NoeudsBase PRESET = FIXED

    CONSTRAINTS TYPE BOUNDARY_CONDITION
    PlateauMobile SET = NoeudsHaut VY = -10.0 AMP = RampeLocale VZ = 0.0
    ```

---

# Choisir un Type de Contrainte

- Utilisez **`BOUNDARY_CONDITION`** avec `preset = "FIXED"` pour les encastrements rigides et les conditions aux limites fixes.
- Utilisez **`BOUNDARY_CONDITION`** avec des vitesses `vx`/`vy`/`vz` prescrites et une [Amplitude Tabulaire](amplitudes.md) pour piloter le mouvement des outils de formage ou le déplacement d'un plateau.