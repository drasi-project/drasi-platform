package io.drasi.source.sdk.models;

import java.util.Set;

/**
 * The request payload form the QueryAPI that contains the details of what data should be bootstrapped.
 */
public class BootstrapRequest {
    private Set<String> nodeLabels;
    private Set<String> relLabels;

    public Set<String> getNodeLabels() {
        return nodeLabels;
    }

    public void setNodeLabels(Set<String> nodeLabels) {
        this.nodeLabels = nodeLabels;
    }

    public Set<String> getRelLabels() {
        return relLabels;
    }

    public void setRelLabels(Set<String> relLabels) {
        this.relLabels = relLabels;
    }
}
