Comfor dispose d'une classe générale pour les parsers[^1], ce qui
permettra à l'avenir de créer des sous-classes pour lire différentes
données provenant d'autres logiciels (par exemple Abaqus). Mais pour l'instant,
Comfor lit un fichier texte ASCII générique organisé en blocs. L'extension de ce
fichier n'a pas d'importance, mais à l'avenir, nous associerons l'extension
*.bim (modèle d'entrée de base) à ce fichier. La structure de ce fichier est
détaillée ci-dessous.

Cependant, dans le cas général, chaque fichier d'entrée doit définir les points
suivants :

- Maillage
- Nœuds
- Éléments
- Matériaux
- Conditions aux limites
- Charges
- Analyse

# Unités

Il n'y a pas de système d'unités dans Comfor. L'utilisateur peut utiliser
n'importe quel système d'unités cohérent
[voir](https://femci.gsfc.nasa.gov/units/index.html). Les unités doivent être
cohérentes de manière à ce que les opérations mathématiques donnent directement
les unités correctes pour la quantité résultante. Par exemple, pour la loi de
Newton :

$$ \mathbf{f} = \mathbf{M} \mathbf{a} $$ 

Si l'unité de force est le newton $N$, l'unité de longueur est le $mm$ et
l'unité de temps est la seconde $s$, les unités d'accélération sont $mm/s^2$ et
les unités de masse doivent être $kg \cdot 10^{3} = t$ (tonne métrique). 

# Fichier d'entrée

Ce type de fichier est structuré en blocs. Chaque bloc est étiqueté et définit
les paramètres d'entrée du modèle. Chaque bloc a un type qui dépend de
l'étiquette/catégorie des données d'entrée. Les étiquettes et types existants
sont indiqués dans le tableau suivant.

- `CONTROL`    
- `MATERIAL`
    - Hyperelastic
    - Hypertextile
    - Elastic
- `CONTRAINTS`
    - Boundary_conditions  
- `AMPLITUDES`  
    - Tabular 
- `NODES`   
- `ELEMENTS`
    - Shell_C03
    - Membrane_3
    - Contact_triangle
    - Contact_line
    - Rod_2
- `TRACKERS`  

La définition générale d'un bloc est la suivante :

```xml
<block_label> TYPE <type_block>
<entry_1>
<entry_2>
<entry_3>
```
!!! astuce
    
    L'ordre des blocs dans le fichier d'entrée n'a aucune incidence sur
    l'opération d'analyse.

## Contrôle de temps

Ce bloc définit les paramètres de l'analyse explicite.
 
- Heure de début et de fin de l'analyse
    - `RUN FROM .. TO ..`
- Intervalle de temps (facultatif)
    - `STEP`
- Intervalle d'impression
    - `PRINT EVERY`

L'étiquette associée est `CONTROLS`.
 
**Structure**

```xml
CONTROLS
RUN FROM <start_time> TO <end_time> STEP <time_step> 
PRINT EVERY <print_step> 
```
Si le label `STEP` n'est pas spécifié, le pas de temps sera défini
automatiquement en fonction du matériau et du type de maillage.

!!! note
    Dans une version future, le type de solveur sera défini ici.

## Matériaux

Ce bloc définit les matériaux du modèle. Chaque bloc contient un groupe de
matériaux du même type. La structure générale est la suivante :

```xml
MATERIALS TYPE <material_type_1>
<material_1_name> RHO = <density> DAMPING = <material1_damping_value> <prop_1> = <value_prop_n> ...
<material_2_name> RHO = <density> DAMPING = <material2_damping-value> <prop_1> = <value_prop_n> ...

MATERIALS TYPE <material_type_2>
<material_3_name> RHO = <density> DAMPING = <material1_damping_value> <prop_n> = <value_prop_n> ...
<material_4_name> RHO = <density> DAMPING = <material2_damping-value> <prop_n> = <value_prop_n> ...
```

- `<material_type>` définit le modèle constitutif du matériau.
- `<material_1_name>` est le nom personnalisé du matériau 1 (défini par
  l'utilisateur)
- Le paramètre `RHO` fait référence à la densité massique du matériau et
  **doit** être défini dans tous les cas.
- `DAMPING` est l'amortissement proportionnel à la masse. Ce facteur introduit
  des forces d'amortissement causées par les vitesses absolues du modèle. Ce
  paramètre est facultatif.
- `<prop_n>` Définit la valeur de la propriété nommée `prop_n`. Les étiquettes
  dépendent de chaque matériau.
 
Pour voir la liste des matériaux disponibles, consultez
[Matériaux](theory/materials/materials_overview.md)

_Exemple_ :

```js
MATERIAL TYPE Elastic
aluminium rho = 2.7e-9 nu=0.3 E=70000
```
## Amplitudes

Une amplitude permet d'imposer un comportement dépendant du temps pour les
contraintes et les charges.

**Structure**

```xml
AMPLITUDES TYPE <amplitude_type_1>
<amplitude_1_name> <prop_n> = <value_prop_n> ...
<amplitude_2_name> <prop_n> = <value_prop_n> ...
```

- `<amplitude_type>` définit le type d'amplitude du matériau du modèle.
- `amplitude_1_name>` est le nom personnalisé de la première amplitude 1 (défini
  par l'utilisateur)
- `<prop_n>` Définit la valeur de la propriété nommée `prop_n`. Les étiquettes
  dépendent de chaque type d'amplitude.

Pour l'instant, seules les amplitudes tabulaires sont prises en charge. La
structure est donnée par :

```xml
AMPLITUDES TYPE TABULAR
<amplitude_1_name> VALUES = <t1 , v1, t2, v2, ... , tn, vn>
<amplitude_2_name> VALUES = <t1 , v1, t2, v2, ... , tn, vn>
```

où `tn, vn` définit la valeur $v_n$ de l'amplitude à l'instant $t_n$. Les
valeurs entre $t_n$ et $t_{n+1}$ sont interpolées linéairement.

_Exemple_:
 
```js
AMPLITUDES TYPE TABULAR
Palier   VALUES = 0, 0 ,1 ,1 ,5, 6, 0, 7, 0
Augmentation VALUES = 0, 0 ,7 ,1 
Diminution VALUES = 0, 1 ,7 ,0 
```
Définit l'amplitude :

<canvas id="Amplitude" width="700" height="400">Désolé, votre navigateur ne
prend pas en charge &lt;canvas&gt;.</canvas>

## Contraintes

Ce bloc définit les différentes contraintes du modèle. Chaque bloc contient
différentes contraintes du même type.

**Structure**

```xml
CONSTRAINTS TYPE <constraint_type_1>
<constraint_1_name> <prop_n> = <value_prop_n> ...

CONSTRAINTS TYPE <constraint_type_1>
<constraint_n_name> <prop_n> = <value_prop_n> ... AMPLITUDE = <amplitude_name>
```

- `<constraint_type>` : définit le type de contrainte du matériau du modèle.
- `contraint_n_name>` : nom personnalisé de l'amplitude n (défini par
  l'utilisateur)
- `<prop_n>` : définit la valeur de la propriété nommée `prop_n`. Les étiquettes
  dépendent du type de contrainte.
- `AMPLITUDE` : indique qu'une amplitude est associée à cette contrainte
    
- `<amplitude_name>` : nom de l'amplitude à appliquer à cette contrainte, comme
  spécifié dans le bloc amplitude.

À l'heure actuelle, le seul type de contrainte est `boundary_conditions`. Cette
contrainte permet de fixer le degrés de liberté du nœud. La structure est donnée par :

```xml
CONSTRAINTS TYPE BOUNDARY_CONDITION
<bc_1_name> VX = <valeur> VY = <valeur> VZ = <valeur> VRX = <valeur> VRY = <valeur> VRZ = <valeur> AX = <valeur> AY = <valeur> AZ = <valeur> ARX = <valeur> ARY = <valeur> ARZ = <valeur>
<bc_with_amplitude> VX = <valeur>  ... AMPLITUDE = <amplitude_name>
```

où `VI` définit le taux de déplacement de la valeur dans la direction I(X,Y,Z),
`VRI` définit le taux de rotation dans la direction I(X,Y,Z), `AI` définit
l'accélération du déplacement de la valeur dans la direction I(X,Y,Z), `ARI`
définit le taux d'accélération de rotation dans la direction I(X,Y,Z). Enfin,
vous pouvez utiliser une amplitude du bloc amplitude pour modifier la valeur
absolue de la condition aux limites.

!!! remarque
    Si le DOF n'est pas fixe, alors il est libre.

_Exemple_ :

```js
CONSTRAINTS TYPE BOUNDARY_CONDITION
FIX_ROT  VRX = O. VRY = O. VRZ = O.
PINNED   VX = O.  VY = O.  VZ = O.
VX_AMP   VX = 1.  AMPLITUDE = Augmentation
AMPLITUDES TYPE TABULAR
Augmentation VALUES = 0, 0 ,7 , 2.5 
```

L'évolution du taux de déplacement est donnée par : 

<canvas id="BCAmplitude" width="700" height="400">Désolé, votre navigateur ne prend pas en charge &lt;canvas&gt;.</canvas>

!!! astuce
    L'ordre des blocs n'a aucune importance, vous pouvez faire référence à une amplitude même si le bloc amplitude est défini après.

## Chargements

Ce bloc définit les différentes charges du modèle. Chaque bloc peut contenir des charges de différents types.

**Structure**
```xml
LOADS 
<load_1_name> <load_type_1> = <value_Load> <load_type_2> = <value_Load>
<load_2_name> <load_type_3> = <value_Load> Amplitude = <amplitude_name>
```

- `<load_n_name>` : nom personnalisé de la charge n (défini par l'utilisateur)
- `<load_type>` : définit le type de charge à définir, les options sont les suivantes :
- `P` : définit une pression normale sur une face de l'élément
- `AX,AY,AZ` : définit le champ d'accélération nodale dans les directions `X,Y,Z`
    
- `FX,FY,FZ` : définit une force nodale ponctuelle dans la direction `X,Y,Z`
- `AMPLITUDE` : indique qu'une amplitude est associée à cette charge.
- `<amplitude_name>` : nom de l'amplitude à appliquer à cette charge, tel que spécifié dans le bloc amplitude.

_Exemple_ :

```js
LOADS
punctual_force   FX = 1.0
gravity_field    AZ = 9.8
normal_pressure  P =  1.0 AMPLITUDE = vacuum
AMPLITUDES TYPE TABULAR
vacuum VALUES = 0., 0. , 5., -1.0 
```
<canvas id="LoadAmplitude" width="700" height="400">Désolé, votre navigateur ne prend pas en charge &lt;canvas&gt;.</canvas>

## Nœuds

Ce bloc définit la position des différents nœuds dans le modèle, **et*
éventuellement les contraintes et les charges appliquées à chaque nœud.
 
**Structure**

```xml
NODES
<node_number_1> X = <x_coord> Y = <y_coord> Z = <z_coord>
<node_number_2> X = <x_coord> Y = <y_coord> Z = <z_coord> CONSTRAINT = <constraint_name> LOAD = <load_name> 
```

- `<node_number>` : numéro entier du nœud
- `<X>` : coordonnée x
- `<Y>` : coordonnée y
- `<Z>` : coordonnée z
- `CONSTRAINT` : indique qu'une contrainte est associée à ce nœud.
- `<constraint_name>` : nom de la contrainte à appliquer à ce nœud, tel que spécifié dans le bloc de contraintes.
- `LOAD` : indique qu'une charge est associée à ce nœud.
- `<load_name>` : nom de la charge à appliquer à ce nœud, tel que spécifié dans le bloc de charge.

_Exemple_ :

```js
NODES
1   X =  3,0    Y = 2,0 Z = 0,0 CONSTRAINT = FIXED_XY
2   X =  5,0    Y = 8,0 Z = 0,0 LOAD = P_FORCE
3   X =  7,0    Y = 2,0 Z = 0,0 CONSTRAINT = FIXED_XY
 
CONSTRAINTS TYPE BOUNDARY_CONDITION
FIXED_XY VX = 0 VY = 0 VZ = 0
LOADS
P_FORCE   FZ = 1.0
```
Cela définit 3 points :

<canvas id="NodeTri" width="700" height="400">Désolé, votre navigateur ne prend
pas en charge &lt;canvas&gt;.</canvas>

## Éléments

Ce bloc définit les différents éléments du modèle. Chaque bloc contient un
groupe d'éléments du même type. La structure générale est la suivante :

**Structure**

```xml
ELEMENTS TYPE <type_élément>
<numéro_élément_1> NODES = <numéro_nœud_1 numéro_nœud_2 numéro_nœud_3 ...> MATERIAL = <nom_matériau> T = <valeur_épaisseur> LOAD = <nom_charge> <prop_n> = <valeur_prop_n> ... 

```

- `<élément_numéro>` : numéro entier de l'élément
- `NODES` : définit l'entrée de connectivité de l'élément
    - `<nœud_numéro_1>` : numéro du premier nœud tel qu'indiqué dans le bloc nœud
    - `<nœud_numéro_2>` : numéro du deuxième nœud tel qu'indiqué dans le bloc nœud
    - `<nœud_numéro_3>` : numéro du troisième nœud tel qu'indiqué dans le bloc nœud    
    - ...
- `MATERIAL` : définit le matériau de l'élément
    - `<material_name>` : nom du matériau tel qu'indiqué dans le bloc matériau
- `T` : définit la valeur d'épaisseur (uniquement pour les coques)
    - `<thickness_value>` : valeur d'épaisseur
- `LOAD` : indique qu'une charge est associée à cet élément.
    - `<load_name>` : nom de la charge à appliquer à cet élément, tel que spécifié dans le bloc de charge.
    - `<prop_n>` Définit la valeur de la propriété nommée `prop_n`. Les étiquettes dépendent de chaque élément.

Pour voir la liste des matériaux disponibles, voir [Éléments]().

_Exemple_ :

```js
ELEMENTS TYPE MEMBRANE_3
1 NODES = [1, 2, 3] MATERIAL = elastic T =  1.0 LOAD = vacuum
```

Cela définit un élément membrane triangulaire à partir des nœuds 1, 2 et 3, en
utilisant le comportement constitutif défini pour le matériau élastique.

<canvas id="ElementTri" width="700" height="400">Désolé, votre navigateur ne
prend pas en charge &lt;canvas&gt;.</canvas>

## Contact

Le contact est activé en ajoutant la balise `CONTACT = ` après la définition de
chaque ligne d'élément. La friction est activée en utilisant
`FRICTION = <friction_value>`. Vous pouvez spécifier deux types de contact :

- `CONTACT = BASIC` : l'élément (surface de contact) va détecter les nœuds
  pénétrant la surface et calculer la force nécessaire pour maintenir le
  contact.
- `CONTACT = EDGE` : active la surface de contact et détecte tout bord en
  contact avec les bords de l'élément.

_Exemple_ :

```js
ELEMENTS TYPE MEMBRANE_3
1 NODES = [1, 2, 3] MATERIAL = elastic T =  1.0 CONTACT = edge FRICTION = 0.2
```
## Trackers

Enfin, nous pouvons utiliser des objets trackers pour suivre certaines
informations sur les nœuds ou les éléments. Ces informations sont imprimées dans
un fichier CSV pour chaque [`print_step`](#controle_de_temps) et pour chaque nœud/élément
spécifié dans la définition du tracker.

**Structure**
```xml
TRACKER TYPE <tracker_type>
<tracker_1_name> <list> = <object_number> TYPE = <information_type> <prop_n> = <value_prop_n> ...
<tracker_2_name> <list> = <object_number> TYPE = <information_type> <prop_n> = <value_prop_n> ... 
```

- `<tracker_type>` : définit la nature du tracker du bloc.
- `ELEMENT` : définit un bloc tracker pour les éléments.
- `NODES` : définit un bloc tracker pour les nœuds.
- `<tracker_n_name>` est le nom personnalisé du tracker n (défini par l'utilisateur)
- `<list>` : liste des nœuds ou des éléments à suivre.
- `NODES `: suivi des numéros des nœuds à suivre.
- `ELEMENTS` : suivi des numéros des éléments à suivre.
- `<prop_n>` Définit la valeur de la propriété nommée `prop_n`. Les étiquettes dépendent de chaque bloc de suivi.

Comme vous pouvez le voir, nous pouvons suivre les informations relatives aux nœuds et aux éléments.

Pour les nœuds :

```xml
TRACKER TYPE NODES
<tracker_1_name> NODES = <node_number_1 node_number_2 node_number_3 ...>  TYPE = <information_type> DIRECTION = <direction_axis> 
```

- `NODES` : définit la liste des ID des nœuds à suivre
- `<node_number_1>` : numéro du premier nœud tel qu'indiqué dans le bloc de nœuds
- `<node_number_2>` : numéro du deuxième nœud tel qu'indiqué dans le bloc de nœuds
- `<node_number_3>` : numéro du troisième nœud tel qu'indiqué dans le bloc de nœuds
- ...
- `TYPE` : informations nodales à suivre.
- `FORCE` : force nodale
- `MOMENT` : moments nodaux
- `POSITION` : position nodale
- `VELOCITY` : vitesse nodale
- `ACCELERATION` : accélération nodale
- `CONTACTFORCE` : force de contact nodale
- `DIRECTION` : composante du tenseur d'informations nodales
- `X` : composante X
- `Y` : composante Y
- `Z` : composante Z

_Exemple_ :

```js
TRACKERS TYPE NODE
FY NODES = [7,8] DIRECTION = Y TYPE = FORCE
```

Pour les éléments :

```xml
TRACKER TYPE ELEMENT
<tracker_1_name> ELEMENTS = <element_number_1 element_number_2 element_number_3 ...>  TYPE = <type_tensor> COMPONENT = <component_tensor>
```

- `NODES` : définit la liste des ID des nœuds à suivre
    - `<node_number_1>` : numéro du premier nœud tel qu'indiqué dans le bloc node
    - `<node_number_2>` : numéro du deuxième nœud tel qu'indiqué dans le bloc node
    - `<node_number_3>` : numéro du troisième nœud tel qu'indiqué dans le bloc node
    - ...
- `TYPE` : informations sur l'élément à suivre.
    - `STRESS` : tenseur de contrainte
    - `STRAIN` : tenseur de déformation
- `COMPONENT` : composante du tenseur
    - `Cii` : donne la composante ${A}_{ii}$ du tenseur $\mathbf{A}$ de type `<type_tensor>`

_Exemple_ :

```js
TRACKERS TYPE ELEMENT 
shear_angle_a ELEMENTS = [3,5,6,7,8,9] COMPONENT = C23 TYPE = strain
shear_angle_b ELEMENTS = [2,4,10,12] COMPONENT = C23 TYPE = strain
shear_angle_c ÉLÉMENTS = [1,11] COMPOSANT = C23 TYPE = strain
```

[^1]: L'analyse syntaxique, ou analyse syntaxique, est le processus qui consiste à analyser une chaîne de symboles, qu'il s'agisse d'un langage naturel, d'un langage informatique ou d'une structure de données, conformément aux règles d'une grammaire formelle. [Wikipedia](https://en.wikipedia.org/wiki/Parsing)


