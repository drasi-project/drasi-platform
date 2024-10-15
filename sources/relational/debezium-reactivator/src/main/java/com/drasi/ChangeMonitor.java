package com.drasi;

import java.io.IOException;
import java.sql.SQLException;

public interface ChangeMonitor {
    void run() throws IOException, SQLException;
    void close() throws Exception;
}
