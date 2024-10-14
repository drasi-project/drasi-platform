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
