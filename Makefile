PYTHON=python3
PIP=$(PYTHON) -m pip
MKDOCS=mkdocs
BUILD_DIR=site
REQUIREMENTS=requirements.txt

default: serve

.PHONY: default serve build clean deploy doctor

install:
	$(PIP) install -r $(REQUIREMENTS)

serve:
	$(MKDOCS) serve --livereload

build: install
	$(MKDOCS) build

clean:
	rm -rf $(BUILD_DIR)

deploy:
	$(MKDOCS) gh-deploy

doctor:
	$(MKDOCS) doctor
