package io.drasi.source.sdk.models;

import java.io.IOException;

public enum SourceChangeOp {
    D, I, U;

    public String toValue() {
        switch (this) {
            case D: return "d";
            case I: return "i";
            case U: return "u";
        }
        return null;
    }

    public static SourceChangeOp forValue(String value) throws IOException {
        if (value.equals("d")) return D;
        if (value.equals("i")) return I;
        if (value.equals("u")) return U;
        throw new IOException("Cannot deserialize SourceChangeOp");
    }
}
