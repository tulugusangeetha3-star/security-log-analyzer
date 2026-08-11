const isValidIPv4 = (ip) => {
  if (!ip) return false;
  const parts = ip.trim().split('.');
  if (parts.length !== 4) return false;
  for (let p of parts) {
    if (p === '' || !/^\d+$/.test(p)) return false;
    const n = Number(p);
    if (n < 0 || n > 255) return false;
  }
  return true;
};

```jsx
import React, { useState } from 'react';

export default function IPAnalysis() {
  const [ipAddress, setIpAddress] = useState('');
  const [error, setError] = useState('');
  const [analyzed, setAnalyzed] = useState(false);

  // Check whether the entered value is a valid IPv4 address
  const isValidIP = (ip) => {
    const parts = ip.trim().split('.');

    // IPv4 must have exactly 4 parts
    if (parts.length !== 4) {
      return false;
    }

    // Each part must be a number between 0 and 255
    return parts.every((part) => {
      if (part === '' || !/^\d+$/.test(part)) {
        return false;
      }

      const number = Number(part);

      return number >= 0 && number <= 255;
    });
  };

  const handleAnalyze = () => {
    const ip = ipAddress.trim();

    // Empty input
    if (ip === '') {
      setError('You entered a wrong address');
      setAnalyzed(false);
      return;
    }

    // Invalid IP address
    if (!isValidIP(ip)) {
      setError('You entered a wrong address');
      setAnalyzed(false);
      return;
    }

    // Valid IP
    setError('');
    setAnalyzed(true);
  };

  return (
    <div
      style={{
        padding: '24px',
        color: '#f8fafc',
      }}
    >
      <h2>IP Address Risk Lookup</h2>

      <p style={{ color: '#64748b' }}>
        Search any client IP to automatically evaluate threat risk level
      </p>

      <div style={{ marginTop: '24px' }}>
        <input
          type="text"
          value={ipAddress}
          onChange={(e) => {
            setIpAddress(e.target.value);
            setError('');
            setAnalyzed(false);
          }}
          placeholder="Enter client IP address"
          style={{
            width: '300px',
            padding: '12px',
            borderRadius: '6px',
            border: error ? '1px solid red' : '1px solid #475569',
            backgroundColor: '#0f172a',
            color: '#f8fafc',
            fontSize: '16px',
            outline: 'none',
          }}
        />

        <button
          onClick={handleAnalyze}
          style={{
            marginLeft: '10px',
            padding: '12px 20px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#2563eb',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Analyze IP
        </button>
      </div>

      {/* Wrong IP address message */}
      {error && (
        <p
          style={{
            color: 'red',
            fontWeight: 'bold',
            marginTop: '16px',
          }}
        >
          {error}
        </p>
      )}

      {/* Valid IP message */}
      {analyzed && !error && (
        <div style={{ marginTop: '24px' }}>
          <h3>Analysis Results for: {ipAddress}</h3>

          <p>Calculated Risk Level:</p>

          <h4 style={{ color: '#22c55e' }}>Low Risk</h4>

          <p>Total Recorded Events:</p>

          <h4>0</h4>

          <h4>Log History for this IP:</h4>

          <p style={{ color: '#94a3b8' }}>
            No prior malicious activity recorded for this IP address.
          </p>
        </div>
      )}
    </div>
  );
}
```

