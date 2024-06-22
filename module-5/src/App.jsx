
import VolumeChart from "./VolumeChart";
import { useState } from "react";
import { Alchemy, Network, Utils } from "alchemy-sdk";
const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
import { ethers } from "ethers";
const settings = {
  apiKey: "grz0ZmJGLvmh--ZEfeBdhgK2SEEigRg_", // Replace with your Alchemy API Key.
  network: Network.ETH_MAINNET, // Replace with your network.
};
const alchemy = new Alchemy(settings);

const App = () => {
  const [blockNumber, setBlockNumber] = useState(0);
  const [volume, setVolume] = useState(0);

  // create a map for each block conatining total value of USDC transferred
  // on that block
  const blockMap = new Map();


  alchemy.ws.on("block", async (block) => {
    console.log(block);
    if (blockMap.size > 2) {
      blockMap.clear();
    }

    let logs = await alchemy.core.getLogs({
      fromBlock: block - 2,
      toBlock: block,
      address: USDC_ADDRESS,
      topics: [ethers.id("Transfer(address,address,uint256)")],

    });
    logs.map((log) => {
      // console.log(log.blockNumber,BigInt(log.data).toString());
      if (blockMap.has(log.blockNumber)) {
        console.log("already",log.blockNumber, BigInt(log.data).toString());
        blockMap.set(
          log.blockNumber,
          // it should add the previous value to the current value not concatenate
          blockMap.get(log.blockNumber) + BigInt(log.data)
        );
      } else {
        console.log("new",log.blockNumber, BigInt(log.data).toString());

        blockMap.set(log.blockNumber, BigInt(log.data));
      }
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