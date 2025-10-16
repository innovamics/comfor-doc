from setuptools import setup, find_packages

setup(
    name='mkdocs-ignore-bibtex-plugin',
    version='0.1',
    description='MkDocs plugin to ignore @ outside [@]',
    author='thibaud.bltn',
    packages=find_packages(),
    entry_points={
        'mkdocs.plugins': [
            'ignore_bibtex = ignore_bibtex.plugin:IgnoreBibtexPlugin',
        ]
    },
    python_requires='>=3.7',
)
