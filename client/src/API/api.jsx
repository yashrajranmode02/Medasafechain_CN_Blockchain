// // src/API/api.jsx
// import axios from 'axios';

// const api = axios.create({
//   baseURL:  'http://localhost:5000/api',
//   headers: { 'Content-Type': 'application/json' },
//   timeout: 20000,
// });

// export const createBatch = (payload) => api.post('/manufacturer/create', payload);
// export const updateStatus = (payload) => api.post('/distributor/updateStatus', payload);
// export const verifyBatch = (payload) => api.post('/consumer/verify', payload);

// export default api;
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// 🧩 Helper to dynamically add roles
const getHeaders = (role) => ({
  headers: { 'x-role': role },
});

// ✅ Manufacturer: Create batch
export const createBatch = (payload) =>
  api.post('/manufacturer/create', payload, getHeaders('manufacturer'));

// ✅ Distributor: Update batch status
export const updateStatus = (payload) =>
  api.post('/distributor/update', payload, getHeaders('distributor'));

// ✅ Consumer: Verify batch
export const verifyBatch = (payload) =>
  api.post('/consumer/verify', payload, getHeaders('consumer'));

// ✅ NEW: Fetch sensor history
export const getSensorHistory = (batchId) =>
  api.get(`/sensor/history/${batchId}`, getHeaders('consumer'));

// ✅ Auth: Signup
export const signup = (payload) =>
  api.post('/auth/signup', payload);

// ✅ Auth: Login
export const login = (payload) =>
  api.post('/auth/login', payload);

// ✅ DL: Fetch metrics
export const getDLMetrics = () =>
  api.get('/dl/metrics');

export default api;
