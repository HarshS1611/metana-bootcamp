
import VolumeChart from "./VolumeChart";
import { useEffect, useState } from "react";
import { Alchemy, Network, Utils } from "alchemy-sdk";
const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
import { ethers } from "ethers";
import Web3 from 'web3';
const settings = {
  apiKey: "grz0ZmJGLvmh--ZEfeBdhgK2SEEigRg_", // Replace with your Alchemy API Key.
  network: Network.ETH_MAINNET, // Replace with your network.
};
const alchemy = new Alchemy(settings);
const erc20Abi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  }
];

const App = () => {
  const [blockNumber, setBlockNumber] = useState([]);
  const [blockMap, setblockMap] = useState(new Map());
  const [gasPrice, setGasPrice] = useState([]);
  const [gasRatio, setGasRatio] = useState([]);

  // alchemy.ws.on("block", async (block) => {
  //   console.log(block);

  //   if (blockMap.size > 10) {
  //     blockMap.clear();
  //   }
  //   setBlockNumber([]);
  //   setGasPrice([]);
  //   setGasRatio([]);


  //   let logs = await alchemy.core.getLogs({
  //     fromBlock: block - 10,
  //     toBlock: block,
  //     address: USDC_ADDRESS,
  //     topics: [ethers.id("Transfer(address,address,uint256)")],

  //   });
  //   logs.map((log) => {
  //     if (blockMap.has(log.blockNumber)) {
  //       setblockMap(map => new Map(map.set(log.blockNumber, map.get(log.blockNumber) + BigInt(log.data))));

  //     } else {
  //       setBlockNumber(async (prev) => {
  //         if (!prev.includes(log.blockNumber)) {
  //           // const block = await alchemy.core.getBlock(log.blockNumber);
  //           // setGasPrice((prev) => [...prev, Number(block.baseFeePerGas) / 10e8]);
  //           // setGasRatio((prev) => [...prev, (Number(block.gasUsed) / Number(block.gasLimit)) * 100]);
  //           return [...prev, log.blockNumber];
  //         }
  //         return prev;
  //       });        
  //       setblockMap(map => new Map(map.set(log.blockNumber, BigInt(log.data))));
  //     }
  //   });

  // });

  const getLogs = async () => {
    const web3 = new Web3('wss://eth-mainnet.g.alchemy.com/v2/grz0ZmJGLvmh--ZEfeBdhgK2SEEigRg_');
    const currentBlock = await web3.eth.getBlockNumber();
    console.log(currentBlock);
    const contract = new web3.eth.Contract(erc20Abi, USDC_ADDRESS);
    const logs = await contract.getPastEvents('Transfer', {
      fromBlock: currentBlock - BigInt(9),
      toBlock: currentBlock,
    });
    setblockMap(new Map());
    setBlockNumber([]);

    for (let i = currentBlock - BigInt(9); i <= currentBlock; i++) {
      setBlockNumber((prev) => [...prev, i.toString()]);
      const block = await web3.eth.getBlock(i);
      // console.log(block);
      setGasPrice((prev) => [...prev, Number(block.baseFeePerGas)]);
      setGasRatio((prev) => [...prev, (Number(block.gasUsed) / Number(block.gasLimit)) * 100]);
    }
    // console.log(logs);
  
    logs.map((log) => {
      if (blockMap.has(log.blockNumber)) {
        setblockMap(map => new Map(map.set(log.blockNumber.toString(), map.get(log.blockNumber) + BigInt(log.returnValues.value))));
      } else {
        setblockMap(map => new Map(map.set(log.blockNumber.toString(), BigInt(log.returnValues.value))));
      }
    });
  }

  useEffect(() => {
    getLogs();
  }, []);



  return (
    <div className="charts">
      <VolumeChart blockNumber={blockNumber} blockMap={blockMap} gasPrice={gasPrice} gasRatio={gasRatio} />
      hii

    </div>
  );
}
export default App;