import React, { createContext, useEffect, useState } from "react";
import { SecretNetworkClient } from "secretjs";

// This endpoint is a reverse proxy for a main-net scrt node
const NODE_URL = "https://elad.uksouth.cloudapp.azure.com";
const CHAIN_ID = "secret-4";
// const CONTRACT_ADDRESS = "";
// const CODE_ID = ;

declare global {
  interface Window {
    keplr: any;
    getOfflineSignerOnlyAmino: any;
    getEnigmaUtils: any;
  }
}

interface IContextProps {
  secretjs: SecretNetworkClient | undefined;
  keplrReady: boolean;
}

export const SecretjsContext = createContext({} as IContextProps);

interface SecretjsContextProps {}
export const SecretjsContextProvider: React.FC<SecretjsContextProps> = (
  props
) => {
  const [secretjs, setSecretjs] = useState<SecretNetworkClient>();
  const [keplrReady, setKeplrReady] = useState<boolean>(false);

  const setupKeplr = async () => {
    const sleep = (ms: number) =>
      new Promise((accept) => setTimeout(accept, ms));

    // Wait for Keplr to be injected to the page
    while (
      !window.keplr ||
      !window.getOfflineSignerOnlyAmino ||
      !window.getEnigmaUtils
    ) {
      await sleep(10);
    }

    // Enable Keplr.
    // This pops-up a window for the user to allow keplr access to the webpage.
    await window.keplr.enable(CHAIN_ID);

    const keplrOfflineSigner = window.getOfflineSignerOnlyAmino(CHAIN_ID);
    const [{ address: myAddress }] = await keplrOfflineSigner.getAccounts();

    let secretjs = await SecretNetworkClient.create({
      grpcWebUrl: NODE_URL,
      chainId: CHAIN_ID,
      wallet: keplrOfflineSigner,
      walletAddress: myAddress,
      encryptionUtils: window.getEnigmaUtils(CHAIN_ID),
    });

    setSecretjs(secretjs);
    setKeplrReady(true);
  };

  useEffect(() => {
    (async () => {
      await setupKeplr();
    })();
  }, []);

  return (
    <SecretjsContext.Provider value={{ secretjs, keplrReady }}>
      {props.children}
    </SecretjsContext.Provider>
  );
};
