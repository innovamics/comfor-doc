Comfor has a general class for parsers [^1], so in the future we will be able to create subclasses to read different data from other software (e.g. Abaqus). But for the moment Comfor reads a generic ASCII text file organized by blocks. The extension of this file is not important, but in the future we will associate the extension *.bim (basic input model), the structure of this file is detailed below. 

However, in the general case, each input file must define the following points:

- Meshing
    - Nodes
    - Elements
- Material
- Boundary conditions
- Loads
- Analysis

# Units 

There are not unit system in Comfor. The user can use any consistent unit system [see](https://femci.gsfc.nasa.gov/units/index.html). The units must be consistent in that mathematical operations directly yield the correct units for the result quantity. For example for Newtons' law :

$$ \mathbf{f} = \mathbf{M} \mathbf{a} $$

If the unit force is the the newton $N$, the length unit is the $mm$ and the time unit is the second $s$, the units for acceleration are $mm/s^2$ and the units for mass, must be $kg \cdot 10^{3} = t$ (metric ton).

# Bim input file

This type of file is structured by blocks. Each block is labeled and defines the input parameters of the model. Each block have a type depending on the label/category of the input data. The existing labels ans types are given in the following table.

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

The general definition of one block is: 

```xml
<block_label> TYPE <type_block>
<entry_1>
<entry_2>
<entry_3>
```

!!! hint
    The order of the block in the input file has not impact for parsing operation

## Control

This block defines the control parameters of the explicit analysis. 

- Start and end time of the analysis
    - `RUN FROM .. TO ..`
- Time step (optional)
    - `STEP`
- Printing step
    - `PRINT EVERY`

The associated label is `CONTROLS`. 

**Structure**

```xml
CONTROLS
RUN FROM <start_time> TO <end_time> STEP <time_step> 
PRINT EVERY <print_step> 
```

If the `STEP` label is not specified, the time step will be set automatically according to the material and the mesh type.

!!! note
    In future version the solver type would be defined here.

## Materials

This blocks defines the materials of the model. Each block contains a group of materials of the same type. The general structure is :

```xml
MATERIALS TYPE <material_type_1>
<material_1_name> RHO = <density> DAMPING = <material1_damping_value> <prop_1> = <value_prop_n> ...
<material_2_name> RHO = <density> DAMPING = <material2_damping-value> <prop_1> = <value_prop_n> ...

MATERIALS TYPE <material_type_2>
<material_3_name> RHO = <density> DAMPING = <material1_damping_value> <prop_n> = <value_prop_n> ...
<material_4_name> RHO = <density> DAMPING = <material2_damping-value> <prop_n> = <value_prop_n> ...
```

- `<material_type>` defines the constitutive model of the material. 
- `<material_1_name>` is the custom name for the material 1 (defined by the user)
- `RHO` parameter make reference to the mass density of the material and **must** be defined in all cases.  
- `DAMPING` is the mass proportional damping. This factor introduces damping forces caused by the absolute velocities of the model. This parameter is optional.
- `<prop_n>` Defines the value of the property with name `prop_n`. The labels depends of each material. 

To see the available list of materials see [Material](docs_materials.md) 

_Example_: 

```js
MATERIAL TYPE Elastic
aluminium rho = 2.7e-9 nu=0.3 E=70000
```

## Amplitudes

An amplitude allows to impose a time dependent behavior for constraints and loads.

**Structure**

```xml
AMPLITUDES TYPE <amplitude_type_1>
<amplitude_1_name> <prop_n> = <value_prop_n> ...
<amplitude_2_name> <prop_n> = <value_prop_n> ...
```

- `<amplitude_type>` defines the amplitude type of the model material. 
- `amplitude_1_name>` is the custom name for the first amplitude 1 (defined by the user)
- `<prop_n>` Defines the value of the property with name `prop_n`. The labels depends of each amplitude type.


At this moment only tabular amplitudes are supported. The structure is given by:

```xml
AMPLITUDES TYPE TABULAR
<amplitude_1_name> VALUES = <t1 , v1, t2, v2, ... , tn, vn>
<amplitude_2_name> VALUES = <t1 , v1, t2, v2, ... , tn, vn>
```

where `tn, vn` defines the value $v_n$ of the amplitude at time $t_n$. The values between $t_n$ and $t_{n+1}$ are linear interpolated.

_Example_: 

```js
AMPLITUDES TYPE TABULAR
Palier   VALUES = 0, 0 ,1 ,1 ,5, 6, 0, 7, 0
Increase VALUES = 0, 0 ,7 ,1 
Decrease VALUES = 0, 1 ,7 ,0 
```
Defines the amplitude: 

<canvas id="Amplitude" width="700" height="400">Désolé, votre navigateur ne prend pas en charge &lt;canvas&gt;.</canvas>

## Constraints 

This block defines the different constraints of the model. Each Block contains different constraints of the same type. 

**Structure**

```xml
CONSTRAINTS TYPE <constraint_type_1>
<constraint_1_name> <prop_n> = <value_prop_n> ...

CONSTRAINTS TYPE <constraint_type_1>
<constraint_n_name> <prop_n> = <value_prop_n> ... AMPLITUDE = <amplitude_name>
```

- `<constraint_type>`: defines the constraint type of the model material. 
- `contraint_n_name>`: is the custom name for the amplitude n (defined by the user)
- `<prop_n>`: Defines the value of the property with name `prop_n`. The labels depends of each constraint type type.
- `AMPLITUDE`: Indicates that an amplitude is associated to this constraint
    - `<amplitude_name>`: amplitude name to be applied to this constraint, as specified in the amplitude block.

At this moment only the only type of constraint is `boundary_conditions`. This
constraints allows to fix the degrees of freedom of the node.The structure is given by:

```xml
CONSTRAINTS TYPE BOUNDARY_CONDITION
<bc_1_name> VX = <value> VY = <value> VZ = <value> VRX = <value> VRY = <value> VRZ = <value> AX = <value> AY = <value> AZ = <value> ARX = <value> ARY = <value> ARZ = <value>
<bc_with_amplitude> VX = <value>  ... AMPLITUDE = <amplitude_name>
```
where `VI` defines the value displacement rate in direction I(X,Y,Z), `VRI` defines the rotational rate in direction I(X,Y,Z), `AI` defines the value displacement acceleration in direction I(X,Y,Z), `ARI` defines the rotational acceleration rate in direction I(X,Y,Z). Finally, you can use an amplitude from the amplitude block to modify the absolute value of the boundary condition. 

!!! note
    If the DOF is not fixed, then is free. 

_Example_: 

```js
CONSTRAINTS TYPE BOUNDARY_CONDITION
FIX_ROT  VRX = O. VRY = O. VRZ = O.
PINNED   VX = O.  VY = O.  VZ = O.
VX_AMP   VX = 1.  AMPLITUDE = Increase

AMPLITUDES TYPE TABULAR
Increase VALUES = 0, 0 ,7 , 2.5 
```
The displacement rate evolution is given by: 

<canvas id="BCAmplitude" width="700" height="400">Désolé, votre navigateur ne prend pas en charge &lt;canvas&gt;.</canvas>

!!! tip
    The order of blocks doesn't have any importance, you can make reference to an amplitude even if the amplitude block is defined after.


## Loads

This block defines the different loads of the model. Each block may contain loads of different types.

**Structure**

```xml
LOADS 
<load_1_name> <load_type_1> = <value_Load> <load_type_2> = <value_Load>
<load_2_name> <load_type_3> = <value_Load> Amplitude = <amplitude_name>
```

- `<load_n_name>`: is the custom name for the load n (defined by the user)
- `<load_type>`: Defines the type of load to be defined, options are:
    - `P`: Defines a normal pressure to an element face
    - `AX,AY,AZ`: Defines nodal acceleration field in the direction `X,Y,Z`
    - `FX,FY,FZ`: Defines a punctual nodal force in the direction `X,Y,Z`
- `AMPLITUDE`: Indicates that an amplitude is associated to this load.
    - `<amplitude_name>`: amplitude name to be applied to this load as specified in the amplitude block.

_Example_:

```js
LOADS
punctual_force   FX = 1.0
gravity_field    AZ = 9.8
normal_pressure  P =  1.0 AMPLITUDE = vacuum

AMPLITUDES TYPE TABULAR
vacuum VALUES = 0., 0. , 5., -1.0 
```
<canvas id="LoadAmplitude" width="700" height="400">Désolé, votre navigateur ne prend pas en charge &lt;canvas&gt;.</canvas>

## Nodes

This block defines the position of the different nodes in the model, **and* eventually the constraints and loads applied to each node. 

**Structure**

```xml
NODES
<node_number_1> X = <x_coord> Y = <y_coord> Z = <z_coord>
<node_number_2> X = <x_coord> Y = <y_coord> Z = <z_coord> CONSTRAINT = <constraint_name> LOAD = <load_name> 
```

- `<node_number>`: integer node number
- `<X>`: x-coordinate
- `<Y>`: y-coordinate
- `<Z>`: z-coordinate
- `CONSTRAINT`: Indicates that a constraint is associated to this node.
    - `<constraint_name>`: constraint name to be applied to this node as specified in the constraint block.
- `LOAD`: Indicates that a load is associated to this node.
    - `<load_name>`: load name to be applied to this node as specified in the load block.

_Example_:

```c
NODES
1	X =  3.0 	Y = 2.0	Z = 0.0	CONSTRAINT = FIXED_XY
2	X =  5.0 	Y = 8.0	Z = 0.0 LOAD = P_FORCE
3	X =  7.0 	Y = 2.0	Z = 0.0	CONSTRAINT = FIXED_XY 

CONSTRAINTS TYPE BOUNDARY_CONDITION
FIXED_XY VX = 0 VY = 0 VZ = 0

LOADS
P_FORCE   FZ = 1.0
```

This defines 3 points :

<canvas id="NodeTri" width="700" height="400">Désolé, votre navigateur ne prend pas en charge &lt;canvas&gt;.</canvas>


## Elements

This block defines the different elements of the model. Each block contains a group of elements of the same type. The general structure is:

**Structure**

```xml
ELEMENTS TYPE <element_type>
<element_number_1> NODES = <node_number_1 node_number_2 node_number_3 ...> MATERIAL = <material_name> T = <thickness_value> LOAD = <load_name> <prop_n> = <value_prop_n> ... 
```

- `<element_number>`: integer element number
- `NODES`: defines the connectivity input of the element
    - `<node_number_1>`: number of the first node as given in the node block
    - `<node_number_2>`: number of the second node as given in the node block
    - `<node_number_3>`: number of the third node as given in the node block
    - ...
- `MATERIAL`: defines the material of the element
    - `<material_name>`: material name as given in the material block
- `T`: Defines the thickness value (only for shells)
    - `<thickness_value>`: the thickness value
- `LOAD`: Indicates that a load is associated to this element.
    - `<load_name>`: load name to be applied to this element as specified in the load block.
- `<prop_n>` Defines the value of the property with name `prop_n`. The labels depends of each element 

To see the available list of materials see [Elements](docs_elements.md) 

_Example_: 

```js
ELEMENTS TYPE MEMBRANE_3
1 NODES = [1, 2, 3]	MATERIAL = elastic T =  1.0 LOAD = vacuum
```

This defines a triangular membrane element from node 1, 2 and 3, using the constitutive behavior defined for the elastic material.

<canvas id="ElementTri" width="700" height="400">Désolé, votre navigateur ne prend pas en charge &lt;canvas&gt;.</canvas>

## Contact 

Contact is enable by adding the key label `CONTACT = ` after the definition of each element line. Friction is enable by using `FRICTION = <friction_value>`. You can specify two contact types:

- `CONTACT = BASIC`: The element (contact surface) is going to detect the nodes penetrating the surface and is gonna compute the necessary force to enforce contact.
- `CONTACT = EDGE`: Enables contact surface + detects any edge in contact with the edges of the element.

_Example_: 

```js
ELEMENTS TYPE MEMBRANE_3
1 NODES = [1, 2, 3]	MATERIAL = elastic T =  1.0 CONTACT = edge FRICTION = 0.2
```

## Trackers 

Finally we can use tracker objects to track some nodal or element information. This information is printed into a CSV file for each [`print_step`](#control) and for each node/element specified in the tracker definition. 

**Structure**

```xml
TRACKER TYPE <tracker_type>
<tracker_1_name> <list> = <object_number> TYPE = <information_type> <prop_n> = <value_prop_n> ... 
<tracker_2_name> <list> = <object_number> TYPE = <information_type> <prop_n> = <value_prop_n> ... 
```

- `<tracker_type>`: defines the the tracker nature of the block.
    - `ELEMENT`: define a tracker block for elements.
    - `NODES`: define a tracker block for nodes.
- `<tracker_n_name>` is the custom name for the tracker n (defined by the user)
- `<list>`: lit of nodes or elements to be tracked.  
    - `NODES `: follow by the node numbers to be tracked.
    - `ELEMENTS`: follow by the element numbers to be tracked.
- `<prop_n>` Defines the value of the property with name `prop_n`. The labels depends of each tracker block.

As you see, we can track nodal an element information. 

For nodes :

```xml
TRACKER TYPE NODES
<tracker_1_name> NODES = <node_number_1 node_number_2 node_number_3 ...>  TYPE = <information_type> DIRECTION = <direction_axis> 
```

- `NODES`: defines the list of the nodes ID to be tracked
    - `<node_number_1>`: number of the first node as given in the node block
    - `<node_number_2>`: number of the second node as given in the node block
    - `<node_number_3>`: number of the third node as given in the node block
    - ...
- `TYPE`: nodal information to be tracked.
    - `FORCE`: Nodal force
    - `MOMENT`: Nodal moments 
    - `POSITION`: Nodal position
    - `VELOCITY`: Nodal velocity
    - `ACCELERATION`: Nodal acceleration
    - `CONTACTFORCE`: Nodal contact force
- `DIRECTION`: Component of the nodal information tensor
    - `X`: X component
    - `Y`: Y component
    - `Z`: Z component

_Example_:

```js
TRACKERS TYPE NODE
FY NODES = [7,8] DIRECTION = Y TYPE = FORCE
```

For elements :

```xml
TRACKER TYPE ELEMENT
<tracker_1_name> ELEMENTS = <element_number_1 element_number_2 element_number_3 ...>  TYPE = <type_tensor> COMPONENT = <component_tensor>
```

- `NODES`: defines the list of the nodes ID to be tracked
    - `<node_number_1>`: number of the first node as given in the node block
    - `<node_number_2>`: number of the second node as given in the node block
    - `<node_number_3>`: number of the third node as given in the node block
    - ...
- `TYPE`: element information to be tracked.
    - `STRESS`: Stress tensor
    - `STRAIN`: Strain tensor 
- `COMPONENT`: Component of the tensor
    - `Cii`: Gives the component ${A}_{ii}$ of the tensor $\mathbf{A}$ of type `<type_tensor>`

_Example_:

```js
TRACKERS TYPE ELEMENT 
shear_angle_a ELEMENTS = [3,5,6,7,8,9] COMPONENT = C23 TYPE = strain
shear_angle_b ELEMENTS = [2,4,10,12] COMPONENT = C23 TYPE = strain
shear_angle_c ELEMENTS = [1,11] COMPONENT = C23 TYPE = strain
```

[^1]: Parsing, syntax analysis, or syntactic analysis is the process of analyzing a string of symbols, either in natural language, computer languages or data structures, conforming to the rules of a formal grammar. [Wikipedia](https://en.wikipedia.org/wiki/Parsing)
