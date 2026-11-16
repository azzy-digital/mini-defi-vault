Mini DeFi Vault

A full-stack decentralised finance (DeFi) application that allows users to connect their MetaMask wallets, deposit Sepolia ETH, view their vault balances, and withdraw their funds through a smart contract.

Live Demo

https://mini-defi-vault-beryl.vercel.app

GitHub Repository

https://github.com/azzy-digital/mini-defi-vault

Smart Contract

- Network: Sepolia Testnet
- Contract Address: "0xf8309BA60f5E99356421b776aAd79538F63EA270"
- Etherscan: https://sepolia.etherscan.io/address/0xf8309BA60f5E99356421b776aAd79538F63EA270

Features

- Connect wallet using MetaMask.
- Deposit ETH into the vault.
- Withdraw deposited ETH.
- View individual wallet balances.
- View the total amount deposited in the vault.
- Interact with a smart contract deployed on the Sepolia testnet.

Technologies Used

- Solidity: Smart contract development.
- Foundry: Smart contract compilation and testing.
- Next.js: Frontend framework.
- React and TypeScript: User interface development.
- Ethers.js: Blockchain interaction.
- MetaMask: Wallet connection and transaction approval.
- Sepolia: Ethereum test network.
- Vercel: Frontend deployment.
- GitHub: Version control and project hosting.

Getting Started

Prerequisites

Before running the project locally, ensure you have:

- Node.js installed.
- npm installed.
- Git installed.
- MetaMask browser extension.
- Sepolia test ETH for testing transactions.

Installation

Clone the repository:

git clone https://github.com/azzy-digital/mini-defi-vault.git

Navigate into the project directory:

cd mini-defi-vault

Install dependencies:

npm install

Start the development server:

npm run dev

Open your browser and visit:

http://localhost:3000

Smart Contract Testing

The smart contract was developed and tested using Foundry.

To compile the contract:

forge build

To run the tests:

forge test

The tests cover:

- Successful deposits.
- Successful withdrawals.
- Rejection of zero-value deposits.
- Rejection of withdrawals exceeding the user's balance.

Security Considerations

- Users connect their wallets through MetaMask.
- The smart contract checks that deposits are greater than zero.
- Withdrawals are restricted to the user's available balance.
- Private keys and sensitive environment variables should never be committed to GitHub.
- Transactions are carried out on the Sepolia test network.

Deployment

The smart contract is deployed on the Sepolia testnet, while the frontend is hosted on Vercel.

Author

Azzy

Aspiring Blockchain Developer | Solidity & Web3

---

This project was developed as part of a practical learning experience in Solidity, smart contract development, and full-stack Web3 application development.
