generate-types:
	npm run clean --prefix ../../../../typespec
	npm run build ./output-unpacked --prefix ../../../../typespec
	quicktype --src-lang schema -l cs -o Models/Unpacked.generated.cs ../../../../typespec/output-unpacked/_generated/@typespec/json-schema/*.yaml --framework SystemTextJson --namespace Drasi.Reactions.Debug.Servers.Models.Unpacked