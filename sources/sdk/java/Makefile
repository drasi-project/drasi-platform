.PHONY: generate-types install-dependencies test package

install-dependencies:
	mvn dependency:resolve
	npm install --prefix ../../../typespec

generate-types:
	npm run clean --prefix ../../../typespec
	npm run build ./source-output --prefix ../../../typespec
	quicktype --src-lang schema -l java -o src/main/java/io/drasi/source/sdk/models/. ../../../typespec/source-output/_generated/@typespec/json-schema/*.yaml --package io.drasi.source.sdk.models --array-type list --just-types

test:
	mvn test

package:
	mvn package