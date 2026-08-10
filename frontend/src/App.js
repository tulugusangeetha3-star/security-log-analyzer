const API_BASE_URL =
  "https://security-log-analyzer-backend.onrender.com";

const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
};

export const getHealth = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return handleResponse(response);
};

export const getBackendStatus = async () => {
  const response = await fetch(`${API_BASE_URL}/`);
  return handleResponse(response);
};

export const apiGet = async (endpoint) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  return handleResponse(response);
};

export const apiPost = async (endpoint, data) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
};