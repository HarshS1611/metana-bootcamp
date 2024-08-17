import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [fromAddress, setFromAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [erc20Contract, setERC20Contract] = useState('');
  const [erc721Contract, setERC721Contract] = useState('');

  const handleSendETH = async () => {
    try {
      const response = await axios.post('http://localhost:3001/sendETH', {
        fromAddress,
        toAddress,
        amount,
        privateKey
      });
      console.log('ETH sent! Transaction hash:', response.data.txHash);
    } catch (error) {
      console.error('Error sending ETH:', error);
    }
  };

  const handleTransferERC20 = async () => {
    try {
      const response = await axios.post('http://localhost:3001/transferERC20', {
        contractAddress: erc20Contract,
        fromAddress,
        toAddress,
        amount,
        privateKey
      });
      console.log('ERC20 token transferred! Transaction hash:', response.data.txHash);
    } catch (error) {
      console.error('Error transferring ERC20 token:', error);
    }
  };

  const handleTransferERC721 = async () => {
    try {
      const response = await axios.post('http://localhost:3001/transferERC721', {
        contractAddress: erc721Contract,
        fromAddress,
        toAddress,
        tokenId,
        privateKey
      });
      console.log('ERC721 token transferred! Transaction hash:', response.data.txHash);
    } catch (error) {
      console.error('Error transferring ERC721 token:', error);
    }
  };

  return (
    <div>
      <h1>Blockchain Transactions</h1>
      <div>
        <h2>Send ETH</h2>
        <input type="text" placeholder="From Address" value={fromAddress} onChange={(e) => setFromAddress(e.target.value)} />
        <input type="text" placeholder="To Address" value={toAddress} onChange={(e) => setToAddress(e.target.value)} />
        <input type="number" placeholder="Amount (ETH)" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <input type="text" placeholder="Private Key" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} />
        <button onClick={handleSendETH}>Send ETH</button>
      </div>

      <div>
        <h2>Transfer ERC20 Token</h2>
        <input type="text" placeholder="Contract Address" value={erc20Contract} onChange={(e) => setERC20Contract(e.target.value)} />
        <input type="text" placeholder="From Address" value={fromAddress} onChange={(e) => setFromAddress(e.target.value)} />
        <input type="text" placeholder="To Address" value={toAddress} onChange={(e) => setToAddress(e.target.value)} />
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <input type="text" placeholder="Private Key" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} />
        <button onClick={handleTransferERC20}>Transfer ERC20</button>
      </div>

      <div>
        <h2>Transfer ERC721 Token</h2>
        <input type="text" placeholder="Contract Address" value={erc721Contract} onChange={(e) => setERC721Contract(e.target.value)} />
        <input type="text" placeholder="From Address" value={fromAddress} onChange={(e) => setFromAddress(e.target.value)} />
        <input type="text" placeholder="To Address" value={toAddress} onChange={(e) => setToAddress(e.target.value)} />
        <input type="text" placeholder="Token ID" value={tokenId} onChange={(e) => setTokenId(e.target.value)} />
        <input type="text" placeholder="Private Key" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} />
        <button onClick={handleTransferERC721}>Transfer ERC721</button>
      </div>
    </div>
  );
};

export default App;
