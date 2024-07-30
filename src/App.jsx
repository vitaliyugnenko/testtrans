import { useEffect, useState } from "react";
import {
  WalletConnectModalSign,
  useConnect,
  useRequest,
  useDisconnect,
} from "@walletconnect/modal-sign-react";

const projectId = "90f079dc357f3b0a2500be0388582698";

export default function HomePage() {
  const [session, setSession] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const { connect, connected } = useConnect({
    requiredNamespaces: {
      eip155: {
        methods: ["eth_sendTransaction", "personal_sign"],
        chains: ["eip155:1"],
        events: ["chainChanged", "accountsChanged"],
      },
    },
  });

  const { request } = useRequest();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    // Check if WalletConnect session exists
    const storedSession = JSON.parse(
      localStorage.getItem("walletConnectSession")
    );
    if (storedSession) {
      setSession(storedSession);
      // Fetch wallet address from session
      const { accounts } = storedSession;
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
      }
    }
  }, []);

  const onConnect = async () => {
    try {
      const newSession = await connect();
      setSession(newSession);
      // Save session to localStorage
      localStorage.setItem("walletConnectSession", JSON.stringify(newSession));
      const { accounts } = newSession;
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onDisconnect = () => {
    try {
      disconnect();
      localStorage.removeItem("walletConnectSession");
      setSession(null);
      setWalletAddress("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <button onClick={onConnect} disabled={!!session}>
        Connect Wallet
      </button>
      {session && <button onClick={onDisconnect}>Disconnect Wallet</button>}
      {walletAddress && <div>Connected Wallet Address: {walletAddress}</div>}
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
