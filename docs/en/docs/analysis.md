<style>
  .md-sidebar--secondary .md-nav__list .md-nav__list .md-nav__item .md-nav {
    display: none !important;
  }

  .md-typeset td:first-child, .md-typeset th:first-child {
    white-space: nowrap;
  }
</style>

# Running the Analysis

Once the model is defined in the input file, the next step is to execute **COMFOR** to perform the analysis. This section describes how to start a simulation, interpret the information displayed during execution, and understand the generated files.

---

## Starting a New Analysis

### Basic Command

COMFOR is executed from the terminal (command line). The input file is given with the `-j` (or `--job`) option, which is **required**:

```bash
comfor -j <input_file> [OPTIONS]
```

- `<input_file>`: Relative (to the current directory) or absolute path to the input file

**Examples:**

```bash
# File in the current directory
comfor -j simulation.toml

# Same, using the long option
comfor --job=simulation.toml

# Relative path
comfor -j ./simulations/forming.toml

# Absolute path
comfor -j /home/user/simulations/forming.toml
```

!!! tip "File Extensions"
    The input format is selected from the file extension:

    | Extension | Format |
    | :--- | :--- |
    | `.toml`, `.giml` | TOML (recommended) |
    | `.txt`, `.in` | Fembic (legacy) |

---

### Command Line Options

The options below are the ones printed by `comfor --help`.

#### Job Options

| Option | Description |
| :--- | :--- |
| `-j, --job INPUT_FILE_NAME` | Input file name (**required**). |
| `-o, --output PATH` | Result root directory. Replaces the default `Results_<input_name>/` directory. Relative paths are resolved from the current directory. |
| `--validate` | Parse and validate the input file without running the simulation. |
| `-u, --cpus 1` | Number of CPUs. The current build is serial: only `1` is accepted (default). Contact [Innovamics](mailto:eduardo.guzman@innovamics.com) for more capacity. |

#### Application Options

| Option | Description |
| :--- | :--- |
| `-i, --info` | Show general information about COMFOR |
| `-c, --credits` | Show software credits, contributors and third-party libraries |
| `-l, --license` | Show software license |
| `-v, --version` | Display COMFOR version and exit |
| `-h, --help` | Display the help message and exit |

**Usage examples:**

```bash
# Only validate the input file
comfor -j simulation.toml --validate

# Run the simulation
comfor -j simulation.toml

# Write the results below a custom directory
comfor -j simulation.toml -o ./results/run-01

# Validate, then run only if the validation succeeded
comfor -j simulation.toml --validate && comfor -j simulation.toml

# Show version
comfor --version
```

### Validation

When the `--validate` option is used, COMFOR:

1. Parses the input file (TOML syntax errors are reported with their line number)
2. Validates every block: mandatory parameters, parameter types, allowed values and ranges
3. Checks that names are present and unique within each block type
4. Writes the report to the terminal and to the job log, then exits without running the simulation

Checks that require the model to be built (for instance that the sections assigned to a set are compatible with its element types, or that referenced sets exist) are performed when the simulation starts.

!!! tip
    The same validation is always performed at the beginning of a normal run: `--validate` is simply a fast way to check a file without creating any result.

---

## Runtime Information

COMFOR first prints a summary of the model, then a block of information each time an output frame is written.

### Model Summary

```
 Model info
  > Number of objects instances
   - Nodes: 1892
   - Loads: 0
   - Elements: 3492
   - Controls: 1
   - Trackers: 0
   - Materials: 1
   - Sections: 2
   - Amplitudes: 1
   - Constraints: 4
   - Sets: 7
   - Surfaces: 0
  > Automatic step time: true
   - Step time: 0.000446
  Output
  > Type: VTU
  > Format: BINARY
  > Frequency: 0.100000
```

### Output Frames

```
 =======================================
  > Writing output file 12
   - Elapsed time: 4.782843
   - Current time: 1.200059
   - Time step: 0.000442
   - Internal energy: 0.319601
   - Kinetic energy: 0.251585
   - Ek/Ei (%): 78.718403
 =======================================
```

| Field | Description |
| :--- | :--- |
| `Writing output file` | Index of the frame being written |
| `Elapsed time` | Wall-clock time since the beginning of the solve (seconds) |
| `Current time` | Current simulation time |
| `Time step` | Current time increment |
| `Internal energy` | Internal (strain) energy of the model |
| `Kinetic energy` | Kinetic energy of the model |
| `Ek/Ei (%)` | Ratio of kinetic to internal energy |

!!! tip "Quasi-static simulations"
    For forming processes, which are quasi-static, the kinetic energy should remain small compared to the internal energy once the deformation has started. A large `Ek/Ei` ratio indicates significant dynamic effects (tool speed too high, not enough damping, etc.). The ratio is meaningless at the very beginning of the simulation, when the internal energy is still close to zero.

At the end of the run, COMFOR prints the total solving time:

```
 Solving took : 31.524193
 Exit Comfor
```

---

## Generated Files

### Directory Structure

For an input file `simulation.toml`:

```
simulation.toml
simulation.md                  # Job log
Results_simulation/            # Result root (or the path given with -o)
├── manifest.toml              # Run status and list of generated files
├── <output_name>/             # One folder per [[output]] block
│   ├── <output_name>_000000.vtu
│   ├── <output_name>_000001.vtu
│   └── ...
└── <tracker_name>.csv         # One file per [tracker] block
```

- Each `[[output]]` block writes its frames in a folder named after the output `name`. Frames are numbered with 6 digits.
- Each `[tracker]` block writes one CSV file named after the tracker `name`.
- `manifest.toml` records the run status (`running`, `completed` or `failed`) and the list of files written.

!!! warning "Existing results"
    The result root must not exist before the run. If it does, COMFOR stops with a `Directory already exists` error to avoid overwriting previous results. Delete the directory or choose another one with `-o`.

### Job Log

The job log is a Markdown file written next to the input file, with the same name (`simulation.md` for `simulation.toml`). It contains the same information as the terminal (file info, validation report, model summary, frames) and, when the validation fails, the full list of errors under **Validation Errors**.

See [Post-processing](postprocessing.md) for the content of the result files.

---

## Error Management

### Error Types

1. **Command line errors**: Missing `-j` or unknown option (COMFOR prints the error and the hint `Run with --help for more information.`), or input file not found.
2. **Parsing errors**: Invalid TOML syntax, or block without a required `name`. The message gives the line number.
3. **Validation errors**: Missing or invalid parameters. All errors are listed in the job log.
4. **Setup errors**: Problems found while building the model (missing reference, incompatible section, existing result directory...).

### Error Message Format

```
 --> Exception caught
Validation failed
  --> TOMLParser: block 'output' at line 14 requires a non-empty 'name'.
```

```
 --> Exception caught
Setup failed
  --> Directory already exists: /home/user/simulations/Results_simulation
```

In both cases COMFOR exits with a non-zero status code, which can be used in scripts.

---

## Best Practices

1. **Validate before execution**: `comfor -j file.toml --validate`
2. **Start small**: Test with a reduced model or a short `run_to`
3. **Monitor energies**: Keep `Ek/Ei` small for quasi-static processes
4. **Check units**: Ensure unit consistency (see [Units](preprocessing.md#units))

---

## Complete Example

```bash
# Validate
comfor -j forming.toml --validate

# Run, writing the results below ./results/forming
comfor -j forming.toml -o ./results/forming

# Check results
ls ./results/forming
cat ./results/forming/manifest.toml
```
