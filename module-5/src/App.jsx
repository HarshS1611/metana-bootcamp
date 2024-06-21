
import VolumeChart from "./VolumeChart";
import { Alchemy, Network } from "alchemy-sdk";
const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

const settings = {
  apiKey: "grz0ZmJGLvmh--ZEfeBdhgK2SEEigRg_", // Replace with your Alchemy API Key.
  network: Network.ETH_MAINNET, // Replace with your network.
};
const alchemy = new Alchemy(settings);

const App = () => {
  const filter = {
    address: USDC_ADDRESS,
    topics: [ethers.utils.id("Transfer(address,address,uint256)")],
  };
  
  alchemy.ws.on(filter, (log, event) => {
    // Emitted whenever a DAI token transfer occurs
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