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
  const rangeType = checkIPRange(ipInput); if (!rangeType) { setIpError("You entered wrong address"); return; } setIpError("");
  if (val && !ipRegex.test(val)) {
    setIpError("You entered wrong address");
  } else {
    setIpError("");
  }
};





const checkIPRange = (ipStr) => {
  if (!ipStr) return null;
  const trimmed = ipStr.trim();
  const parts = trimmed.split('.');
  if (parts.length !== 4) return null;
  
  const nums = [];
  for (let p of parts) {
    if (p === '' || !/^\d+$/.test(p)) return null;
    const n = Number(p);
    if (n < 0 || n > 255) return null;
    nums.push(n);
  }
  
  const [a, b, c, d] = nums;
  if (a === 10) return "Private Class A (10.0.0.0 – 10.255.255.255)";
  if (a === 172 && b >= 16 && b <= 31) return "Private Class B (172.16.0.0 – 172.31.255.255)";
  if (a === 192 && b === 168) return "Private Class C (192.168.0.0 – 192.168.255.255)";
  if (a === 127) return "Loopback (127.0.0.0 – 127.255.255.255)";
  if (a === 169 && b === 254) return "Link-local (169.254.0.0 – 169.254.255.255)";
  
  return "Public IPv4";
};






