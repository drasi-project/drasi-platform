package io.drasi.source.sdk.models;

import java.io.IOException;

public enum SourceInsertOp {
    I;

    public String toValue() {
        switch (this) {
            case I: return "i";
        }
        return null;
    }

    public static SourceInsertOp forValue(String value) throws IOException {
        if (value.equals("i")) return I;
        throw new IOException("Cannot deserialize SourceInsertOp");
    }
}
