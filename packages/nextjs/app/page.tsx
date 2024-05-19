"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { ethers } from "ethers";
import deployedContracts from "~~/contracts/deployedContracts";
import { getTargetNetworks } from "~~/utils/scaffold-eth";
import { FaExternalLinkAlt } from "react-icons/fa";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [networks] = useState(getTargetNetworks());
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0].id);

  const [isSelected1, setIsSelected1] = useState(false);
  const [isSelected2, setIsSelected2] = useState(false);
  const [isSelected3, setIsSelected3] = useState(false);
  const [isSelected4, setIsSelected4] = useState(false);
  const [isSelected5, setIsSelected5] = useState(false);
  const [isSelected6, setIsSelected6] = useState(false);
  const [isSelected7, setIsSelected7] = useState(false);

  const [amount, setAmount] = useState(0);


  const provider = new ethers.BrowserProvider(window.ethereum)

  const MintToken = async (index: number, amount: number) => {
    if (amount > 0) {
      try {
        const signer = await provider.getSigner();

        const contract = new ethers.Contract(
          deployedContracts[selectedNetwork].ForgeToken.address,
          deployedContracts[selectedNetwork].ForgeToken.abi,
          signer
        );
        const tx = await contract.mint(index, amount);
        await tx.wait();
        console.log(tx);
        alert("Token minted successfully")
      }
      catch (e) {
        console.log(e)
        alert("You do not have enough tokens to mint")
      }
    } else {
      alert("Please enter a valid amount")
    }
  };
  const ForgeToken = async (index: number, amount: number) => {
    if (amount > 0) {
      try {
        const signer = await provider.getSigner();

        const contract = new ethers.Contract(
          deployedContracts[selectedNetwork].ForgeToken.address,
          deployedContracts[selectedNetwork].ForgeToken.abi,
          signer
        );
        const tx = await contract.ForgeTokenById(index, amount);
        await tx.wait();
        console.log(tx);
        setAmount(0);
        alert("Token forged successfully")
      } catch (e) {
        console.log(e)
        alert("You do not have enough tokens to forge")
      }
    } else {
      alert("Please enter a valid amount")
    }
  }

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">NFT FORGERY</span>
          </h1>
          <div className="flex justify-center items-center space-x-2">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          <p className="text-center text-lg">
            MINT, TRADE AND FORGE NFT TOKENS{" "}
            <code className="italic bg-base-300 ml-5 text-base font-bold max-w-full break-words break-all inline-block">
              COMPLETELY FREE
            </code>
          </p>

        </div>
        {/* <button onClick={MintToken}>
          Mint
        </button> */}
        <div>

        </div>
        <div>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 my-10">


              <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div>

                  <img className="rounded-t-lg w-96 h-48" src="./assets/0.jpeg" alt="" />
                </div>
                <div className="p-5">
                  <a href="https://testnet.rarible.com/token/polygon/0x1da618e1e158513dd9458fdf78b51fce1c235913:0" target="blank">
                    <h5 className="flex items-center gap-2 mb-2 text-2xl w-60 font-bold tracking-tight text-gray-900 dark:text-white">Legendary Sword <FaExternalLinkAlt className="h-4 w-4" /></h5>
                  </a>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">A powerful sword forged by ancient dwarven blacksmiths. Grants +25 Attack Power.</p>
                  {isSelected1 ? (
                    <div className="flex gap-4">   <input type="number" onChange={(e) => setAmount(Number(e.target.value))} className=" p-2 bg-gray-200 rounded-lg text-black" />
                      <button onClick={() => {
                        MintToken(0, amount);
                        setIsSelected1(false);
                      }} className="px-4 p-2 bg-blue-700 rounded-lg text-white">Mint</button></div>
                  ) : <>
                    <button onClick={() => setIsSelected1(true)} className=" p-2 bg-blue-700 rounded-lg text-white">Mint Token</button></>}
                </div>
              </div>

              <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div>

                  <img className="rounded-t-lg w-96 h-48" src="./assets/0.jpeg" alt="" />
                </div>
                <div className="p-5">
                  <a href="https://testnet.rarible.com/token/polygon/0x1da618e1e158513dd9458fdf78b51fce1c235913:1" target="blank">
                    <h5 className="flex items-center gap-2 mb-2 text-2xl w-60 font-bold tracking-tight text-gray-900 dark:text-white">Pixel Landscapes <FaExternalLinkAlt className="h-4 w-4" /></h5>
                  </a>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">A collection of pixel art landscapes created by a renowned digital artist.</p>
                  {isSelected2 ? (
                    <div className="flex gap-4">   <input type="number" onChange={(e) => setAmount(Number(e.target.value))} className=" p-2 bg-gray-200 rounded-lg text-black" />
                      <button onClick={() => {
                        MintToken(1, amount);
                        setIsSelected2(false);
                      }} className="px-4 p-2 bg-blue-700 rounded-lg text-white">Mint</button></div>
                  ) : <>
                    <button onClick={() => setIsSelected2(true)} className=" p-2 bg-blue-700 rounded-lg text-white">Mint Token</button></>}
                </div>
              </div>

              <div className="relative max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div>

                  <img className="rounded-t-lg w-96 h-48" src="./assets/0.jpeg" alt="" />
                </div>
                <div className="p-5">
                  <a href="https://testnet.rarible.com/token/polygon/0x1da618e1e158513dd9458fdf78b51fce1c235913:2" target="blank">
                    <h5 className="flex items-center gap-2 mb-2 text-2xl w-60 font-bold tracking-tight text-gray-900 dark:text-white">CryptoPup #412 <FaExternalLinkAlt className="h-4 w-4" /></h5>
                  </a>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 ">An adorable digital puppy from the CryptoPets collection.</p>
                  {isSelected3 ? (
                    <div className="absolute bottom-4 flex gap-4">   <input type="number" onChange={(e) => setAmount(Number(e.target.value))} className=" p-2 bg-gray-200 rounded-lg text-black" />
                      <button onClick={() => {
                        MintToken(2, amount);
                        setIsSelected3(false);
                      }} className="px-4 p-2 bg-blue-700 rounded-lg text-white">Mint</button></div>
                  ) : <>
                    <button onClick={() => setIsSelected3(true)} className="absolute bottom-4  p-2 bg-blue-700 rounded-lg text-white">Mint Token</button></>}
                </div>
              </div>

              <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div>

                  <img className="rounded-t-lg w-96 h-48" src="./assets/0.jpeg" alt="" />
                </div>
                <div className="p-5">
                  <a href="https://testnet.rarible.com/token/polygon/0x1da618e1e158513dd9458fdf78b51fce1c235913:3" target="blank">
                    <h5 className="flex items-center gap-2 mb-2 text-2xl w-60 font-bold tracking-tight text-gray-900 dark:text-white">Cyber Shades<FaExternalLinkAlt className="h-4 w-4" /></h5>
                  </a>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 ">A pair of stylish augmented reality shades for your digital avatar.</p>
                  {isSelected4 ? (
                    <div className="flex gap-4">   <input type="number" onChange={(e) => setAmount(Number(e.target.value))} className=" p-2 bg-gray-200 rounded-lg text-black" />
                      <button onClick={() => {
                        ForgeToken(3, amount);
                        setIsSelected4(false);
                      }} className="px-4 p-2 bg-blue-700 rounded-lg text-white">Forge</button></div>
                  ) : <>
                    <button onClick={() => setIsSelected4(true)} className=" p-2 bg-blue-700 rounded-lg text-white">Forge Token</button></>}
                </div>
              </div>

              <div className="relative max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div>

                  <img className="rounded-t-lg w-96 h-48" src="./assets/4.jpeg" alt="" />
                </div>
                <div className="p-5">
                  <a href="https://testnet.rarible.com/token/polygon/0x1da618e1e158513dd9458fdf78b51fce1c235913:4" target="blank">
                    <h5 className="flex items-center gap-2 mb-2 text-2xl  font-bold tracking-tight text-gray-900 dark:text-white">Fractal Dreamscapes <FaExternalLinkAlt className="h-4 w-4" /></h5>
                  </a>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 ">A mesmerizing fractal artwork from the Dreamscapes collection by artist Kai-Xu.</p>
                  {isSelected5 ? (
                    <div className="flex gap-4">   <input type="number" onChange={(e) => setAmount(Number(e.target.value))} className=" p-2 bg-gray-200 rounded-lg text-black" />
                      <button onClick={() => {
                        ForgeToken(4, amount);
                        setIsSelected5(false);
                      }} className="px-4 p-2 bg-blue-700 rounded-lg text-white">Forge</button></div>
                  ) : <>
                    <button onClick={() => setIsSelected5(true)} className=" p-2 bg-blue-700 rounded-lg text-white">Forge Token</button></>}
                </div>
              </div>

              <div className="relative max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div>

                  <img className="rounded-t-lg w-96 h-48" src="./assets/5.jpeg" alt="" />
                </div>
                <div className="p-5">
                  <a href="https://testnet.rarible.com/token/polygon/0x1da618e1e158513dd9458fdf78b51fce1c235913:5" target="blank">
                    <h5 className="flex items-center gap-2 mb-2 text-2xl w-80 font-bold tracking-tight text-gray-900 dark:text-white">MetaCity Penthouse <FaExternalLinkAlt className="h-4 w-4" /></h5>
                  </a>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 ">A luxurious penthouse in the heart of the MetaCity virtual world.</p>
                  {isSelected6 ? (
                    <div className="flex gap-4 absolute bottom-4">   <input type="number" onChange={(e) => setAmount(Number(e.target.value))} className=" p-2 bg-gray-200 rounded-lg text-black" />
                      <button onClick={() => {
                        ForgeToken(5, amount);
                        setIsSelected6(false);
                      }} className="px-4 p-2 bg-blue-700 rounded-lg text-white">Forge</button></div>
                  ) : <>
                    <button onClick={() => setIsSelected6(true)} className="absolute bottom-4 p-2 bg-blue-700 rounded-lg text-white">Forge Token</button></>}
                </div>
              </div>
            
              <div className="relative max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div>

                  <img className="rounded-t-lg w-96 h-48" src="./assets/6.jpeg" alt="" />
                </div>
                <div className="p-5">
                  <a href="https://testnet.rarible.com/token/polygon/0x1da618e1e158513dd9458fdf78b51fce1c235913:6" target="blank">
                    <h5 className="flex items-center gap-2 mb-2 text-2xl w-60 font-bold tracking-tight text-gray-900 dark:text-white">Cyber Kicks 2.0<FaExternalLinkAlt className="h-4 w-4" /></h5>
                  </a>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 ">The latest edition of the popular Cyber Kicks digital sneakers.</p>
                  {isSelected7 ? (
                    <div className="absolute bottom-4 flex gap-4">   <input type="number" onChange={(e) => setAmount(Number(e.target.value))} className=" p-2 bg-gray-200 rounded-lg text-black" />
                      <button onClick={() => {
                        ForgeToken(6, amount);
                        setIsSelected7(false);
                      }} className="px-4 p-2 bg-blue-700 rounded-lg text-white">Forge</button></div>
                  ) : <>
                    <button onClick={() => setIsSelected7(true)} className="absolute bottom-5 p-2 bg-blue-700 rounded-lg text-white">Forge Token</button></>}
                </div>
              </div>
            



            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
