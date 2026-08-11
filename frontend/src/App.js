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
const refreshBackendConnection = async () => {
  try {
    const response = ${API_BASE_URL}/;
    const res = await fetch(response);
    const data = await res.json();
    if (res.ok) {
      alert("Backend connection refreshed successfully: " + data.message);
    } else {
      alert("Backend responded with an error.");
    }
  } catch (error) {
    alert("Failed to connect to backend.");
  }
};






const handleIpChange = (e) => {
  const val = e.target.value;
  setIpInput(val);
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (val && !ipRegex.test(val)) {
    setIpError("You entered wrong address");
  } else {
    setIpError("");
  }
};


