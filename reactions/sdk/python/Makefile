.PHONY: install-dependencies generate-types test package

install-dependencies:
	poetry install --with dev
	npm install --prefix ../../../typespec

generate-types:
	$(MAKE) install-dependencies
	npm run clean --prefix ../../../typespec
	npm run build ./view-svc --prefix ../../../typespec
	npm run build ./query-output --prefix ../../../typespec
	poetry run datamodel-codegen --input-file-type jsonschema --input ../../../typespec/query-output/_generated/@typespec/json-schema --output-model-type pydantic_v2.BaseModel --use-annotated --output ./drasi_reaction/models
	poetry run datamodel-codegen --input-file-type jsonschema --input ../../../typespec/view-svc/_generated/@typespec/json-schema --output-model-type pydantic_v2.BaseModel --use-annotated --output ./drasi_reaction/models

test:
	poetry run pytest tests

package:
	@echo "No published python package yet"
