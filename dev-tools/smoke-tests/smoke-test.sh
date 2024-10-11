echo Setting up Smoke Test...

namespace="$1"

# Default namespace
if [ -z "$namespace" ]; then
    namespace="drasi-system"
fi

echo Setting up Postgres...

# Deploy Postgres   TODO: Update the URL
kubectl apply -f https://raw.githubusercontent.com/ruokun-niu/drasi-platform/smoke-test/dev-tools/smoke-tests/resources/smoke-test-postgres.yaml
kubectl wait --for=condition=ready --timeout=60s pod -l app=postgres


echo Postgres database is created in the 'default' namespace

echo Applying Drasi components...

drasi namespace set $namespace   # Set the namespace

# Apply source
echo Applying a Source with the name 'smoke-test'
drasi apply -f https://raw.githubusercontent.com/ruokun-niu/drasi-platform/smoke-test/dev-tools/smoke-tests/resources/smoke-test-source.yaml
drasi wait source smoke-test -t 120

# Apply continuous query 
echo Applying a ContinuousQuery with the name 'smoke-query'
drasi apply -f https://raw.githubusercontent.com/ruokun-niu/drasi-platform/smoke-test/dev-tools/smoke-tests/resources/smoke-test-query.yaml


# Apply Reaction
echo Applying a Reaction with the name 'smoke-result-reaction'
drasi apply -f https://raw.githubusercontent.com/ruokun-niu/drasi-platform/smoke-test/dev-tools/smoke-tests/resources/smoke-test-reaction.yaml