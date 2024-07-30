import { useEffect, useState } from "react";
import {
  WalletConnectModalSign,
  useConnect,
} from "@walletconnect/modal-sign-react";

// Project ID from WalletConnect
const projectId = "90f079dc357f3b0a2500be0388582698";

export default function HomePage() {
  const [walletAddress, setWalletAddress] = useState("");
  const [disabled, setDisabled] = useState(false);
  const { connect } = useConnect({
    requiredNamespaces: {
      eip155: {
        methods: ["eth_sendTransaction", "personal_sign"],
        chains: ["eip155:1"],
        events: ["chainChanged", "accountsChanged"],
      },
    },
  });

  useEffect(() => {
    // Load wallet address from localStorage on component mount
    const savedAddress = localStorage.getItem("walletAddress");
    if (savedAddress) {
      setWalletAddress(savedAddress);
    }
  }, []);

  async function onConnect() {
    try {
      setDisabled(true);
      const session = await connect();
      console.info(session);

      // Assuming session contains account info
      const address = session.accounts[0];
      setWalletAddress(address);
      localStorage.setItem("walletAddress", address);
    } catch (err) {
      console.error(err);
    } finally {
      setDisabled(false);
    }
  }

  return (
    <>
      <button onClick={onConnect} disabled={disabled}>
        Connect Wallet
      </button>
      {walletAddress && (
        <div>
          <p>Connected Wallet Address:</p>
          <p>{walletAddress}</p>
        </div>
      )}
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
