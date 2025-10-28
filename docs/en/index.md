---
hide:
  - navigation
  - toc
---

**Comfor** is a modern, open-source simulation platform for composite forming
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

---

# Comfor Edition Comparison

<div class="comparatif-container" style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center;">

  <div class="edition-card" style="flex: 1; min-width: 250px; border: 1px solid #ccc; border-radius: 10px; padding: 1.5rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.05); transition: transform 0.2s;">
    <h2 style="margin-top: 0.5rem; color: #333;">Comfor Community</h2>
    <p style="font-weight: bold; color: #555;">Free & Open Source</p>
    <ul style="list-style: none; padding: 0; text-align: left;">
      <li>✔ Standard performance</li>
      <li>✔ Suitable for small teams</li>
      <li>✔ Community support</li>
      <li>✔ Basic configuration options</li>
      <li>✔ Standard toolkit</li>
    </ul>
    <div style="margin-top: 1rem; font-weight: bold; color: #333;">Best for students, individuals, small teams</div>
    <a class="md-button md-raised" href="overview/download/" style="margin-top: 1rem;">Download</a>
  </div>

  <div class="edition-card" style="flex: 1; min-width: 250px; border: 1px solid #ccc; border-radius: 10px; padding: 1.5rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.05); transition: transform 0.2s;">
    <h2 style="margin-top: 0.5rem; color: #333;">Comfor Enterprise</h2>
    <p style="font-weight: bold; color: #555;">Commercial Edition</p>
    <ul style="list-style: none; padding: 0; text-align: left;">
      <li>✔ High performance for large-scale use</li>
      <li>✔ Enterprise-level scalability</li>
      <li>✔ Dedicated priority support</li>
      <li>✔ Advanced configuration & deployment</li>
      <li>✔ Enhanced toolkit with extra modules</li>
    </ul>
    <div style="margin-top: 1rem; font-weight: bold; color: #333;">Best for large organizations & industrial teams</div>
    <a class="md-button md-raised" href="collaborate/industry/#comfor_enterprise" style="margin-top: 1rem;">Learn More</a>
  </div>

</div>

---

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

---

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
