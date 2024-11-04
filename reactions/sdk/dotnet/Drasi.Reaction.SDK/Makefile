.PHONY: generate-types

generate-types:
	quicktype --src-lang schema -l cs -o Models.g.cs ../../../../typespec/query-output/_generated/@typespec/json-schema/*.yaml --framework SystemTextJson --namespace Drasi.Reaction.SDK.Models