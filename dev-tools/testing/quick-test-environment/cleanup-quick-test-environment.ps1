$namespace = $args[0]

# Default namespace
if (-not $namespace) {
    $namespace = "drasi-system"
}



drasi namespace set $namespace
kubectl delete -f https://raw.githubusercontent.com/main/drasi-platform/main/dev-tools/testing/quick-test-environment/resources/quick-test-postgres.yaml -n default

drasi delete -f https://raw.githubusercontent.com/main/drasi-platform/main/dev-tools/testing/quick-test-environment/resources/quick-test-reaction.yaml
drasi delete -f https://raw.githubusercontent.com/main/drasi-platform/main/dev-tools/testing/quick-test-environment/resources/quick-test-query.yaml
drasi delete -f https://raw.githubusercontent.com/main/drasi-platform/main/dev-tools/testing/quick-test-environment/resources/quick-test-source.yaml

