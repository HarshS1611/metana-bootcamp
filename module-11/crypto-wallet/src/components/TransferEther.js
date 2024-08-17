import React, { useState } from 'react';
import { LegacyTransaction } from '@ethereumjs/tx';
import { bufferToHex, toBuffer } from 'ethereumjs-util';
import { Common } from '@ethereumjs/common';
import axios from 'axios';

const INFURA_URL = process.env.REACT_APP_API_URL;
const chain = 'sepolia';

const TransferEther = ({ account }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const getTransactionCount = async () => {
    const response = await axios.post(INFURA_URL, {
      jsonrpc: '2.0',
      method: 'eth_getTransactionCount',
      params: [account, 'latest'],
      id: 1
    });
    return parseInt(response.data.result, 16);
  };

  const getGasPrice = async () => {
    const response = await axios.post(INFURA_URL, {
      jsonrpc: '2.0',
      method: 'eth_gasPrice',
      params: [],
      id: 1
    });
    return parseInt(response.data.result, 16);
  };

  const sendTransaction = async () => {
    const nonce = await getTransactionCount();
    const gasPrice = await getGasPrice();
    const value = parseInt(amount) * 1e18; // Convert to Wei

    const common = new Common({ chain });
    const txParams = {
      nonce: bufferToHex(toBuffer(nonce)),
      gasPrice: bufferToHex(toBuffer(gasPrice)),
      gasLimit: bufferToHex(toBuffer(21000)), // Standard gas limit for ETH transfer
      to: recipient,
      value: bufferToHex(toBuffer(value)),
      data: '0x',
    };

    const tx = LegacyTransaction.fromTxData(txParams, { common: new Common({ chain }) });
    const privateKey = toBuffer('YOUR_PRIVATE_KEY'); // Use throwaway private key
    const signedTx = tx.sign(privateKey);
    const serializedTx = signedTx.serialize();
    const rawTx = bufferToHex(serializedTx);

    const response = await axios.post(INFURA_URL, {
      jsonrpc: '2.0',
      method: 'eth_sendRawTransaction',
      params: [rawTx],
      id: 1
    });

    console.log('Transaction Hash:', response.data.result);
  };

  return (
    <div>
      <h2>Transfer Ether</h2>
      <input
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        type="text"
        placeholder="Amount (ETH)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={sendTransaction}>Transfer Ether</button>
    </div>
  );
};

export default TransferEther;
