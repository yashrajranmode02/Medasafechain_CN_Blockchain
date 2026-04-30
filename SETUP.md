# 🚀 MediSafeChain - Complete Setup Guide

## 📋 Project Overview
**MediSafeChain** - A blockchain-powered medicine supply chain tracking system ensuring authenticity and traceability from Manufacturer → Distributor → Chemist.

## 🏗️ Architecture Overview

### Component Interactions:
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │◄──►│     Backend      │◄──►│   Blockchain    │
│   (React)       │    │ (Node.js/Express)│    │   (Hardhat)     │
│                 │    │                  │    │                 │
│ - User Interface│    │ - REST API       │    │ - Smart Contract│
│ - QR Scanning   │    │ - Blockchain Svc │    │ - Role-based AC │
│ - Role Mgmt     │    │ - MongoDB        │    │ - Event Logs    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🔧 Prerequisites
- Node.js v18+ 
- MongoDB (local or cloud)
- Git
- Text editor (VS Code recommended)

---

## 📦 Installation & Setu

### 1️⃣ **Blockchain Setup**

```powershell
cd blockchain

# Install dependencies
npm install

# Verify installation
npm run compile
```

**Dependencies included:**
- `hardhat ^3.0.6` - Ethereum development environment
- `@nomicfoundation/hardhat-ethers ^4.0.1` - Ethers.js integration
- `@openzeppelin/contracts ^5.4.0` - Secure smart contracts
- `ethers ^5.8.0` - Ethereum library
- `dotenv ^17.2.2` - Environment variables

### 2️⃣ **Backend Setup**

```powershell
cd ../backend

# Install dependencies  
npm install

# Copy environment template
cp env.template .env

# Edit .env with your settings
notepad .env
```

**Dependencies included:**
- `express ^4.18.2` - Web framework
- `mongoose ^8.0.3` - MongoDB ODM
- `ethers ^6.8.1` - Blockchain interaction
- `jsonwebtoken ^9.0.2` - JWT authentication
- `bcryptjs ^2.4.3` - Password hashing
- `cors ^2.8.5` - CORS middleware
- `helmet ^7.1.0` - Security headers
- `qrcode ^1.5.3` - QR code generation
- `dotenv ^16.3.1` - Environment management

### 3️⃣ **Frontend Setup** *(Create this directory)*

```powershell
cd ..
npm create vite@latest frontend -- --template react
cd frontend
npm install

# Install additional dependencies
npm install axios react-router-dom @headlessui/react @heroicons/react
npm install react-qr-code html5-qrcode
```

---

## 🚀 **Running the Project Locally**

### **Step 1: Start Hardhat Local Network**
```powershell
cd blockchain
npm run node
# Keep this terminal running - it's your local blockchain
```

### **Step 2: Deploy Smart Contract**
*(In a new terminal)*
```powershell
cd blockchain
npm run deploy-local
# This deploys BatchRegistry and updates .env with contract address
```

### **Step 3: Test Contract (Optional)**
```powershell
npm run deploy-demo
# Demonstrates creating batches and transfers
```

### **Step 4: Configure Backend Environment**
```powershell
cd ../backend

# Edit .env file:
# - Set CONTRACT_ADDRESS from blockchain deployment
# - Set RPC_URL=http://localhost:8545
# - Configure MongoDB URI
# - Set JWT_SECRET
```

### **Step 5: Start Backend Server**
```powershell
cd backend
npm run dev
# Backend starts on http://localhost:3000
```

### **Step 6: Start Frontend** *(When ready)*
```powershell
cd ../frontend
npm run dev  
# Frontend starts on http://localhost:5173
```

---

## 🔗 **Contract Integration**

### **ABI File Location**
After deployment, the ABI is automatically saved to:
```
blockchain/artifacts/contracts/BatchRegistry.sol/BatchRegistry.json
```

### **Backend Environment Example**
```bash
# .env file in backend/
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/medisafechain
JWT_SECRET=your-super-secret-jwt-key-at-least-32-chars
RPC_URL=http://localhost:8545
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
CONTRACT_ABI_PATH=../blockchain/artifacts/contracts/BatchRegistry.sol/BatchRegistry.json
```

---

## 🧪 **Testing the Integration**

### **1. Health Check**
```powershell
curl http://localhost:3000/health
```

### **2. Create Test Batch**
```powershell
curl -X POST http://localhost:3000/api/batches \
  -H "Content-Type: application/json" \
  -d '{
    "batchId": "MED-001", 
    "productName": "Paracetamol 500mg",
    "mfgDate": "2025-01-01",
    "expDate": "2027-01-01"
  }'
```

### **3. Verify Batch**
```powershell
curl http://localhost:3000/api/verify/MED-001
```

---

## 📁 **Project Structure**
```
MediSafeChain/
├── blockchain/                  # Smart contracts & Hardhat config
│   ├── contracts/
│   │   └── BatchRegistry.sol   # Main smart contract
│   ├── scripts/
│   │   ├── deploy.js           # Deployment script
│   │   └── demo-interact.js    # Demo interactions
│   ├── hardhat.config.js       # Hardhat configuration
│   └── package.json
├── backend/                     # Node.js API server
│   ├── src/
│   │   ├── services/
│   │   │   └── blockchainService.js  # Blockchain integration
│   │   ├── routes/             # API endpoints
│   │   ├── models/             # MongoDB schemas
│   │   └── index.js            # Main server file
│   └── package.json
├── frontend/                    # React UI (to be created)
└── docs/                        # Documentation
```

---

## 🔄 **Development Workflow**

1. **Modify Smart Contract** → Recompile → Redeploy → Update backend config
2. **Backend Changes** → Restart server → Test API endpoints  
3. **Frontend Changes** → Hot reload → Test UI interactions

---

## 🔐 **Security Notes**

- ✅ Smart contract uses OpenZeppelin's AccessControl
- ✅ Role-based permissions (Manufacturer, Distributor, Chemist, Regulator)
- ✅ Input validation and event logging
- ⚠️ **Never commit private keys to version control**
- ⚠️ Use separate environments for dev/staging/production

---

## 🆘 **Common Issues & Solutions**

### **"Contract not deployed" error**
- Ensure Hardhat node is running
- Redeploy contract: `npm run deploy-local`
- Update backend .env with new contract address

### **"Provider not connected" error**  
- Check RPC_URL in backend .env
- Ensure Hardhat node is running on http://localhost:8545

### **MongoDB connection issues**
- Install MongoDB locally or use MongoDB Atlas
- Update MONGODB_URI in backend .env

---

## 🎯 **Next Steps After Blockchain Setup**

1. ✅ Smart contract deployed and tested
2. ✅ Backend service connected to blockchain  
3. ⏭️ **Create frontend React app**
4. ⏭️ **Implement QR code generation/scanning**
5. ⏭️ **Add user authentication**
6. ⏭️ **Build role-based dashboards**
7. ⏭️ **Deploy to production networks**