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

  async function onConnect() {
    try {
      setDisabled(true);
      const session = await connect();
      setSession(session);
      // Get wallet address from session
      const accounts = session?.namespaces?.eip155?.accounts;
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0].split(":")[2]); // Extract the address from the account string
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
    } catch (err) {
      console.error(err);
    } finally {
      setDisabled(false);
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
