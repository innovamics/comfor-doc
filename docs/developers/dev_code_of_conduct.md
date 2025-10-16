This section details the **coding style and formatting conventions** used in the **COMFOR** project. These guidelines ensure **consistency, readability, and long-term maintainability** of the codebase.

# Key Conventions
COMFOR follows an adapted version of the **LLVM coding style**.

| **Aspect**               | **Standard**                          |
|--------------------------|---------------------------------------|
| Indentation              | 4 spaces (no tabs)                    |
| Max line length          | 80 characters                         |
| Brace style              | K&R / 1TBS                            |
| Pointer alignment        | Left (`int* ptr;`)                    |
| Namespace indentation    | None                                  |
| `switch` / `case`        | `case` aligned with `switch`          |
| File header              | Fixed format (see below)              |
| Enum declaration         | `enum class`                          |
| Type aliases             | `using` (avoid `typedef`)             |
| Function/method names    | `camelCase`                           |
| Class names              | `PascalCase`                          |
| Private members          | `snake_case_`                         |
| File extensions          | `.h` and `.cpp` (no `.hpp`)           |
| Doxygen comments         | `/// @` syntax only                   |
| Required tools           | `clang-format ≥ 15`                   |

For full details, refer to the `.clang-format` file in the project root.

# File Header Template
Every `.h` or `.cpp` file must start with the following header:

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

# Code Separators
## Long separator (80 characters)
```cpp
//------------------------------------------------------------------------------
```

## Section separator
```cpp
// --- Section Title ---
```

# VSCode Snippets
Predefined snippets are available in `.vscode/comfor.code-snippets` to quickly insert headers and separators.

**How to use:**

1. Press `Ctrl + Space` to trigger snippets.
2. Type the snippet name (e.g., `comfor_hpp` for a header file).
3. Update placeholders (author, copyright, `@brief`).

**Available snippets:**

- `comfor_hpp` → Header file template.
- `comfor_cpp` → Source file template.
- `comfor_sep_long` → Long separator.
- `comfor_sep_short` → Section separator.
- `comfor_cmake_header` → CMakeLists.txt header.

# CLion Live Templates
CLion automatically inserts COMFOR-style headers when creating new files (`.cpp`, `.h`, `CMakeLists.txt`). Templates are defined in `.idea/fileTemplates`.

**Post-insertion steps:**

- Update author/contact information.
- Adjust copyright years.
- Complete Doxygen tags (e.g., `@brief`).

# Include What You Use (IWYU)
[IWYU](https://include-what-you-use.org/) is integrated into COMFOR to **optimize `#include` directives** by:

- Removing unused includes.
- Adding missing includes.
- Replacing internal Eigen includes with `ComforMath.h`.
- Reducing build times and dependencies.

## Installation

=== "Windows :fontawesome-brands-windows:"

    IWYU is not officially supported on Windows. Manual setup requires a full LLVM/Clang toolchain and building IWYU from source.

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

## Enable IWYU in CMake
Add the following to your `CMakeLists.txt`:
```cmake
option(USE_IWYU "Enable include-what-you-use analysis" ON)
if(USE_IWYU)
    find_program(IWYU_PATH NAMES include-what-you-use iwyu REQUIRED)
    set(CMAKE_CXX_INCLUDE_WHAT_YOU_USE
        ${IWYU_PATH}
        -Xiwyu --comment_style=long
        -Xiwyu --mapping_file=${CMAKE_SOURCE_DIR}/.iwyu-imp)
endif()
```

## Manual Usage
Run IWYU manually with:
```sh
python3 /usr/bin/iwyu_tool.py -p build \
  -- -Xiwyu --mapping_file=../.iwyu-imp > out.txt
```
Apply fixes with:
```sh
python3 /usr/bin/fix_includes.py \
  --update_comments --reorder --nosafe_headers < out.txt
```

# Final Notes
1. **Format your code** with `.clang-format` before committing.
2. **Use official templates** for headers and source files.
3. **Keep includes minimal** with IWYU.
4. **Stay consistent** with the project’s coding standards.
