<style>
  .md-sidebar--secondary .md-nav__list .md-nav__list .md-nav__item .md-nav {
    display: none !important;
  }
</style>

<div class="grid cards" style="grid-template-columns: repeat(auto-fit, minmax(200px, 300px))" markdown>

- :material-chart-bell-curve-cumulative:{ .lg .middle }
  [<span style="color: #76B900; font-weight: bold;">Tabulaire</span>](#tabulaire_tabular)

</div>

Cette section présente une **vue d'ensemble pratique** des modèles d'amplitudes temporelles disponibles dans **COMFOR**. Les amplitudes sont utilisées pour moduler des conditions aux limites, des charges ou tout autre paramètre évolutif au cours du temps de simulation.

# Modèles d'Amplitudes Disponibles

## Paramètres Communs à Toutes les Amplitudes

Chaque bloc d'amplitude nécessite ce paramètre de base :

| Paramètre | Type | Requis | Défaut | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Oui** | - | Mot-clé du modèle d'amplitude (ex: `TABULAR`). |

---

## Tabulaire (TABULAR)

Le type d'amplitude `TABULAR` définit une courbe temporelle $y = f(t)$ à travers une série de paires discrètes temps/valeur. **COMFOR** effectue une interpolation linéaire entre les points définis.

### Paramètres

| Paramètre | Type | Requis | Description |
| :--- | :--- | :---: | :--- |
| **`values`** | Array | **Oui** | Liste de paires discrètes `[temps, valeur]`. Doit contenir au moins 2 paires. |

!!! info "Logique Opérationnelle"
    * **Interpolation Linéaire** : Évaluée de manière linéaire entre les points consécutifs $(t_1, v_1)$ et $(t_2, v_2)$.
    * **Hors Limites** : Si le temps de simulation actuel $t$ se situe en dehors de la plage définie $[t_{\text{min}}, t_{\text{max}}]$, l'amplitude renvoie **`0.0`**.
    * **Tri Automatique** : COMFOR trie automatiquement les points temporels par ordre croissant lors de l'initialisation.

### Exemples

=== "TOML :simple-toml:"
    ```toml
    # Une charge en rampe augmentant de 0.0 à 10.0 sur 1 seconde, puis maintenue constante jusqu'à 2.0s
    [amplitude.RampeMontante]
    type = "TABULAR"
    values = [
        [0.0, 0.0],
        [1.0, 10.0],
        [2.0, 10.0]
    ]
    ```

=== "Fembic :material-text:"
    ```xml
    AMPLITUDES TYPE TABULAR
    RampeMontante VALUES = [0.0, 0.0, 1.0, 10.0, 2.0, 10.0]
    ```

---

# Choisir un Modèle d'Amplitude

- Utilisez **`TABULAR`** pour des courbes de charge expérimentales, des profils de vitesse de poinçon ou la modulation par étapes de conditions aux limites.