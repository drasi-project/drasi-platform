import com.fasterxml.jackson.databind.ObjectMapper;
import io.drasi.source.sdk.*;
import io.drasi.source.sdk.models.BootstrapRequest;
import io.drasi.source.sdk.models.SourceElement;

import java.io.IOException;
import java.util.*;

public class App {
    public static void main(String[] args) {
        var proxy = SourceProxy.builder()
                .withStreamFunction(request -> new MyBootstrapStream(request))
                .build();

        proxy.start();
    }
}

class MyBootstrapStream implements BootstrapStream {

    private final BootstrapRequest request;
    private final Iterator<SourceElement> elements;

    public MyBootstrapStream(BootstrapRequest request) {
        this.request = request;

        ObjectMapper mapper = new ObjectMapper();

        elements = List.of(
            new SourceElement("Location-A", mapper.valueToTree(Map.of(
                    "longitude", 50.0,
                    "latitude", 60.0
                    )), Set.of("Location")),
                new SourceElement("Location-B", mapper.valueToTree(Map.of(
                        "longitude", 51.0,
                        "latitude", 65.0
                )), Set.of("Location"))
        ).iterator();
    }


    @Override
    public List<String> validate() {
        if (request.getNodeLabels().contains("Some Invalid Label")) {
            return List.of("Invalid Label is not allowed");
        }

        return List.of();
    }

    @Override
    public SourceElement next() {
        if (elements.hasNext()) {
            return elements.next();
        }

        return null;
    }

    @Override
    public void close() throws IOException {

    }
}