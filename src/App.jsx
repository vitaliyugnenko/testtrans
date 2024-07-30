import {
  WalletConnectModalSign,
  useConnect,
  useRequest,
} from "@walletconnect/modal-sign-react";
import { useState, useEffect } from "react";

// 1. Get projectID at https://cloud.walletconnect.com
const projectId = "90f079dc357f3b0a2500be0388582698";

export default function HomePage() {
  const [session, setSession] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const { request } = useRequest();
  const [disabled, setDisabled] = useState(false);
  const { connect, disconnect } = useConnect({
    requiredNamespaces: {
      eip155: {
        methods: ["eth_sendTransaction", "personal_sign"],
        chains: ["eip155:1"],
        events: ["chainChanged", "accountsChanged"],
      },
    },
  });

  // Load session and wallet address from localStorage on component mount
  useEffect(() => {
    const savedSession = localStorage.getItem("session");
    const savedAddress = localStorage.getItem("walletAddress");
    if (savedSession) {
      setSession(JSON.parse(savedSession));
    }
    if (savedAddress) {
      setWalletAddress(savedAddress);
    }
  }, []);

  async function onConnect() {
    try {
      setDisabled(true);
      const newSession = await connect();
      setSession(newSession);
      const accounts = newSession?.namespaces?.eip155?.accounts;
      if (accounts && accounts.length > 0) {
        const address = accounts[0].split(":")[2]; // Extract the address from the account string
        setWalletAddress(address);
        // Save session and wallet address to localStorage
        localStorage.setItem("session", JSON.stringify(newSession));
        localStorage.setItem("walletAddress", address);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDisabled(false);
    }
  }

  async function onDisconnect() {
    try {
      setDisabled(true);
      await disconnect();
      setSession(null);
      setWalletAddress(null);
      // Remove session and wallet address from localStorage
      localStorage.removeItem("session");
      localStorage.removeItem("walletAddress");
    } catch (err) {
      console.error(err);
    } finally {
      setDisabled(false);
    }
  }

  async function onSendTransaction() {
    if (!session || !walletAddress) {
      alert("Please connect a wallet first.");
      return;
    }

    try {
      const tx = await request({
        topic: session.topic,
        chainId: "eip155:1",
        request: {
          id: 1,
          jsonrpc: "2.0",
          method: "eth_sendTransaction",
          params: [
            {
              from: walletAddress,
              to: "0x1456225dE90927193F7A171E64a600416f96f2C8", // Replace with actual recipient address
              value: "0x1000000000000000000", // 1 ETH in wei
            },
          ],
        },
      });
      console.log("Transaction response:", tx);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div style={{ textAlign: "center", color: "#fff" }}>
      <button onClick={onConnect} disabled={disabled}>
        Connect Wallet
      </button>
      {session && (
        <button onClick={onDisconnect} disabled={disabled}>
          Disconnect Wallet
        </button>
      )}
      {walletAddress && <div>Connected Wallet Address: {walletAddress}</div>}
      <button onClick={onSendTransaction} disabled={!session || !walletAddress}>
        Send Transaction
      </button>
      {/* Set up WalletConnectModalSign component */}
      <WalletConnectModalSign
        projectId={projectId}
        metadata={{
          name: "My Dapp",
          description: "My Dapp description",
          url: "https://my-dapp.com",
          icons: ["https://my-dapp.com/logo.png"],
        }}
      />
    </div>
  );
}

/*хуйпизда*/
