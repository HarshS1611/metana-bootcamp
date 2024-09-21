const express = require('express');
const bodyParser = require('body-parser');
const { sendETH, transferERC20, transferERC721 } = require('./utils');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Endpoint to send ETH
app.post('/sendETH', async (req, res) => {
  const { fromAddress, toAddress, amount, privateKey } = req.body;
  try {
    const txHash = await sendETH(fromAddress, toAddress, amount, privateKey);
    res.json({ txHash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to transfer ERC20 tokens
app.post('/transferERC20', async (req, res) => {
  const { contractAddress, fromAddress, toAddress, amount, privateKey } = req.body;
  try {
    const txHash = await transferERC20(contractAddress, fromAddress, toAddress, amount, privateKey);
    res.json({ txHash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to transfer ERC721 tokens
app.post('/transferERC721', async (req, res) => {
  const { contractAddress, fromAddress, toAddress, tokenId, privateKey } = req.body;
  try {
    const txHash = await transferERC721(contractAddress, fromAddress, toAddress, tokenId, privateKey);
    res.json({ txHash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
