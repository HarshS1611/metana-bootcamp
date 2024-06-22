
import VolumeChart from "./VolumeChart";
import { useState } from "react";
import { Alchemy, Network, Utils } from "alchemy-sdk";
const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
import { ethers } from "ethers";
import Web3 from "web3";
const settings = {
  apiKey: "grz0ZmJGLvmh--ZEfeBdhgK2SEEigRg_", // Replace with your Alchemy API Key.
  network: Network.ETH_MAINNET, // Replace with your network.
};
const alchemy = new Alchemy(settings);

const App = () => {
  const [blockNumber, setBlockNumber] = useState(0);

  alchemy.ws.on("block", async (block) => {
    console.log(block);
    let logs = await alchemy.core.getLogs({
      fromBlock: block - 10,
      toBlock: block,
      address: USDC_ADDRESS,
      topics: [
        ethers.utils.id("Transfer(address,address,uint256)"),
     
      ],
    });
    console.log(logs);
  });





  return (
    <div className="charts">
      {/* <VolumeChart /> */}
      hii

    </div>
  );
}
export default App;