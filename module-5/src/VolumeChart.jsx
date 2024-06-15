import { Chart } from "react-google-charts";
import React, { useEffect, useState, useMemo } from 'react';
import { Network, Alchemy } from "alchemy-sdk";
const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

const settings = {
  // apiKey: `${import.meta.env.REACT_APP_API_KEY}`,
  apiKey: "grz0ZmJGLvmh--ZEfeBdhgK2SEEigRg_",
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(settings);

export default function VolumeChart() {

  const [blockNumber, setBlockNumber] = useState([]);
  const [volume, setVolume] = useState([]);
  const [gasPrice, setGasPrice] = useState([]);

  useEffect(() => {
    const initWeb3 = async () => {
      const latestBlock = await alchemy.core.getBlock();
      console.log((Number(latestBlock.baseFeePerGas) / 10e8), latestBlock.number);

      const fromBlock = latestBlock.number - 9;

      for (let i = fromBlock; i <= latestBlock.number; i++) {
        const block = await alchemy.core.getBlock(i);
        console.log(block.number, block.transactions.length);
        setBlockNumber((prev) => [...prev, block.number]);
        setVolume((prev) => [...prev, block.transactions.length]);
        setGasPrice((prev) => [...prev, Number(block.baseFeePerGas) / 10e8]);
      }
    };

    initWeb3();
  }, []);

  const volumeData = [
    [
      { label: "Block Number" },
      "Block Number",
    ],
    [blockNumber[0], volume[0]],
    [blockNumber[1], volume[1]],
    [blockNumber[2], volume[2]],
    [blockNumber[3], volume[3]],
    [blockNumber[4], volume[4]],
    [blockNumber[5], volume[5]],
    [blockNumber[6], volume[6]],
    [blockNumber[7], volume[7]],
    [blockNumber[8], volume[8]],
    [blockNumber[9], volume[9]],
  ];

  const gasPriceData = [
    [
      { label: "Block Number" },
      "Gas Price",
    ],
    [blockNumber[0], gasPrice[0]],
    [blockNumber[1], gasPrice[1]],
    [blockNumber[2], gasPrice[2]],
    [blockNumber[3], gasPrice[3]],
    [blockNumber[4], gasPrice[4]],
    [blockNumber[5], gasPrice[5]],
    [blockNumber[6], gasPrice[6]],
    [blockNumber[7], gasPrice[7]],
    [blockNumber[8], gasPrice[8]],
    [blockNumber[9], gasPrice[9]],
  ];

  const volumeOptions = {
    chart: {
      title: "the total volume of the transfer for each block (USDC)",
    },
    width: 800,
    height: 500,
    series: {
      0: { axis: "Temps" },
    },
    axes: {
      y: {
        Temps: { label: "Transaction Volume" },
      },
    },
  };

  const gasOptions = {
    chart: {
      title: "the BASEFEE for each block",
    },
    width: 800,
    height: 500,
    series: {
      0: { axis: "Temps" },
    },
    axes: {
      y: {
        Temps: { label: "Gas Price" },
      },
    },
  };

  console.log(volumeData);
  console.log(gasPriceData);

  return (
    <>
      {volumeData && volumeData.length > 10 ? <Chart
        chartType="Line"
        width="90%"
        height="400px"
        data={volumeData}
        options={volumeOptions}
      />
        : <div>Loading...</div>}
      {gasPriceData && gasPriceData.length > 10 ? <Chart
        chartType="Line"
        width="90%"
        height="400px"
        data={gasPriceData}
        options={gasOptions}
      />
        : <div>Loading...</div>}
    </>
  );
}
