'use client';

import { useState } from 'react';
import { BrowserProvider, Contract, formatEther, parseEther } from 'ethers';

declare global {
interface Window {
ethereum?: {
request: (args: {
method: string;
params?: unknown[];
}) => Promise<unknown>;
};
}
}

const CONTRACT_ADDRESS = '0xf8309BA60f5E99356421b776aAd79538F63EA270';

const ABI = [
'function balances(address) view returns (uint256)',
'function totalDeposits() view returns (uint256)',
'function deposit() payable',
'function withdraw(uint256 amount)',
];

export default function Home() {
const [account, setAccount] = useState('');
const [balance, setBalance] = useState('0.00');
const [totalDeposits, setTotalDeposits] = useState('0.00');
const [amount, setAmount] = useState('');
const [loading, setLoading] = useState(false);
const [status, setStatus] = useState('');

async function getContract() {
if (!window.ethereum) {
throw new Error('Please install MetaMask first.');
}

const chainId = await window.ethereum.request({
  method: 'eth_chainId',
});

if (chainId !== '0xaa36a7') {
  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0xaa36a7' }],
  });
}

const provider = new BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

return new Contract(CONTRACT_ADDRESS, ABI, signer);

}

async function refreshBalances(walletAddress: string) {
const contract = await getContract();

const userBalance = await contract.balances(walletAddress);
const deposits = await contract.totalDeposits();

setBalance(Number(formatEther(userBalance)).toFixed(4));
setTotalDeposits(Number(formatEther(deposits)).toFixed(4));

}

async function connectWallet() {
if (!window.ethereum) {
setStatus('Please install MetaMask first.');
return;
}

try {
  setStatus('Connecting wallet...');

  // Request wallet permission first.
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  }) as string[];

  if (!accounts || accounts.length === 0) {
    throw new Error('No wallet account found.');
  }

  setAccount(accounts[0]);

  // Connect to the contract after wallet permission is granted.
  await refreshBalances(accounts[0]);

  setStatus('Wallet connected successfully!');
} catch (error) {
  console.error(error);
  setStatus(
    error instanceof Error
      ? error.message
      : 'Wallet connection failed.'
  );
}

}

async function depositETH() {
if (!account) {
setStatus('Please connect your wallet first.');
return;
}

try {
  if (!amount || Number(amount) <= 0) {
    setStatus('Enter a valid ETH amount.');
    return;
  }

  setLoading(true);
  setStatus('Please confirm the deposit in MetaMask...');

  const contract = await getContract();

  const tx = await contract.deposit({
    value: parseEther(amount),
  });

  setStatus('Deposit submitted. Waiting for confirmation...');

  await tx.wait();

  await refreshBalances(account);

  setAmount('');
  setStatus('Deposit successful!');
} catch (error) {
  console.error(error);
  setStatus(
    error instanceof Error ? error.message : 'Deposit failed.'
  );
} finally {
  setLoading(false);
}

}

async function withdrawETH() {
if (!account) {
setStatus('Please connect your wallet first.');
return;
}

try {
  if (!amount || Number(amount) <= 0) {
    setStatus('Enter a valid ETH amount.');
    return;
  }

  setLoading(true);
  setStatus('Please confirm the withdrawal in MetaMask...');

  const contract = await getContract();

  const tx = await contract.withdraw(parseEther(amount));

  setStatus('Withdrawal submitted. Waiting for confirmation...');

  await tx.wait();

  await refreshBalances(account);

  setAmount('');
  setStatus('Withdrawal successful!');
} catch (error) {
  console.error(error);
  setStatus(
    error instanceof Error ? error.message : 'Withdrawal failed.'
  );
} finally {
  setLoading(false);
}

}

return (
<main className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
<div className="max-w-6xl mx-auto">

    <header className="flex justify-between items-center mb-16">
      <h1 className="text-2xl font-bold text-cyan-400">
        Mini DeFi Vault
      </h1>

      <button
        onClick={connectWallet}
        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-5 py-3 rounded-xl"
      >
        {account
          ? `${account.slice(0, 6)}...${account.slice(-4)}`
          : 'Connect Wallet'}
      </button>
    </header>

    <section className="mb-12">
      <p className="text-cyan-400 mb-3">
        DECENTRALIZED FINANCE
      </p>

      <h2 className="text-4xl md:text-6xl font-bold mb-5">
        Your assets.
        <br />
        Your control.
      </h2>

      <p className="text-slate-400 text-lg">
        A simple and secure place to deposit and manage your ETH.
      </p>
    </section>

    <section className="grid md:grid-cols-2 gap-6 mb-10">

      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
        <p className="text-slate-400 mb-4">
          Your Vault Balance
        </p>
        <h3 className="text-4xl font-bold">
          {balance} ETH
        </h3>
        <p className="text-slate-500 mt-3">
          Your deposited balance
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
        <p className="text-slate-400 mb-4">
          Total Deposits
        </p>
        <h3 className="text-4xl font-bold">
          {totalDeposits} ETH
        </h3>
        <p className="text-slate-500 mt-3">
          Total assets deposited in the vault
        </p>
      </div>

    </section>

    <section className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
      <h3 className="text-2xl font-bold mb-3">
        Manage Your Vault
      </h3>

      <p className="text-slate-400 mb-6">
        Connect your wallet to deposit or withdraw ETH.
      </p>

      <input
        type="number"
        min="0"
        step="any"
        placeholder="Enter amount in ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 mb-5 text-white outline-none focus:border-cyan-400"
      />

      <div className="flex flex-wrap gap-4">

        <button
          onClick={connectWallet}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-6 py-3 rounded-xl"
        >
          {account ? 'Wallet Connected' : 'Connect Wallet'}
        </button>

        <button
          onClick={depositETH}
          disabled={!account || loading}
          className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-400 text-slate-950 font-semibold px-6 py-3 rounded-xl"
        >
          {loading ? 'Processing...' : 'Deposit ETH'}
        </button>

        <button
          onClick={withdrawETH}
          disabled={!account || loading}
          className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl"
        >
          {loading ? 'Processing...' : 'Withdraw ETH'}
        </button>

      </div>

      {status && (
        <p className="mt-6 text-cyan-400 break-words">
          {status}
        </p>
      )}
    </section>

    <footer className="text-center text-slate-500 mt-16">
      Mini DeFi Vault | Built with Next.js, Solidity and Ethers.js
      <p className="mt-2 text-sm">
        Sepolia Testnet
      </p>
    </footer>

  </div>
</main>

);
}