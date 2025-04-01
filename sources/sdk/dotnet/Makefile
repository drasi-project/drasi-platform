.PHONY: install-dependencies test package

install-dependencies:
	cd Drasi.Source.SDK && dotnet restore
	npm install --prefix ../../../typespec

test:
	cd Drasi.Source.SDK && dotnet test

package: test
	cd Drasi.Source.SDK && dotnet pack Drasi.Source.SDK/Drasi.Source.SDK.csproj -c Release