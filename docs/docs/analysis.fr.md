L'étape de pré-traitement consiste à générer un fichier texte ASCII d’entrée
décrivant le modèle. L’étape suivante consiste à exécuter Comfor en utilisant ce
fichier d’entrée. L’analyse sera effectuée et Comfor va générer plusieurs
fichiers de sortie : fichiers Paraview, fichiers CSV et journaux (.log).

# Démarrer une nouvelle analyse

Comfor s’exécute depuis le terminal (ligne de commande) avec la syntaxe
suivante:

```bash
comfor <nom_du_fichier>
```

- `<nom_du_fichier>` : est le chemin relatif ou absolu vers le fichier d’entrée.
  Si le fichier est situé dans le même dossier que l’exécutable de Comfor, vous
  pouvez simplement indiquer son nom.

_Exemples_ :

```console
$ comfor test.bim
$ comfor ./sim/test.bim
$ comfor ../test.bim
$ comfor /usr/name/sim/test.bim
```

# Informations pendant l’exécution

Pendant l’analyse, Comfor affiche périodiquement des informations utiles dans le
terminal. La fréquence est définie par le paramètre
[`PRINT EVERY`](preprocessing.md#controle_de_temps) dans le bloc de contrôle.

La sortie s’organise en blocs comme suit :

```console
=================================
Elapsed time: 0.955748s
Current time: 8s
Time step: 0.001
Internal energy: 35.2456
Kinetic energy: 0.0110008
=================================
```

- `Elapsed time` : temps CPU utilisateur (temps réel) depuis le début de la simulation.
- `Current time` : temps courant dans la simulation.
- `Time step` : plus petit pas de temps courant du modèle.
- `Internal energy` : énergie générée par les forces internes du modèle.
- `Kinetic energy` : énergie cinétique du modèle.

!!! tip
    Pour arrêter une simulation en cours, appuyez sur ++ctrl+c++.

# Sortie

Un nouveau dossier nommé `Results_<nom_du_fichier>` est créé dans le même
répertoire que le fichier d’entrée. Ce dossier contient une série de fichiers
`*.vtk` pouvant être visualisés avec Paraview.

# Erreurs et bugs

Si une erreur survient, veuillez nous contacter.
