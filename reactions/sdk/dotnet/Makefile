.PHONY: generate-types install-dependencies test package

install-dependencies:
	dotnet restore
	npm install --prefix ../../../typespec

generate-types:
	npm run clean --prefix ../../../typespec
	npm run build ./view-svc --prefix ../../../typespec
	npm run build ./query-output --prefix ../../../typespec
	quicktype --src-lang schema -l cs -o Drasi.Reaction.SDK/Models/QueryOutput/Models.generated.cs ../../../typespec/query-output/_generated/@typespec/json-schema/*.yaml --framework SystemTextJson --namespace Drasi.Reaction.SDK.Models.QueryOutput
	quicktype --src-lang schema -l cs -o Drasi.Reaction.SDK/Models/ViewService/Models.generated.cs ../../../typespec/view-svc/_generated/@typespec/json-schema/*.yaml --framework SystemTextJson --namespace Drasi.Reaction.SDK.Models.ViewService

test:
	dotnet test

package:
	dotnet pack Drasi.Reaction.SDK/Drasi.Reaction.SDK.csproj -c Release