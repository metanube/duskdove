"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk";

let coinbaseProviderInstance: any = null;

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [currentWallet, setCurrentWallet] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [ensDomain, setEnsDomain] = useState<string>(""); // ENS input field
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null); // Resolved ENS address
  const [isVerified, setIsVerified] = useState<boolean | null>(null); // Wallet and ENS match status
  const [metadata, setMetadata] = useState<Record<string, string | null> | null>(null); // ENS metadata
  const [currentHandle, setCurrentHandle] = useState<string | null>("DefaultHandle.bsky.social"); // Mock handle

  const buttonStyles = {
    padding: "10px 20px",
    fontSize: "16px",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  const handleError = (error: any, defaultMessage: string) => {
    console.error(error);
    setErrorMessage(error.message || defaultMessage);
  };

  const connectWallet = async (walletType: "metamask" | "coinbase") => {
    try {
      setWalletAddress(null);
      setErrorMessage(null);
      setIsVerified(null);

      let provider;

      if (walletType === "metamask") {
        if (!window.ethereum) {
          throw new Error("MetaMask is not installed. Please install it to connect.");
        }

        await window.ethereum.request({ method: "eth_requestAccounts" });
        provider = new ethers.BrowserProvider(window.ethereum);
        setCurrentWallet("metamask");
      } else if (walletType === "coinbase") {
        const coinbaseWallet = new CoinbaseWalletSDK({
          appName: "DuskDove",
          rpc: process.env.NEXT_PUBLIC_INFURA_URL,
        });

        coinbaseProviderInstance = coinbaseWallet.makeWeb3Provider();
        await coinbaseProviderInstance.request({ method: "eth_requestAccounts" });
        provider = new ethers.BrowserProvider(coinbaseProviderInstance);
        setCurrentWallet("coinbase");
      }

      const accounts = await provider.listAccounts();
      if (!accounts || accounts.length === 0) throw new Error("No accounts found.");
      const address = await accounts[0].getAddress();

      setWalletAddress(address);
    } catch (error: any) {
      handleError(error, `Failed to connect to ${walletType}.`);
    }
  };

  const resolveENS = async () => {
    try {
      if (!walletAddress) {
        throw new Error("No wallet connected. Please connect a wallet to proceed.");
      }

      if (!ensDomain) {
        throw new Error("Please enter an ENS domain.");
      }

      const normalizedDomain = ensDomain.trim().toLowerCase().normalize("NFKC");
      const ensRegex = /^[a-z0-9\u00a1-\uffff-]+(?:\.[a-z0-9\u00a1-\uffff-]+)*\.eth$/iu;
      if (!ensRegex.test(normalizedDomain)) {
        throw new Error(
          "Invalid ENS domain format. Please ensure it is valid, supports emojis, or ends with .eth."
        );
      }

      console.log(`Resolving ENS: ${normalizedDomain}`);

      const INFURA_URL = process.env.NEXT_PUBLIC_INFURA_URL;
      if (!INFURA_URL) {
        throw new Error("Infura URL is not configured. Please check your environment variables.");
      }

      const provider = new ethers.JsonRpcProvider(INFURA_URL);
      const address = await provider.resolveName(normalizedDomain);

      if (!address) {
        setResolvedAddress(null);
        setIsVerified(null);
        throw new Error("The ENS domain does not have a configured Ethereum address.");
      }

      setResolvedAddress(address);
      setIsVerified(walletAddress?.toLowerCase() === address.toLowerCase());
      setMetadata(null); // Reset metadata for new domain
    } catch (error: any) {
      handleError(error, "Failed to resolve ENS domain.");
    }
  };

  const fetchAllMetadata = async () => {
    try {
      if (!walletAddress) {
        throw new Error("No wallet connected. Please connect a wallet to proceed.");
      }

      if (!resolvedAddress) {
        throw new Error("Please resolve the ENS domain first.");
      }

      console.log(`Using Infura URL: ${process.env.NEXT_PUBLIC_INFURA_URL}`);

      const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_INFURA_URL);
      const resolver = await provider.getResolver(ensDomain);

      if (!resolver) {
        throw new Error("No resolver found for this ENS domain.");
      }

      // Predefined fields to fetch
      const fields = ["avatar", "com.twitter", "email", "github", "bluesky"];
      const fetchedMetadata: Record<string, string | null> = {};

      for (const field of fields) {
        const value = await resolver.getText(field);
        fetchedMetadata[field] = value || "Not available";
      }

      setMetadata(fetchedMetadata);
    } catch (error: any) {
      handleError(error, "Failed to fetch ENS metadata.");
    }
  };

  const setHandle = () => {
    if (!walletAddress) {
      setErrorMessage("No wallet connected. Please connect a wallet to set your handle.");
      return;
    }

    if (isVerified) {
      setCurrentHandle(ensDomain); // Only use the ENS domain as the new handle
    } else {
      setErrorMessage("Cannot set handle: ENS domain is not verified with the connected wallet.");
    }
  };

  useEffect(() => {
    setErrorMessage(null);
    setIsVerified(null);
  }, [ensDomain]);

  return (
    <main style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial, sans-serif" }}>
      <h1>Welcome to DuskDove, a PoC by metaNube.eth</h1>
      <p>Let’s connect a wallet, verify an ENS domain, and set it as your Bluesky handle!</p>

      <div>
        <button
          onClick={() => connectWallet("metamask")}
          style={{ ...buttonStyles, backgroundColor: "#007bff", margin: "10px" }}
        >
          Connect MetaMask
        </button>
        <button
          onClick={() => connectWallet("coinbase")}
          style={{ ...buttonStyles, backgroundColor: "#28a745", margin: "10px" }}
        >
          Connect Coinbase Wallet
        </button>
      </div>

      <div style={{ marginTop: "30px" }}>
        <input
          type="text"
          placeholder="Enter ENS domain (e.g., example.eth)"
          value={ensDomain}
          onChange={(e) => setEnsDomain(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            width: "300px",
            marginRight: "10px",
          }}
        />
        <button
          onClick={resolveENS}
          style={{ ...buttonStyles, backgroundColor: "#6c757d" }}
        >
          Resolve ENS
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={fetchAllMetadata}
          style={{ ...buttonStyles, backgroundColor: "#ffc107" }}
        >
          Fetch Metadata
        </button>
        <button
          onClick={setHandle}
          style={{ ...buttonStyles, backgroundColor: "#17a2b8", marginLeft: "10px" }}
        >
          Set ENS as Handle
        </button>
      </div>

      {resolvedAddress && (
        <p style={{ marginTop: "20px", fontSize: "18px", color: "blue" }}>
          Resolved Address: {resolvedAddress}
        </p>
      )}

      {isVerified !== null && (
        <p
          style={{
            marginTop: "20px",
            fontSize: "18px",
            color: isVerified ? "green" : "red",
          }}
        >
          {isVerified
            ? "The connected wallet matches the ENS domain!"
            : "The connected wallet does NOT match the ENS domain."}
        </p>
      )}

      {metadata && (
        <div style={{ marginTop: "20px", textAlign: "left", maxWidth: "400px", margin: "auto" }}>
          <h3>ENS Metadata</h3>
          {Object.entries(metadata).map(([key, value]) => (
            <p key={key}>
              <strong>{key.replace("com.", "").toUpperCase()}:</strong> {value || "Not available"}
            </p>
          ))}
        </div>
      )}

      {walletAddress && (
        <p style={{ marginTop: "20px", fontSize: "18px", color: "green" }}>
          Connected Wallet ({currentWallet}): {walletAddress}
        </p>
      )}

      <div style={{ marginTop: "100px", textAlign: "center" }}>
        <h2>Bluesky Mock Profile</h2>
        <p>
          <strong>Current Handle:</strong> {currentHandle}
        </p>
      </div>

      {errorMessage && (
        <p style={{ marginTop: "20px", fontSize: "16px", color: "red" }}>{errorMessage}</p>
      )}
    </main>
  );
}
