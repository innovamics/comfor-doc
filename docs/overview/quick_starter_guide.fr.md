
Comfor a été compilé et testé sous Windows (win64), Linux (amd64) et macOS
(amd64). L'utilisation d'une autre architecture n'est pas garantie.

# Téléchargement

Pour exécuter Comfor, vous pouvez [télécharger](download_page.md) les binaires
depuis la page des versions, ou bien le compiler depuis les sources. Téléchargez
la version correspondant à votre architecture et
[exécutez un exemple](#executer_un_exemple).

# Compilation depuis les sources

Pour compiler Comfor depuis les sources, il vous faudra télécharger et compiler
le code. Suivez les instructions ci-dessous.

## Prérequis

**CMake** : un générateur multiplateforme et open-source de systèmes de
compilation. Il permet de générer un projet pour un IDE donné (Makefiles Unix,
Xcode, Eclipse, etc.) ou bien des règles de compilation pour Comfor. Il peut
être installé facilement sous Linux avec :

```bash
sudo apt install cmake
```

Sous macOS avec [brew](https://brew.sh/) :

```bash
brew install cmake
```

Les binaires pour macOS et Windows sont disponibles sur
[cmake.org](https://cmake.org).

**Compilateur C++**

Comfor est écrit en C++ et nécessite un
[compilateur C++](https://en.cppreference.com/w/cpp/compiler_support/17)
compatible avec les fonctionnalités du standard **C++17**.

Exemples compatibles :

- gcc >= 9
- clang libc++ >= 7
- Apple clang >= 11.0.0
- MSVC >= 2015

Sous **Ubuntu 18.04/20.04**, vous pouvez installer GCC avec :

```bash
sudo apt install build-essential
```

Sous **macOS**, vérifiez si le compilateur Clang est déjà installé :

```bash
clang --version
```

Pour l’installer ou le mettre à jour :

```bash
xcode-select --install
```

Sous **Windows**, vous pouvez utiliser un environnement POSIX comme
[MSYS2](https://www.msys2.org), [MinGW](https://www.mingw-w64.org/), ou
Mysys. Depuis la version **0.2.1** :

!!! note
    Comfor est compatible avec les
    [compilateurs Microsoft C++](https://visualstudio.microsoft.com/downloads/)
    (testé avec Visual C++ 2019).

!!! warning
    [Mingw32](https://www.msys2.org) n'est pas entièrement compatible avec
    [google-test](https://github.com/google/googletest), une bibliothèque
    populaire pour les tests unitaires et d'intégration (voir
    [issue 2418](https://github.com/google/googletest/issues/2418)). Vous pouvez
    compiler Comfor mais pas exécuter les tests.

## Cloner le dépôt

Clonez ou téléchargez les sources depuis le
[répertoire principal](https://gitlab.com/innovamics/comfor). Si vous ne
connaissez pas Git, consultez une cheat sheet.

```bash
git clone https://gitlab.com/innovamics/comfor.git
```

## Compilation

### Avec Cmake

Assurez-vous que `make` est installé (`make --version`). C’est généralement le
cas sur macOS et Linux après l’installation des
[outils développeurs](#prerequis).

Les règles de compilation sont générées par CMake via le fichier
`CMakeLists.txt`. Il est recommandé de créer un dossier `Build/` pour regrouper
les fichiers intermédiaires.

```bash
cd COMFOR
mkdir Build
cd Build
cmake -DCMAKE_BUILD_TYPE=Release ..
make
```

Les binaires se trouvent dans le dossier `Bin/Release`.

!!! tip
    CMake peut
    [générer](https://cmake.org/cmake/help/latest/manual/cmake-generators.7.html)
    des projets pour divers IDE (Eclipse, Xcode, VSCode...). Pour spécifier un
    générateur :  
    ```bash
    cmake .. -G "<Nom_du_générateur>"
    ```

### Compilation multiplateforme (Visual Studio Code)

Si vous avez des difficultés à compiler, vous pouvez utiliser Visual Studio Code
qui offre une interface graphique et des extensions utiles pour automatiser le
processus de compilation.

# Exécution et tests

Vous devriez maintenant avoir un exécutable appelé `comfor`. Pour l’exécuter :

```bash
./comfor
```

Comfor vous demandera alors le chemin du fichier d'entrée si aucun n’est
spécifié.

## Exécuter un exemple

Utilisez un fichier d’entrée fourni dans le dossier `Examples` ou téléchargez
des cas de test depuis la [page de téléchargement](download_page.md#exemples) :

```bash
./comfor CHEMIN_VERS_FICHIER_ENTRÉE
```

## Lancer les tests

CMake génère aussi des exécutables de test (`*Test`). Par exemple :

```bash
./AmplitudeTest
```

Résultat attendu :

```console
[==========] Running 5 tests from 1 test suite.
[----------] 5 tests from TabularTest
[  PASSED  ] 5 tests.
```

Si un test échoue, n'hésitez pas à nous contacter.

# Post-traitement

Comfor peut générer des fichiers VTK pour visualiser les résultats avec le
post-processeur Paraview, disponible sur
[paraview.org](https://www.paraview.org/download).
