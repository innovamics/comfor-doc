Comfor est un code FEM explicite écrit en C++. L'objectif de ce logiciel est de
fournir une solution générale et innovante pour la modélisation des procédés de
mise en forme des composites. Comfor est conçu pour être modulaire et adapté
aussi bien aux applications industrielles qu'à la recherche.

Nous sommes fiers d'être le seul fournisseur de logiciels pour composites à
fournir le code source. Puisqu’il ne devrait pas y avoir de secrets en
physique, le code source de toutes les équations et des modèles physiques
implémentés dans Comfor est accessible aux chercheurs. Nous espérons que cette
ouverture permettra à davantage de chercheurs de participer au développement de
modèles physiques indispensables à l'industrie. N'hésitez pas à consulter une
copie de l'édition open source sur la page de téléchargement.

# Bien démarrer

Le [guide de démarrage rapide](overview/quick_starter_guide.md) vous donne le
strict nécessaire pour commencer. Pour créer vos propres modèles, vous pouvez
consulter le [guide utilisateur](user/user_overview.md).

# Présentation

**Comfor est écrit en C++**

- Le C++ est un langage orienté objet, permettant une solution hautement modulaire.
- Le C++ est robuste et performant.
- Le calcul parallèle peut être implémenté facilement avec OpenMP.

**Comfor est multiplateforme**

Grâce à des outils comme CMake, nous pouvons proposer une solution compatible
multiplateforme. Actuellement, Comfor a été compilé et testé pour les
architectures suivantes :

- Ubuntu 18.04/20.04
  - Gcc 10.2
  - Clang 11.0.3
  - Clang 12.0.0
- OSX Big Sur
  - Clang 11.0.3
  - Clang 12.0.0
- Windows 7, 10, 11
  - GCC 10.2.0 via MSYS2/MinGW64
  - Visual Studio 2019 (amd64, x86_amd64)

**Comfor est open source**

Le code source sera publié en 2025.

# Utilisateurs

Dans la documentation utilisateur, vous apprendrez à construire, exécuter et
analyser votre première simulation. Si vous avez besoin de bases scientifiques
sur la mise en forme des composites et la simulation par éléments finis, vous
pouvez consulter la [documentation théorique](theory/theory_overview.md).

# Développeurs

Vous souhaitez rejoindre la communauté ? Génial ! Vous trouverez dans le guide
développeur toutes les informations et les outils nécessaires sur le projet.
Innovons ensemble !

---

<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img
alt="Creative Commons License" style="border-width:0"
src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a><br /><span
xmlns:dct="http://purl.org/dc/terms/" property="dct:title">Comfor
Documentation</span> by <a xmlns:cc="http://creativecommons.org/ns#"
href="https://egm_foss.gitlab.io/about_me/" property="cc:attributionName"
rel="cc:attributionURL">Eduardo Guzman</a> is licensed under a <a rel="license"
href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons
Attribution-ShareAlike 4.0 International License</a>.<br />Based on a work at <a
xmlns:dct="http://purl.org/dc/terms/"
href="https://gitlab.com/innovamics/comfor-doc"
rel="dct:source">https://gitlab.com/innovamics/comfor-doc</a>.
