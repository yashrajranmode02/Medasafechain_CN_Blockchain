// // src/pages/consumerpage.jsx
// import React, { useState } from 'react';
// import { verifyBatch } from '../API/api';
// import BatchCard from '../component/BatchCard';
// import { motion } from 'framer-motion';
// import { ShieldCheck, RefreshCcw, Search } from 'lucide-react';

// export default function ConsumerPage() {
//   const [batchId, setBatchId] = useState('');
//   const [qrPayload, setQrPayload] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [resp, setResp] = useState(null);
//   const [err, setErr] = useState(null);

//   const submit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setResp(null);
//     setErr(null);
//     try {
//       const { data } = await verifyBatch({ batchId, qrPayload });
//       setResp(data);
//     } catch (error) {
//       setErr(error?.response?.data || { message: error.message });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-800 flex justify-center items-start pt-16 px-4">
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="max-w-4xl w-full bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8"
//       >
//         <h2 className="text-3xl font-semibold text-center text-white mb-6 flex items-center justify-center gap-2">
//           <ShieldCheck className="text-blue-400" /> Verify Medicine Batch
//         </h2>

//         <form onSubmit={submit} className="space-y-4">
//           <div>
//             <label className="block text-gray-300 mb-1">Batch ID</label>
//             <input
//               required
//               value={batchId}
//               onChange={(e) => setBatchId(e.target.value)}
//               className="w-full border border-gray-600 bg-white/10 text-white placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//               placeholder="Enter Batch ID"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-300 mb-1">QR Payload</label>
//             <input
//               required
//               value={qrPayload}
//               onChange={(e) => setQrPayload(e.target.value)}
//               className="w-full border border-gray-600 bg-white/10 text-white placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//               placeholder="Paste QR Payload"
//             />
//           </div>

//           <div className="flex gap-3 justify-center">
//             <button
//               disabled={loading}
//               className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-md font-medium shadow-lg hover:shadow-blue-500/30"
//             >
//               <Search size={18} />
//               {loading ? 'Verifying...' : 'Verify Batch'}
//             </button>

//             <button
//               type="button"
//               onClick={() => {
//                 setBatchId('');
//                 setQrPayload('');
//                 setResp(null);
//                 setErr(null);
//               }}
//               className="flex items-center gap-2 border border-gray-500 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-md transition"
//             >
//               <RefreshCcw size={18} /> Reset
//             </button>
//           </div>
//         </form>

//         <div className="mt-8">
//           {err && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="bg-red-900/30 border border-red-600 text-red-200 p-4 rounded-md backdrop-blur-sm"
//             >
//               <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(err, null, 2)}</pre>
//             </motion.div>
//           )}

//           {resp && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="space-y-4 mt-4"
//             >
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <BatchCard title="Batch ID">{resp.batchId || '-'}</BatchCard>
//                 <BatchCard title="Current Status">{resp.currentStatus || '-'}</BatchCard>
//                 <BatchCard title="Manufacturer">{resp.manufacturer || '-'}</BatchCard>
//                 <BatchCard title="Message">{resp.message || '-'}</BatchCard>
//               </div>

//               <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-4 rounded-md text-gray-200">
//                 <h4 className="font-semibold mb-2 text-blue-300">Raw Response</h4>
//                 <pre className="overflow-x-auto max-h-60 text-sm">{JSON.stringify(resp, null, 2)}</pre>
//               </div>
//             </motion.div>
//           )}
//         </div>
//       </motion.div>
//     </div>
//   );
// }
// src/pages/consumerpage.jsx
import React, { useState, useEffect } from 'react';
import { verifyBatch } from '../API/api';
import BatchCard from '../component/BatchCard';
import { motion } from 'framer-motion';
import { ShieldCheck, RefreshCcw, Search } from 'lucide-react';

export default function ConsumerPage() {
  const [batchId, setBatchId] = useState('');
  const [qrPayload, setQrPayload] = useState('');
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState(null);
  const [err, setErr] = useState(null);

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

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResp(null);
    setErr(null);
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
    localStorage.removeItem("consumerForm"); // clear saved data too
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-800 flex justify-center items-start pt-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8"
      >
        <h2 className="text-3xl font-semibold text-center text-white mb-6 flex items-center justify-center gap-2">
          <ShieldCheck className="text-blue-400" /> Verify Medicine Batch
        </h2>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Batch ID</label>
            <input
              required
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              className="w-full border border-gray-600 bg-white/10 text-white placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Enter Batch ID"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">QR Payload</label>
            <input
              required
              value={qrPayload}
              onChange={(e) => setQrPayload(e.target.value)}
              className="w-full border border-gray-600 bg-white/10 text-white placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Paste QR Payload"
            />
          </div>

          <div className="flex gap-3 justify-center">
            <button
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-md font-medium shadow-lg hover:shadow-blue-500/30"
            >
              <Search size={18} />
              {loading ? 'Verifying...' : 'Verify Batch'}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 border border-gray-500 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-md transition"
            >
              <RefreshCcw size={18} /> Reset
            </button>
          </div>
        </form>

        <div className="mt-8">
          {err && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-900/30 border border-red-600 text-red-200 p-4 rounded-md backdrop-blur-sm"
            >
              <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(err, null, 2)}</pre>
            </motion.div>
          )}

          {resp && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4 mt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BatchCard title="Batch ID">{resp.batchId || '-'}</BatchCard>
                <BatchCard title="Current Status">{resp.currentStatus || '-'}</BatchCard>
                <BatchCard title="Manufacturer">{resp.manufacturer || '-'}</BatchCard>
                <BatchCard title="Message">{resp.message || '-'}</BatchCard>
              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-4 rounded-md text-gray-200">
                <h4 className="font-semibold mb-2 text-blue-300">Raw Response</h4>
                <pre className="overflow-x-auto max-h-60 text-sm">{JSON.stringify(resp, null, 2)}</pre>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
