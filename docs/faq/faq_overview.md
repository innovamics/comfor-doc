This FAQ covers common questions about **Comfor**, from installation and usage to development and scientific applications.

# Installation

??? question "What are the system requirements for Comfor?"
    Comfor is supported on **Windows (win64)**, **Linux (amd64)**, and **macOS (amd64)**. Using any other architecture is not guaranteed to work.
    **Minimum requirements:**

    - **C++ Compiler** (C++17/20 support):
        - GCC ≥ 9 (Linux)
        - Clang ≥ 7 (macOS/Linux)
        - MSVC ≥ 2019 (Windows)
    - **CMake ≥ 3.15**
    - **Git**

    For more details, see the [Download](../overview/download_page.md) and [Quick start](../overview/quick_starter_guide.md) pages.

??? question "How do I install Comfor from source?"
    Follow the instructions in the [Quick start Page](../overview/quick_starter_guide.md).

??? question "Are there pre-built binaries available?"
    Yes! Pre-built binaries are available on the [Download Page](../overview/download_page.md).

??? question "How do I verify my installation?"
    Run the test suite as described in the [Quick start Page](../overview/quick_starter_guide.md#run_and_test).

# Getting Started

??? question "Where can I find a quick starter guide?"
    See the [Quick start Page](../overview/quick_starter_guide.md).

??? question "How do I define a material model?"
    Material models are documented in the [Materials Documentation](../docs/docs_materials.md).

??? question "How do I run a simulation?"
    Run Comfor from the terminal using:
    ```bash
    comfor <input_file_name>
    ```
    For more details, see the [Running Section](../docs/docs_analysis.md).

??? question "Where can I find example cases?"
    Example cases are included in the source code under the `Examples/` directory.
    
    You can also [download examples](../overview/download_page.md#examples).

# Physics and Models

??? question "What finite element formulations are supported?"
    See the [Elements Documentation](../docs/docs_elements.md) for a full list.

??? question "How are boundary conditions applied?"
    Boundary conditions are documented in the [Preprocessing Documentation](../docs/docs_preprocessing.md).

# Development

??? question "How can I contribute to Comfor?"
    See the [Code of Conduct](../developers/dev_code_of_conduct.md) and [Git Guide](../developers/dev_git.md) for contribution guidelines.

# Scientific and Academic Use

??? question "Is Comfor peer-reviewed?"
    Comfor's numerical methods are published and validated in collaboration with academic and industrial partners.
    For references, see the [Publications Page](../news/news_publications.md).
    !!! note
        Comfor is provided "as is" and is intended for research and academic use.

??? question "Can I use Comfor for my research?"
    Yes, Comfor is available for **research and academic purposes** under the terms of its license.
    You may modify the software or create derivative works **only for research or academic use**.
    For commercial use or redistribution, a separate license agreement with Innovamics is required.
    See the [License Page](../developers/dev_license.md) for full details.

??? question "How do I cite Comfor in my publications?"
    To cite Comfor, refer to the relevant publications listed on the [Publications Page](../news/news_publications.md).
    Ensure compliance with the license terms and acknowledge Innovamics as the software developer.

# Troubleshooting

??? question "My simulation crashes. What should I do?"
    1. Check the log file.
    2. Report the issue on [GitLab](https://gitlab.com/comfor/comfor) with the error log and input file.

??? question "How do I report a bug?"
    Open an issue on [GitLab](https://gitlab.com/comfor/comfor) with a minimal input file and the full error log.

# Miscellaneous

??? question "Is Comfor free?"
    Comfor is available **free of charge** for **research and academic use** under the terms of its license.
    See the [License Page](../developers/dev_license.md) for details.

??? question "Can I use Comfor for commercial projects?"
    Comfor is **not available for commercial use** under its standard license.
    For proprietary or commercial use, please contact Innovamics to negotiate a separate license agreement.
    See the [License Page](../developers/dev_license.md) for more information.

??? question "How do I stay updated on new releases?"
    - Check the [Versions Page](../news/news_versions.md) for the latest updates.
    - Watch the [GitLab repository](https://gitlab.com/comfor/comfor) for real-time notifications.
