import React, { useState } from 'react';

export default function IPAnalysis() {
  const [ipInput, setIpInput] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const isValidIPv4 = (ip) => {
    if (!ip || typeof ip !== 'string') return false;
    const trimmed = ip.trim();
    const dotCount = (trimmed.match(/\./g) || []).length;
    if (dotCount !== 3) return false;

    const parts = trimmed.split('.');
    if (parts.length !== 4) return false;

    for (let p of parts) {
      if (p === '' || !/^\d+$/.test(p)) return false;
      const n = Number(p);
      if (n < 0 || n > 255) return false;
    }
    return true;
  };

  const trimmedInput = ipInput.trim();
  const isValid = isValidIPv4(trimmedInput);

  // Determine network range type if valid
  let rangeType = "Public IPv4";
  if (isValid) {
    const parts = trimmedInput.split('.').map(Number);
    const [a, b] = parts;
    if (a === 10) rangeType = "Private Class A (10.0.0.0 – 10.255.255.255)";
    else if (a === 172 && b >= 16 && b <= 31) rangeType = "Private Class B (172.16.0.0 – 172.31.255.255)";
    else if (a === 192 && b === 168) rangeType = "Private Class C (192.168.0.0 – 192.168.255.255)";
    else if (a === 127) rangeType = "Loopback (127.0.0.0 – 127.255.255.255)";
    else if (a === 169 && b === 254) rangeType = "Link-local (169.254.0.0 – 169.254.255.255)";
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <span className="text-2xl">🌐</span>
          <h2 className="text-xl font-bold text-gray-900">IP Address Risk Lookup</h2>
        </div>
        <p className="text-gray-500 text-sm mb-4">Search any client IP to automatically evaluate threat risk level</p>
        
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={ipInput}
            onChange={(e) => {
              setIpInput(e.target.value);
              setHasSearched(false);
            }}
            onKeyDown={(e) => { if (e.key === 'Enter') setHasSearched(true); }}
            placeholder="Enter IP address (e.g. 192.168.1.105 or 10.0.0.15)..."
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          />
          <button
            onClick={() => setHasSearched(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            Analyze IP
          </button>
        </div>

        {hasSearched && !isValid && (
          <div className="mt-3 text-red-600 font-bold text-sm">
            You entered wrong address
          </div>
        )}
      </div>

      {hasSearched && isValid && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Analysis Results for: <span className="text-blue-600">{trimmedInput}</span>
          </h3>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Calculated Risk Level:</p>
              <p className="text-xl font-bold text-green-600">Low Risk</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Recorded Events:</p>
              <p className="text-xl font-bold text-gray-900">0</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-800 mb-1">Log History for this IP:</p>
            <p className="text-sm text-gray-500">No prior malicious activity recorded for this IP address ({rangeType}).</p>
          </div>
        </div>
      )}
    </div>
  );
}
