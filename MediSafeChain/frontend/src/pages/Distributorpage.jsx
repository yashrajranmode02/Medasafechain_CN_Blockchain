// // // src/pages/distributorpage.jsx
// // import React, { useState } from "react";
// // import { motion } from "framer-motion";
// // import { updateStatus } from "../API/api";

// // const STATUS_OPTIONS = [
// //   { label: "Created", value: 0 },
// //   { label: "Received", value: 1 },
// //   { label: "In Transit", value: 2 },
// //   { label: "Delivered", value: 3 },
// // ];

// // export default function DistributorPage() {
// //   const [batchId, setBatchId] = useState("");
// //   const [status, setStatus] = useState(1);
// //   const [remarks, setRemarks] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [resp, setResp] = useState(null);
// //   const [err, setErr] = useState(null);

// //   const submit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setErr(null);
// //     setResp(null);
// //     try {
// //       const { data } = await updateStatus({ batchId, status, remarks });
// //       setResp(data);
// //     } catch (error) {
// //       setErr(error?.response?.data || { message: error.message });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-[70vh] flex justify-center items-start pt-10 text-white">
// //       <motion.div
// //         initial={{ opacity: 0, y: 25 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         transition={{ duration: 0.7 }}
// //         className="w-full max-w-3xl p-8 rounded-2xl shadow-lg bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-xl border border-gray-700/40 relative overflow-hidden"
// //       >
// //         {/* Animated glowing border */}
// //         <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 opacity-20 blur-xl animate-pulse"></div>

// //         <motion.h2
// //           className="text-3xl font-semibold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400"
// //           initial={{ opacity: 0 }}
// //           animate={{ opacity: 1 }}
// //           transition={{ delay: 0.2 }}
// //         >
// //           Distributor — Update Batch Status
// //         </motion.h2>

// //         <form onSubmit={submit} className="space-y-6 relative z-10">
// //           {/* Batch ID */}
// //           <motion.div
// //             initial={{ opacity: 0, y: 10 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ delay: 0.3 }}
// //           >
// //             <label className="block text-sm font-medium mb-1">Batch ID</label>
// //             <input
// //               required
// //               value={batchId}
// //               onChange={(e) => setBatchId(e.target.value)}
// //               className="w-full px-4 py-3 rounded-md bg-gray-800/60 border border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400 outline-none transition-all"
// //               placeholder="Enter Batch ID"
// //             />
// //           </motion.div>

// //           {/* Status Dropdown */}
// //           <motion.div
// //             initial={{ opacity: 0, y: 10 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ delay: 0.4 }}
// //           >
// //             <label className="block text-sm font-medium mb-1">Status</label>
// //             <select
// //               value={status}
// //               onChange={(e) => setStatus(Number(e.target.value))}
// //               className="w-full px-4 py-3 rounded-md bg-gray-800/60 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
// //             >
// //               {STATUS_OPTIONS.map((o) => (
// //                 <option key={o.value} value={o.value}>
// //                   {o.label}
// //                 </option>
// //               ))}
// //             </select>
// //           </motion.div>

// //           {/* Remarks */}
// //           <motion.div
// //             initial={{ opacity: 0, y: 10 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ delay: 0.5 }}
// //           >
// //             <label className="block text-sm font-medium mb-1">
// //               Remarks (optional)
// //             </label>
// //             <input
// //               value={remarks}
// //               onChange={(e) => setRemarks(e.target.value)}
// //               className="w-full px-4 py-3 rounded-md bg-gray-800/60 border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
// //               placeholder="e.g., Package handed to courier"
// //             />
// //           </motion.div>

// //           {/* Buttons */}
// //           <div className="flex gap-4 pt-4">
// //             <motion.button
// //               type="submit"
// //               disabled={loading}
// //               whileHover={{ scale: 1.05 }}
// //               whileTap={{ scale: 0.95 }}
// //               className={`flex-1 py-3 rounded-md text-white font-semibold transition-all ${
// //                 loading
// //                   ? "bg-gray-600 cursor-not-allowed"
// //                   : "bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/30"
// //               }`}
// //             >
// //               {loading ? "Updating..." : "⚡ Update Status"}
// //             </motion.button>

// //             <motion.button
// //               type="button"
// //               onClick={() => {
// //                 setBatchId("");
// //                 setStatus(1);
// //                 setRemarks("");
// //                 setResp(null);
// //                 setErr(null);
// //               }}
// //               whileHover={{ scale: 1.05 }}
// //               className="px-4 py-3 border border-gray-600 rounded-md hover:bg-gray-700 transition-all"
// //             >
// //               Reset
// //             </motion.button>
// //           </div>
// //         </form>

// //         {/* Response & Error Display */}
// //         <div className="mt-8 space-y-4">
// //           {err && (
// //             <motion.div
// //               initial={{ opacity: 0, scale: 0.9 }}
// //               animate={{ opacity: 1, scale: 1 }}
// //               className="bg-red-600/20 border border-red-500/40 p-4 rounded-lg text-red-300"
// //             >
// //               <h3 className="font-semibold mb-2">❌ Error</h3>
// //               <pre className="text-sm whitespace-pre-wrap">
// //                 {JSON.stringify(err, null, 2)}
// //               </pre>
// //             </motion.div>
// //           )}

