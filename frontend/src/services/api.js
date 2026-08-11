// Change this URL to match your live Render Backend URL (without trailing slash)
export const API_BASE_URL = "https://YOUR-BACKEND-NAME.onrender.com";

export const getHealth = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error("Health check failed");
    return await res.json();
  } catch (err) {
    console.error("getHealth Error:", err);
    return { status: "offline" };
  }
};

export const getAnalytics = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/analytics`);
    if (!res.ok) throw new Error("Failed to fetch analytics");
    return await res.json();
  } catch (err) {
    console.error("getAnalytics Error:", err);
    return null;
  }
};

export const getLogs = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/logs`);
    if (!res.ok) throw new Error("Failed to fetch logs");
    return await res.json();
  } catch (err) {
    console.error("getLogs Error:", err);
    return { logs: [] };
  }
};

export const getIncidents = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/incidents`);
    if (!res.ok) throw new Error("Failed to fetch incidents");
    return await res.json();
  } catch (err) {
    console.error("getIncidents Error:", err);
    return { incidents: [] };
  }
};

export const getReports = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/reports`);
    if (!res.ok) throw new Error("Failed to fetch reports");
    return await res.json();
  } catch (err) {
    console.error("getReports Error:", err);
    return {};
  }
};

export const addLog = async (logData) => {
  const res = await fetch(`${API_BASE_URL}/logs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(logData),
  });

  if (!res.ok) {
    throw new Error(`Failed to send log. Status: ${res.status}`);
  }

  return await res.json();
};