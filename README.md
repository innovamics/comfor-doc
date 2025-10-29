# Comfor Documentation

[![GitHub CI Status](https://github.com/innovamics/comfor-doc/actions/workflows/ci.yml/badge.svg)](https://github.com/innovamics/comfor-doc/actions)
[![GitLab CI Status](https://gitlab.com/comfor/comfor-doc/badges/main/pipeline.svg)](https://gitlab.com/comfor/comfor-doc/-/pipelines)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC_BY--SA_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by-sa/4.0/)
[![Built with Material for MkDocs](https://img.shields.io/badge/Material_for_MkDocs-526CFE?style=flat-square&logo=MaterialForMkDocs&logoColor=white)](https://squidfunk.github.io/mkdocs-material/)

Comfor (**COMfor FORming**) is a **high-performance open-source software** for **composite material simulation**. It is designed to provide researchers, engineers, and students with a robust tool for simulating composite materials efficiently.

This documentation covers **installation**, **usage**, and **advanced features** to help you get the most out of Comfor.

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
  - [Install Dependencies](#install-dependencies)
  - [Build Documentation](#build-documentation)
  - [Serve Locally](#serve-locally)
- [Resources](#resources)
- [License](#license)

## Introduction

Comfor provides a reliable and high-performance environment for composite material simulations.

Key features:

- Fast and robust simulation engine
- Open-source and customizable
- Documentation with examples for beginners and experts

## Getting Started

### Install Dependencies

Create a Python virtual environment and install required packages:

```bash
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r requirements.txt
```

Or use the Makefile:

```bash
make install
```

### Build Documentation

To generate the static documentation site, use the following commands:

```bash
make build
```

For language-specific builds:
```bash
make build-en   # Build English documentation
make build-fr   # Build French documentation
```
> **Note:** The generated site will be available in the `public/` directory.


### Serve Locally

To preview the documentation, run:

```bash
make serve
```

For language-specific previews with live reloading:
```bash
make serve-en   # Serve English documentation
make serve-fr   # Serve French documentation
```

Visit [http://127.0.0.1:8000/comfor-doc/en/](http://127.0.0.1:8000/comfor-doc/en/) to see the site locally.
> **Note:** The URL path (`/en` or `/fr`) depends on the language you are serving.

## Resources

* [Material for MkDocs theme](https://squidfunk.github.io/mkdocs-material/)
* [MkDocs official documentation](https://www.mkdocs.org/getting-started/)
* [Comfor repository](https://gitlab.com/comfor/comfor)

## License

<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
    <img alt="Creative Commons License"
    style="border-width:0"
    src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" />
</a>
<br/>
<span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">Comfor Documentation</span>
by <a xmlns:cc="http://creativecommons.org/ns#" href="https://egm_foss.gitlab.io/about_me/" property="cc:attributionName" rel="cc:attributionURL">Eduardo Guzman</a>
is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.
<br/>Based on a work at <a xmlns:dct="http://purl.org/dc/terms/" href="https://gitlab.com/comfor/comfor-doc" rel="dct:source">https://gitlab.com/comfor/comfor-doc</a>.
