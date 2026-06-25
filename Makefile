PYTHON=python3
PIP=$(PYTHON) -m pip
MKDOCS=mkdocs
BUILD_DIR=public
REQUIREMENTS=requirements.txt

EN_CONFIG=config/en/mkdocs.yml
FR_CONFIG=config/fr/mkdocs.yml

default: serve-en

.PHONY: default serve build clean deploy doctor build-en build-fr

install:
	$(PIP) install -r $(REQUIREMENTS)

build: install build-en build-fr

build-en:
	$(MKDOCS) build -f $(EN_CONFIG)

build-fr:
	$(MKDOCS) build -f $(FR_CONFIG)

serve: build-en build-fr
	cd $(BUILD_DIR) && $(PYTHON) -m http.server 8000

serve-en:
	$(MKDOCS) serve -f $(EN_CONFIG) --livereload

serve-fr:
	$(MKDOCS) serve -f $(FR_CONFIG) --livereload

clean:
	rm -rf $(BUILD_DIR) $(BUILD_DIR)/*

deploy:
	$(MKDOCS) gh-deploy -f $(EN_CONFIG)

doctor:
	$(MKDOCS) doctor
