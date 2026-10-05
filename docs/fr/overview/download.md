Cette page propose les téléchargements de l'édition **Comfor Community**, la version open source de Comfor destinée à la recherche et à l'enseignement.

Pour accéder aux fonctionnalités avancées, aux intégrations professionnelles et au support dédié, consultez [**Comfor Enterprise**](../services/industry.md#editions_de_comfor).

# Dernière version de Comfor Community — v0.15.0

=== "Windows :fontawesome-brands-windows:"

    Télécharger Comfor V0.15.0 pour Windows (Visual Studio 2022)

    [Windows 10/11 :fontawesome-brands-windows:](../assets/bin/v0_15_0/Release-windows-vs2022/COMFOR_V0_15_0_VS2022.exe){ .md-button }

    !!! note
        Pour Windows : installez le dernier [package redistribuable Visual C++ pour Visual Studio 2015-2022](https://learn.microsoft.com/fr-fr/cpp/windows/latest-supported-vc-redist){:target="_blank"}

=== "Linux :simple-linux:"

    Télécharger Comfor V0.15.0 pour Ubuntu 22.04 (GCC 11)

    [Ubuntu 22.04 :simple-ubuntu:](../assets/bin/v0_15_0/Release-ubuntu-22.04-gcc/COMFOR_V0_15_0_GCC11){ .md-button }

    Télécharger Comfor V0.15.0 pour Ubuntu 24.04 (GCC 13)

    [Ubuntu 24.04 :simple-ubuntu:](../assets/bin/v0_15_0/Release-ubuntu-24.04-gcc/COMFOR_V0_15_0_GCC13){ .md-button }

    Télécharger Comfor V0.15.0 pour Rocky Linux 9 (GCC 11)

    [Rocky Linux 9 :simple-rockylinux:](../assets/bin/v0_15_0/Release-rocky-linux-9-gcc/COMFOR_V0_15_0_GCC11){ .md-button }

    !!! note
        Après le téléchargement, rendez le fichier exécutable : `chmod +x COMFOR_V0_15_0_*`

=== "macOS :simple-apple:"

    Télécharger Comfor V0.15.0 pour macOS 13 ou ultérieur (Apple Silicon, Clang)

    [macOS :simple-apple:](../assets/bin/v0_15_0/Release-macos-clang/COMFOR_V0_15_0_CLANG){ .md-button }

    !!! note
        Après le téléchargement, rendez le fichier exécutable (`chmod +x COMFOR_V0_15_0_CLANG`). Au premier lancement, macOS peut bloquer le fichier : autorisez-le dans *Réglages Système → Confidentialité et sécurité*.

!!! tip "Vérifier l'installation"
    Lancez `COMFOR_V0_15_0_<plateforme> --version` pour vérifier l'exécutable téléchargé, puis suivez le [tutoriel complet](tutorial.md).

!!! info
    Consultez les archives des [versions précédentes](versions.md).

# Vérifier le Téléchargement

Chaque exécutable possède une empreinte **SHA-256**. Calculer l'empreinte du fichier téléchargé et la comparer à la valeur ci-dessous permet de s'assurer que le fichier est complet et n'a pas été modifié.

| Plateforme | Fichier | SHA-256 |
| :--- | :--- | :--- |
| Windows | `COMFOR_V0_15_0_VS2022.exe` | `12c143f0af144792442552d9d013c40c257779d4ccce91f8039b61f2b879efce` |
| Ubuntu 22.04 | `COMFOR_V0_15_0_GCC11` | `a0a690658a8f942600cfb37e864d7dd68de8718b2ba90033aab5a50d3ff65b2f` |
| Ubuntu 24.04 | `COMFOR_V0_15_0_GCC13` | `6ce4bb312aa6dfff397709af679d51cac99846b2cc6e47ac7e92266b29598eb3` |
| Rocky Linux 9 | `COMFOR_V0_15_0_GCC11` | `34a3211c5514570019cad83bc0539e8ccbee81acee3ba2ce229535df2ff1b434` |
| macOS | `COMFOR_V0_15_0_CLANG` | `932e9f77d17c533c87fe46811e3dc7b880fe782175b0c8977b34d11145ea7c2a` |

=== "Windows :fontawesome-brands-windows:"

    Dans PowerShell, depuis le dossier de téléchargement :

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

La valeur affichée doit être identique à celle de votre plateforme dans le tableau. Toutes les empreintes sont aussi disponibles dans [SHA256SUMS.txt](../assets/bin/v0_15_0/SHA256SUMS.txt).

!!! warning "Attention"
    Si les valeurs diffèrent, n'exécutez pas le fichier : téléchargez-le à nouveau.

# Exemples

- Le [tutoriel complet](tutorial.md) fournit un fichier d'entrée TOML prêt à l'emploi (benchmark double dôme) avec ses maillages.
- <a href="../../assets/examples/examples.zip" download>Anciens exemples</a> (format Fembic, pour les versions jusqu'à v0.8.0).
