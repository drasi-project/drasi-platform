import com.fasterxml.jackson.databind.ObjectMapper;
import io.drasi.source.sdk.*;
import io.drasi.source.sdk.models.SourceInsert;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.ByteBuffer;
import java.util.List;
import java.util.UUID;

public class App {
    public static void main(String[] args) {
        var reactivator = Reactivator.builder()
                .withChangeMonitor(new MyChangeMonitor())
                .withDeprovisionHandler((statestore) -> statestore.delete("cursor"))
                .build();

        reactivator.start();
    }
}

class MyChangeMonitor implements ChangeMonitor {

    private volatile boolean shouldStop = false;
    private final ObjectMapper mapper = new ObjectMapper();
    private static Logger log = LoggerFactory.getLogger(MyChangeMonitor.class);

    @Override
    public void run(ChangePublisher publisher, StateStore stateStore) throws Exception {
        var cursorStart = stateStore.get("cursor");
        var cursor = switch (cursorStart) {
            case null -> 0;
            default -> {
                if (cursorStart.length == 4) {
                    yield ByteBuffer.wrap(cursorStart).getInt();
                } else {
                    yield 0;
                }
            }
        };

        log.info("Starting from cursor: {}", cursor);

        var startingVehicleLocationId = "Location-A";

        while (!shouldStop) {
            Thread.sleep(5000);

            var vehicleId = UUID.randomUUID().toString();
            var vehicleInsert = generateVehicleInsert(vehicleId, cursor);
            cursor++;

            var vehicleLocationInsert = generateVehicleLocation(vehicleId, startingVehicleLocationId, cursor);
            cursor++;

            publisher.Publish(vehicleInsert);
            publisher.Publish(vehicleLocationInsert);

            stateStore.put("cursor", ByteBuffer.allocate(4).putInt(cursor).array());

            log.info("Published vehicle and location relation for vehicle: {}", vehicleId);
        }
    }

    private SourceInsert generateVehicleInsert(String vehicleId, int cursor) {
        var changeTime = System.currentTimeMillis();
        var vehicleProperties = mapper.createObjectNode();
        vehicleProperties.put("name", "Vehicle " + cursor);

        var vehicleInsert = new SourceInsert(vehicleId, changeTime, vehicleProperties, null, List.of("Vehicle"), changeTime, cursor);

        return vehicleInsert;
    }

    private SourceInsert generateVehicleLocation(String vehicleId, String locationId, int cursor) {
        var changeTime = System.currentTimeMillis();
        var relationId = UUID.randomUUID().toString();

        var vehicleLocationInsert = new SourceInsert(relationId, changeTime, null, null, List.of("LOCATED_AT"), changeTime, cursor, vehicleId, locationId);

        return vehicleLocationInsert;
    }

    @Override
    public void close() throws Exception {
        shouldStop = true;
    }
}