// //           {resp && (
// //             <motion.div
// //               initial={{ opacity: 0, scale: 0.9 }}
// //               animate={{ opacity: 1, scale: 1 }}
// //               className="bg-green-600/20 border border-green-500/40 p-4 rounded-lg text-green-300"
// //             >
// //               <h3 className="font-semibold mb-2">✅ Response</h3>
// //               <pre className="text-sm whitespace-pre-wrap">
// //                 {JSON.stringify(resp, null, 2)}
// //               </pre>
// //             </motion.div>
// //           )}
// //         </div>
// //       </motion.div>
// //     </div>
// //   );
// // }
// // src/pages/DistributorPage.jsx
// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { updateStatus } from "../API/api";
// import BatchCard from "../component/BatchCard";
// import { PackageCheck, RefreshCcw, Send } from "lucide-react";

// export default function DistributorPage() {
//   const [batchId, setBatchId] = useState("");
//   const [status, setStatus] = useState("Received");
//   const [remarks, setRemarks] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [resp, setResp] = useState(null);
//   const [err, setErr] = useState(null);

//   const submit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErr(null);
//     setResp(null);
//     try {
//       const { data } = await updateStatus({ batchId, status, note: remarks });
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
//           <PackageCheck className="text-blue-400" /> Distributor — Update Status
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
//             <label className="block text-gray-300 mb-1">Status</label>
//             <select
//               value={status}
//               onChange={(e) => setStatus(e.target.value)}
//               className="w-full border border-gray-600 bg-white/10 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//             >
//               <option value="Dispatched">Dispatched</option>
//               <option value="InTransit">In Transit</option>
//               <option value="Received">Received</option>
//               <option value="Delivered">Delivered</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-gray-300 mb-1">Remarks (optional)</label>
//             <input
//               value={remarks}
//               onChange={(e) => setRemarks(e.target.value)}
//               className="w-full border border-gray-600 bg-white/10 text-white placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//               placeholder="e.g., Dispatched from central warehouse"
//             />
//           </div>

//           <div className="flex gap-3 justify-center">
//             <button
//               disabled={loading}
//               className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-md font-medium shadow-lg hover:shadow-blue-500/30"
//             >
//               <Send size={18} />
//               {loading ? "Updating..." : "Update Status"}
//             </button>

//             <button
//               type="button"
//               onClick={() => {
//                 setBatchId("");
//                 setStatus("Received");
//                 setRemarks("");
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
//                 <BatchCard title="Batch ID">{batchId}</BatchCard>
//                 <BatchCard title="Status">{status}</BatchCard>
//                 <BatchCard title="Message">{resp.message || "-"}</BatchCard>
//                 <BatchCard title="Transaction Hash">{resp.txHash || "-"}</BatchCard>
//               </div>

//               <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-4 rounded-md text-gray-200">
//                 <h4 className="font-semibold mb-2 text-blue-300">Raw Response</h4>
//                 <pre className="overflow-x-auto max-h-60 text-sm">
//                   {JSON.stringify(resp, null, 2)}
//                 </pre>
//               </div>
//             </motion.div>
//           )}
//         </div>
//       </motion.div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { updateStatus } from "../API/api";
import BatchCard from "../component/BatchCard";
import { PackageCheck, RefreshCcw, Send } from "lucide-react";

export default function DistributorPage() {
  const [batchId, setBatchId] = useState("");
  const [status, setStatus] = useState("Received");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState(null);
  const [err, setErr] = useState(null);

  // 🧠 Load saved data from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("distributorForm"));
    if (saved) {
      setBatchId(saved.batchId || "");
      setStatus(saved.status || "Received");
      setRemarks(saved.remarks || "");
    }
  }, []);

  // 💾 Save data automatically on change
  useEffect(() => {
    localStorage.setItem(
      "distributorForm",
      JSON.stringify({ batchId, status, remarks })
    );
  }, [batchId, status, remarks]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setResp(null);
    try {
      const { data } = await updateStatus({ batchId, status, note: remarks });
      setResp(data);
    } catch (error) {
      setErr(error?.response?.data || { message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBatchId("");
    setStatus("Received");
    setRemarks("");
    setResp(null);
    setErr(null);
    localStorage.removeItem("distributorForm"); // 🧹 also clear saved data
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-800 flex justify-center items-start pt-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8"
      >
        <h2 className="text-3xl font-semibold text-center text-white mb-6 flex items-center justify-center gap-2">
          <PackageCheck className="text-blue-400" /> Distributor — Update Status
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
            <label className="block text-gray-300 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-600 bg-white/10 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              <option value="Dispatched">Dispatched</option>
              <option value="InTransit">In Transit</option>
              <option value="Received">Received</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Remarks (optional)</label>
            <input
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full border border-gray-600 bg-white/10 text-white placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="e.g., Dispatched from central warehouse"
            />
          </div>

          <div className="flex gap-3 justify-center">
            <button
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-md font-medium shadow-lg hover:shadow-blue-500/30"
            >
              <Send size={18} />
              {loading ? "Updating..." : "Update Status"}
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
                <BatchCard title="Batch ID">{batchId}</BatchCard>
                <BatchCard title="Status">{status}</BatchCard>
                <BatchCard title="Message">{resp.message || "-"}</BatchCard>
                <BatchCard title="Transaction Hash">{resp.txHash || "-"}</BatchCard>
              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-4 rounded-md text-gray-200">
                <h4 className="font-semibold mb-2 text-blue-300">Raw Response</h4>
                <pre className="overflow-x-auto max-h-60 text-sm">
                  {JSON.stringify(resp, null, 2)}
                </pre>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
