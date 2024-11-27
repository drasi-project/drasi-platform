package io.drasi.source.sdk.models;

import java.io.IOException;

public enum Table {
    NODE, REL;

    public String toValue() {
        switch (this) {
            case NODE: return "node";
            case REL: return "rel";
        }
        return null;
    }

    public static Table forValue(String value) throws IOException {
        if (value.equals("node")) return NODE;
        if (value.equals("rel")) return REL;
        throw new IOException("Cannot deserialize Table");
    }
}
