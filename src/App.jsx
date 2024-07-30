import { useState } from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";

export default function App() {
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    try {
      const provider = new WalletConnectProvider({
        rpc: {
          1: "https://mainnet.infura.io/v3/824ecb7df0eb4a1bb4ee81c8f3df31eb", // Можно оставить пустым или заменить на другой RPC URL
        },
      });

      await provider.enable();
      const web3Provider = new ethers.providers.Web3Provider(provider);
      const signer = web3Provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <button onClick={connectWallet}>Connect Wallet</button>
      {walletAddress && <p>Connected Wallet Address: {walletAddress}</p>}
    </div>
  );
}
