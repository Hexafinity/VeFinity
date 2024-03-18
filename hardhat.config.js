require("@nomicfoundation/hardhat-toolbox");

// You should replace these values with your own
const BSC_TESTNET_RPC_URL = "https://data-seed-prebsc-1-s1.binance.org:8545/";
const BSC_MAINNET_RPC_URL = "https://bsc-dataseed.binance.org/";
const PRIVATE_KEY = "e42725e6eaacfc3c830a37318b9b83ea2e0cae109b15b21a0b81d5f51d1c33e3"; // NEVER share your private key!

module.exports = {
  solidity: "0.8.24",
  networks: {
    // Configuration for BSC Testnet
    bsctestnet: {
      url: BSC_TESTNET_RPC_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 97,
    },
    // Configuration for BSC Mainnet
    bsc: {
      url: BSC_MAINNET_RPC_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 56,
    },
  },
};