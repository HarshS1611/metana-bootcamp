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

export default function VolumeChart({ blockNumber, blockMap, gasPrice, gasRatio }) {

  useEffect(() => {
    const initWeb3 = async () => {
      const latestBlock = await alchemy.core.getBlock();

      const fromBlock = latestBlock.number - 9;

      for (let i = fromBlock; i <= latestBlock.number; i++) {
        const block = await alchemy.core.getBlock(i);
        setBlockNumber((prev) => [...prev, block.number]);
        setVolume((prev) => [...prev, block.transactions.length]);
        setGasPrice((prev) => [...prev, Number(block.baseFeePerGas) / 10e8]);
        setGasRatio((prev) => [...prev, (Number(block.gasUsed) / Number(block.gasLimit)) * 100]);
      }
    };

    // initWeb3();
  }, []);

  const volumeData = [
    [
      { label: "Block Number" },
      "Block Number",
    ],
    [blockNumber[0], Number(blockMap.get(blockNumber[0]))],
    [blockNumber[1], Number(blockMap.get(blockNumber[1]))],
    [blockNumber[2], Number(blockMap.get(blockNumber[2]))],
    [blockNumber[3], Number(blockMap.get(blockNumber[3]))],
    [blockNumber[4], Number(blockMap.get(blockNumber[4]))],
    [blockNumber[5], Number(blockMap.get(blockNumber[5]))],
    [blockNumber[6], Number(blockMap.get(blockNumber[6]))],
    [blockNumber[7], Number(blockMap.get(blockNumber[7]))],
    [blockNumber[8], Number(blockMap.get(blockNumber[8]))],
    [blockNumber[9], Number(blockMap.get(blockNumber[9]))],

  ];

  const gasPriceData = [
    [
      { label: "Block Number" },
      "BASEFEE",
      "Gas Ratio"
    ],
    [blockNumber[0], Number(gasPrice[0]), Number(gasRatio[0])],
    [blockNumber[1], Number(gasPrice[1]), Number(gasRatio[1])],
    [blockNumber[2], Number(gasPrice[2]), Number(gasRatio[2])],
    [blockNumber[3], Number(gasPrice[3]), Number(gasRatio[3])],
    [blockNumber[4], Number(gasPrice[4]), Number(gasRatio[4])],
    [blockNumber[5], Number(gasPrice[5]), Number(gasRatio[5])],
    [blockNumber[6], Number(gasPrice[6]), Number(gasRatio[6])],
    [blockNumber[7], Number(gasPrice[7]), Number(gasRatio[7])],
    [blockNumber[8], Number(gasPrice[8]), Number(gasRatio[8])],
    [blockNumber[9], Number(gasPrice[9]), Number(gasRatio[9])],

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


  return (
    <>
      {volumeData ? <Chart
        chartType="Line"
        width="100%"
        height="900px"
        data={volumeData}
        options={volumeOptions}
      />
        : <div>Loading...</div>}
      {gasPriceData ? <Chart
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
