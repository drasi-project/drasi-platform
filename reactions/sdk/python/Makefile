.PHONY: install-dependencies generate-types test package

install-dependencies:
	uv sync --group dev
	npm install --prefix ../../../typespec

generate-types:
	$(MAKE) install-dependencies
	npm run clean --prefix ../../../typespec
	npm run build ./view-svc --prefix ../../../typespec
	npm run build ./query-output --prefix ../../../typespec
	npm run build ./output-unpacked --prefix ../../../typespec
	uv run datamodel-codegen \
		--input-file-type jsonschema \
		--input ../../../typespec/query-output/_generated/@typespec/json-schema \
		--formatters black isort \
		--use-annotated \
		--output-model-type pydantic_v2.BaseModel \
		--output ./drasi/reaction/models
	uv run datamodel-codegen \
		--input-file-type jsonschema \
		--input ../../../typespec/view-svc/_generated/@typespec/json-schema \
		--formatters black isort \
		--use-annotated \
		--output-model-type pydantic_v2.BaseModel \
		--output ./drasi/reaction/models
	uv run datamodel-codegen \
		--input-file-type jsonschema \
		--input ../../../typespec/output-unpacked/_generated/@typespec/json-schema \
		--formatters black isort \
		--use-annotated \
		--output-model-type pydantic_v2.BaseModel \
		--output ./drasi/reaction/models

test:
	uv run pytest tests

package:
	@echo "No published python package yet"
