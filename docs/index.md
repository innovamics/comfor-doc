---
hide:
  - navigation
  - toc
---

<div class="hero">
  <div class="hero-content">
    <h1>Comfor</h1>
    <p>Open-source composite forming, built for precision and transparency</p>
    <a href="overview/download/" class="md-button md-button--primary">Download</a>
  </div>
</div>

<!-- **Comfor** is a modern, open-source simulation platform for composite forming
and processing. Built in **C++17/20**, it uses an explicit finite element method
(FEM) tailored to simulate complex manufacturing processes.

Engineered for **modularity**, **transparency**, and **performance**, Comfor
bridges the gap between industrial robustness and academic flexibility. Whether
you're modeling advanced forming processes or developing custom material
behaviors, Comfor provides a powerful, extensible framework.

---

# Why Comfor?

## 📚 Built on a Scientific Foundation

Comfor is backed by over a decade of academic and industrial R&D. Our numerical
models are published, peer-reviewed, and validated in collaboration with:

- ENIB [(Brest national school of engineering)](https://www.enib.fr/en_enib/){:target="_blank"}
- INSA Lyon [(Institut National des Sciences Appliquées de Lyon)](https://www.insa-lyon.fr/en){:target="_blank"}
- IRT Jules Verne [(French Institutes of Technology)](https://www.irt-jules-verne.fr/en/irt-jules-verne/){:target="_blank"}
- UHA [(Université de Haute Alsace)](https://www.uha.fr/en/index.html){:target="_blank"}

Explore our references and publications in the Scientific References section.

---

## 🔍 Transparent Physics, From the Ground Up

Forget the black-boxes. Fork the physics. At
[Innovamics](https://www.innovamics.com/){:target="_blank"}, we expose every layer of the
simulation stack—because understanding and trust matter. From material laws to
solvers, you can inspect, audit, and modify:

- Finite element formulations
- Contact and interaction models
- Boundary conditions and constraints
- Time integration schemes
- Plus every component involved in the simulation pipeline

This enables researchers and engineers to:

1. Audit and verify the mathematical models behind simulations
2. Extend or adapt specific aspects of the physics for custom use cases
3. Build trust in simulation results, with full control over assumptions and
   implementations

Our openness fosters a scientific environment where innovation, reproducibility,
and transparency come first.

> We believe open software leads to better science and better engineering.

--- -->

<div class="feature feature-right">
  <div class="feature-content">
    <h2>Open Source and Cross-Platform</h2>
    <p><strong>Comfor</strong> is a fully <em>open-source</em> software, available on Windows, Linux, and macOS. Whether you are a researcher, student, or engineer, you can download precompiled binaries or build it from source to adapt it to your needs. Its transparent and well-documented code allows you to understand every step of the simulation process and actively contribute to its development. Join a vibrant community sharing improvements, examples, and tips to get the most out of Comfor.</p>
    <p><a href="https://gitlab.com/innovamics/comfor" class="md-button">Explore the source code</a></p>
  </div>
  <div class="feature-image">
    <img src="assets/img/filter_vtk.gif" alt="Open Source">
  </div>
</div>

<div class="feature feature-left">
  <div class="feature-content">
    <h2>Advanced Composite Material Simulation</h2>
    <p>With its <strong>explicit non-linear solver</strong>, Comfor enables modeling of complex composite materials with scientific accuracy. From elastic membranes to anisotropic textile composites, it can simulate large deformations and transient dynamic behavior reliably. Every material, element, and contact law is based on recent research, providing a solid foundation for engineering and research projects. <em>You have full control over your simulation parameters</em> while leveraging a robust and high-performance tool.</p>
    <p><a href="docs/overview/" class="md-button">Discover the capabilities</a></p>
  </div>
  <div class="feature-image">
    <img src="assets/img/filter_vtk.gif" alt="Composite Materials">
  </div>
</div>

<div class="feature feature-right">
  <div class="feature-content">
    <h2>Interactive Results Visualization</h2>
    <p>Comfor integrates seamlessly with <strong>Paraview</strong> to turn your simulations into interactive visualizations. Play animations, apply filters to isolate areas of interest, interpolate solutions between steps, and plot data intuitively. This approach makes it easy to <em>understand and present forces, displacements, and stresses</em> in your model, making your results both accurate and visually compelling.</p>
    <p><a href="docs/postprocessing" class="md-button">See the visualization</a></p>
  </div>
  <div class="feature-image">
    <img src="assets/img/filter_vtk.gif" alt="Results Visualization">
  </div>
</div>

<div class="feature feature-left">
  <div class="feature-content">
    <h2>Designed for Research and Innovation</h2>
    <p>Comfor is designed to support both cutting-edge research and professional engineering workflows. With a <strong>Community Edition</strong> for open research and an <strong>Enterprise Edition</strong> for large-scale industrial applications, it offers flexibility, high performance, and reliability. Researchers and engineers can also benefit from professional services, training programs, and collaborative partnerships to extend Comfor’s capabilities and drive innovation in composite simulation.</p>
    <p><a href="collaborate/industry/" class="md-button">Discover editions & services</a></p>
  </div>
  <div class="feature-image">
    <img src="assets/img/filter_vtk.gif" alt="Research and Innovation">
  </div>
</div>

# Comfor Edition Comparison

<div class="comparatif-container" style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center;">

  <div class="edition-card" style="flex: 1; min-width: 250px; border: 1px solid #ccc; border-radius: 10px; padding: 1.5rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.05); transition: transform 0.2s;">
    <h2 style="margin-top: 0.5rem; font-size: 1.4rem; font-weight: 500; color: var(--md-default-fg-color);">Comfor Community</h2>
    <p style="font-weight: bold; color: var(--md-default-fg-color--light);">Free & Open Source</p>
    <ul style="list-style: none; padding: 0; text-align: left;">
      <li>✔ Standard performance</li>
      <li>✔ Suitable for small teams</li>
      <li>✔ Community support</li>
      <li>✔ Basic configuration options</li>
      <li>✔ Standard toolkit</li>
    </ul>
    <div style="margin-top: 1rem; font-weight: bold; color: var(--md-default-fg-color--light);">Best for students, individuals, small teams</div>
    <a class="md-button md-raised" href="overview/download/" style="margin-top: 1rem;">Download</a>
  </div>

  <div class="edition-card" style="flex: 1; min-width: 250px; border: 1px solid #ccc; border-radius: 10px; padding: 1.5rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.05); transition: transform 0.2s;">
    <h2 style="margin-top: 0.5rem; font-size: 1.4rem; font-weight: 500; color: var(--md-default-fg-color);">Comfor Enterprise</h2>
    <p style="font-weight: bold; color: var(--md-default-fg-color--light);">Commercial Edition</p>
    <ul style="list-style: none; padding: 0; text-align: left;">
      <li>✔ High performance for large-scale use</li>
      <li>✔ Enterprise-level scalability</li>
      <li>✔ Dedicated priority support</li>
      <li>✔ Advanced configuration & deployment</li>
      <li>✔ Enhanced toolkit with extra modules</li>
    </ul>
    <div style="margin-top: 1rem; font-weight: bold; color: var(--md-default-fg-color--light);">Best for large organizations & industrial teams</div>
    <a class="md-button md-raised" href="collaborate/industry/#comfor_enterprise" style="margin-top: 1rem;">Learn More</a>
  </div>

</div>

<!-- ---

# 🚀 Ready to Start?

If you're new to Comfor, here are the best places to begin:

- [Quick Starter Guide](overview/quick_starter_guide.md) – Minimal steps to run
  your first simulation
- [User Guide](docs/overview.md) – Define models, materials, and
  postprocess results
- [Downloads](overview/download.md) – Get the latest binaries and example
  cases.

---

# 👨‍💻 For Developers

Want to contribute or implement your own models? The
[Developer Guide](developers/api.md) walks you through building,
testing, and extending Comfor.

---

## Let’s build the next generation of composite simulation tools

Start contributing today or reach out if you want to collaborate on research,
features, or integration.

[Visit the GitLab repository](https://gitlab.com/comfor){:target="_blank"}

--- -->

# License and Credits

<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img
alt="Creative Commons License" style="border-width:0"
src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a><br /><span
xmlns:dct="http://purl.org/dc/terms/" property="dct:title">Comfor
Documentation</span> by <a xmlns:cc="http://creativecommons.org/ns#"
href="https://egm_foss.gitlab.io/about_me/" property="cc:attributionName"
rel="cc:attributionURL">Eduardo Guzman</a> is licensed under a <a rel="license"
href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.<br />Based on a work at <a
xmlns:dct="http://purl.org/dc/terms/"
href="https://gitlab.com/comfor/comfor-doc"
rel="dct:source">https://gitlab.com/comfor/comfor-doc</a>.
