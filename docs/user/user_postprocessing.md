# Post-processing

[VTK](http://www.vtk.org/VTK/img/file-formats.pdf) is the default output format for the results. In the future, other formats may be developed according to users and researchers needs.

During the simulation Comfor writes several vtk files, one every [`print_step`](user_preprocessing.md#control). These files are located in the folder `Results_<file_name>`.

_Exemple_

```
Project_name
  |
  |---in_file.bim
  |---Results_in_file
  |     |--- in_file_0.vtk
  |     |--- in_file_1.vtk
  |     |--- in_file_2.vtk
       ...
```

!!! tip
    You can also open many other inputs formats, like raw tables `*.csv`, geometric data `*.stl`, images `*.png` ... try to open your tracker csv files.

## Load the files

In order to visualize the results, open Paraview. Click on menu _File_->_Open_ and look for the `Results_<file_name>`. Since Comfor names the files in ascending order, Paraview propose to open the files as a group.

<div style="text-align:center;">
    <figure>
        <img src="../../assets/img/open_vtk.gif" alt="Logo">
        <figcaption>Loading the files</figcaption>
    </figure>
</div>

## Play the animation

After open the files, Paraview create a stage on the [`Pipeline Browser`](https://www.paraview.org/ParaView/index.php/Pipeline_Browser_Ideas). If the mesh is not displayed you need to click in _Apply_ in the properties section.

!!! tip
    Activate the **Auto Apply** option in _Paraview Preferences_->_General_->_Properties Panel Options_.
    
To play the animation, click the Play button on the VCR toolbar. The time toolbar shows the current frame displayed. You can also go frame by frame, go to the first or last frame, or play the animation in a loop.

The data to be displayed can be selected in the _Data Analysis_ toolbar. A list allows you to select the active variables for the current model, scalar and vectorial values defined either at the nodes or at the elements. This can be also changed on the properties section/Coloring. The default color maps can be changed to have a more suitable visual color gradient.

<div style="text-align:center;">
    <figure>
        <img src="../../assets/img/play_vtk.gif">
        <figcaption>Playing the animation</figcaption>
    </figure>
</div>

## Applying filters

Paraview has a series of [filters](https://www.paraview.org/Wiki/ParaView/Users_Guide/List_of_filters) that allow us to manipulate the data and treat the simulation data. These filters can be applied in cascade to combine their functionalities. To apply a filter, click on menu _Filters -> Alphabetical_, or search by category. The most common filters for our application are:

- `Connectivity`: Identifies the mesh regions that are connected. The Connectivity filter assigns a region id (point data) to connected components of the input data set. We use this filter to separate the solid regions form the composite plates.
- `Threshold`:This filter extracts elements that have nodal or element data scalars in the specified range. The Threshold filter extracts the portions of the input dataset whose scalars lie within the specified range. To specify the range, select **your** Threshold filter in the Pile Browser tree and expand the `Properties(Threshold)` section in the properties menu. Select the scalar to be evaluated and fix the max an min values. Finally click apply
- `Cell to data point`: This filter allows to extrapolate element data to the nodes. It averages the values of the data of the elements surrounding a node to compute nodal information.
- `Temporal interpolator`: Interpolate the solution between to frames. Useful to obtain nice and smooth animations for presentations.
- `Plot data`: Plot data arrays from the input. This filter prepare arbitrary data to be plotted in any of the plots. By default the data is shown in a XY line plot. Use this filter to plot you csv files.

<div style="text-align:center;">
    <figure>
        <img src="../../assets/img/filter_vtk.gif">
        <figcaption>Applying filters</figcaption>
    </figure>
</div>

## Ressources

For more information you can read the different online tutorials:

- [Official Paraview tutorial ](https://www.paraview.org/Wiki/The_ParaView_Tutorial)
- [Cyprien Rusu tutorials](https://youtube.com/playlist?list=PLvkU6i2iQ2fpcVsqaKXJT5Wjb9_ttRLK-)
