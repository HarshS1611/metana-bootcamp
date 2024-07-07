"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { IoIosArrowDown } from "react-icons/io";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import deployedContracts from "~~/contracts/deployedContracts";
import { getTargetNetworks } from "~~/utils/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [networks] = useState(getTargetNetworks());
  const selectedNetwork = networks[0].id;

  const [tradeDropDown, setTradeDropDown] = useState(false);

  const [recieveDropDown, setRecieveDropdownOpen] = useState(false);

  const [tradeId, setTradeId] = useState(10);
  const [recieveId, setRecieveId] = useState(0);

  const [tradeName, setTradeName] = useState("Select Trade Token ");
  const [recieveName, setRecieveName] = useState("Select Recieve Token");
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);

  const [provider, setProvider] = useState(null);

  const TradeToken = async () => {
    if (recieveId >= 0 && tradeId >= 0 && tradeId !== recieveId) {
      setLoading(true);
      const fetchGasPrice = await fetch("https://gasstation.polygon.technology/amoy").then(res => res.json());
      console.log(fetchGasPrice.standard.maxFee);
      const gasPriceWei = ethers.parseUnits(fetchGasPrice.standard.maxFee.toFixed(10), "gwei");
      try {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        const contract = new ethers.Contract(
          deployedContracts[selectedNetwork].ForgeToken.address,
          deployedContracts[selectedNetwork].ForgeToken.abi,
          signer,
        );
        console.log(contract);
        const data = contract.interface.encodeFunctionData("tradeToken", [tradeId, recieveId]);
        console.log(data);
        const gasLimit = await provider.estimateGas({
          to: contract.target,
          data: data,
          from: address,
        });
        console.log(gasLimit);
        const tx = await contract.tradeToken(tradeId, recieveId, {
          gasPrice: gasPriceWei,
          gasLimit: gasLimit,
        });
        await tx.wait();
        setLoading(false);
        console.log(tx);
        setTxHash(tx.hash);
        setTradeName("Select Trade Token");
        setRecieveName("Select Recieve Token");
        alert("Token traded successfully");
      } catch (e) {
        console.log(e);
        alert("Invalid Token Selected");
        setLoading(false);
      }
    } else {
      alert("Insufficient balance or invalid trade token");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
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
            <span className="block text-4xl font-bold">NFT TRADE CENTER</span>
          </h1>
          <div className="flex justify-center items-center space-x-2">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          <p className="text-center text-lg">
            TRADE YOUR NFT TOKENS{" "}
            <code className="italic bg-base-300 ml-5 text-base font-bold max-w-full break-words break-all inline-block">
              COMPLETELY FREE
            </code>
          </p>
        </div>

        {txHash && (
          <div>
            <p>
              Your NFT token has been traded successfully -{" "}
              <a target="blank" href={`https://amoy.polygonscan.com/tx/${txHash}`} className="underline">
                {txHash}
              </a>
            </p>
          </div>
        )}
        <div className="flex flex-col items-center space-y-4 mt-5">
          <div className="flex flex-col gap-5">
            <div className="relative">
              <button
                className=" bg-base-300 pr-2 rounded-lg pl-4 py-2 flex justify-between items-center w-full"
                onClick={() => setTradeDropDown(!tradeDropDown)}
              >
                {tradeName}
                <div className=" flex w-6 ml-2 items-center justify-center">
                  <IoIosArrowDown className="text-gray-600 group-open:rotate-180" />
                </div>
              </button>
              {tradeDropDown && (
                <div
                  className="z-10 origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <p
                    onClick={() => {
                      setTradeId(0);
                      setTradeName("Legendary Sword");
                      setTradeDropDown(false);
                    }}
                    className=" cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:text-[#7db434]"
                    role="menuitem"
                  >
                    Legendary Sword
                  </p>
                  <p
                    onClick={() => {
                      setTradeId(1);
                      setTradeName("NFPixel LandscapesT4");
                      setTradeDropDown(false);
                    }}
                    className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:text-[#7db434]"
                    role="menuitem"
                  >
                    Pixel Landscapes
                  </p>
                  <p
                    onClick={() => {
                      setTradeId(2);
                      setTradeName("CryptoPup");

                      setTradeDropDown(false);
                    }}
                    className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:text-[#7db434]"
                    role="menuitem"
                  >
                    CryptoPup
                  </p>
                  <p
                    onClick={() => {
                      setTradeId(3);
                      setTradeName("Cyber Shades");

                      setTradeDropDown(false);
                    }}
                    className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:text-[#7db434]"
                    role="menuitem"
                  >
                    Cyber Shades
                  </p>
                  <p
                    onClick={() => {
                      setTradeId(4);
                      setTradeName("Fractal Dreamscapes");
                      setTradeDropDown(false);
                    }}
                    className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:text-[#7db434]"
                    role="menuitem"
                  >
                    Fractal Dreamscapes
                  </p>
                  <p
                    onClick={() => {
                      setTradeId(5);
                      setTradeName("MetaCity Penthouse");
                      setTradeDropDown(false);
                    }}
                    className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:text-[#7db434]"
                    role="menuitem"
                  >
                    MetaCity Penthouse
                  </p>
                  <p
                    onClick={() => {
                      setTradeId(6);
                      setTradeName("Cyber Kicks 2.0");

                      setTradeDropDown(false);
                    }}
                    className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:text-[#7db434]"
                    role="menuitem"
                  >
                    Cyber Kicks 2.0
                  </p>
                </div>
              )}
            </div>

            <div className="relative ">
              <button
                className="flex justify-between gap-1 bg-base-300 pr-2 rounded-lg pl-4 py-2 items-center w-full"
                onClick={() => setRecieveDropdownOpen(!recieveDropDown)}
              >
                {recieveName}
                <div className=" flex w-6 items-center justify-start">
                  <IoIosArrowDown className="text-gray-600 group-open:rotate-180" />
                </div>
              </button>
              {recieveDropDown && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <p
                    onClick={() => {
                      setRecieveId(0);
                      setRecieveName("Legendary Sword");
                      setRecieveDropdownOpen(false);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:text-[#7db434]"
                    role="menuitem"
                  >
                    Legendary Sword
                  </p>
                  <p
                    onClick={() => {
                      setRecieveId(1);
                      setRecieveName("Pixel Landscapes");
                      setRecieveDropdownOpen(false);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:text-[#7db434]"
                    role="menuitem"
                  >
                    Pixel Landscapes
                  </p>
                  <p
                    onClick={() => {
                      setRecieveId(2);
                      setRecieveName("CryptoPup");
                      setRecieveDropdownOpen(false);
                    }}
                    className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:text-[#7db434]"
                    role="menuitem"
                  >
                    CryptoPup
                  </p>
                </div>
              )}
            </div>
            {loading ? (
              <button className="bg-base-300 text-white rounded-lg px-4 py-2 w-full" disabled>
                Trading...
              </button>
            ) : (
              <button onClick={TradeToken} className=" bg-blue-700 rounded-lg text-white px-4 py-2 w-full">
                Trade
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
