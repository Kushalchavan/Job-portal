import client from "prom-client";

// Collect default Node.js metrics
client.collectDefaultMetrics();

export const register = client.register;