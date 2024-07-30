import {
  WalletConnectModalSign,
  useConnect,
  useRequest,
} from "@walletconnect/modal-sign-react";
import { useState, useEffect } from "react";

const projectId = "90f079dc357f3b0a2500be0388582698";

export default function HomePage() {
  const [session, setSession] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const { request, data, error, loading } = useRequest();
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

  async function onConnect() {
    try {
      setDisabled(true);
      const session = await connect();
      setSession(session);

      // Get the connected wallet address from the session
      const accounts = session?.accounts || [];
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        localStorage.setItem("walletAddress", accounts[0]); // Save to localStorage
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDisabled(false);
    }
  }

  useEffect(() => {
    const storedAddress = localStorage.getItem("walletAddress");
    if (storedAddress) {
      setWalletAddress(storedAddress);
    }
  }, []);

  return (
    <>
      <button onClick={onConnect} disabled={disabled}>
        Connect Wallet
      </button>
      {walletAddress && <div>Connected Wallet Address: {walletAddress}</div>}
      <button
        onClick={async () => {
          const response = await request({
            topic: session?.topic,
            chainId: "eip155:1",
            request: {
              id: 1,
              jsonrpc: "2.0",
              method: "personal_sign",
              params: [
                {
                  from: "0x1456225dE90927193F7A171E64a600416f96f2C8",
                  to: "0x1456225dE90927193F7A171E64a600416f96f2C8",
                  data: "0x",
                  nonce: "0x00",
                  gasPrice: "0xbb5e",
                  gas: "0x5208",
                  value: "0x00",
                  amount: "23",
                  symbol: "Usdt",
                },
              ],
            },
          });
          console.log(response);
        }}
        disabled={disabled}
      >
        Send Transaction
      </button>

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
