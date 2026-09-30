---
title: Coordinate Systems
---

## Introduction

COMFOR implements a comprehensive **coordinate systems management** framework that enables working with local and global reference frames. This functionality is particularly useful for:

- Defining material orientations (fiber directions in composites)
- Transforming vectors and tensors between reference frames
- Contact algorithms that require geometric transformations

---

## Coordinate System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 CoordinateSystem (Interface)                     │
├─────────────────────────────────────────────────────────────┤
│  + vectorToGlobal(const Vec3d&) -> Vec3d                        │
│  + vectorToLocal(const Vec3d&) -> Vec3d                         │
│  + tensorToGlobal(const Mat3d&) -> Mat3d                       │
│  + tensorToLocal(const Mat3d&) -> Mat3d                        │
│  + pointToGlobal(const Vec3d&) -> Vec3d                        │
│  + pointToLocal(const Vec3d&) -> Vec3d                         │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │
              ┌───────────────────────────────┴───────────────────────────────┐
              │                                                               │
              ▼                                                               ▼
   ┌─────────────────────────────────────────────────────────────┐
   │                    CartesianSystem                           │
   │                                                                  │
   │  Concrete implementation for orthonormal cartesian           │
   │  reference frames (rigid frames)                              │
   │                                                                  │
   │  - Internal storage: Eigen::Isometry3d                       │
   │  - Transformations: rotation + translation                    │
   │  - Factory methods for easy creation                         │
   └─────────────────────────────────────────────────────────────┘
```

---

## CoordinateSystem: Base Interface

The abstract `CoordinateSystem` class defines the interface for all coordinate transformations.

### Pure Virtual Methods

| Method | Description |
| :--- | :--- |
| `vectorToGlobal(v_local)` | Rotate a vector from local frame to global frame (push-forward) |
| `vectorToLocal(v_global)` | Rotate a vector from global frame to local frame (pull-back) |
| `tensorToGlobal(T_local)` | Rotate a 2nd order tensor from local to global |
| `tensorToLocal(T_global)` | Rotate a 2nd order tensor from global to local |
| `pointToGlobal(p_local)` | Transform a point from local to global (rotation + translation) |
| `pointToLocal(p_global)` | Transform a point from global to local (rotation + translation) |

!!! note "Vector vs Point Transformations"
    - **Vectors**: Rotation only (no translation)
    - **Tensors**: Rotation only (no translation)
    - **Points**: Rotation + translation (complete mapping)

---

## CartesianSystem: Orthonormal Cartesian Frame

The `CartesianSystem` class implements an orthonormal cartesian reference frame defined by:

- **Origin**: Reference point in global space
- **Basis**: Three orthogonal unit vectors (e₁, e₂, e₃) defining local axes

### Internal Storage

```cpp
Eigen::Isometry3d transform_ = Eigen::Isometry3d::Identity();
```

The transformation is stored as a 3D isometry (rotation + translation) from the Eigen library.

---

## Creating a Coordinate System

`CartesianSystem` provides several factory methods for creating reference frames:

### 1. Identity Frame

Creates a frame at the origin with the canonical basis (e₁ = [1,0,0], e₂ = [0,1,0], e₃ = [0,0,1]).

```cpp
CartesianSystem system = CartesianSystem::Identity();
```

### 2. From Orthonormal Basis

Creates a frame with an origin and an orthonormal basis matrix.

```cpp
Vec3d origin(1.0, 2.0, 3.0);
Mat3d basis;
basis << 1.0, 0.0, 0.0,
           0.0, 1.0, 0.0,
           0.0, 0.0, 1.0;

CartesianSystem system = CartesianSystem::FromBasis(origin, basis);
```

!!! warning "Basis Validation"
    The matrix must be a valid orthonormal rotation matrix. The `validateBasis()` method checks that:
    - Columns are unit vectors (norm ≈ 1)
    - Columns are orthogonal to each other
    - Determinant is +1 (no reflection)

### 3. From X Axis

Creates a frame with origin and X axis direction. Y and Z axes are automatically determined using the Frisvad method to form an orthonormal basis.

```cpp
Vec3d origin(0.0, 0.0, 0.0);
Vec3d x_direction(1.0, 1.0, 0.0); // X axis direction

CartesianSystem system = CartesianSystem::FromXAxis(origin, x_direction);
```

#### Frisvad Algorithm

The Frisvad algorithm [Frisvad, 2012] is used to build a stable orthonormal basis from a single direction vector. It is particularly robust for directions near the Z axis.

!!! info "Singularity Threshold"
    When the Z component of the vector is less than `FrisvadZLimit ≈ -0.9999999` (≈ cos(179.995°)), a stable branch is used to avoid numerical instability.

### 4. From Plane

Creates a frame with origin, a point defining the X axis, and a point defining the XY plane.

```cpp
Vec3d origin(0.0, 0.0, 0.0);
Vec3d point_on_x(1.0, 0.0, 0.0); // Defines X axis direction
Vec3d point_in_xy(1.0, 1.0, 0.0); // Defines XY plane

