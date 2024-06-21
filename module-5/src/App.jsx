
import VolumeChart from "./VolumeChart";
import { useState } from "react";
import { Alchemy, Network } from "alchemy-sdk";
const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
import { ethers } from "ethers";
const settings = {
  apiKey: "grz0ZmJGLvmh--ZEfeBdhgK2SEEigRg_", // Replace with your Alchemy API Key.
  network: Network.ETH_MAINNET, // Replace with your network.
};
const alchemy = new Alchemy(settings);

const App = () => {
  const [blockNumber, setBlockNumber] = useState(0);
  alchemy.ws.on("block", (blockNumber) => {
    console.log("Latest block:", blockNumber);
    setBlockNumber(blockNumber);
  }
  );
const filter = {
  fromBlock: blockNumber - 10,
  toBlock: blockNumber,
  address: USDC_ADDRESS,
  topics: [ethers.id("Transfer(address,address,uint256)")],
};

alchemy.ws.on(filter, (log, event) => {
  console.log(log, event);
});



return (
  <div className="charts">
    {/* <VolumeChart /> */}
    hii

  </div>
);
}
export default App;