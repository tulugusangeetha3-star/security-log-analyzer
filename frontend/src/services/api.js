const API_BASE_URL = "https://security-log-analyzer-backend.onrender.com";

const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
};

export const getHealth = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return await handleResponse(response);
};

export const getBackendStatus = async () => {
  const response = await fetch(`${API_BASE_URL}/`);
  return await handleResponse(response);
};

export const apiGet = async (endpoint) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  return await handleResponse(response);
};

export const apiPost = async (endpoint, data) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await handleResponse(response);
};

export { API_BASE_URL };
