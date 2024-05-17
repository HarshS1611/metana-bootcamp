"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { ethers } from "ethers";
import deployedContracts from "~~/contracts/deployedContracts";
const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const provider = new ethers.BrowserProvider(window.ethereum)

  const MintToken = async () => {
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(
      deployedContracts[11155111].ForgeToken.address,
      deployedContracts[11155111].ForgeToken.abi,
      signer
    );
    const tx = await contract.mint(0, 10);
    await tx.wait();
    console.log(tx);
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
        <button onClick={MintToken}>
          Mint
        </button>


      </div>
    </>
  );
};

export default Home;
