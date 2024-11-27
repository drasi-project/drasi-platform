package io.drasi.source.sdk;

public class StateStoreFactory {
    private static StateStore instance;

    private StateStoreFactory() {
        // private constructor to prevent instantiation
    }

    public static synchronized StateStore getInstance() {
        if (instance == null) {
            instance = new DaprStateStore();
        }
        return instance;
    }
}
