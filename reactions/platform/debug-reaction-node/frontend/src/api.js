// const API_URL = "http://hello-world-debug-backend-gateway.drasi-system.svc.cluster.local:3001";
const API_URL = "http://localhost:3001";

export const fetchQueries = async () => {
    const response = await fetch(`${API_URL}/queries`);
    return response.json();
};
