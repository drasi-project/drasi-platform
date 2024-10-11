echo Setting up Postgres...

helm repo add bitnami https://charts.bitnami.com/bitnami 1>/dev/null



namespace="$1"

if [ -z "$namespace" ]; then
    namespace="drasi-system"
fi


echo Setting up the Postgres database for the smoke test
helm install smoke-postgresql -f https://drasi.blob.core.windows.net/smoke-tests/smoke-postgresql-values.yaml bitnami/postgresql  1>/dev/null

kubectl wait --for=condition=ready pod smoke-postgresql-0  --timeout=60s 1>/dev/null
echo The Postgres db is created successfully

export POSTGRES_PASSWORD=$(kubectl get secret --namespace default smoke-postgresql -o jsonpath="{.data.postgres-password}" | base64 -d)

echo Populating the data in the database
curl -s https://drasi.blob.core.windows.net/smoke-tests/setup-smoke-data.sh | bash
kubectl create secret generic pg-creds --from-literal=password=$POSTGRES_PASSWORD -n $namespace

echo "Current records in the 'item' table:"
(kubectl run smoke-postgresql-client --rm -i --restart='Never' --namespace default \
  --image docker.io/bitnami/postgresql:15.1.0-debian-11-r31 --env="PGPASSWORD=$POSTGRES_PASSWORD" \
  --command -- psql -q --host smoke-postgresql -U postgres -d postgres -p 5432 -c '\c smokedb' \
  -c "SELECT * FROM item;" 2>/dev/null) | grep -v "pod \"smoke-postgresql-client\" deleted\|If you don't see a command prompt, try pressing enter."

echo Applying Drasi components...

drasi namespace set $namespace

## Apply source
echo Applying the Source
drasi apply -f  https://drasi.blob.core.windows.net/smoke-tests/smoke-test-source.yaml
sleep 10
kubectl wait pod -n $namespace --for=condition=ready -l 'drasi/type=source' --timeout=60s


## Apply continuous query
echo Applying the ContinuousQuery
drasi apply -f https://drasi.blob.core.windows.net/smoke-tests/smoke-test-query.yaml


## Apply reaction
echo Applying the Reaction
drasi apply -f https://drasi.blob.core.windows.net/smoke-tests/smoke-test-reaction.yaml

sleep 10

kubectl wait pod -n $namespace --for=condition=ready -l 'drasi/resource=smoke-result-reaction'  --timeout=60s


# curl result
initial_output=$(kubectl run curl-pod --image=curlimages/curl -n $namespace --restart=Never --rm -it  -- sh -c 'sleep 3; curl http://smoke-result-reaction-gateway:8080/smoke-query/all; sleep 3'  2>/dev/null)
initial_parsed_output=$(echo $initial_output | grep -o '\[.*\]')
echo "Initial output:$initial_parsed_output"


# sleep 5

echo Adding the following entry to the database: '{"Id": 4, "Name": "Item 4", "Category": "A"}'


(kubectl run smoke-postgresql-client --rm -i --restart='Never' \
  --image docker.io/bitnami/postgresql:15.1.0-debian-11-r31 --env="PGPASSWORD=$POSTGRES_PASSWORD" \
  --command -- psql -q --host smoke-postgresql -U postgres -d postgres -p 5432 -c '\c smokedb' \
  -c "INSERT INTO item (id, name, category) VALUES (4, 'Item 4', 'A'); SELECT * FROM item;") 2>/dev/null | grep -v "pod \"smoke-postgresql-client\" deleted"

# add sleep
echo "Retrieving the current result from the debug reaction"
sleep 10

command_output=$(kubectl run curl-pod --image=curlimages/curl -n $namespace --restart=Never --rm -it  -- sh -c 'sleep 3; curl http://smoke-result-reaction-gateway:8080/smoke-query/all; sleep 3'  2>/dev/null)
parsed_output=$(echo $command_output | grep -o '\[.*\]')

expected_output='[{"Category":"A","Id":1,"Name":"Item 1"},{"Category":"A","Id":3,"Name":"Item 3"},{"Category":"A","Id":4,"Name":"Item 4"}]'

echo "Expected output after the insertion:$expected_output"
echo "Actual output:$parsed_output"


sleep 5

if [ "$parsed_output" = "$expected_output" ]; then
    echo "The output from the reaction matches the expected output"
    echo "Smoke test completed"

    echo "Cleaning up..."
    curl -s https://drasi.blob.core.windows.net/smoke-tests/cleanup-smoke-test.sh | bash
    exit 0
else
    echo "Smoke test failed"

    echo "Resources are not deleted. If you wish to clean up everything, run 'curl -s https://drasi.blob.core.windows.net/smoke-tests/cleanup-smoke-test.sh | bash'"
    exit 1
fi
