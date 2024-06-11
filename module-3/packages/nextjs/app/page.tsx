"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { ethers } from "ethers";
import deployedContracts from "~~/contracts/deployedContracts";
import { getTargetNetworks } from "~~/utils/scaffold-eth";
import { FaExternalLinkAlt } from "react-icons/fa";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [networks] = useState(getTargetNetworks());
  const selectedNetwork = networks[0].id;
  const [provider, setProvider] = useState(null);


  const [txHash, setTxHash] = useState("");
  const [fTxHash, setFTxHash] = useState("");
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [loading4, setLoading4] = useState(false);
  const [loading5, setLoading5] = useState(false);
  const [loading6, setLoading6] = useState(false);
  const [loading7, setLoading7] = useState(false);

  const MintToken = async (index: number) => {
    setFTxHash("");
    try {
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        deployedContracts[selectedNetwork].ForgeToken.address,
        deployedContracts[selectedNetwork].ForgeToken.abi,
        signer
      );
      const tx = await contract.freeMint(index);
      await tx.wait();
      console.log(tx);
      setLoading1(false);
      setLoading2(false);
      setLoading3(false);
      setTxHash(tx.hash);
      alert("Token minted successfully")
    }
    catch (e) {
      console.log(e)
      setLoading1(false);
      setLoading2(false);
      setLoading3(false);

      alert("Cannot claim more than one token every 1 minute")
    }

  };
  const ForgeToken = async (index: number) => {
    setTxHash("");
    try {
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        deployedContracts[selectedNetwork].ForgeToken.address,
        deployedContracts[selectedNetwork].ForgeToken.abi,
        signer
      );
      const tx = await contract.ForgeTokenById(index);
      await tx.wait();
      console.log(tx);
      setFTxHash(tx.hash);
      setLoading4(false);
      setLoading5(false);
      setLoading6(false);
      setLoading7(false);
      alert("Token forged successfully")
    } catch (e) {
      console.log(e)
      setLoading4(false);
      setLoading5(false);
      setLoading6(false);
      setLoading7(false);
      alert("You do not have enough tokens to forge")
    }

  }
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ethereum = window.ethereum;
      if (ethereum) {
        setProvider(new ethers.BrowserProvider(ethereum));
      }
    }
  }, []);


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
            MINT AND FORGE NFT TOKENS{" "}
            <code className="italic bg-base-300 ml-5 text-base font-bold max-w-full break-words break-all inline-block">
              COMPLETELY FREE
            </code>
          </p>

        </div>
        {
          txHash && <div>
            <p>Your NFT token has been minted  successfully - <a target="blank" href={`https://amoy.polygonscan.com/tx/${txHash}`} className="underline">{txHash}</a></p>

          </div>
        }
        {
          fTxHash && <div>
            <p>Your NFT token has been  forged successfully - <a target="blank" href={`https://amoy.polygonscan.com/tx/${fTxHash}`} className="underline">{fTxHash}</a></p>

          </div>
        }
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
                  <a href="https://testnet.rarible.com/token/polygon/0x8f40eC69C6841Df15c11618C10DE2F78F7Bd7fd9:0" target="blank">
                    <h5 className="flex items-center gap-2 mb-2 text-2xl w-60 font-bold tracking-tight text-gray-900 dark:text-white">Legendary Sword <FaExternalLinkAlt className="h-4 w-4" /></h5>
                  </a>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">A powerful sword forged by ancient dwarven blacksmiths. Grants +25 Attack Power.</p>

                  {loading1 ? <button className="p-2 bg-blue-700 rounded-lg text-white" disabled>Minting...</button> : <button onClick={() => {
                    MintToken(0);
                    setLoading1(true)
                  }} className=" p-2 bg-blue-700 rounded-lg text-white">Mint Token</button>
                  }


                </div>
              </div>

              <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div>

                  <img className="rounded-t-lg w-96 h-48" src="./assets/1.jpeg" alt="" />
                </div>
                <div className="p-5">
                  <a href="https://testnet.rarible.com/token/polygon/0x8f40eC69C6841Df15c11618C10DE2F78F7Bd7fd9:1" target="blank">
                    <h5 className="flex items-center gap-2 mb-2 text-2xl w-60 font-bold tracking-tight text-gray-900 dark:text-white">Pixel Landscapes <FaExternalLinkAlt className="h-4 w-4" /></h5>
                  </a>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">A collection of pixel art landscapes created by a renowned digital artist.</p>

                  {
                    loading2 ? <button className="p-2 bg-blue-700 rounded-lg text-white" disabled>Minting...</button> : <button onClick={() => {
                      MintToken(1); setLoading2(true)
                    }} className=" p-2 bg-blue-700 rounded-lg text-white">Mint Token</button>
                  }

                </div>
              </div>

              <div className="relative max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div>

                  <img className="rounded-t-lg w-96 h-48" src="./assets/2.jpeg" alt="" />
                </div>
                <div className="p-5">
                  <a href="https://testnet.rarible.com/token/polygon/0x8f40eC69C6841Df15c11618C10DE2F78F7Bd7fd9:2" target="blank">
                    <h5 className="flex items-center gap-2 mb-2 text-2xl w-60 font-bold tracking-tight text-gray-900 dark:text-white">CryptoPup #412 <FaExternalLinkAlt className="h-4 w-4" /></h5>
                  </a>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 ">An adorable digital puppy from the CryptoPets collection.</p>

                  {
                    loading3 ? <button className="p-2 bg-blue-700 rounded-lg text-white" disabled>Minting...</button> : <button onClick={() => {
                      MintToken(2);
                      setLoading3(true)
                    }} className=" p-2 bg-blue-700 rounded-lg text-white">Mint Token</button>
                  }
                </div>
              </div>

              <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div>

                  <img className="rounded-t-lg w-96 h-48" src="./assets/3.jpeg" alt="" />
                </div>
                <div className="p-5">
                  <a href="https://testnet.rarible.com/token/polygon/0x8f40eC69C6841Df15c11618C10DE2F78F7Bd7fd9:3" target="blank">
                    <h5 className="flex items-center gap-2 mb-2 text-2xl w-60 font-bold tracking-tight text-gray-900 dark:text-white">Cyber Shades<FaExternalLinkAlt className="h-4 w-4" /></h5>
                  </a>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 ">A pair of stylish augmented reality shades for your digital avatar.</p>

                  {
                    loading4 ? <button className="p-2 bg-blue-700 rounded-lg text-white" disabled>Forging...</button> : <button onClick={() => {
                      ForgeToken(3);
                      setLoading4(true)
                    }} className=" p-2 bg-blue-700 rounded-lg text-white">Forge Token</button>
                  }
                </div>
              </div>

              <div className="relative max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div>

                  <img className="rounded-t-lg w-96 h-48" src="./assets/4.jpeg" alt="" />
                </div>
                <div className="p-5">
                  <a href="https://testnet.rarible.com/token/polygon/0x8f40eC69C6841Df15c11618C10DE2F78F7Bd7fd9:4" target="blank">
                    <h5 className="flex items-center gap-2 mb-2 text-2xl  font-bold tracking-tight text-gray-900 dark:text-white">Fractal Dreamscapes <FaExternalLinkAlt className="h-4 w-4" /></h5>
                  </a>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 ">A mesmerizing fractal artwork from the Dreamscapes collection by artist Kai-Xu.</p>

                  {
                    loading5 ? <button className="p-2 bg-blue-700 rounded-lg text-white" disabled>Forging...</button> : <button onClick={() => {
                      ForgeToken(4);
                      setLoading5(true)
                    }} className=" p-2 bg-blue-700 rounded-lg text-white">Forge Token</button>
                  }

                </div>
              </div>

              <div className="relative max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div>

                  <img className="rounded-t-lg w-96 h-48" src="./assets/5.jpeg" alt="" />
                </div>
                <div className="p-5">
                  <a href="https://testnet.rarible.com/token/polygon/0x8f40eC69C6841Df15c11618C10DE2F78F7Bd7fd9:5" target="blank">
                    <h5 className="flex items-center gap-2 mb-2 text-2xl w-80 font-bold tracking-tight text-gray-900 dark:text-white">MetaCity Penthouse <FaExternalLinkAlt className="h-4 w-4" /></h5>
                  </a>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 ">A luxurious penthouse in the heart of the MetaCity virtual world.</p>

                  {
                    loading6 ? <button className="p-2 bg-blue-700 rounded-lg text-white" disabled>Forging...</button> : <button onClick={() => {
                      ForgeToken(5);
                      setLoading6(true)
                    }} className=" p-2 bg-blue-700 rounded-lg text-white">Forge Token</button>
                  }

                </div>
              </div>

              <div className="relative max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div>

                  <img className="rounded-t-lg w-96 h-48" src="./assets/6.jpeg" alt="" />
                </div>
                <div className="p-5">
                  <a href="https://testnet.rarible.com/token/polygon/0x8f40eC69C6841Df15c11618C10DE2F78F7Bd7fd9:6" target="blank">
                    <h5 className="flex items-center gap-2 mb-2 text-2xl w-60 font-bold tracking-tight text-gray-900 dark:text-white">Cyber Kicks 2.0<FaExternalLinkAlt className="h-4 w-4" /></h5>
                  </a>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 ">The latest edition of the popular Cyber Kicks digital sneakers.</p>

                  {
                    loading7 ? <button className="p-2 bg-blue-700 rounded-lg text-white" disabled>Forging...</button> : <button onClick={() => {
                      ForgeToken(6);
                      setLoading7(true)
                    }} className=" p-2 bg-blue-700 rounded-lg text-white">Forge Token</button>
                  }

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
