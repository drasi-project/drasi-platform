echo Setting up Smoke Test...

namespace="$1"

# Default namespace
if [ -z "$namespace" ]; then
    namespace="drasi-system"
fi

echo Setting up Postgres...

# Deploy Postgres   TODO: Update the URL
kubectl apply -f https://raw.githubusercontent.com/ruokun-niu/drasi-platform/smoke-test/dev-tools/smoke-tests/resources/smoke-test-postgres.yaml -n default
kubectl wait --for=condition=ready --timeout=60s pod -l app=postgres -n default


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

drasi wait reaction smoke-result-reaction -t 120

# Initial result
initial_output=$(kubectl run curl-pod --image=curlimages/curl -n drasi-system --restart=Never --rm -it  -- sh -c 'sleep 3; curl http://smoke-result-reaction-gateway:8080/smoke-query/all; sleep 3'  2>/dev/null)
initial_parsed_output=$(echo $initial_output | grep -o '\[.*\]')
echo "Initial output:$initial_parsed_output"

# Insert data into the postgres database
echo Adding the following entry to the database: '{"Id": 4, "Name": "Item 4", "Category": "A"}'

# get the postgres pod name
postgres_pod=$(kubectl get pods -l app=postgres -o jsonpath="{.items[0].metadata.name}" -n default)


kubectl exec -it $postgres_pod -n default  -- psql -U postgres -d smokedb -q -c "INSERT INTO public.item (id, name, category) VALUES (4, 'Item 4', 'A');" > /dev/null 2>&1


echo "Retrieving the current result from the debug reaction"
sleep 10

final_output=$(kubectl run curl-pod --image=curlimages/curl -n drasi-system --restart=Never --rm -it  -- sh -c 'sleep 3; curl http://smoke-result-reaction-gateway:8080/smoke-query/all; sleep 3'  2>/dev/null)
final_parsed_output=$(echo $final_output | grep -o '\[.*\]')
echo "Final output:$final_parsed_output"

expected_output='[{"Category":"A","Id":1,"Name":"Item 1"},{"Category":"A","Id":3,"Name":"Item 3"},{"Category":"A","Id":4,"Name":"Item 4"}]'

echo "Expected output after the insertion:$expected_output"
echo "Actual output:$parsed_output"

if [ "$final_parsed_output" == "$expected_output" ]; then
    echo "Smoke test passed!"

    echo "cleaning up resources..."
    kubectl delete -f https://raw.githubusercontent.com/ruokun-niu/drasi-platform/smoke-test/dev-tools/smoke-tests/resources/smoke-test-postgres.yaml -n default

    drasi delete -f https://raw.githubusercontent.com/ruokun-niu/drasi-platform/smoke-test/dev-tools/smoke-tests/resources/smoke-test-source.yaml
    drasi delete -f https://raw.githubusercontent.com/ruokun-niu/drasi-platform/smoke-test/dev-tools/smoke-tests/resources/smoke-test-query.yaml
    drasi delete -f https://raw.githubusercontent.com/ruokun-niu/drasi-platform/smoke-test/dev-tools/smoke-tests/resources/smoke-test-reaction.yaml

    
else
    echo "Smoke test failed"

    echo "Resources are not deleted. If you wish to clean up everything, run 'curl -s https://raw.githubusercontent.com/ruokun-niu/drasi-platform/smoke-test/dev-tools/smoke-tests/cleanup-smoke-test.sh | bash'"
    exit 1
fi