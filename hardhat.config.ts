import "@typechain/hardhat"
import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-ethers"
import "hardhat-gas-reporter"
import "dotenv/config"
import "solidity-coverage"
import "hardhat-deploy"
import "hardhat-contract-sizer"
import { HardhatUserConfig } from "hardhat/config"

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || "https://goerli.alchemyapi.io/v2/your-api-key"

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0000000000000000000000000000000000000000000000000000000000000000"

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      blockGasLimit: 30000000,
      gasPrice: 0,
      initialBaseFeePerGas: 0,
      allowUnlimitedContractSize: true,
      accounts: {
        mnemonic: 'explain tackle mirror kit van hammer degree position ginger unfair soup bonus',
        count: 20,
        accountsBalance: '100000000000000000000000',
      },
    },
    goerli: {
        url: GOERLI_RPC_URL,
        accounts: [PRIVATE_KEY],
        chainId: 5,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.17",
      },
    ],
    settings: {
        optimizer: {
            enabled: true,
            runs: 10,
            details: { yul: false },
        },
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
  },
  namedAccounts: {
    deployer: { // will be the default admin for roles
      default: 0
    },
    referenceInstanceSetter: { // will be able to set new FeeDistributor reference instances
      default: 1
    },
    inctanceCreator: {
      default: 2
    },
    assetRecoverer: {
      default: 3
    },
    serviceAddress: { // P2P secure address (cold storage, multisig, etc.)
      default: 4
    },
    nobody: {
      default: 5
    },
  },
}

export default config
