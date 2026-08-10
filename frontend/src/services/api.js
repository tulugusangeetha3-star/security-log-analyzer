```javascript
const API_BASE_URL =
  "https://security-log-analyzer-backend.onrender.com";

const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
};

// Check whether the FastAPI backend is healthy
export const getHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Backend health check failed:", error);
    throw error;
  }
};

// Get basic backend information
export const getBackendStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Backend status check failed:", error);
    throw error;
  }
};

// Generic GET request
export const apiGet = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    return await handleResponse(response);
  } catch (error) {
    console.error(`GET ${endpoint} failed:`, error);
    throw error;
  }
};

// Generic POST request
export const apiPost = async (endpoint, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error(`POST ${endpoint} failed:`, error);
    throw error;
  }
};

// Export backend URL
export { API_BASE_URL };
```
