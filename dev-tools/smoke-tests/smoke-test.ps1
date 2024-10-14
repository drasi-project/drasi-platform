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

