<style>
  .md-sidebar--secondary .md-nav__list .md-nav__list .md-nav__item .md-nav {
    display: none !important;
  }

  .md-typeset td:first-child, .md-typeset th:first-child {
    white-space: nowrap;
  }
</style>

# Exécution de l'Analyse

Une fois le modèle défini dans le fichier d'entrée, l'étape suivante consiste à exécuter **COMFOR** pour réaliser l'analyse. Cette section décrit comment lancer une simulation, interpréter les informations affichées pendant l'exécution et comprendre les fichiers générés.

---

## Lancer une Nouvelle Analyse

### Commande de Base

COMFOR s'exécute depuis le terminal (ligne de commande). Le fichier d'entrée est donné avec l'option `-j` (ou `--job`), qui est **obligatoire** :

```bash
comfor -j <fichier_d_entree> [OPTIONS]
```

- `<fichier_d_entree>` : Chemin relatif (au répertoire courant) ou absolu vers le fichier d'entrée

**Exemples :**

```bash
# Fichier dans le répertoire courant
comfor -j simulation.toml

# Idem, avec l'option longue
comfor --job=simulation.toml

# Chemin relatif
comfor -j ./simulations/forming.toml

# Chemin absolu
comfor -j /home/user/simulations/forming.toml
```

!!! tip "Extensions de fichier"
    Le format d'entrée est choisi à partir de l'extension du fichier :

    | Extension | Format |
    | :--- | :--- |
    | `.toml`, `.giml` | TOML (recommandé) |
    | `.txt`, `.in` | Fembic (historique) |

---

### Options de la Ligne de Commande

Les options ci-dessous sont celles affichées par `comfor --help`.

#### Options du Job

| Option | Description |
| :--- | :--- |
| `-j, --job INPUT_FILE_NAME` | Nom du fichier d'entrée (**obligatoire**). |
| `-o, --output PATH` | Répertoire racine des résultats. Remplace le répertoire par défaut `Results_<nom_entrée>/`. Les chemins relatifs sont résolus depuis le répertoire courant. |
| `--validate` | Analyse et valide le fichier d'entrée sans lancer la simulation. |
| `-u, --cpus 1` | Nombre de CPU. La version actuelle est séquentielle : seule la valeur `1` est acceptée (défaut). Contactez [Innovamics](mailto:eduardo.guzman@innovamics.com) pour plus de capacité. |

#### Options de l'Application

| Option | Description |
| :--- | :--- |
| `-i, --info` | Affiche des informations générales sur COMFOR |
| `-c, --credits` | Affiche les crédits, les contributeurs et les bibliothèques tierces |
| `-l, --license` | Affiche la licence du logiciel |
| `-v, --version` | Affiche la version de COMFOR et quitte |
| `-h, --help` | Affiche le message d'aide et quitte |

**Exemples d'utilisation :**

```bash
# Valider uniquement le fichier d'entrée
comfor -j simulation.toml --validate

# Lancer la simulation
comfor -j simulation.toml

# Écrire les résultats dans un répertoire personnalisé
comfor -j simulation.toml -o ./results/run-01

# Valider, puis lancer seulement si la validation a réussi
comfor -j simulation.toml --validate && comfor -j simulation.toml

# Afficher la version
comfor --version
```

### Validation

Avec l'option `--validate`, COMFOR :

1. Analyse le fichier d'entrée (les erreurs de syntaxe TOML sont signalées avec leur numéro de ligne)
2. Valide chaque bloc : paramètres obligatoires, types, valeurs et plages autorisées
3. Vérifie que les noms sont présents et uniques pour chaque type de bloc
4. Écrit le rapport dans le terminal et dans le journal du job, puis quitte sans lancer la simulation

Les vérifications qui nécessitent la construction du modèle (par exemple la compatibilité des sections avec les types d'éléments du set auquel elles sont assignées, ou l'existence des sets référencés) sont effectuées au démarrage de la simulation.

!!! tip "Astuce"
    La même validation est toujours effectuée au début d'un calcul normal : `--validate` est simplement un moyen rapide de vérifier un fichier sans créer de résultats.

---

## Informations d'Exécution

COMFOR affiche d'abord un résumé du modèle, puis un bloc d'informations à chaque écriture d'une frame de sortie.

### Résumé du Modèle

```
 Model info
  > Number of objects instances
   - Nodes: 1892
   - Loads: 0
   - Elements: 3492
   - Controls: 1
   - Trackers: 0
   - Materials: 1
   - Sections: 2
   - Amplitudes: 1
   - Constraints: 4
   - Sets: 7
   - Surfaces: 0
  > Automatic step time: true
   - Step time: 0.000446
  Output
  > Type: VTU
  > Format: BINARY
  > Frequency: 0.100000
```

### Frames de Sortie

