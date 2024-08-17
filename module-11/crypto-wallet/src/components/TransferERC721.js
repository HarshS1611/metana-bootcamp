import React, { useState } from 'react';
import { LegacyTransaction } from '@ethereumjs/tx';
import { bufferToHex, toBuffer } from 'ethereumjs-util';
import { Common } from '@ethereumjs/common';
import axios from 'axios';

const INFURA_URL = process.env.REACT_APP_API_URL;
const chain = 'sepolia';

const TransferERC721 = ({ account }) => {
  const [contractAddress, setContractAddress] = useState('');
  const [recipient, setRecipient] = useState('');
  const [tokenId, setTokenId] = useState('');

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

    // Encode ERC721 safeTransferFrom data
    const methodId = '0x42842e0e'; // Keccak-256 hash of "safeTransferFrom(address,address,uint256)" and take first 4 bytes
    const fromPadded = account.slice(2).padStart(64, '0');
    const recipientPadded = recipient.slice(2).padStart(64, '0');
    const tokenIdHex = parseInt(tokenId).toString(16).padStart(64, '0');
    const data = methodId + fromPadded + recipientPadded + tokenIdHex;

    const common = new Common({ chain });
    const txParams = {
      nonce: bufferToHex(toBuffer(nonce)),
      gasPrice: bufferToHex(toBuffer(gasPrice)),
      gasLimit: bufferToHex(toBuffer(150000)), // Estimate the gas limit accordingly
      to: contractAddress,
      value: '0x0',
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
      <h2>Transfer ERC721 Token</h2>
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
        placeholder="Token ID"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
      />
      <button onClick={sendTransaction}>Transfer ERC721</button>
    </div>
  );
};

export default TransferERC721;
