package io.drasi.source.sdk.models;

import java.io.IOException;

public enum SourceDeleteOp {
    D;

    public String toValue() {
        switch (this) {
            case D: return "d";
        }
        return null;
    }

    public static SourceDeleteOp forValue(String value) throws IOException {
        if (value.equals("d")) return D;
        throw new IOException("Cannot deserialize SourceDeleteOp");
    }
}
