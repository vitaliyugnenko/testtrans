import { useState, useEffect } from "react";
import {
  WalletConnectModalSign,
  useConnect,
  useRequest,
} from "@walletconnect/modal-sign-react";

// 1. Get projectID at https://cloud.walletconnect.com
const projectId = "90f079dc357f3b0a2500be0388582698";

export default function HomePage() {
  const [session, setSession] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const { request, error, loading } = useRequest();
  const { connect, disconnect } = useConnect({
    requiredNamespaces: {
      eip155: {
        methods: ["eth_sendTransaction", "personal_sign"],
        chains: ["eip155:1"],
        events: ["chainChanged", "accountsChanged"],
      },
    },
  });

  async function onConnect() {
    try {
      const session = await connect();
      setSession(session);

      // Assuming session contains the address
      const address = session?.peerMeta?.name || "Unknown address";
      setWalletAddress(address);
    } catch (err) {
      console.error(err);
    }
  }

  async function onDisconnect() {
    try {
      await disconnect();
      setSession(null);
      setWalletAddress("");
    } catch (err) {
      console.error(err);
    }
  }

  async function onSendTransaction() {
    if (!session) {
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

  useEffect(() => {
    // Restore session and wallet address from local storage on mount
    const savedSession = JSON.parse(
      localStorage.getItem("walletconnect-session")
    );
    if (savedSession) {
      setSession(savedSession);
      const address = savedSession.peerMeta?.name || "Unknown address";
      setWalletAddress(address);
    }
  }, []);

  useEffect(() => {
    // Save session to local storage whenever it changes
    if (session) {
      localStorage.setItem("walletconnect-session", JSON.stringify(session));
    }
  }, [session]);

  return (
    <>
      <button onClick={onConnect} disabled={loading}>
        Connect Wallet
      </button>
      <button onClick={onDisconnect} disabled={loading || !session}>
        Disconnect Wallet
      </button>
      {walletAddress && <div>Connected Wallet Address: {walletAddress}</div>}
      <button onClick={onSendTransaction} disabled={!session}>
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
    </>
  );
}
