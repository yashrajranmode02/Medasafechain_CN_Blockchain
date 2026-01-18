import "@nomicfoundation/hardhat-ethers";
import dotenv from "dotenv";

dotenv.config();

export default {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: process.env.LOCALHOST_RPC_URL || "http://127.0.0.1:8545",
      timeout: 60000,
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/your-project-id",
      accounts:
        process.env.PRIVATE_KEY &&
        process.env.PRIVATE_KEY !== "your_private_key_here"
          ? [process.env.PRIVATE_KEY]
          : [],
      timeout: 60000,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 40000,
  },
};
