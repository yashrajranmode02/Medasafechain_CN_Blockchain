// // src/pages/manufacturerpage.jsx
// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { createBatch } from "../API/api";

// export default function ManufacturerPage() {
//   const [batchId, setBatchId] = useState("");
//   const [medicineName, setMedicineName] = useState("");
//   const [qrPayload, setQrPayload] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [resp, setResp] = useState(null);
//   const [err, setErr] = useState(null);

//   const submit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErr(null);
//     setResp(null);
//     try {
//       const { data } = await createBatch({ batchId, medicineName, qrPayload });
//       setResp(data);
//     } catch (error) {
//       setErr(error?.response?.data || { message: error.message });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-[70vh] flex justify-center items-start pt-10 text-white">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.7 }}
//         className="w-full max-w-3xl p-8 rounded-2xl shadow-lg bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-xl border border-gray-700/40 relative overflow-hidden"
//       >
//         {/* Animated gradient border */}
//         <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 opacity-20 blur-xl animate-pulse"></div>

//         <motion.h2
//           className="text-3xl font-semibold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.2 }}
//         >
//           Manufacturer — Create New Batch
//         </motion.h2>

//         <form onSubmit={submit} className="space-y-6 relative z-10">
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//           >
//             <label className="block text-sm font-medium mb-1">Batch ID</label>
//             <input
//               required
//               value={batchId}
//               onChange={(e) => setBatchId(e.target.value)}
//               className="w-full px-4 py-3 rounded-md bg-gray-800/60 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
//               placeholder="Amoxicillin250mg_Batch003"
//             />
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//           >
//             <label className="block text-sm font-medium mb-1">
//               Medicine Name
//             </label>
//             <input
//               required
//               value={medicineName}
//               onChange={(e) => setMedicineName(e.target.value)}
//               className="w-full px-4 py-3 rounded-md bg-gray-800/60 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-400 outline-none transition-all"
//               placeholder="Amoxicillin 250mg"
//             />
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5 }}
//           >
//             <label className="block text-sm font-medium mb-1">QR Payload</label>
//             <input
//               required
//               value={qrPayload}
//               onChange={(e) => setQrPayload(e.target.value)}
//               className="w-full px-4 py-3 rounded-md bg-gray-800/60 border border-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-400 outline-none transition-all"
//               placeholder="Amoxicillin250mg_Batch003_QRData"
//             />
//           </motion.div>

//           <div className="flex gap-4 pt-4">
//             <motion.button
//               type="submit"
//               disabled={loading}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className={`flex-1 py-3 rounded-md text-white font-semibold transition-all ${
//                 loading
//                   ? "bg-gray-600 cursor-not-allowed"
//                   : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-lg hover:shadow-blue-500/30"
//               }`}
//             >
//               {loading ? "Creating..." : "🚀 Create Batch"}
//             </motion.button>

//             <motion.button
//               type="button"
//               onClick={() => {
//                 setBatchId("");
//                 setMedicineName("");
//                 setQrPayload("");
//                 setResp(null);
//                 setErr(null);
//               }}
//               whileHover={{ scale: 1.05 }}
//               className="px-4 py-3 border border-gray-600 rounded-md hover:bg-gray-700 transition-all"
//             >
//               Reset
//             </motion.button>
//           </div>
//         </form>

//         <div className="mt-8 space-y-4">
//           {err && (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               className="bg-red-600/20 border border-red-500/40 p-4 rounded-lg text-red-300"
//             >
//               <h3 className="font-semibold mb-2">❌ Error</h3>
//               <pre className="text-sm whitespace-pre-wrap">
//                 {JSON.stringify(err, null, 2)}
//               </pre>
//             </motion.div>
//           )}

//           {resp && (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               className="bg-green-600/20 border border-green-500/40 p-4 rounded-lg text-green-300"
//             >
//               <h3 className="font-semibold mb-2">✅ Response</h3>
//               <pre className="text-sm whitespace-pre-wrap">
//                 {JSON.stringify(resp, null, 2)}
//               </pre>
//             </motion.div>
//           )}
//         </div>
//       </motion.div>
//     </div>
//   );
// }
// // src/pages/ManufacturerPage.jsx
// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { createBatch } from "../API/api";
// import BatchCard from "../component/BatchCard";
// import { ShieldPlus, RefreshCcw, Rocket } from "lucide-react";

// export default function ManufacturerPage() {
//   const [batchId, setBatchId] = useState("");
//   const [medicineName, setMedicineName] = useState("");
//   const [qrPayload, setQrPayload] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [resp, setResp] = useState(null);
//   const [err, setErr] = useState(null);

//   const submit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErr(null);
//     setResp(null);
//     try {
//       const { data } = await createBatch({ batchId, medicineName, qrPayload });
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
//           <ShieldPlus className="text-blue-400" /> Manufacturer — Create Batch
//         </h2>

//         <form onSubmit={submit} className="space-y-4">
//           <div>
//             <label className="block text-gray-300 mb-1">Batch ID</label>
//             <input
//               required
//               value={batchId}
//               onChange={(e) => setBatchId(e.target.value)}
//               className="w-full border border-gray-600 bg-white/10 text-white placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//               placeholder="e.g., AMX250_BATCH_001"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-300 mb-1">Medicine Name</label>
//             <input
//               required
//               value={medicineName}
//               onChange={(e) => setMedicineName(e.target.value)}
//               className="w-full border border-gray-600 bg-white/10 text-white placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//               placeholder="e.g., Amoxicillin 250mg"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-300 mb-1">QR Payload</label>
//             <input
//               required
//               value={qrPayload}
//               onChange={(e) => setQrPayload(e.target.value)}
//               className="w-full border border-gray-600 bg-white/10 text-white placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//               placeholder="Paste QR Data"
//             />
//           </div>

