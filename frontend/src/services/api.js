const API_BASE_URL = "http://127.0.0.1:8000";

const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
};

export const getHealth = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return await handleResponse(res);
  } catch (error) {
    return { status: "offline", error: error.message };
  }
};

export const getLogs = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/logs`);
    return await handleResponse(res);
  } catch (error) {
    return [];
  }
};

export const getIncidents = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/incidents`);
    return await handleResponse(res);
  } catch (error) {
    return [];
  }
};

export const getAnalytics = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/analytics`);
    return await handleResponse(res);
  } catch (error) {
    return null;
  }
};

export const getReports = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/reports`);
    return await handleResponse(res);
  } catch (error) {
    return [];
  }
};