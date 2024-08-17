import React, { useState } from 'react';
import { LegacyTransaction } from '@ethereumjs/tx';
import { bufferToHex, toBuffer } from 'ethereumjs-util';
import { Common } from '@ethereumjs/common';
import axios from 'axios';

const INFURA_URL = process.env.REACT_APP_API_URL;
const chain = 'sepolia';

const TransferERC20 = ({ account }) => {
  const [contractAddress, setContractAddress] = useState('');
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
    const value = '0x0'; // Value is zero for ERC20 transfers

    // Encode ERC20 transfer data
    const methodId = '0xa9059cbb'; // Keccak-256 hash of "transfer(address,uint256)" and take first 4 bytes
    const recipientPadded = recipient.slice(2).padStart(64, '0');
    const amountHex = parseInt(amount).toString(16).padStart(64, '0');
    const data = methodId + recipientPadded + amountHex;

    const common = new Common({ chain });
    const txParams = {
      nonce: bufferToHex(toBuffer(nonce)),
      gasPrice: bufferToHex(toBuffer(gasPrice)),
      gasLimit: bufferToHex(toBuffer(100000)), // Estimate the gas limit accordingly
      to: contractAddress,
      value: value,
      data: data,
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
      <h2>Transfer ERC20 Token</h2>
      <input
        type="text"
        placeholder="Contract Address"
        value={contractAddress}
        onChange={(e) => setContractAddress(e.target.value)}
      />
      <input
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={sendTransaction}>Transfer ERC20</button>
    </div>
  );
};

export default TransferERC20;
