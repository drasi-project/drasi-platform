# Oracle Database Source Support

This implementation adds Oracle database support to Drasi's relational source provider, following the same architectural patterns established for PostgreSQL, MySQL, and SQL Server.

## Implementation Overview

### Components Modified/Added

1. **Dependencies**:
   - Added `debezium-connector-oracle` to debezium-reactivator
   - Added Oracle JDBC driver (`ojdbc11`) to sql-proxy

2. **Oracle Database Strategy** (`Oracle.java`):
   - Implements `DatabaseStrategy` interface
   - Handles Oracle-specific connection configuration
   - Manages SCN (System Change Number) extraction for change tracking
   - Provides Oracle-specific table metadata handling
   - Configures Debezium Oracle connector with LogMiner
   - Implements supplemental logging setup for CDC requirements

3. **Main Components Updated**:
   - `DebeziumReactivator.java`: Added Oracle case to connector strategy selection
   - `ResultStream.java`: Added Oracle JDBC connection handling
   - `TableCursor.java`: Updated identifier quoting for Oracle (uses double quotes)

4. **Configuration**:
   - Added Oracle source provider to `default-source-providers.yaml`
   - Supports both database name and service name configurations
   - Default port 1521 for Oracle

5. **Testing**:
   - Created end-to-end test scenario (`10-oracle-scenario`)
   - Includes Oracle XE container setup with test data
   - Verifies basic CDC functionality

## Oracle-Specific Features

### Change Data Capture
- Uses Debezium Oracle connector with LogMiner strategy
- Extracts SCN (System Change Number) for change ordering
- Requires supplemental logging to be enabled

### Connection Configuration
- Supports both SID and service name connections
- Uses Oracle thin JDBC driver
- Connection string format: `jdbc:oracle:thin:@//host:port/service_name`

### Schema Handling
- Uses uppercase schema and table names (Oracle convention)
- Handles Oracle's case-sensitive identifier rules
- Primary key detection works with Oracle's metadata format

## Usage Example

```yaml
apiVersion: v1
kind: Source
name: oracle-source
spec:
  kind: Oracle
  properties:
    host: oracle-server.example.com
    port: 1521
    user: drasi_user
    password: password
    serviceName: ORCL  # or use database field for SID
    tables:
      - SCHEMA.TABLE_NAME
```

## Prerequisites for Oracle Database

1. **Database Configuration**:
   - Archive log mode must be enabled
   - Supplemental logging should be enabled (handled automatically by the connector)

2. **User Permissions**:
   The Oracle user needs the following privileges:
   ```sql
   GRANT CONNECT TO drasi_user;
   GRANT RESOURCE TO drasi_user;
   GRANT SELECT_CATALOG_ROLE TO drasi_user;
   GRANT EXECUTE_CATALOG_ROLE TO drasi_user;
   GRANT SELECT ANY TRANSACTION TO drasi_user;
   GRANT LOGMINING TO drasi_user;
   GRANT CREATE TABLE TO drasi_user;
   GRANT LOCK ANY TABLE TO drasi_user;
   GRANT CREATE SEQUENCE TO drasi_user;
   ```

3. **LogMiner Setup**:
   - The Oracle connector uses LogMiner for CDC
   - Supplemental logging is automatically enabled by the connector initialization

## Testing

Run the Oracle integration test:
```bash
cd e2e-tests
npm test -- 10-oracle-scenario
```

Note: The test requires Docker and sufficient resources to run Oracle XE container (recommended 4GB RAM).

## Limitations

1. **Oracle Version Support**: Tested with Oracle XE 21c, should work with Oracle 12c and later
2. **LogMiner Requirements**: Requires Oracle to be in archive log mode
3. **Resource Requirements**: Oracle containers require significant memory (2-4GB minimum)
4. **Licensing**: Ensure appropriate Oracle licensing for your use case

## Future Enhancements

1. **Oracle RAC Support**: Could be extended to support Oracle Real Application Clusters
2. **Advanced LogMiner Options**: Additional configuration options for performance tuning
3. **Flashback Query Support**: Alternative to LogMiner for certain use cases
4. **Oracle Cloud Integration**: Enhanced support for Oracle Autonomous Database