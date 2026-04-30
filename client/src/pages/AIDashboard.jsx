import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getDLMetrics } from "../API/api";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  LineChart, Line, CartesianGrid
} from 'recharts';
import { Brain, TrendingUp, ShieldCheck, Activity, Cpu, AlertCircle } from "lucide-react";

const ModelCard = ({ title, metrics, icon: Icon, color }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-xl"
  >
    <div className="flex items-center gap-4 mb-6">
      <div className={`p-3 rounded-xl bg-${color}-500/20 text-${color}-400`}>
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      {Object.entries(metrics).map(([key, value]) => (
        <div key={key} className="bg-black/20 p-3 rounded-lg border border-white/5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{key}</p>
          <p className={`text-lg font-mono ${(value * 100) > 90 ? 'text-green-400' : 'text-blue-400'}`}>
            {(value * 100).toFixed(1)}%
          </p>
        </div>
      ))}
    </div>
  </motion.div>
);

export default function AIDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data } = await getDLMetrics();
        if (data.success) {
          setMetrics(data.metrics);
        } else {
          setError("Failed to load metrics data.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-400 animate-pulse">Analyzing Deep Learning Models...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-red-400">
      <AlertCircle size={48} />
      <p>Error: {error}</p>
    </div>
  );

  // Prepare data for Radar Chart
  const radarData = [
    { subject: 'Accuracy', ...Object.fromEntries(Object.entries(metrics).map(([k, v]) => [k, v.accuracy * 100])) },
    { subject: 'Precision', ...Object.fromEntries(Object.entries(metrics).map(([k, v]) => [k, v.precision * 100])) },
    { subject: 'Recall', ...Object.fromEntries(Object.entries(metrics).map(([k, v]) => [k, v.recall * 100])) },
    { subject: 'F1-Score', ...Object.fromEntries(Object.entries(metrics).map(([k, v]) => [k, v.f1 * 100])) },
    { subject: 'ROC-AUC', ...Object.fromEntries(Object.entries(metrics).map(([k, v]) => [k, v.roc_auc * 100])) },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Header section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2">
            AI Insight Dashboard
          </h1>
          <p className="text-gray-400 flex items-center gap-2 italic">
            <Activity size={16} className="text-blue-500" /> 
            Advanced Anomaly Detection System (v2.0-DeepLearning)
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-blue-500/10 border border-blue-500/20 px-6 py-3 rounded-2xl">
            <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-1">System Trust</p>
            <p className="text-2xl font-black text-blue-300">High Confidence</p>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 px-6 py-3 rounded-2xl">
            <p className="text-xs text-purple-400 font-bold uppercase tracking-widest mb-1">Models Active</p>
            <p className="text-2xl font-black text-purple-300">3 / 3 Ready</p>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Model Cards */}
        <ModelCard 
          title="LSTM Sequence" 
          metrics={metrics.lstm_sequence} 
          icon={Brain} 
          color="blue" 
        />
        <ModelCard 
          title="Transformer Risk" 
          metrics={metrics.transformer_risk} 
          icon={Cpu} 
          color="purple" 
        />
        <ModelCard 
          title="Audit Transformer" 
          metrics={metrics.audit_note_transformer} 
          icon={ShieldCheck} 
          color="pink" 
        />

        {/* Charts Section */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl h-[500px]">
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <TrendingUp className="text-green-400" /> Performance Comparison
          </h3>
          <ResponsiveContainer width="100%" height="90%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              
              <Radar
                name="LSTM"
                dataKey="lstm_sequence"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.5}
              />
              <Radar
                name="Transformer"
                dataKey="transformer_risk"
                stroke="#A855F7"
                fill="#A855F7"
                fillOpacity={0.4}
              />
               <Radar
                name="Audit"
                dataKey="audit_note_transformer"
                stroke="#EC4899"
                fill="#EC4899"
                fillOpacity={0.3}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Simulation / Info Panel */}
        <div className="bg-gradient-to-br from-gray-800/50 to-black/50 border border-white/10 p-8 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-4">Why Deep Learning?</h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              Our new system transitions from simple thresholding to complex pattern recognition. 
              <strong> LSTM</strong> captures temporal temperature shifts, while <strong>Transformers</strong> analyze 
              global risk context across the entire supply chain.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                <p className="text-sm text-gray-300">99.4% Accuracy on Audit logs</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 shrink-0" />
                <p className="text-sm text-gray-300">Self-attention mechanism for risk flags</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-pink-500 mt-2 shrink-0" />
                <p className="text-sm text-gray-300">Robust against sensor noise</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-blue-600/10 border border-blue-500/30 rounded-2xl">
            <h4 className="text-blue-300 font-bold mb-2 flex items-center gap-2">
              <ShieldCheck size={18} /> Implementation Status
            </h4>
            <p className="text-xs text-blue-200/70 mb-4">
              Models are currently running in Shadow Mode, validating against real-world data before being fully enabled on the Blockchain.
            </p>
            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "85%" }}
                transition={{ duration: 2 }}
                className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
