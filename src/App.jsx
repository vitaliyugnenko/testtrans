import { useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import ErrorMessage from "./ErrorMessage";
import TxList from "./TxList";

const connectWallet = async ({ setWalletAddress, setError }) => {
  try {
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");

    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.BrowserProvider(window.ethereum);

    const signer = await provider.getSigner();
    const walletAddress = await signer.getAddress();
    setWalletAddress(walletAddress);
    console.log("Wallet Address:", walletAddress);
  } catch (err) {
    setError(err.message);
    console.log(err.message);
  }
};

const startPayment = async ({ setError, setTxs, ether, addr }) => {
  try {
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    ethers.getAddress(addr);

    const tx = await signer.sendTransaction({
      to: addr,
      value: ethers.parseEther(ether),
    });
    console.log({ ether, addr });
    console.log("tx", tx);
    setTxs([tx]);
  } catch (err) {
    setError(err.message);
    console.log(err.message);
  }
};

export default function App() {
  const [error, setError] = useState();
  const [txs, setTxs] = useState([]);
  const [walletAddress, setWalletAddress] = useState("");

  const [address, setAddress] = useState();
  const [amount, setAmount] = useState();

  const handleConnectWallet = async () => {
    setError();
    await connectWallet({ setWalletAddress, setError });
  };

  const handleSendTransaction = async (e) => {
    e.preventDefault();

    setError();

    await startPayment({
      setError,
      setTxs,
      ether: amount,
      addr: address,
    });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-bg-color-main">
      <div className="flex justify-center items-center h-screen w-1/2">
        <form className="w-80 p-4" onSubmit={handleSendTransaction}>
          <div className="w-full mx-auto rounded-xl bg-bg-color-main">
            <main className="p-4 max-w-screen-lg mx-auto">
              <h1 className="text-xl font-semibold text-white text-center">
                Send ETH payment
              </h1>
              <div className="my-3 text-center">
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none mb-4"
                  onClick={handleConnectWallet}
                >
                  Connect Wallet
                </button>
                {walletAddress && (
                  <div className="my-3 text-white">
                    Connected Wallet Address: {walletAddress}
                  </div>
                )}
              </div>
              <div className="my-3">
                <input
                  type="text"
                  name="addr"
                  className="form-input w-full focus:ring focus:outline-none border-gray-300 rounded-md text-white pl-4"
                  placeholder="Recipient Address"
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="my-3">
                <input
                  name="ether"
                  type="text"
                  className="form-input w-full focus:ring focus:outline-none border-gray-300 rounded-md text-white pl-4"
                  placeholder="Amount in ETH"
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </main>
            <footer className="p-4 flex justify-center">
              <button
                type="submit"
                className="bg-zinc-800 hover:bg-zinc-900 text-white font-bold py-2 px-4 rounded focus:outline-none"
              >
                Pay now
              </button>
              <ErrorMessage message={error} />
              <TxList txs={txs} />
            </footer>
          </div>
        </form>
      </div>
    </div>
  );
}
