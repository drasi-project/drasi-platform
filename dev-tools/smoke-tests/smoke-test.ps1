Write-Host "Setting up Smoke Test..."

$namespace = $args[0]

# Default namespace
if (-not $namespace) {
    $namespace = "drasi-system"
}

Write-Host "Setting up Postgres..."

# Deploy Postgres   TODO: Update the URL
kubectl apply -f https://raw.githubusercontent.com/ruokun-niu/drasi-platform/smoke-test/dev-tools/smoke-tests/resources/smoke-test-postgres.yaml -n default
kubectl wait --for=condition=ready --timeout=60s pod -l app=postgres -n default

Write-Host "Postgres database is created in the 'default' namespace"

Write-Host "Applying Drasi components..."

# Set the namespace
drasi namespace set $namespace

# Apply source
Write-Host "Applying a Source with the name 'smoke-test'"
drasi apply -f https://raw.githubusercontent.com/ruokun-niu/drasi-platform/smoke-test/dev-tools/smoke-tests/resources/smoke-test-source.yaml
drasi wait source smoke-test -t 120

# Apply continuous query
Write-Host "Applying a ContinuousQuery with the name 'smoke-query'"
drasi apply -f https://raw.githubusercontent.com/ruokun-niu/drasi-platform/smoke-test/dev-tools/smoke-tests/resources/smoke-test-query.yaml
Start-Sleep -Seconds 5

# Apply Reaction
Write-Host "Applying a Reaction with the name 'smoke-result-reaction'"
drasi apply -f https://raw.githubusercontent.com/ruokun-niu/drasi-platform/smoke-test/dev-tools/smoke-tests/resources/smoke-test-reaction.yaml

drasi wait reaction smoke-result-reaction -t 120

# Run the kubectl command and capture the output
$initial_output = & kubectl run curl-pod --image=curlimages/curl -n $namespace --restart=Never --rm --attach -q -- sh -c 'curl -s http://smoke-result-reaction-gateway:8080/smoke-query/all' 2>$null

# Extract the portion of the output that matches the pattern [.*]
if ($initial_output -match '\[.*\]') {
    $initial_parsed_output = $Matches[0]
} else {
    $initial_parsed_output = $null
}
$initial_parsed_output = $Matches[0]

# Print the parsed output
Write-Host "Initial output: $initial_parsed_output"

# Retrieve the name of the postgres pod
$postgres_pod = kubectl get pods -l app=postgres -o jsonpath="{.items[0].metadata.name}" -n default

# Log the first insertion
Write-Host "Inserting the following entries into the database: {'Id': 4, 'Name': 'Item 4', 'Category': 'B'}"
Write-Host "postgres pod: $postgres_pod"

# Execute the first SQL insert command inside the postgres pod
kubectl exec $postgres_pod -n default -- psql -U postgres -d smokedb -c "INSERT INTO public.`"Item`" VALUES (6, 'Item 4', 'B')"

Start-Sleep -Seconds 5

Write-Host "Inserting the following entries into the database: {'Id': 5, 'Name': 'Item 5', 'Category': 'A'}"

kubectl exec $postgres_pod -n default -- psql -U postgres -d smokedb -c "INSERT INTO public.`"Item`" VALUES (5, 'Item 5', 'A')"


Write-Host "Retrieving the current result from the debug reaction"


Start-Sleep -Seconds 20

$final_output = & kubectl run curl-pod --image=curlimages/curl -n $namespace --restart=Never --rm --attach -q -- sh -c 'curl -s http://smoke-result-reaction-gateway:8080/smoke-query/all' 2>$null

# Extract the portion of the output that matches the pattern [.*]
if ($final_output -match '\[.*\]') {
    $final_parsed_output = $Matches[0]
} else {
    $final_parsed_output = $null
}
$final_parsed_output = $Matches[0]


Write-Host "Final output: $final_parsed_output"

$expected_output = '[{"Category":"A","Id":1,"Name":"Item 1"},{"Category":"A","Id":3,"Name":"Item 3"},{"Category":"A","Id":5,"Name":"Item 5"}]'

Write-Host "Expected output after the insertion: $expected_output"

if ($final_parsed_output -eq $expected_output) {
    Write-Host "Smoke test passed!"

    # Cleaning up resources
    Write-Host "Cleaning up resources..."
    kubectl delete -f https://raw.githubusercontent.com/ruokun-niu/drasi-platform/smoke-test-test/dev-tools/smoke-tests/resources/smoke-test-postgres.yaml -n default

    drasi delete -f https://raw.githubusercontent.com/ruokun-niu/drasi-platform/smoke-test-test/dev-tools/smoke-tests/resources/smoke-test-source.yaml
    drasi delete -f https://raw.githubusercontent.com/ruokun-niu/drasi-platform/smoke-test-test/dev-tools/smoke-tests/resources/smoke-test-query.yaml
    drasi delete -f https://raw.githubusercontent.com/ruokun-niu/drasi-platform/smoke-test-test/dev-tools/smoke-tests/resources/smoke-test-reaction.yaml
} else {
    Write-Host "Smoke test failed"

    Write-Host "Resources are not deleted. If you wish to clean up everything, run the following commands:"

    Write-Host "kubectl delete -f https://raw.githubusercontent.com/ruokun-niu/drasi-platform/smoke-test-test/dev-tools/smoke-tests/resources/smoke-test-postgres.yaml -n default"
    Write-Host "drasi delete -f https://raw.githubusercontent.com/ruokun-niu/drasi-platform/smoke-test-test/dev-tools/smoke-tests/resources/smoke-test-source.yaml"
    Write-Host "drasi delete -f https://raw.githubusercontent.com/ruokun-niu/drasi-platform/smoke-test-test/dev-tools/smoke-tests/resources/smoke-test-query.yaml"
    Write-Host "drasi delete -f https://raw.githubusercontent.com/ruokun-niu/drasi-platform/smoke-test-test/dev-tools/smoke-tests/resources/smoke-test-reaction.yaml"

    
    exit 1
}