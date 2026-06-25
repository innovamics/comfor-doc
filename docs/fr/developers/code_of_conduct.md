Cette section détaille les **conventions de style et de formatage** utilisées dans le projet **COMFOR**. Ces directives garantissent la **cohérence, la lisibilité et la maintenabilité à long terme** du code.

# Conventions clés
COMFOR suit une version adaptée du **style de codage LLVM**.

| **Aspect**                   | **Standard**                       |
|------------------------------|------------------------------------|
| Indentation                  | 4 espaces (pas de tabulations)     |
| Longueur maximale des lignes | 80 caractères                      |
| Style des accolades          | K&R / 1TBS                         |
| Alignement des pointeurs     | À gauche (`int* ptr;`)             |
| Indentation des namespaces   | Aucune                             |
| Alignement `switch` / `case` | `case` aligné avec `switch`        |
| En-tête de fichier           | Format fixe (voir ci-dessous)      |
| Déclaration des énumérations | `enum class`                       |
| Alias de type                | `using` (éviter `typedef`)         |
| Noms de fonctions/méthodes   | `camelCase`                        |
| Noms de classes              | `PascalCase`                       |
| Membres privés               | `snake_case_`                      |
| Extensions de fichier        | `.h` et `.cpp` (pas de `.hpp`)     |
| Commentaires Doxygen         | Syntaxe `/// @` uniquement         |
| Outils requis                | `clang-format ≥ 15`                |

Pour plus de détails, consultez le fichier `.clang-format` à la racine du projet.

# Modèle d'en-tête de fichier
Chaque fichier `.h` ou `.cpp` doit commencer par l'en-tête suivante :

```cpp
//------------------------------------------------------------------------------
// COMFOR - Simulation Framework for Composite Forming and Processing
//------------------------------------------------------------------------------
//
// @file        file_name.ext
// @brief       Description of the file content.
// @author      Your Name <your@email.com>
// @date        YYYY-MM-DD
// @copyright   (C) 20XX-20YY Your Name/University/Company
//
// For licensing terms, see the LICENSE file in the root directory.
//------------------------------------------------------------------------------
```

# Séparateurs de code
## Séparateur long (80 caractères)
```cpp
//------------------------------------------------------------------------------
```

## Séparateur de section
```cpp
// --- Section Title ---
```

# Extraits de code VSCode
Des extraits de code prédéfinis sont disponibles dans `.vscode/comfor.code-snippets` pour insérer rapidement des en-têtes et des séparateurs.

**Comment les utiliser :**

1. Appuyez sur ++ctrl+spc++ pour déclencher les extraits de code.
2. Tapez le nom de l'extrait (par exemple, `comfor_hpp` pour un fichier d'en-tête).
3. Mettez à jour les espaces réservés (auteur, copyright, `@brief`).

**Extraits disponibles :**

- `comfor_hpp` → Modèle de fichier d'en-tête.
- `comfor_cpp` → Modèle de fichier source.
- `comfor_sep_long` → Séparateur long.
- `comfor_sep_short` → Séparateur de section.
- `comfor_cmake_header` → En-tête de CMakeLists.txt.

# Modèles CLion
CLion insère automatiquement les en-têtes au style COMFOR lors de la création de nouveaux fichiers (`.cpp`, `.h`, `CMakeLists.txt`). Les modèles sont définis dans `.idea/fileTemplates`.

**Étapes post-insertion :**

- Mettre à jour les informations d'auteur/contact.
- Ajuster les années de copyright.
- Compléter les balises Doxygen (par exemple, `@brief`).

# Include What You Use (IWYU)
[IWYU](https://include-what-you-use.org/){:target="_blank"} est intégré à COMFOR pour **optimiser les directives `#include`** en :

- Supprimant les inclusions inutilisées.
- Ajoutant les inclusions manquantes.
- Remplaçant les inclusions internes d'Eigen par `ComforMath.h`.
- Réduisant les temps de compilation et les dépendances.

## Installation

=== "Windows :fontawesome-brands-windows:"

    IWYU n'est pas officiellement supporté sur Windows. Une installation manuelle nécessite une chaîne d'outils LLVM/Clang complète et la compilation d'IWYU à partir des sources.

=== "Linux :simple-linux:"

    Debian/Ubuntu

    ```sh
    sudo apt install include-what-you-use
    ```

    Fedora

    ```sh
    sudo dnf install include-what-you-use
    ```
    
    Arch

    ```sh
    sudo pacman -S include-what-you-use
    ```

=== "macOS :simple-apple:"

    Homebrew

    ```sh
    brew install include-what-you-use
    ```

## Activer IWYU dans CMake
Ajoutez ce qui suit à votre `CMakeLists.txt` :
```cmake
option(USE_IWYU "Activer l'analyse include-what-you-use" ON)
if(USE_IWYU)
    find_program(IWYU_PATH NAMES include-what-you-use iwyu REQUIRED)
    set(CMAKE_CXX_INCLUDE_WHAT_YOU_USE
        ${IWYU_PATH}
        -Xiwyu --comment_style=long
        -Xiwyu --mapping_file=${CMAKE_SOURCE_DIR}/.iwyu-imp)
endif()
```

## Utilisation manuelle
Exécutez IWYU manuellement avec :
```sh
python3 /usr/bin/iwyu_tool.py -p build \
  -- -Xiwyu --mapping_file=../.iwyu-imp > out.txt
```
Appliquez les corrections avec :
```sh
python3 /usr/bin/fix_includes.py \
  --update_comments --reorder --nosafe_headers < out.txt
```

# Notes finales
1. **Formatez votre code** avec `.clang-format` avant de commit.
2. **Utilisez les modèles officiels** pour les en-têtes et les fichiers sources.
3. **Gardez les inclusions minimales** avec IWYU.
4. **Restez cohérent** avec les normes de codage du projet.
