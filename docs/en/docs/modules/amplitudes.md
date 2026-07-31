<style>
  .md-sidebar--secondary .md-nav__list .md-nav__list .md-nav__item .md-nav {
    display: none !important;
  }
</style>

<div class="grid cards" style="grid-template-columns: repeat(auto-fit, minmax(200px, 300px))" markdown>

- :material-chart-bell-curve-cumulative:{ .lg .middle }
  [<span style="color: #76B900; font-weight: bold;">Tabular</span>](#tabular)

</div>

This section provides a **practical overview** of the time-dependent amplitude models available in **COMFOR**. Amplitudes are used to scale boundary conditions, loads, or other time-sensitive parameters over simulation time.

# Available Amplitude Models

## Common Parameters for All Amplitudes

Every amplitude block requires these base parameters:

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Yes** | - | Amplitude formulation keyword (e.g., `TABULAR`). |

---

## Tabular

The `TABULAR` amplitude type defines a temporal curve $y = f(t)$ through a set of discrete time/value pairs. **COMFOR** performs linear interpolation between the defined points.

### Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| **`values`** | Array | **Yes** | List of discrete `[time, value]` pairs. Must contain at least 2 pairs. |

!!! info "Operational Logic"
    * **Linear Interpolation**: Evaluated linearly between consecutive points $(t_1, v_1)$ and $(t_2, v_2)$.
    * **Out-of-Bounds**: If the current simulation time $t$ is outside the defined range $[t_{\text{min}}, t_{\text{max}}]$, the amplitude returns **`0.0`**.
    * **Automatic Sorting**: COMFOR automatically sorts time points in ascending order during initialization.

### Examples

=== "TOML :simple-toml:"
    ```toml
    # A ramp load increasing from 0.0 to 10.0 over 1 second, held constant until 2.0s
    [amplitude.RampUp]
    type = "TABULAR"
    values = [
        [0.0, 0.0],
        [1.0, 10.0],
        [2.0, 10.0]
    ]
    ```

=== "Fembic :material-text:"
    ```xml
    AMPLITUDES TYPE TABULAR
    RampUp VALUES = [0.0, 0.0, 1.0, 10.0, 2.0, 10.0]
    ```

---

# Choose an Amplitude Model

- Use **`TABULAR`** for experimental loading curves, punch velocity profiles, or step-wise boundary condition scaling.