CartesianSystem system = CartesianSystem::FromPlane(origin, point_on_x, point_in_xy);
```

---

## Transformation Between Arbitrary Systems

In addition to transformations to/from the global frame, `CartesianSystem` provides methods for direct transformation between any two arbitrary frames:

### Direct Transformation Methods

| Method | Description | Formula |
| :--- | :--- | :--- |
| `vectorTo(v_this, target)` | Transform vector from `this` to `target` | $v_{target} = R_{target\leftarrow this} v_{this}$ |
| `tensorTo(T_this, target)` | Transform tensor from `this` to `target` | $T_{target} = R_{target\leftarrow this} T_{this} R_{this\leftarrow target}$ |
| `pointTo(p_this, target)` | Transform point from `this` to `target` | $p_{target} = R_{target\leftarrow this} (p_{this} - o_{this}) + o_{target}$ |

### Usage Example

```cpp
// Create two coordinate systems
CartesianSystem systemA = CartesianSystem::FromXAxis(Vec3d(0,0,0), Vec3d(1,0,0));
CartesianSystem systemB = CartesianSystem::FromXAxis(Vec3d(1,0,0), Vec3d(0,1,0));

// Vector in systemA
Vec3d v_A(1.0, 0.0, 0.0);

// Transform to systemB
Vec3d v_B = systemA.vectorTo(v_A, systemB);
```

---

## Accessors

`CartesianSystem` provides several accessors to inspect the frame:

| Method | Returns | Description |
| :--- | :--- | :--- |
| `basis()` | `Mat3d` | Returns the basis matrix (local → global) |
| `origin()` | `Vec3d` | Returns the origin in global coordinates |
| `ex()` | `Vec3d` | Returns X axis in global coordinates |
| `ey()` | `Vec3d` | Returns Y axis in global coordinates |
| `ez()` | `Vec3d` | Returns Z axis in global coordinates |

---

## Numerical Tolerances

The `CartesianSystemTolerances` structure defines numerical tolerances used for validation:

| Constant | Value | Description |
| :--- | :--- | :--- |
| `Norm` | `1e-12` | Minimum norm for non-zero vectors |
| `Norm2` | `1e-24` | Minimum squared norm (avoids sqrt) |
| `Matrix` | `1e-10` | Tolerance for rotation matrix validation |
| `FrisvadZLimit` | `-0.9999999` | Singularity threshold for Frisvad algorithm |

---

## Applications in COMFOR

### 1. Composite Material Orientation

Materials of type `HYPERTEXTILE` use `CartesianSystem` to define fiber directions:

```cpp
// In HyperTextile::initialize()
CartesianSystem localFrame = CartesianSystem::FromXAxis(
    Vec3d::Zero(),
    warp_orientation_
);
```

### 2. Shell Elements

Elements `DKT18`, `S3L_C0`, `Membrane3`, `Rod2` use `CartesianSystem` to manage their local frames:

```cpp
// Each element has its own local coordinate system
CartesianSystem elementFrame = ...;

// Transform stresses from local to global
Mat3d stressGlobal = elementFrame.tensorToGlobal(stressLocal);
```

### 3. Contact Algorithms

Contact elements `ContactTriangle` and `ContactLine` use coordinate transformations for:

- Calculating contact normals
- Detecting penetrations
- Calculating contact forces in the correct frame

---

## Complete Example: Stress Transformation

```cpp
#include <CoordinateSystems/CartesianSystem.h>

using namespace comfor;

int main() {
    // Create a local coordinate system rotated by 45°
    Vec3d origin(0.0, 0.0, 0.0);
    Mat3d basis;
    double angle = M_PI / 4.0; // 45 degrees
    basis << cos(angle), -sin(angle), 0.0,
              sin(angle),  cos(angle), 0.0,
              0.0,         0.0,        1.0;
    
    CartesianSystem localSystem = CartesianSystem::FromBasis(origin, basis);
    
    // Stress tensor in local frame (e.g., orthotropic material)
    Mat3d stressLocal = Mat3d::Zero();
    stressLocal(0,0) = 100.0; // Normal stress in fiber direction
    stressLocal(1,1) = 50.0;  // Normal stress perpendicular
    stressLocal(0,1) = 25.0;  // Shear stress
    
    // Transform to global frame
    Mat3d stressGlobal = localSystem.tensorToGlobal(stressLocal);
    
    // Now stressGlobal can be used in global calculations
    std::cout << "Stress in global frame:\n" << stressGlobal << std::endl;
    
    return 0;
}
```

---

## Best Practices

1. **Use factory methods**: Prefer `FromXAxis()`, `FromPlane()`, `FromBasis()` over direct constructor
2. **Validate bases**: Always verify that the basis matrix is a valid orthonormal matrix
3. **Avoid unnecessary transformations**: Transformations have a computational cost
4. **Use direct transformations**: When possible, use `vectorTo()` and `tensorTo()` rather than intermediate transformations

---

## References

- Frisvad, J. R. (2012). "Building an orthonormal basis, revisited". Journal of Graphics Tools, 16(4), 51-59.
- Eigen Library Documentation: https://eigen.tuxfamily.org/

\bibliography