```
 =======================================
  > Writing output file 12
   - Elapsed time: 4.782843
   - Current time: 1.200059
   - Time step: 0.000442
   - Internal energy: 0.319601
   - Kinetic energy: 0.251585
   - Ek/Ei (%): 78.718403
 =======================================
```

| Champ | Description |
| :--- | :--- |
| `Writing output file` | Indice de la frame écrite |
| `Elapsed time` | Temps réel écoulé depuis le début de la résolution (secondes) |
| `Current time` | Temps de simulation courant |
| `Time step` | Incrément de temps courant |
| `Internal energy` | Énergie interne (de déformation) du modèle |
| `Kinetic energy` | Énergie cinétique du modèle |
| `Ek/Ei (%)` | Rapport entre énergie cinétique et énergie interne |

!!! tip "Simulations quasi statiques"
    Pour les procédés de mise en forme, qui sont quasi statiques, l'énergie cinétique doit rester faible devant l'énergie interne une fois la déformation engagée. Un rapport `Ek/Ei` élevé indique des effets dynamiques importants (vitesse d'outil trop élevée, amortissement insuffisant, etc.). Ce rapport n'a pas de sens au tout début de la simulation, lorsque l'énergie interne est encore proche de zéro.

À la fin du calcul, COMFOR affiche le temps total de résolution :

```
 Solving took : 31.524193
 Exit Comfor
```

---

## Fichiers Générés

### Structure des Répertoires

Pour un fichier d'entrée `simulation.toml` :

```
simulation.toml
simulation.md                  # Journal du job
Results_simulation/            # Racine des résultats (ou le chemin donné avec -o)
├── manifest.toml              # Statut du calcul et liste des fichiers générés
├── <nom_output>/              # Un dossier par bloc [[output]]
│   ├── <nom_output>_000000.vtu
│   ├── <nom_output>_000001.vtu
│   └── ...
└── <nom_tracker>.csv          # Un fichier par bloc [tracker]
```

- Chaque bloc `[[output]]` écrit ses frames dans un dossier portant le `name` de la sortie. Les frames sont numérotées sur 6 chiffres.
- Chaque bloc `[tracker]` écrit un fichier CSV portant le `name` du tracker.
- `manifest.toml` enregistre le statut du calcul (`running`, `completed` ou `failed`) et la liste des fichiers écrits.

!!! warning "Résultats existants"
    La racine des résultats ne doit pas exister avant le calcul. Si elle existe, COMFOR s'arrête avec une erreur `Directory already exists` pour ne pas écraser des résultats précédents. Supprimez le répertoire ou choisissez-en un autre avec `-o`.

### Journal du Job

Le journal du job est un fichier Markdown écrit à côté du fichier d'entrée, avec le même nom (`simulation.md` pour `simulation.toml`). Il contient les mêmes informations que le terminal (informations du fichier, rapport de validation, résumé du modèle, frames) et, lorsque la validation échoue, la liste complète des erreurs sous **Validation Errors**.

Voir [Post-traitement](postprocessing.md) pour le contenu des fichiers de résultats.

---

## Gestion des Erreurs

### Types d'Erreurs

1. **Erreurs de ligne de commande** : `-j` manquant ou option inconnue (COMFOR affiche l'erreur et l'indication `Run with --help for more information.`), ou fichier d'entrée introuvable.
2. **Erreurs d'analyse** : Syntaxe TOML invalide, ou bloc sans le `name` requis. Le message donne le numéro de ligne.
3. **Erreurs de validation** : Paramètres manquants ou invalides. Toutes les erreurs sont listées dans le journal du job.
4. **Erreurs de construction** : Problèmes détectés lors de la construction du modèle (référence manquante, section incompatible, répertoire de résultats existant...).

### Format des Messages d'Erreur

```
 --> Exception caught
Validation failed
  --> TOMLParser: block 'output' at line 14 requires a non-empty 'name'.
```

```
 --> Exception caught
Setup failed
  --> Directory already exists: /home/user/simulations/Results_simulation
```

Dans les deux cas, COMFOR quitte avec un code de retour non nul, utilisable dans des scripts.

---

## Bonnes Pratiques

1. **Valider avant l'exécution** : `comfor -j fichier.toml --validate`
2. **Commencer petit** : Tester avec un modèle réduit ou un `run_to` court
3. **Surveiller les énergies** : Garder `Ek/Ei` faible pour les procédés quasi statiques
4. **Vérifier les unités** : Assurer la cohérence des unités (voir [Unités](preprocessing.md#unites))

---

## Exemple Complet

```bash
# Valider
comfor -j forming.toml --validate

# Lancer, en écrivant les résultats dans ./results/forming
comfor -j forming.toml -o ./results/forming

# Vérifier les résultats
ls ./results/forming
cat ./results/forming/manifest.toml
```
