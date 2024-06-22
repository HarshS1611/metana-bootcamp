
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
  const [blockNumber, setBlockNumber] = useState([]);
  const [blockMap, setblockMap] = useState(new Map());


  alchemy.ws.on("block", async (block) => {
    console.log(block);

    if (blockMap.size > 10) {
      blockMap.clear();
    }
    setBlockNumber([]);


    let logs = await alchemy.core.getLogs({
      fromBlock: block - 10,
      toBlock: block,
      address: USDC_ADDRESS,
      topics: [ethers.id("Transfer(address,address,uint256)")],

    });
    logs.map((log) => {
      if (blockMap.has(log.blockNumber)) {
        setblockMap(map => new Map(map.set(log.blockNumber, map.get(log.blockNumber) + BigInt(log.data))));

      } else {
        setBlockNumber((prev) => {
          if (!prev.includes(log.blockNumber)) {
            return [...prev, log.blockNumber];
          }
          return prev;
        });        console.log(log.blockNumber);
        setblockMap(map => new Map(map.set(log.blockNumber, BigInt(log.data))));
      }
    });

  });





  return (
    <div className="charts">
      <VolumeChart blockNumber={blockNumber} blockMap={blockMap} />
      hii

    </div>
  );
}
export default App;