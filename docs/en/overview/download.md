This page provides downloads for the **Comfor Community Edition**, the open-source version of Comfor designed for research and educational use.

For advanced features, enterprise integrations, and professional support, see [**Comfor Enterprise**](../services/industry.md#comfor_editions).

# Latest Community Version — v0.15.0

=== "Windows :fontawesome-brands-windows:"

    Download Comfor V0.15.0 for Windows (Visual Studio 2022)

    [Windows 10/11 :fontawesome-brands-windows:](../assets/bin/v0_15_0/Release-windows-vs2022/COMFOR_V0_15_0_VS2022.exe){ .md-button }

    !!! note
        For Windows : Install the latest [Visual C++ redistributable package for Visual Studio 2015-2022](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist){:target="_blank"}

=== "Linux :simple-linux:"

    Download Comfor V0.15.0 for Ubuntu 22.04 (GCC 11)

    [Ubuntu 22.04 :simple-ubuntu:](../assets/bin/v0_15_0/Release-ubuntu-22.04-gcc/COMFOR_V0_15_0_GCC11){ .md-button }

    Download Comfor V0.15.0 for Ubuntu 24.04 (GCC 13)

    [Ubuntu 24.04 :simple-ubuntu:](../assets/bin/v0_15_0/Release-ubuntu-24.04-gcc/COMFOR_V0_15_0_GCC13){ .md-button }

    Download Comfor V0.15.0 for Rocky Linux 9 (GCC 11)

    [Rocky Linux 9 :simple-rockylinux:](../assets/bin/v0_15_0/Release-rocky-linux-9-gcc/COMFOR_V0_15_0_GCC11){ .md-button }

    !!! note
        After downloading, make the file executable: `chmod +x COMFOR_V0_15_0_*`

=== "macOS :simple-apple:"

    Download Comfor V0.15.0 for macOS 13 or later (Apple Silicon, Clang)

    [macOS :simple-apple:](../assets/bin/v0_15_0/Release-macos-clang/COMFOR_V0_15_0_CLANG){ .md-button }

    !!! note
        After downloading, make the file executable (`chmod +x COMFOR_V0_15_0_CLANG`). On first launch, macOS may block the file: allow it in *System Settings → Privacy & Security*.

!!! tip "Check the installation"
    Run `COMFOR_V0_15_0_<platform> --version` to check the downloaded executable, then follow the [complete tutorial](tutorial.md).

!!! info
    Browse the archives for [previous versions](versions.md).

# Verify the Download

Each executable has a **SHA-256** checksum. Computing the checksum of the downloaded file and comparing it with the value below ensures that the file is complete and has not been modified.

| Platform | File | SHA-256 |
| :--- | :--- | :--- |
| Windows | `COMFOR_V0_15_0_VS2022.exe` | `12c143f0af144792442552d9d013c40c257779d4ccce91f8039b61f2b879efce` |
| Ubuntu 22.04 | `COMFOR_V0_15_0_GCC11` | `a0a690658a8f942600cfb37e864d7dd68de8718b2ba90033aab5a50d3ff65b2f` |
| Ubuntu 24.04 | `COMFOR_V0_15_0_GCC13` | `6ce4bb312aa6dfff397709af679d51cac99846b2cc6e47ac7e92266b29598eb3` |
| Rocky Linux 9 | `COMFOR_V0_15_0_GCC11` | `34a3211c5514570019cad83bc0539e8ccbee81acee3ba2ce229535df2ff1b434` |
| macOS | `COMFOR_V0_15_0_CLANG` | `932e9f77d17c533c87fe46811e3dc7b880fe782175b0c8977b34d11145ea7c2a` |

=== "Windows :fontawesome-brands-windows:"

    In PowerShell, from the download folder:

    ```powershell
    Get-FileHash COMFOR_V0_15_0_VS2022.exe -Algorithm SHA256
    ```

=== "Linux :simple-linux:"

    ```bash
    sha256sum COMFOR_V0_15_0_GCC11
    ```

=== "macOS :simple-apple:"

    ```bash
    shasum -a 256 COMFOR_V0_15_0_CLANG
    ```

The value printed must be identical to the one of your platform in the table. All the checksums are also available in [SHA256SUMS.txt](../assets/bin/v0_15_0/SHA256SUMS.txt).

!!! warning
    If the values differ, do not run the file: download it again.

# Examples

- The [complete tutorial](tutorial.md) provides a ready-to-run TOML input file (double-dome benchmark) with its meshes.
- <a href="../../assets/examples/examples.zip" download>Legacy examples</a> (Fembic format, for versions up to v0.8.0).
