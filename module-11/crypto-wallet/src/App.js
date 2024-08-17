import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TransferERC20 from './components/TransferERC20';
import TransferERC721 from './components/TransferERC721';
import TransferEther from './components/TransferEther';

const INFURA_URL = process.env.REACT_APP_API_URL;

const App = () => {
  const [account, setAccount] = useState('');

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => setAccount(accounts[0]))
        .catch(err => console.error(err));

      window.ethereum.on('accountsChanged', accounts => {
        setAccount(accounts[0]);
      });
    } else {
      alert('Please install MetaMask to use this app.');
    }
  }, []);

  return (
    <div className="App">
      <h1>Crypto Wallet</h1>
      <p>Connected account: {account}</p>
      <TransferERC20 account={account} />
      <TransferERC721 account={account} />
      <TransferEther account={account} />
    </div>
  );
}

export default App;
