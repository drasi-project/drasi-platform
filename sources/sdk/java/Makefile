.PHONY: generate-types install-dependencies test package

install-dependencies:
	mvn dependency:resolve

test:
	mvn test

package:
	mvn package

deploy:
	mvn deploy