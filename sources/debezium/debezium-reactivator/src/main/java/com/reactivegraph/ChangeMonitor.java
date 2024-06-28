package com.reactivegraph;

import java.io.IOException;
import java.sql.SQLException;

public interface ChangeMonitor {
    void run() throws IOException, SQLException;
}
