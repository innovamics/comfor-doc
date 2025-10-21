As seen before, the pre-processing operation consist in generating the input ASCII text file of the model. The next step is to run comfor using this input file. The analysis will be performed and Comfor is going to generate several output files : Paraview files, CSV files and log files.

# Starting a new analysis

Comfor is execute from the terminal(command line) using the following syntax:

```bash
comfor <input_file_name>
```

- `<input_file_name>`: is the relatif or full path name to the input file. If the file is placed in the same folder of the comfor binary, you should indicate only the file name.

_Examples_:

```console
$ comfor test.bim
$ comfor ./sim/test.bim
$ comfor ../test.bim
$ comfor /usr/name/sim/test.bim
```

# Run time information

During the analysis, Comfor will print periodically some useful information on the terminal. The frequency is the defined by the [`print_step`](preprocessing.md#control) defined in the control block.

The output information is given by block with the general structure:

```console
=================================
Elapsed time: 0.955748s
Current time: 8s
Time step: 0.001
Internal energy: 35.2456
Kinetic energy: 0.0110008
=================================
```

- `Elapsed time`: Is the user CPU time (real time) from the beginning of the simulation.
- `Current time`: Is current time of the simulation
- `Time step`: Is the current minimum time step of the whole model.
- `Internal energy`: Is the energy generate by the internal forces int the whole model.
- `Kinetic energy`: Is the kinetic energy in the whole model.

!!! tip
    To stop a job just press ++ctrl+c++

# Output

A new folder named `Results_<file_name>` is created in the same directory of the input file. This folder contains a série of \*.vtk files which can be viewed using paraview.

# Errors and bugs

If any error occurs, please [contact us]()
