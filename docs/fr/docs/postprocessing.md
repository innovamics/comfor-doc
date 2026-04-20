Le format [VTU (XML Unstructured Grid)](https://docs.vtk.org/en/latest/vtk_file_formats/vtkxml_file_format.html#unstructuredgrid){:target="_blank"} est le format de sortie recommandé pour les résultats dans **COMFOR**, bien que le format VTK hérité soit toujours supporté. Ces formats sont des standards industriels pour la visualisation scientifique.

Pendant la simulation, **COMFOR** écrit plusieurs fichiers de résultats à la [`fréquence`](preprocessing.md#sorties_output) spécifiée. Ces fichiers sont stockés dans le répertoire de résultats défini dans votre fichier d'entrée.

**Exemple de structure de dossier**

```console
Dossier_Projet
  |
  |---simulation.toml
  |---Dossier_Resultats
  |     |--- simulation_0.vtu
  |     |--- simulation_1.vtu
  |     |--- simulation_2.vtu
       ...
```

# Charger les fichiers

Pour visualiser les résultats, ouvrez **ParaView**. Cliquez sur **File → Open** et naviguez jusqu'à votre dossier de résultats. Comme **COMFOR** nomme les fichiers dans un ordre croissant (ex: `fichier_..vtu`), ParaView proposera automatiquement de les ouvrir en tant que **groupe de fichiers** (série temporelle).

<div style="text-align:center;">
	<figure>
		<img src="../../assets/img/open_vtk.gif" alt="Chargement des fichiers dans ParaView">
		<figcaption>Chargement des fichiers</figcaption>
	</figure>
</div>

# Lancer l'animation

Après avoir ouvert les fichiers, ils apparaîtront dans le **Navigateur de pipeline** (Pipeline Browser). Cliquez sur le bouton **Apply** dans la section des propriétés pour afficher le maillage.

!!! tip "Astuce de flux de travail"
    Pour gagner du temps, activez l'option **Auto Apply** dans *Edit → Settings → General → Properties Panel Options*.

Pour lancer l'animation, utilisez le bouton **Play** de la barre d'outils VCR. Vous pouvez naviguer image par image, lire l'animation en boucle ou sauter à des pas de temps spécifiques via la barre temporelle.

Les données à afficher (Scalaires ou Vecteurs) peuvent être sélectionnées dans le menu déroulant de la **Variable Active**. Vous pouvez visualiser les données nodales (ex: Déplacement) ou les données éléments (ex: Contrainte). Les couleurs et les dégradés peuvent être personnalisés dans la section **Coloring** du panneau des propriétés.

<div style="text-align:center;">
	<figure>
		<img src="../../assets/img/play_vtk.gif" alt="Contrôles d'animation">
		<figcaption>Lecture de l'animation</figcaption>
	</figure>
</div>

# Appliquer des filtres

ParaView propose une large gamme de [filtres](https://docs.paraview.org/en/latest/Tutorials/ClassroomTutorials/beginningSourcesAndFilters.html){:target="_blank"} pour traiter et analyser les données de simulation. Les filtres peuvent être empilés dans le Navigateur de pipeline pour combiner leurs effets.

Filtres couramment utilisés pour les simulations **COMFOR** :

  - **`Connectivity`** : Identifie les régions du maillage qui sont connectées. Ce filtre assigne un identifiant de région (données de points) aux composants connectés du jeu de données d'entrée. Nous utilisons ce filtre pour séparer les régions solides des plaques composites.
  - **`Threshold` (Seuil)** : Ce filtre extrait les éléments qui possèdent des scalaires de données nodales ou éléments dans une plage spécifiée. Pour spécifier la plage, sélectionnez votre filtre Threshold dans l'arborescence du Navigateur de pipeline et développez la section `Properties(Threshold)`. Sélectionnez le scalaire à évaluer et fixez les valeurs max et min. Enfin, cliquez sur Apply.
  - **`Cell Data to Point Data`** : Ce filtre permet d'extrapoler les données des éléments vers les nœuds. Il effectue la moyenne des valeurs des données des éléments entourant un nœud pour calculer l'information nodale.
  - **`Temporal Interpolator`** : Interpole la solution entre deux images. Utile pour obtenir des animations fluides et de qualité pour les présentations.
  - **`Plot Data`** : Trace des tableaux de données à partir de l'entrée. Ce filtre prépare des données arbitraires pour être tracées dans n'importe quel graphique (par défaut, un graphique linéaire XY). Utilisez ce filtre pour tracer vos fichiers CSV.

<div style="text-align:center;">
	<figure>
		<img src="../../assets/img/filter_vtk.gif" alt="Application de filtres">
		<figcaption>Application de filtres</figcaption>
	</figure>
</div>

# Ressources

Pour une formation approfondie sur ParaView, consultez ces ressources :

  - [Tutoriel officiel de ParaView (Wiki)](https://www.paraview.org/Wiki/The_ParaView_Tutorial){:target="_blank"}
  - [Tutoriels de Cyprien Rusu - ParaView pour l'EF](https://youtube.com/playlist?list=PLvkU6i2iQ2fpcVsqaKXJT5Wjb9_ttRLK-){:target="_blank"}
