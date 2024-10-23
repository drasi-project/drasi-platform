echo Setting up Quick Test...

namespace="$1"

# Default namespace
if [ -z "$namespace" ]; then
    namespace="drasi-system"
fi

echo Setting up Postgres...

# Deploy Postgres 
kubectl apply -f https://raw.githubusercontent.com/drasi-project/drasi-platform/main/dev-tools/testing/quick-test-environment/resources/quick-test-postgres.yaml -n default
kubectl wait --for=condition=ready --timeout=60s pod -l app=postgres -n default


echo Postgres database is created in the 'default' namespace

echo Applying Drasi components...

drasi namespace set $namespace   # Set the namespace

# Apply source
echo Applying a Source with the name 'quick-test'
drasi apply -f https://raw.githubusercontent.com/drasi-project/drasi-platform/main/dev-tools/testing/quick-test-environment/resources/quick-test-source.yaml
drasi wait source quick-test -t 120

# Apply continuous query 
echo Applying a ContinuousQuery with the name 'quick-query'
drasi apply -f https://raw.githubusercontent.com/drasi-project/drasi-platform/main/dev-tools/testing/quick-test-environment/resources/quick-test-query.yaml
sleep 5

# Apply Reaction
echo Applying a Reaction with the name 'quick-result-reaction'
drasi apply -f https://raw.githubusercontent.com/drasi-project/drasi-platform/main/dev-tools/testing/quick-test-environment/resources/quick-test-reaction.yaml

drasi wait reaction quick-result-reaction -t 120

# Initial result
initial_output=$(kubectl run curl-pod --image=curlimages/curl -n $namespace --restart=Never  --rm --attach -q -- sh -c 'curl -s http://quick-result-reaction-gateway:8080/quick-query/all' 2>/dev/null)
initial_parsed_output=$(echo $initial_output | grep -o '\[.*\]')
echo "Initial output:$initial_parsed_output"



# get the postgres pod name
postgres_pod=$(kubectl get pods -l app=postgres -o jsonpath="{.items[0].metadata.name}" -n default)

echo "Inserting the following entries into the database: '{"Id": 4, "Name": "Item 4", "Category": "B"}'"
echo "postgres pod:$postgres_pod"
kubectl exec  $postgres_pod -n default -- psql -U postgres -d smokedb -c "INSERT INTO public.\"Item\" VALUES (4, 'Item 4', 'B')" 2>/dev/null
sleep 5
echo "Inserting the following entries into the database: '{"Id": 5, "Name": "Item 5", "Category": "A"}'"
kubectl exec  $postgres_pod -n default -- psql -U postgres -d smokedb -c "INSERT INTO public.\"Item\" VALUES (5, 'Item 5', 'A')" 2>/dev/null

echo "Retrieving the current result from the debug reaction"
sleep 20

final_output=$(kubectl run curl-pod --image=curlimages/curl -n $namespace --restart=Never  --rm --attach -q -- sh -c 'curl -s http://quick-result-reaction-gateway:8080/quick-query/all' 2>/dev/null)
final_parsed_output=$(echo $final_output | grep -o '\[.*\]')
echo "Final output:$final_parsed_output"

expected_output='[{"Category":"A","Id":1,"Name":"Item 1"},{"Category":"A","Id":3,"Name":"Item 3"},{"Category":"A","Id":5,"Name":"Item 5"}]'

echo "Expected output after the insertion:$expected_output"

if [ "$final_parsed_output" == "$expected_output" ]; then
    echo "Quick test passed!"

    echo "cleaning up resources..."
    kubectl delete -f https://raw.githubusercontent.com/drasi-project/drasi-platform/main/dev-tools/testing/quick-test-environment/resources/quick-test-postgres.yaml -n default

    drasi delete -f https://raw.githubusercontent.com/drasi-project/drasi-platform/main/dev-tools/testing/quick-test-environment/resources/quick-test-reaction.yaml
    drasi delete -f https://raw.githubusercontent.com/drasi-project/drasi-platform/main/dev-tools/testing/quick-test-environment/resources/quick-test-query.yaml
    drasi delete -f https://raw.githubusercontent.com/drasi-project/drasi-platform/main/dev-tools/testing/quick-test-environment/resources/quick-test-source.yaml

else
    echo "Quick test failed"

    echo "Resources are not deleted. If you wish to clean up everything, run 'curl -s https://raw.githubusercontent.com/drasi-project/drasi-platform/main/dev-tools/testing/quick-test-environment/cleanup-quick-test-environment.sh | bash'"
    exit 1
fi