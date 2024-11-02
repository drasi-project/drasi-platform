json2ts -i ./reaction/_generated/@typespec/json-schema -o types/ --cwd ./reaction/_generated/@typespec/json-schema --
declareExternallyReferenced false


dotnet tool install -g NJsonSchema.CodeGeneration.CSharp

quicktype --src-lang schema -l typescript -o output.ts ./query-output/_generated/@typespec/json-schema/*.yaml    

quicktype --src-lang schema -l cs -o output.cs ./query-output/_generated/@typespec/json-schema/*.yaml --framework SystemTextJson --namespace Drasi.Reaction.SDK.Models