//           <div className="flex gap-3 justify-center">
//             <button
//               disabled={loading}
//               className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-md font-medium shadow-lg hover:shadow-blue-500/30"
//             >
//               <Rocket size={18} />
//               {loading ? "Creating..." : "Create Batch"}
//             </button>

//             <button
//               type="button"
//               onClick={() => {
//                 setBatchId("");
//                 setMedicineName("");
//                 setQrPayload("");
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
//               <pre className="text-sm whitespace-pre-wrap">
//                 {JSON.stringify(err, null, 2)}
//               </pre>
//             </motion.div>
//           )}

//           {resp && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="space-y-4 mt-4"
//             >
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <BatchCard title="Batch ID">
//                   {JSON.parse(resp.qrPayload)?.batchId || "-"}
//                 </BatchCard>

//                 <BatchCard title="Message">{resp.message || "-"}</BatchCard>
//                 <BatchCard title="Transaction Hash">{resp.txHash || "-"}</BatchCard>
//                 <BatchCard title="Status">Success ✅</BatchCard>
//               </div>

//               <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-4 rounded-md text-gray-200">
//                 <h4 className="font-semibold mb-2 text-blue-300">Raw Response</h4>
//                 <pre className="overflow-x-auto max-h-60 text-sm">
//                   {JSON.stringify(resp, null, 2)}
//                 </pre>
//               </div>
//             </motion.div>
//           )}
//           {resp?.qrImage && (
//           <div className="flex justify-center mt-4">
//             <img
//               src={resp.qrImage}
//               alt="QR Code"
//               className="rounded-xl border border-white/30 shadow-lg max-w-[200px]"
//             />
//           </div>
//         )}
        

//         </div>
//       </motion.div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createBatch } from "../API/api";
import BatchCard from "../component/BatchCard";
import { ShieldPlus, RefreshCcw, Rocket } from "lucide-react";

export default function ManufacturerPage() {
  const [batchId, setBatchId] = useState("");
  const [medicineName, setMedicineName] = useState("");
  const [qrPayload, setQrPayload] = useState("");
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState(null);
  const [err, setErr] = useState(null);

  // 🧠 Load saved data when page loads
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("manufacturerForm"));
    if (saved) {
      setBatchId(saved.batchId || "");
      setMedicineName(saved.medicineName || "");
      setQrPayload(saved.qrPayload || "");
    }
  }, []);

  // 💾 Save data automatically whenever input changes
  useEffect(() => {
    localStorage.setItem(
      "manufacturerForm",
      JSON.stringify({ batchId, medicineName, qrPayload })
    );
  }, [batchId, medicineName, qrPayload]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setResp(null);
    try {
      const { data } = await createBatch({ batchId, medicineName, qrPayload });
      setResp(data);
    } catch (error) {
      setErr(error?.response?.data || { message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBatchId("");
    setMedicineName("");
    setQrPayload("");
    setResp(null);
    setErr(null);
    localStorage.removeItem("manufacturerForm"); // clear saved data too
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-800 flex justify-center items-start pt-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8"
      >
        <h2 className="text-3xl font-semibold text-center text-white mb-6 flex items-center justify-center gap-2">
          <ShieldPlus className="text-blue-400" /> Manufacturer — Create Batch
        </h2>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Batch ID</label>
            <input
              required
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              className="w-full border border-gray-600 bg-white/10 text-white placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="e.g., AMX250_BATCH_001"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Medicine Name</label>
            <input
              required
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              className="w-full border border-gray-600 bg-white/10 text-white placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="e.g., Amoxicillin 250mg"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">QR Payload</label>
            <input
              required
              value={qrPayload}
              onChange={(e) => setQrPayload(e.target.value)}
              className="w-full border border-gray-600 bg-white/10 text-white placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Paste QR Data"
            />
          </div>

          <div className="flex gap-3 justify-center">
            <button
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-md font-medium shadow-lg hover:shadow-blue-500/30"
            >
              <Rocket size={18} />
              {loading ? "Creating..." : "Create Batch"}
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
              <pre className="text-sm whitespace-pre-wrap">
                {JSON.stringify(err, null, 2)}
              </pre>
            </motion.div>
          )}

          {resp && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4 mt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BatchCard title="Batch ID">
                  {JSON.parse(resp.qrPayload)?.batchId || "-"}
                </BatchCard>

                <BatchCard title="Message">{resp.message || "-"}</BatchCard>
                <BatchCard title="Transaction Hash">{resp.txHash || "-"}</BatchCard>
                <BatchCard title="Status">Success ✅</BatchCard>
              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-4 rounded-md text-gray-200">
                <h4 className="font-semibold mb-2 text-blue-300">Raw Response</h4>
                <pre className="overflow-x-auto max-h-60 text-sm">
                  {JSON.stringify(resp, null, 2)}
                </pre>
              </div>
            </motion.div>
          )}

          {resp?.qrImage && (
            <div className="flex justify-center mt-4">
              <img
                src={resp.qrImage}
                alt="QR Code"
                className="rounded-xl border border-white/30 shadow-lg max-w-[200px]"
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
