<style>
  .md-sidebar--secondary .md-nav__list .md-nav__list .md-nav__item .md-nav {
    display: none !important;
  }
</style>

<div class="grid cards" style="grid-template-columns: repeat(auto-fit, minmax(200px, 320px))" markdown>

- :material-arrow-down-bold:{ .lg .middle }
  [<span style="color: #76B900; font-weight: bold;">Normal Laws</span>](#normal_contact_laws)

- :material-arrow-expand-horizontal:{ .lg .middle }
  [<span style="color: #c73131ff; font-weight: bold;">Tangential Laws</span>](#tangential_contact_laws)

</div>

This section provides a **practical overview** of the physical laws governing surface interaction in **COMFOR**. Contact behaviours are defined independently and referenced by [Contact](../preprocessing.md#contact) blocks.

# Available Contact Behaviour Types

## Common Parameters for All Contact Behaviours

Every contact behaviour block requires this base parameter:

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`type`** | String | **Yes** | - | Contact law technology keyword (`LINEAR_PENALTY`, `PENALTY_ADHESION`, `COULOMB`). |

---

## Normal Contact Laws

Normal contact laws compute reaction forces perpendicular to the interface to prevent penetration or manage adhesion.

### LINEAR_PENALTY

A linear penalty spring model that applies a normal compressive force proportional to the penetration distance (*gap*).

| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| **`stiffness`** | Float | **Yes** | Penalty spring stiffness. Must be strictly positive. *(Alias: `factor`)* |

#### Examples

=== "TOML :simple-toml:"
    ```toml
    [contact_behaviour.HardNormal]
    type = "LINEAR_PENALTY"
    stiffness = 1.0e6
    ```

=== "Fembic :material-text:"
    ```xml
    CONTACT_BEHAVIOURS TYPE LINEAR_PENALTY
    HardNormal STIFFNESS = 1.0e6
    ```

---

### PENALTY_ADHESION

A normal law that handles both compression penalty forces during penetration and tensile adhesive forces during separation.

| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| **`stiffness`** | Float | **Yes** | Compression penalty stiffness. Must be strictly positive. *(Alias: `factor`)* |
| **`strength`** | Float | **Yes** | Adhesive force magnitude per unit area. Must be non-negative. *(Alias: `adhesive_strength`)* |
| `threshold` | Float | No | Distance tolerance for adhesion. Defaults to element thickness ($t$). *(Alias: `adhesion_threshold`)* |

#### Examples

=== "TOML :simple-toml:"
    ```toml
    [contact_behaviour.AdhesiveTool]
    type = "PENALTY_ADHESION"
    stiffness = 1.0e6
    strength = 50.0
    threshold = 0.5
    ```

=== "Fembic :material-text:"
    ```xml
    CONTACT_BEHAVIOURS TYPE PENALTY_ADHESION
    AdhesiveTool STIFFNESS = 1.0e6 STRENGTH = 50.0 THRESHOLD = 0.5
    ```

---

## Tangential Contact Laws

Tangential contact laws compute friction forces parallel to the contact plane.

### COULOMB

Standard Coulomb friction law. It applies a tangential force proportional to the normal contact force and the friction coefficient $\mu$.

| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| **`friction`** | Float | **Yes** | Friction coefficient $\mu$. Must be non-negative. *(Alias: `mu`)* |

!!! info "Regularization & Smooth Factor"
    To minimize numerical oscillations during abrupt changes in slip direction, the `COULOMB` implementation uses a continuous smoothing factor derived from the dot product of consecutive slip vectors.

#### Examples

=== "TOML :simple-toml:"
    ```toml
    [contact_behaviour.SteelFriction]
    type = "COULOMB"
    friction = 0.15
    ```

=== "Fembic :material-text:"
    ```xml
    CONTACT_BEHAVIOURS TYPE COULOMB
    SteelFriction FRICTION = 0.15
    ```

---

# Choose a Contact Behaviour

- Use **`LINEAR_PENALTY`** (Normal) + **`COULOMB`** (Tangential) for standard tool-part or self-contact interfaces.
- Use **`PENALTY_ADHESION`** (Normal) for sticky tools, tack analysis, or resin-rich composite forming.