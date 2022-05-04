import { makeAutoObservable, observable } from "mobx";
import { SecretNetworkClient, Wallet } from "secretjs";

const CONTRACT_ADDRESS = "secret16ypyj8ydfy88axst8a8klhqef5t5zyjqkc3nst";
const CODE_ID = 8914;

// This endpoint is a reverse proxy for a main-net scrt node
// const NODE_URL = "https://elad.uksouth.cloudapp.azure.com";
// const CHAIN_ID = "secret-4";

const NODE_URL = "https://lior.node.scrtlabs.com";
const CHAIN_ID = "pulsar-2";

declare global {
  interface Window {
    keplr: any;
    getOfflineSignerOnlyAmino: any;
    getEnigmaUtils: any;
  }
}

export class SecretjsStore {
  secretjsClient: SecretNetworkClient | null;
  keplrReady: boolean;
  contractHash: string = "";

  constructor() {
    makeAutoObservable(
      this,
      {
        secretjsClient: observable,
        keplrReady: observable,
        contractHash: observable,
      },
      {
        autoBind: true,
      }
    );

    this.secretjsClient = null;
    this.keplrReady = false;
    this.initializeSecretjs();
  }

  get secretjs() {
    return this.secretjsClient!;
  }

  initializeSecretjs() {
    const sleep = (ms: number) =>
      new Promise((accept) => setTimeout(accept, ms));
    // Wait for Keplr to be injected to the page
    // while (
    //   !window.keplr ||
    //   !window.getOfflineSignerOnlyAmino ||
    //   !window.getEnigmaUtils
    // ) {
    //   await sleep(10);
    // }

    // // Enable Keplr.
    // // This pops-up a window for the user to allow keplr access to the webpage.
    // await window.keplr.enable(CHAIN_ID);

    // const keplrOfflineSigner = window.getOfflineSignerOnlyAmino(CHAIN_ID);
    // const [{ address: myAddress }] = await keplrOfflineSigner.getAccounts();
    const wallet = new Wallet(
      "leave mask dinner title adult satisfy track crumble test concert damp bracket eager turtle laptop actual lesson divert hub behave risk write daughter tuition"
    );
    const myAddress = wallet.address;
    SecretNetworkClient.create({
      grpcWebUrl: NODE_URL,
      chainId: CHAIN_ID,
      wallet: wallet,
      walletAddress: myAddress,
      // encryptionUtils: window.getEnigmaUtils(CHAIN_ID),
    })
      .then((secretjsClient) => {
        this.secretjsClient = secretjsClient;
        this.keplrReady = true;

        debugger;
        this.secretjsClient.query.compute
          .codeHash(CODE_ID)
          .then((contractHash: string) => {
            debugger;
            this.contractHash = contractHash;
          })
          .catch((e: string) => console.log(e));
      })
      .catch((e) => e);

    // if (this.secretjsClient) {
    //   this.secretjsClient.query.compute
    //     .codeHash(CODE_ID)
    //     .then((contractHash: string) => (this.contractHash = contractHash))
    //     .catch((e: string) => console.log(e));
    // }
  }
}
export const secretjsStore = new SecretjsStore();

// export default SecretjsStore;
