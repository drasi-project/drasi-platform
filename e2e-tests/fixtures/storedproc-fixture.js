/**
 * @param {Array} queryIds
 */
function storedprocReactionManifest(queryIds) {
  let result = {
    "apiVersion": "v1",
    "kind": "Reaction",
    "name": "test-storedproc",
    "spec": {
      "kind": "StoredProc",
      "queries": queryIds.reduce((a, v) => ({ ...a, [v]: ""}), {}),
      "properties": {
        "AddedResultCommand": "public.insertCommandResult(@Id, @Name, @Category)",
        "DatabaseClient": "pg",
        "DatabaseHostname": "postgres.default.svc.cluster.local",
        "DatabaseDbname": "test-db",
        "DatabaseUser": "test",
        "DatabasePassword": "test",
        "DatabasePort": 5432,
        "DatabaseSsl": false
      }
    }
  };

  return result;
}

module.exports = storedprocReactionManifest;