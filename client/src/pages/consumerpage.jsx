// src/pages/consumerpage.jsx
import React, { useState, useEffect } from 'react';
import { verifyBatch, getSensorHistory } from '../API/api';
import BatchCard from '../component/BatchCard';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, RefreshCcw, Search, Thermometer, AlertTriangle, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function ConsumerPage() {
  const [batchId, setBatchId] = useState('');
  const [qrPayload, setQrPayload] = useState('');
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState(null);
  const [err, setErr] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // 🧠 Load saved data from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("consumerForm"));
    if (saved) {
      setBatchId(saved.batchId || "");
      setQrPayload(saved.qrPayload || "");
    }
  }, []);

  // 💾 Save data automatically on change
  useEffect(() => {
    localStorage.setItem(
      "consumerForm",
      JSON.stringify({ batchId, qrPayload })
    );
  }, [batchId, qrPayload]);

  // 🔄 Auto-fetch history whenever batch is verified — keeps running even if recalled
  useEffect(() => {
    let interval;
    if (resp && resp.valid) {
      const fetchHistory = async () => {
        try {
          const { data } = await getSensorHistory(batchId);
          if (data.success) {
            const formatted = data.history.map(h => ({
              ...h,
              time: new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            }));
            setHistory(formatted.slice(-20)); // show last 20 for a better chart

            // Instantly update UI if backend confirms recall
            if (data.isRecalled && resp.currentStatus !== 6) {
              setResp(prev => ({ ...prev, currentStatus: 6 }));
            }
          }
        } catch (e) {
          console.error("Failed to fetch live updates", e);
        }
      };

      fetchHistory();
      interval = setInterval(fetchHistory, 5000); // Always keep polling
    }
    return () => clearInterval(interval);
  }, [resp?.valid, batchId]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResp(null);
    setErr(null);
    setHistory([]);
    try {
      const { data } = await verifyBatch({ batchId, qrPayload });
      setResp(data);
    } catch (error) {
      setErr(error?.response?.data || { message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBatchId('');
    setQrPayload('');
    setResp(null);
    setErr(null);
    setHistory([]);
    localStorage.removeItem("consumerForm");
  };

  const isRecalled = resp?.currentStatus === 6 || resp?.currentStatus === "Recalled";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-800 flex justify-center items-start pt-16 px-4 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl w-full bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8"
      >
        <h2 className="text-3xl font-semibold text-center text-white mb-6 flex items-center justify-center gap-2">
          <ShieldCheck className="text-blue-400" /> Verify Medicine Batch
        </h2>

        <form onSubmit={submit} className="space-y-4 max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-1 text-sm">Batch ID</label>
              <input
                required
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                className="w-full border border-gray-600 bg-white/5 text-white placeholder-gray-500 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Ex: BATCH_001"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1 text-sm">QR Payload</label>
              <input
                required
                value={qrPayload}
                onChange={(e) => setQrPayload(e.target.value)}
                className="w-full border border-gray-600 bg-white/5 text-white placeholder-gray-500 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Paste QR Hash"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-center pt-2">
            <button
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-blue-500/30"
            >
              {loading ? <RefreshCcw className="animate-spin" size={18} /> : <Search size={18} />}
              {loading ? 'Verifying...' : 'Verify Batch'}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 border border-gray-500 hover:bg-white/10 text-gray-300 px-6 py-2 rounded-full transition"
            >
              <RefreshCcw size={18} /> Reset
            </button>
          </div>
        </form>

        <AnimatePresence>
          {err && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8 bg-red-900/30 border border-red-600 text-red-200 p-4 rounded-xl backdrop-blur-sm flex items-center gap-3"
            >
              <AlertTriangle className="text-red-500 shrink-0" />
              <p className="text-sm">{err.message || "Verification failed. Check ID and Payload."}</p>
            </motion.div>
          )}

          {resp && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 space-y-8"
            >
              {/* Alert Banner */}
              {isRecalled ? (
                <div className="bg-red-600/20 border-2 border-red-500 p-6 rounded-2xl flex items-center gap-6 animate-pulse">
                  <div className="bg-red-500 p-3 rounded-full">
                    <AlertTriangle className="text-white" size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-red-400">BATCH RECALLED!</h3>
                    <p className="text-red-200">This medicine has been flagged as UNSAFE due to temperature anomalies. Do not consume!</p>
                  </div>
                </div>
              ) : resp.valid && (
                <div className="bg-green-600/20 border-2 border-green-500/50 p-6 rounded-2xl flex items-center gap-6">
                  <div className="bg-green-500 p-3 rounded-full">
                    <CheckCircle className="text-white" size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-green-400">MEDICINE GENUINE</h3>
                    <p className="text-green-200">The batch ID and QR hash match our secure blockchain records.</p>
                  </div>
                </div>
              )}

              {/* Data Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <BatchCard title="Medicine Name" className="bg-white/5">{resp.medicineName || 'Unknown'}</BatchCard>
                <BatchCard title="Current Status" className={isRecalled ? "text-red-400 font-bold" : "text-blue-400"}>
                  {isRecalled ? '🚩 RECALLED' : (resp.currentStatus || 'Unknown')}
                </BatchCard>
                <BatchCard title="Created At">{resp.createdAt ? new Date(Number(resp.createdAt) * 1000).toLocaleDateString() : '-'}</BatchCard>
              </div>

              {resp.qrImage && (
                <div className="flex flex-col items-center gap-4 bg-white/5 p-8 rounded-2xl border border-white/10 shadow-inner">
                  <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-widest">Product QR Code</h4>
                  <img src={resp.qrImage} alt="QR Code" className="w-48 h-48 rounded-xl border-4 border-white/20 shadow-2xl bg-white p-2" />
                  <p className="text-xs text-gray-400">Scan this code to verify authenticity anywhere</p>
                </div>
              )}

              {/* Temperature Chart */}
              {resp.valid && (
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xl font-semibold flex items-center gap-2">
                      <Thermometer className="text-orange-400" /> Temperature History
                    </h4>
                    <span className={`text-xs px-3 py-1 rounded-full ring-1 ${
                      isRecalled
                        ? 'bg-red-500/10 text-red-400 ring-red-500/30 animate-pulse'
                        : 'bg-white/5 text-gray-400 ring-white/10'
                    }`}>
                      {isRecalled ? '🚨 Recalled — Monitoring Active' : 'Live Updates Active'}
                    </span>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={history}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                        <XAxis dataKey="time" stroke="#9CA3AF" fontSize={10} tickMargin={10} />
                        <YAxis stroke="#9CA3AF" fontSize={10} domain={[10, 50]} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                          labelStyle={{ color: '#9CA3AF' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="temperature"
                          stroke={isRecalled ? "#EF4444" : "#3B82F6"}
                          strokeWidth={3}
                          dot={{ r: 4, fill: isRecalled ? "#EF4444" : "#3B82F6", strokeWidth: 0 }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                          animationDuration={500}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {history.length === 0 && (
                    <div className="text-center py-10 text-gray-500 italic">
                      No sensor data recorded for this batch yet.
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
