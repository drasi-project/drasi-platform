.PHONY: install-dependencies test package

install-dependencies:
	dotnet restore
	npm install --prefix ../../../typespec

test:
	dotnet test

package:
	dotnet pack Drasi.Source.SDK/Drasi.Source.SDK.csproj -c Release