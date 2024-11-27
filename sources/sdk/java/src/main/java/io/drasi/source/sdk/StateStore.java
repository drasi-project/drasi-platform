package io.drasi.source.sdk;

public interface StateStore {

    void put(String key, byte[] value);

    byte[] get(String key);

    void delete(String key);

}
