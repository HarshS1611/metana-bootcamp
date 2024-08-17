const { Buffer } = require('buffer');
const { Transaction } = require('@ethereumjs/tx');
const { privateToBuffer, bufferToHex, toBuffer } = require('@ethereumjs/util');
const axios = require('axios');

// Helper functions
const sendTransaction = async (signedTx) => {
  const response = await axios.post('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID', {
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_sendRawTransaction',
    params: [`0x${signedTx.toString('hex')}`],
  });
  return response.data.result;
};

const signTransaction = (tx, privateKey) => {
  const privateKeyBuffer = Buffer.from(privateKey, 'hex');
  const transaction = Transaction.fromTxData(tx, { common: 'mainnet' });
  const signedTx = transaction.sign(privateKeyBuffer);
  return signedTx.serialize();
};

const sendETH = async (fromAddress, toAddress, amount, privateKey) => {
  const nonce = await getNonce(fromAddress);
  const gasPrice = await getGasPrice();
  const tx = {
    nonce: bufferToHex(toBuffer(nonce)),
    gasLimit: '0x5208', // 21000 in hex
    gasPrice: gasPrice,
    to: toAddress,
    value: `0x${(parseFloat(amount) * 1e18).toString(16)}`, // Convert ETH to wei
    data: '0x'
  };
  const signedTx = signTransaction(tx, privateKey);
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
  const signedTx = signTransaction(tx, privateKey);
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
  const signedTx = signTransaction(tx, privateKey);
  return sendTransaction(signedTx);
};

const getNonce = async (address) => {
  const response = await axios.post('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID', {
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_getTransactionCount',
    params: [address, 'latest']
  });
  return response.data.result;
};

const getGasPrice = async () => {
  const response = await axios.post('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID', {
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_gasPrice'
  });
  return response.data.result;
};

module.exports = { sendETH, transferERC20, transferERC721 };
