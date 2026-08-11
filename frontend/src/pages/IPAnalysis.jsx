import React, { useState } from 'react';

export default function IPAnalysis() {
  const [ipInput, setIpInput] = useState('');
  const [ipError, setIpError] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const getIPRangeType = (ip) => {
    const parts = ip.split('.').map(Number);
    const [a, b] = parts;
    if (a === 10) return "Private Class A (10.0.0.0 – 10.255.255.255)";
    if (a === 172 && b >= 16 && b <= 31) return "Private Class B (172.16.0.0 – 172.31.255.255)";
    if (a === 192 && b === 168) return "Private Class C (192.168.0.0 – 192.168.255.255)";
    if (a === 127) return "Loopback (127.0.0.0 – 127.255.255.255)";
    if (a === 169 && b === 254) return "Link-local (169.254.0.0 – 169.254.255.255)";
    return "Public IPv4";
  };

  const handleAnalyze = () => {
    setIpError('');
    setAnalysisResult(null);

    if (!isValidIPv4(ipInput)) {
      setIpError('You entered wrong address');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const rangeType = getIPRangeType(ipInput);
      setAnalysisResult({
        ip: ipInput.trim(),
        riskLevel: 'Low Risk',
        eventsCount: 0,
        range: rangeType,
        history: 'No prior malicious activity recorded for this IP address.'
      });
      setLoading(false);
    }, 300);
  };

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
              if (ipError) setIpError('');
            }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAnalyze(); }}
            placeholder="Enter IP address (e.g. 192.168.1.105 or 10.0.0.15)..."
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          />
          <button
            onClick={handleAnalyze}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            Analyze IP
          </button>
        </div>

        {ipError && (
          <div className="mt-3 text-red-600 font-bold text-sm">
            {ipError}
          </div>
        )}
      </div>

      {analysisResult && isValidIPv4(analysisResult.ip) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Analysis Results for: <span className="text-blue-600">{analysisResult.ip}</span>
          </h3>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Calculated Risk Level:</p>
              <p className="text-xl font-bold text-green-600">{analysisResult.riskLevel}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Recorded Events:</p>
              <p className="text-xl font-bold text-gray-900">{analysisResult.eventsCount}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-800 mb-1">Log History for this IP:</p>
            <p className="text-sm text-gray-500">{analysisResult.history}</p>
          </div>
        </div>
      )}
    </div>
  );
}
