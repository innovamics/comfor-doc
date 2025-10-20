Cette FAQ répond aux questions courantes concernant **Comfor**, de l'installation et l'utilisation au développement et aux applications scientifiques.

# Installation

??? faq "Quelles sont les configurations système requises pour Comfor ?"
    Comfor est pris en charge sur **Windows (win64)**, **Linux (amd64)** et **macOS (amd64)**. L'utilisation d'une autre architecture n'est pas garantie.
    **Configurations minimales requises :**

    - **Compilateur C++** (support C++17/20) :
        - GCC ≥ 9 (Linux)
        - Clang ≥ 7 (macOS/Linux)
        - MSVC ≥ 2019 (Windows)
    - **CMake ≥ 3.15**
    - **Git**

    Pour plus de détails, consultez les pages [Téléchargement](../overview/download_page.md) et [Guide de démarrage rapide](../overview/quick_starter_guide.md).

??? faq "Comment installer Comfor à partir des sources ?"
    Suivez les instructions dans le [Guide de démarrage rapide](../overview/quick_starter_guide.md).

??? faq "Existe-t-il des binaires pré-compilés disponibles ?"
    Oui ! Des binaires pré-compilés sont disponibles sur la [Page de téléchargement](../overview/download_page.md).

??? faq "Comment vérifier mon installation ?"
    Exécutez la suite de tests comme décrit dans le [Guide de démarrage rapide](../overview/quick_starter_guide.md#execution_et_tests).

# Prise en main

??? faq "Où puis-je trouver un guide de démarrage rapide ?"
    Consultez le [Guide de démarrage rapide](../overview/quick_starter_guide.md).

??? faq "Comment définir un modèle de matériau ?"
    Les modèles de matériaux sont documentés dans la [Documentation sur les matériaux](../docs/docs_materials.md).

??? faq "Comment exécuter une simulation ?"
    Exécutez Comfor depuis le terminal en utilisant :
    ```bash
    comfor <nom_du_fichier>
    ```
    Pour plus de détails, consultez la section [Exécution d'une simulation](../docs/docs_analysis.md).

??? faq "Où puis-je trouver des cas d'exemples ?"
    Des cas d'exemples sont inclus dans le code source dans le répertoire `Examples/`.

    Vous pouvez également [télécharger des exemples](../overview/download_page.md#exemples).

# Physique et modèles

??? faq "Quelles formulations d'éléments finis sont prises en charge ?"
    Consultez la [Documentation sur les éléments](../docs/docs_elements.md) pour une liste complète.

??? faq "Comment les conditions aux limites sont-elles appliquées ?"
    Les conditions aux limites sont documentées dans la [Documentation sur le prétraitement](../docs/docs_preprocessing.md).

# Développement

??? faq "Comment puis-je contribuer à Comfor ?"
    Consultez le [Code de conduite](../developers/dev_code_of_conduct.md) et le [Guide Git](../developers/dev_git.md) pour les directives de contribution.

# Utilisation scientifique et académique

??? faq "Comfor est-il revu par des pairs ?"
    Les méthodes numériques de Comfor sont publiées et validées en collaboration avec des partenaires académiques et industriels.
    Pour les références, consultez la [Page des publications](../news/news_publications.md).
    !!! note
        Comfor est fourni "tel quel" et est destiné à un usage de recherche et académique.

??? faq "Puis-je utiliser Comfor pour mes recherches ?"
    Oui, Comfor est disponible pour un **usage de recherche et académique** sous les termes de sa licence.
    Vous pouvez modifier le logiciel ou créer des œuvres dérivées **uniquement pour un usage de recherche ou académique**.
    Pour un usage commercial ou une redistribution, un accord de licence séparé avec Innovamics est requis.
    Consultez la [Page de licence](../developers/dev_license.md) pour plus de détails.

??? faq "Comment citer Comfor dans mes publications ?"
    Pour citer Comfor, référez-vous aux publications pertinentes listées sur la [Page des publications](../news/news_publications.md).
    Assurez-vous de respecter les termes de la licence et de mentionner Innovamics comme développeur du logiciel.

# Résolution des problèmes

??? faq "Ma simulation plante. Que faire ?"
    1. Vérifiez le fichier de log.
    2. Signalez le problème sur [GitLab](https://gitlab.com/comfor/comfor){:target="_blank"} avec le fichier de log d'erreur et le fichier d'entrée.

??? faq "Comment signaler un bug ?"
    Ouvrez une issue sur [GitLab](https://gitlab.com/comfor/comfor){:target="_blank"} avec un fichier d'entrée minimal et le fichier de log d'erreur complet.

# Divers

??? faq "Comfor est-il gratuit ?"
    Comfor est disponible **gratuitement** pour un **usage de recherche et académique** sous les termes de sa licence.
    Consultez la [Page de licence](../developers/dev_license.md) pour plus de détails.

??? faq "Puis-je utiliser Comfor pour des projets commerciaux ?"
    Comfor **n'est pas disponible pour un usage commercial** sous sa licence standard.
    Pour un usage propriétaire ou commercial, veuillez contacter Innovamics pour négocier un accord de licence séparé.
    Consultez la [Page de licence](../developers/dev_license.md) pour plus d'informations.

??? faq "Comment rester informé des nouvelles versions ?"
    - Consultez la [Page des versions](../news/news_versions.md) pour les dernières mises à jour.
    - Surveillez le [Dépôt GitLab](https://gitlab.com/comfor/comfor){:target="_blank"} pour des notifications en temps réel.
