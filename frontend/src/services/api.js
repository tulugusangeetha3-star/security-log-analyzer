const API_BASE_URL = "https://security-log-analyzer-backend.onrender.com";

export const getHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) throw new Error("Backend offline");
    return await response.json();
  } catch (error) {
    console.error("Health check error:", error);
    return { status: "offline" };
  }
};

export const getAnalytics = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics`);
    if (!response.ok) throw new Error("Analytics request failed");
    return await response.json();
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return { total_logs: 0, high_risk: 0, medium_risk: 0, low_risk: 0 };
  }
};

export const getLogs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/logs`);
    if (!response.ok) throw new Error("Logs request failed");
    return await response.json();
  } catch (error) {
    console.error("Logs fetch error:", error);
    return { logs: [] };
  }
};

export const getIncidents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/incidents`);
    if (!response.ok) throw new Error("Incidents request failed");
    return await response.json();
  } catch (error) {
    console.error("Incidents fetch error:", error);
    return { incidents: [] };
  }
};

export const getReports = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/reports`);
    if (!response.ok) throw new Error("Reports request failed");
    return await response.json();
  } catch (error) {
    console.error("Reports fetch error:", error);
    return {};
  }
};

export const addLog = async (logData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logData),
    });
    if (!response.ok) throw new Error("Failed to add log");
    return await response.json();
  } catch (error) {
    console.error("Add log error:", error);
    throw error;
  }
};

export { API_BASE_URL };