const { Buffer } = require('buffer');
const rlp = require('rlp');
const { FeeMarketEIP1559Transaction } = require('@ethereumjs/tx')
const { bufferToHex, toBuffer } = require('ethereumjs-util');
const { Common, Chain, Hardfork } = require('@ethereumjs/common');
const { bytesToHex } = require('@ethereumjs/util');

const axios = require('axios');
const { loadKZG } = require('kzg-wasm')
const dotenv = require('dotenv');
dotenv.config();

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

const getNonce = async (address) => {
  try {
    const response = await axios.post(`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`, {
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getTransactionCount',
      params: [address, 'pending']
    });
    return response.data.result;
  } catch (error) {
    console.error('Error getting nonce:', error.message);
    throw error;
  }
};

// Function to get gas price
const getGasPrice = async () => {
  try {
    const response = await axios.post(`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`, {
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_gasPrice'
    });
    return response.data.result;
  } catch (error) {
    console.error('Error getting gas price:', error.message);
    throw error;
  }
};

// Function to create and sign a transaction
const signTransaction = async (txParams, privateKey) => {
  // const kzg = await loadKZG();
  const common = new Common({ chain: Chain.Sepolia, hardfork: Hardfork.Cancun })

  const privateKeyBuffer = Buffer.from(privateKey, 'hex');

  const tx = FeeMarketEIP1559Transaction.fromTxData(txParams, { common })

  // const tx = TransactionFactory.fromTxData(txParams, { common });
  const signedTx = tx.sign(privateKeyBuffer);
  // console.log('Signed transaction:', signedTx);
  return signedTx;
};

// Function to send a signed transaction
const sendTransaction = async (signedTx) => {
  try {
    // Convert the signed transaction to RLP encoding and then to a hex string
    const signedTxHex = bytesToHex(signedTx.serialize());

    console.log('Signed transaction hex:', signedTxHex);

    // Post the transaction
    const response = await axios.post(`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`, {
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_sendRawTransaction',
      params: [signedTxHex],
    });
    console.log('Transaction sent:', response);

    

    return response.data.result;
  } catch (error) {
    console.error('Error sending transaction:', error.response ? error.response.data : error.message);
    throw error;
  }
};

const sendETH = async (fromAddress, toAddress, amount, privateKey) => {
  const nonce = await getNonce(fromAddress);
  const gasPrice = await getGasPrice();
  const tx = {
    nonce: `0x${parseInt(nonce, 16).toString(16)}`,
    maxPriorityFeePerGas: '0x635F41',
    maxFeePerGas: '0xDD36E03',
    gasLimit: '0x5208', // 21000 in hex
    to: toAddress,
    value: `0x${(parseFloat(amount) * 1e18).toString(16)}`, // Convert ETH to wei
  };
  console.log('Transaction:', tx);
  const signedTx = await signTransaction(tx, privateKey);
  return sendTransaction(signedTx);
};

const transferERC20 = async (contractAddress, fromAddress, toAddress, amount, privateKey) => {
  const nonce = await getNonce(fromAddress);
  const gasPrice = await getGasPrice();
  const data = `0xa9059cbb${'0'.repeat(24)}${toAddress.replace('0x', '')}${amount.padStart(64, '0')}`;
  const tx = {
    nonce: bufferToHex(toBuffer(nonce)),
    gasLimit: '0x5208', // 21000 in hex
    gasPrice: gasPrice,
    to: contractAddress,
    value: '0x0',
    data: data
  };
  const signedTx = await signTransaction(tx, privateKey);
  return sendTransaction(signedTx);
};

const transferERC721 = async (contractAddress, fromAddress, toAddress, tokenId, privateKey) => {
  const nonce = await getNonce(fromAddress);
  const gasPrice = await getGasPrice();
  const data = `0x23b872dd${fromAddress.replace('0x', '')}${toAddress.replace('0x', '')}${tokenId.padStart(64, '0')}`;
  const tx = {
    nonce: bufferToHex(toBuffer(nonce)),
    gasLimit: '0x5208', // 21000 in hex
    gasPrice: gasPrice,
    to: contractAddress,
    value: '0x0',
    data: data
  };
  const signedTx = await signTransaction(tx, privateKey);
  return sendTransaction(signedTx);
};

module.exports = { sendETH, transferERC20, transferERC721 };
