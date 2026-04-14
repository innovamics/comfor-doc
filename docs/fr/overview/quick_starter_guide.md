Cet outil a été compilé et testé sur **Windows** (x86_64, ARM64), **Linux** (x86_64, ARM64) et **macOS** (x86_64, Apple Silicon). L'utilisation de toute autre architecture n'est pas garantie.

# Téléchargement

Pour utiliser **COMFOR**, vous pouvez [télécharger](download.md) les binaires depuis la page des versions (releases) ou les compiler directement depuis les sources. Téléchargez le binaire correspondant à votre architecture, suivez les instructions ci-dessous et [lancez quelques tests](#execution_et_tests).

Pour compiler **COMFOR** depuis les sources, vous devrez télécharger et compiler le code. Pour cela, suivez les étapes suivantes.

# Compilation depuis les sources

## Prérequis

**CMake** : Un générateur de système de construction (build) open-source et multiplateforme. Il permet de générer un projet pour un IDE donné (Unix Makefiles, Xcode, Visual Studio, etc.) ou des règles de compilation pour **COMFOR**. Il s'installe facilement sous Linux avec la commande suivante :

```bash
sudo apt install cmake
```

Sur macOS via [brew](https://brew.sh/){:target="_blank"} :

```bash
brew install cmake
```

Les fichiers binaires pour macOS et Windows peuvent être téléchargés sur [cmake.org](https://cmake.org){:target="_blank"}.

**Compilateur C++**

**COMFOR** est écrit en C++ et nécessite un [compilateur C++](https://en.cppreference.com/w/cpp/compiler_support/17){:target="_blank"} supportant les fonctionnalités du **C++17** ou supérieur.

Versions recommandées :

  - **GCC** \>= 11
  - **Clang** \>= 14
  - **Apple Clang** \>= 13.0.0
  - **MSVC** \>= 2022

Sous **Ubuntu 22.04 / 24.04 LTS**, vous pouvez installer les outils nécessaires avec :

```bash
sudo apt install build-essential
```

Sous macOS, vérifiez si le compilateur Clang est déjà installé :

```bash
clang --version
```

Pour installer ou mettre à jour les compilateurs Clang, entrez :

```bash
command xcode-select --install
```

Sous Windows, vous pouvez utiliser un environnement POSIX comme [MSYS2](https://www.msys2.org){:target="_blank"} ou [MinGW-w64](https://www.mingw-w64.org/){:target="_blank"}. **COMFOR** est également entièrement compatible avec les [compilateurs Microsoft C++](https://visualstudio.microsoft.com/downloads/){:target="_blank"} (testé avec **Visual Studio 2022**).

!!! warning "Attention"
    Certaines versions de MinGW peuvent présenter des problèmes de compatibilité avec [google-test](https://github.com/google/googletest){:target="_blank"} (voir [l'issue 2418](https://github.com/google/googletest/issues/2418){:target="_blank"}). Bien que vous puissiez compiler **COMFOR**, la construction des tests unitaires peut nécessiter des configurations spécifiques.

**Python**

!!! note "Note"
    Python est principalement utilisé pour le post-traitement des résultats, les tests automatisés et la génération de cette documentation.

Assurez-vous que **Python 3.10+** et les paquets suivants sont installés :

  - Graphiques : [Matplotlib](https://pypi.org/project/matplotlib/){:target="_blank"}
  - Documentation : [MkDocs-Material](https://squidfunk.github.io/mkdocs-material/){:target="_blank"}

Installez les paquets via pip :

```bash
python3 -m pip install matplotlib mkdocs-material
```

!!! warning "Attention"
    Sur Windows, il est recommandé d'utiliser la distribution officielle de [Python.org](https://www.python.org/downloads/){:target="_blank"}. Assurez-vous que `python` et `pip` sont ajoutés au PATH de votre système.

## Clonage

Clonez ou téléchargez les sources depuis le [dépôt principal](https://gitlab.com/comfor/comfor.git){:target="_blank"}.

```bash
git clone https://gitlab.com/comfor/comfor.git
```

## Compilation

### Via CMake (Recommandé)

Les règles de compilation sont générées par CMake à partir du fichier `CMakeLists.txt` inclus dans le projet. Une bonne pratique consiste à encapsuler tous les fichiers intermédiaires dans un dossier unique (le build). CMake identifie l'architecture et génère les règles du projet.

```bash
cd COMFOR
mkdir build
cd build
cmake -DCMAKE_BUILD_TYPE=Release ..
cmake --build . --config Release
```

Les fichiers binaires seront situés dans le dossier `bin/Release`.

!!! tip "Astuce"
    CMake peut [générer](https://cmake.org/cmake/help/latest/manual/cmake-generators.7.html){:target="_blank"} des projets pour différents IDE (Visual Studio, Xcode, Eclipse). Vous pouvez spécifier un générateur avec `cmake .. -G <nom_du_generateur>`. Pour voir la liste des générateurs disponibles, utilisez : `cmake -G`.

### Alternative via IDE

Si vous préférez une interface graphique, vous pouvez utiliser **Visual Studio Code** avec les extensions "C/C++" et "CMake Tools" pour automatiser le processus de compilation.

---

# Options d'exécution (CLI)

**COMFOR** est un outil en ligne de commande. Vous pouvez contrôler son comportement via différents arguments pour gérer l'exécution parallèle, valider des fichiers ou afficher des informations sur le logiciel.

## Arguments disponibles

| Argument | Forme longue | Valeur | Description |
| :--- | :--- | :---: | :--- |
| `-j` | `--job` | `FICHIER` | **Requis.** Chemin vers le fichier d'entrée (`.toml`, `.txt` ou `.fembic`). |
| `-u` | `--cpus` | `1..16` | Nombre de threads CPU pour l'exécution parallèle. (Défaut : `1`). |
| - | `--validate` | - | Valide la syntaxe du fichier d'entrée sans lancer le solveur. |
| `-i` | `--info` | - | Affiche les informations générales sur **COMFOR**. |
| `-c` | `--credits` | - | Liste les contributeurs et les bibliothèques utilisées. |
| `-l` | `--license` | - | Affiche les termes de la licence logicielle. |
| `-v` | `--version` | - | Affiche la version actuelle. |
| `-h` | `--help` | - | Affiche le message d'aide. |

---

# Exécution et Tests

Vous devriez maintenant avoir un fichier exécutable nommé **COMFOR** (ou `comfor.exe` sous Windows).

## Lancement

Pour lancer une simulation, placez-vous dans votre répertoire de travail et utilisez le flag `-j` (ou `--job`) suivi de votre fichier d'entrée. Vous pouvez également spécifier le nombre de threads CPU avec `-u`.

```bash
# Exécution standard (1 thread)
./comfor -j Examples/input_file.toml

# Exécution parallèle avec 4 threads
./comfor -j Examples/input_file.toml -u 4
```

!!! tip "Astuce"
    Si vous lancez `./comfor` sans l'argument `-j`, le programme démarrera en mode interactif et vous demandera de saisir manuellement le chemin de votre fichier d'entrée.

## Validation

Si vous souhaitez vérifier votre fichier d'entrée pour des erreurs de syntaxe ou des paramètres manquants sans lancer le calcul, utilisez le flag `--validate` :

```bash
./comfor -j Examples/input_file.toml --validate
```

## Tests unitaires

En plus du binaire principal, CMake génère une série d'exécutables de test (ex: `AmplitudeTest`, `MaterialTest`). Ils permettent de vérifier que les différents modules de **COMFOR** fonctionnent correctement sur votre machine.

Exemple :

```bash
./AmplitudeTest
```

Résultat attendu :

```console
[==========] Running 5 tests from 1 test suite.
[----------] Global test environment set-up.
[----------] 5 tests from TabularTest
[ RUN      ] TabularTest.parseOne
[       OK ] TabularTest.parseOne (0 ms)
...
[  PASSED  ] 5 tests.
```

---

# Post-traitement

**COMFOR** génère des fichiers **VTU** ou **VTK** pour les résultats. **ParaView** est le post-processeur open-source recommandé pour visualiser ces résultats. ParaView est disponible sur [paraview.org](https://www.paraview.org/download/){:target="_blank"}.
