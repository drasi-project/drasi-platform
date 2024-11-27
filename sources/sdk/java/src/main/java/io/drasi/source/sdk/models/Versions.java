package io.drasi.source.sdk.models;

import java.io.IOException;

public enum Versions {
    V1;

    public String toValue() {
        switch (this) {
            case V1: return "v1";
        }
        return null;
    }

    public static Versions forValue(String value) throws IOException {
        if (value.equals("v1")) return V1;
        throw new IOException("Cannot deserialize Versions");
    }
}
