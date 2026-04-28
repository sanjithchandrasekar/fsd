import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Database, CheckCircle, XCircle, Users, Package, RefreshCw, Server } from 'lucide-react';

const DbTestPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use relative path for compatibility with proxy and production
      const response = await axios.get('/api/db-check');
      setData(response.data);
    } catch (err) {
      console.error('DB Check Error:', err);
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="min-h-screen bg-[#0F111A] text-white pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Database className="text-violet-500 w-10 h-10" />
              System Connectivity
            </h1>
            <p className="text-gray-400">Real-time status of your MongoDB Atlas connection</p>
          </div>
          <button 
            onClick={checkConnection}
            disabled={loading}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Status
          </button>
        </div>

        {loading && !data ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#161922] rounded-3xl border border-gray-800">
            <RefreshCw className="w-12 h-12 text-violet-500 animate-spin mb-4" />
            <p className="text-xl text-gray-300">Pinging Atlas Shards...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/50 rounded-3xl p-8 flex items-start gap-4">
            <XCircle className="text-red-500 w-8 h-8 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold text-red-500 mb-2">Connection Failed</h3>
              <p className="text-gray-300 mb-4">{error}</p>
              <div className="bg-black/40 p-4 rounded-xl font-mono text-sm text-red-400">
                Check if your IP is whitelisted in Atlas and MONGO_URI is correct in .env
              </div>
            </div>
          </div>
        ) : data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Card */}
            <div className="col-span-1 md:col-span-2 bg-[#161922] rounded-3xl p-8 border border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="bg-green-500/20 p-4 rounded-2xl">
                  <CheckCircle className="text-green-500 w-10 h-10" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                    <h3 className="text-2xl font-bold text-green-500">Connected</h3>
                  </div>
                  <p className="text-gray-400 font-mono text-sm">{data.host}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-sm uppercase tracking-widest mb-1">Database</p>
                <p className="text-xl font-semibold text-violet-400">{data.database}</p>
              </div>
            </div>

            {/* User Stats Card */}
            <div className="bg-[#161922] rounded-3xl p-8 border border-gray-800 transition-all hover:border-violet-500/50 group">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-violet-500/10 p-3 rounded-xl group-hover:bg-violet-500/20 transition-colors">
                  <Users className="text-violet-500 w-6 h-6" />
                </div>
                <span className="text-gray-500 text-sm font-mono">Collection: users</span>
              </div>
              <p className="text-gray-400 mb-1">Total Verified Users</p>
              <p className="text-5xl font-bold">{data.stats.users}</p>
            </div>

            {/* Product Stats Card */}
            <div className="bg-[#161922] rounded-3xl p-8 border border-gray-800 transition-all hover:border-violet-500/50 group">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-violet-500/10 p-3 rounded-xl group-hover:bg-violet-500/20 transition-colors">
                  <Package className="text-violet-500 w-6 h-6" />
                </div>
                <span className="text-gray-500 text-sm font-mono">Collection: products</span>
              </div>
              <p className="text-gray-400 mb-1">Live Artisanal Items</p>
              <p className="text-5xl font-bold">{data.stats.products}</p>
            </div>

            {/* Server Info */}
            <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-violet-600/10 to-transparent rounded-3xl p-8 border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <Server className="text-violet-500 w-5 h-5" />
                <h4 className="font-semibold">Backend Environment</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-gray-500 text-xs uppercase mb-1">Runtime</p>
                  <p className="text-sm font-mono text-gray-300">Node.js v22.18.0</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase mb-1">Port</p>
                  <p className="text-sm font-mono text-gray-300">5000</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase mb-1">CORS Policy</p>
                  <p className="text-sm font-mono text-gray-300">Enabled (v5173)</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase mb-1">Mongoose</p>
                  <p className="text-sm font-mono text-gray-300">Active</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DbTestPage;
