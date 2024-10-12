namespace="$1"

if [ -z "$namespace" ]; then
    namespace="drasi-system"
fi


drasi namespace set $namespace
kubectl delete -f https://raw.githubusercontent.com/ruokun-niu/drasi-platform/smoke-test/dev-tools/smoke-tests/resources/smoke-test-postgres.yaml -n default

drasi delete -f https://raw.githubusercontent.com/ruokun-niu/drasi-platform/smoke-test/dev-tools/smoke-tests/resources/smoke-test-source.yaml
drasi delete -f https://raw.githubusercontent.com/ruokun-niu/drasi-platform/smoke-test/dev-tools/smoke-tests/resources/smoke-test-query.yaml
drasi delete -f https://raw.githubusercontent.com/ruokun-niu/drasi-platform/smoke-test/dev-tools/smoke-tests/resources/smoke-test-reaction.yaml