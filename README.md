# 💊 MediSafeChain CN Blockchain

A **Full Stack Blockchain Project** built to ensure transparency, authenticity, and traceability in the pharmaceutical supply chain.

---

## 🧠 Overview
MediSafeChain connects **manufacturers, distributors, and consumers** through blockchain to prevent counterfeit medicine distribution.  
This project includes:
- A **Smart Contract** for supply chain tracking  
- A **Node.js + Express backend** for APIs  
- A **React + Vite frontend** for user interaction  

---

## 🏗️ Project Structure
MediSafeChain/
│
├── blockchain/ # Contains Solidity contracts and Hardhat setup
├── Backends/ # Node.js + Express server and API routes
└── frontend/ # React frontend (Vite)

---

## ⚙️ Prerequisites

Make sure you have these installed:
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/)
- [Hardhat](https://hardhat.org/)
- [Metamask](https://metamask.io/) (for frontend testing)

---

## 🚀 How to Run the Project

### 🧩 1. Start the Blockchain Node
Open a terminal and run:

cd MediSafeChain/blockchain
npx hardhat node
his starts a local blockchain at http://127.0.0.1:8545/

You’ll get a list of pre-funded accounts (with 10,000 ETH each).
⚒️ 2. Deploy the Smart Contract
cd MediSafeChain/blockchain
npx hardhat run scripts/deploy.js --network localhost
This will compile and deploy the contract to your local Hardhat blockchain.

🧠 3. Setup Backend
In a new terminal:
cd MediSafeChain/Backends
node scripts/grantRoles.js
node scripts/grantConsumerRole.js

Then start your backend server:
node server.js
The backend connects with your deployed smart contract and provides APIs for the frontend.
💻 4. Start the Frontend

In a third terminal:

cd MediSafeChain/frontend
npm install
npm run dev
The frontend will start (usually on http://localhost:5173
).
You can now interact with the blockchain through the UI.

🧾 Notes

Make sure your Hardhat node (npx hardhat node) is running before deploying or using backend/frontend.

You may need to connect Metamask to localhost:8545 and import one of the Hardhat private keys for testing.

Backend should automatically pick up the deployed contract address if configured correctly.

---

**Deployed Link:** [https://medi-safe-chain.vercel.app/manufacturer](https://medi-safe-chain.vercel.app/manufacturer)
