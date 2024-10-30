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
        "DatabaseHostname": "127.0.0.1",
        "DatabaseDbname": "test-db",
        "DatabaseUser": "test",
        "DatabasePassword": "test",
        "DatabasePort": 5432
      }
    }
  };
}

module.exports = storedprocReactionManifest;