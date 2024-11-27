package io.drasi.source.sdk.models;

import java.io.IOException;

public enum SourceUpdateOp {
    U;

    public String toValue() {
        switch (this) {
            case U: return "u";
        }
        return null;
    }

    public static SourceUpdateOp forValue(String value) throws IOException {
        if (value.equals("u")) return U;
        throw new IOException("Cannot deserialize SourceUpdateOp");
    }
}
