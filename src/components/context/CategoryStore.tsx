import { makeAutoObservable, observable } from "mobx";
import { fromUtf8, SecretNetworkClient, Wallet } from "secretjs";
import {
  ItemData,
  ContactData,
  UserItemDetails,
  UserItem,
  CategoryStoreData,
  SUCCESS_STATUS,
  Categories,
} from "../consts";

type SetViewingKeyResult = {
  set_viewing_key: {
    status: string;
  };
};

type FetchedItems = {
  fetched_items: {
    items: ItemData[];
    user_items: UserItem[];
    contact_data: ContactData;
    status: string;
  };
};

type AddItemResult = {
  add_item: {
    status: string;
  };
};

type UpdateItemResult = {
  update_item: {
    status: string;
  };
};

type RemoveItemResult = {
  remove_item: {
    status: string;
  };
};

// const CONTRACT_ADDRESS = "secret1ncfk9dqfdvd9gcvkfkcrgj0jpludkk9wsm5g5l";
const CONTRACT_ADDRESS = "secret16ypyj8ydfy88axst8a8klhqef5t5zyjqkc3nst";
const CODE_ID = 8914;
// const CODE_ID = 8815;

// This endpoint is a reverse proxy for a main-net scrt node
// const NODE_URL = "https://elad.uksouth.cloudapp.azure.com";
// const CHAIN_ID = "secret-4";

const NODE_URL = "https://lior.node.scrtlabs.com";
const CHAIN_ID = "pulsar-2";

const addItemToCategory = async (
  secretjsClient: SecretNetworkClient,
  contractHash: string,
  item: ItemData
) => {
  // return true;
  // const contractHash = await secretjsClient.query.compute.codeHash(CODE_ID);
  debugger;
  const result = await secretjsClient.tx.compute.executeContract(
    {
      sender: secretjsClient.address,
      contractAddress: CONTRACT_ADDRESS,
      codeHash: contractHash, // optional but way faster
      msg: {
        add_item: {
          ...item.static_data, // elad: Adjust fileds names to server (e.g. sellerEmail... )
        },
      },
      sentFunds: [], // optional
    },
    {
      gasLimit: 100_000,
    }
  );
  debugger;
  const {
    add_item: { status },
  } = JSON.parse(fromUtf8(result.data[0])) as AddItemResult;

  // Elad: Charge the user!
  if (status !== SUCCESS_STATUS) {
    alert("Item update failed");
    throw new TypeError("Failed to add item");
  }

  return item;
};

// MobX implementation
export class CategoryStore {
  category: string;
  //   secretjsClient: SecretNetworkClient | null = null;
  store: CategoryStoreData = {
    items: [],
    userItems: [],
    contactData: { email: "", delivery_address: "" },
    loaded: false,
  };

  constructor(category: string) {
    makeAutoObservable(
      this,
      {
        store: observable,
      },
      { autoBind: true }
    );
    this.category = category;
    // this.loadSecretjs();
  }

  //   loadSecretjs = () => {
  //     const wallet = new Wallet(
  //       "leave mask dinner title adult satisfy track crumble test concert damp bracket eager turtle laptop actual lesson divert hub behave risk write daughter tuition"
  //     );
  //     const myAddress = wallet.address;
  //     SecretNetworkClient.create({
  //       grpcWebUrl: NODE_URL,
  //       chainId: CHAIN_ID,
  //       wallet: wallet,
  //       walletAddress: myAddress,
  //       // encryptionUtils: window.getEnigmaUtils(CHAIN_ID),
  //     })
  //       .then((secretjsClient) => (this.secretjsClient = secretjsClient))
  //       .catch((e) => e);
  //   };

  //   setSecretjs(secretjs: SecretNetworkClient) {
  //     this.secretjs = secretjs;
  //   }

  //   get secretjs() {
  //     return this.secretjsClient;
  //   }

  get items() {
    return this.store.items;
  }

  get userItems() {
    return this.store.userItems;
  }

  get contactData() {
    return this.store.contactData;
  }

  get loaded() {
    return this.store.loaded;
  }

  async makePayment(
    secretjsClient: SecretNetworkClient,
    oldQuantity: number,
    newQuantity: number,
    wantedPrice: string
  ) {
    // secretcli tx bank send secret124yc2x4v7n3qe3q0zwd8a4vznm4247uynp7efr secret1nxcwlf5x86yluxr92fretj6yu77z6lnjtugqes 50000uscrt
    // const contractHash = await secretjsClient.query.compute.codeHash(CODE_ID);
    debugger;
    let ammountToPay: number = 0;
    if (newQuantity - oldQuantity < 0) {
      // The user should be refunded, the refund will be made in the server side.
      // But the user will pay the transaction fee
      ammountToPay = 500000;
    } else {
      ammountToPay = parseInt(wantedPrice) * (newQuantity - oldQuantity);
    }

    const tx = await secretjsClient.tx.bank.send(
      {
        amount: [{ amount: ammountToPay.toString(), denom: "uscrt" }],
        fromAddress: secretjsClient.address,
        toAddress: CONTRACT_ADDRESS, // Set recipient to sender for testing
      },
      {
        gasLimit: 20_000,
        gasPriceInFeeDenom: 0.25,
        memo: "Move payment to the site owner",
      }
    );

    return tx.code === 0;
  }

  async setViewingKeyInServer(
    secretjsClient: SecretNetworkClient,
    contractHash: string,
    viewingKey: string
  ) {
    // return true;
    // const contractHash = await secretjsClient.query.compute.codeHash(CODE_ID);
    const result = await secretjsClient.tx.compute.executeContract(
      {
        sender: secretjsClient.address,
        contractAddress: CONTRACT_ADDRESS,
        codeHash: contractHash, // optional but way faster
        msg: {
          set_viewing_key: {
            key: viewingKey,
          },
        },
        sentFunds: [], // optional
      },
      {
        gasLimit: 100_000,
      }
    );

    const {
      set_viewing_key: { status },
    } = JSON.parse(fromUtf8(result.data[0])) as SetViewingKeyResult;

    // Elad: Charge/refund the user!
    return status === SUCCESS_STATUS;
  }

  async getItemsFromServer(
    secretjsClient: SecretNetworkClient,
    contractHash: string
  ) {
    if (this.store.loaded === true) {
      return this.store;
    }
    const viewingKey = localStorage.getItem("viewing-key");
    // const contractHash = await secretjsClient.query.compute.codeHash(CODE_ID);
    const result = await secretjsClient.query.compute
      .queryContract({
        contractAddress: CONTRACT_ADDRESS,
        codeHash: contractHash,
        query: {
          get_items: {
            category: this.category,
            address: secretjsClient.address,
            key: viewingKey,
          },
        },
      })
      .then((result) => result)
      .catch((e) => e);
    // debugger;
    // const {
    //   fetched_items: { items, user_items, contact_data, status },
    // } = result as FetchedItems;
    // } = JSON.parse(fromUtf8(result)) as FetchedItems;

    if (result.status !== SUCCESS_STATUS) {
      alert("Fethcing the items failed " + result.status);
      return [];
    }

    this.store.items = result.items;
    this.store.contactData = result.contact_data;
    this.store.userItems = result.user_items;
    this.store.loaded = true;

    // return this.store;
  }

  addItemToCategory(
    secretjsClient: SecretNetworkClient,
    contractHash: string,
    item: ItemData
  ) {
    addItemToCategory(secretjsClient, contractHash, item)
      .then((item: ItemData) => this.store.items.push(item))
      .catch((e) => console.log(e));
  }

  async removeItem(
    secretjsClient: SecretNetworkClient,
    contractHash: string,
    url: string
  ) {
    debugger;
    // return true;
    const viewingKey = localStorage.getItem("viewing-key");
    const result = await secretjsClient.tx.compute.executeContract(
      {
        sender: secretjsClient.address,
        contractAddress: CONTRACT_ADDRESS,
        codeHash: contractHash, // optional but way faster
        msg: {
          remove_item: {
            category: this.category,
            url,
            verification_key: viewingKey,
          },
        },
        sentFunds: [], // optional
      },
      {
        gasLimit: 100_000,
      }
    );
    try {
      const {
        remove_item: { status },
      } = JSON.parse(fromUtf8(result.data[0])) as RemoveItemResult;

      // Elad: Charge/refund the user!
      if (status !== SUCCESS_STATUS) {
        alert("Item removal failed");
        throw new TypeError("Item removal failed");
      }
    } catch {
      if (result.data.length > 0) {
        this.store.items = this.store.items.filter(
          (item: ItemData) => item.static_data.url !== url
        );
      }
    }

    // return this.store;
  }

  async updateItem(
    secretjsClient: SecretNetworkClient,
    contractHash: string,
    url: string,
    item: ItemData,
    userUpdateData: UserItemDetails,
    oldQuantity: number
  ) {
    let newQuantity = userUpdateData.quantity;

    if (oldQuantity === newQuantity) {
      alert("Same quantity - nothing to update!");
      return;
    }
    debugger;
    let wantedPrice = item.static_data.wanted_price;
    let payed = await this.makePayment(
      secretjsClient,
      oldQuantity,
      newQuantity,
      wantedPrice
    );
    if (!payed) {
      alert("Payment failed");
      return;
    }

    let succeded = await this.updateItemInServer(
      secretjsClient,
      contractHash,
      url,
      userUpdateData
    );

    if (succeded) {
      this.updateItemInLocalStore(url, userUpdateData);
      return;
    }
    alert("Item update failed");
    throw new TypeError("Item update failed");
  }

  async updateItemInServer(
    secretjsClient: SecretNetworkClient,
    contractHash: string,
    url: string,
    userUpdateData: UserItemDetails
  ) {
    // return true;
    // const contractHash = await secretjsClient.query.compute.codeHash(CODE_ID);
    debugger;

    const result = await secretjsClient.tx.compute.executeContract(
      {
        sender: secretjsClient.address,
        contractAddress: CONTRACT_ADDRESS,
        codeHash: contractHash, // optional but way faster
        msg: {
          update_item: {
            category: this.category,
            url,
            user_details: {
              account_address: userUpdateData.accountAddress,
              contact_data: {
                email: userUpdateData.email,
                delivery_address: userUpdateData.deliveryAddress,
              },
              quantity: userUpdateData.quantity,
            },
          },
        },
        sentFunds: [{ denom: "uscrt", amount: "140000000" }], // optional
      },
      {
        gasLimit: 100_000,
      }
    );
    debugger;
    try {
      const {
        update_item: { status },
      } = JSON.parse(fromUtf8(result.data[0])) as UpdateItemResult;

      // Elad: Charge/refund the user!
      return status === SUCCESS_STATUS;
    } catch {
      return result.data.length > 0;
    }
  }

  async updateItemInLocalStore(url: string, userUpdateData: UserItemDetails) {
    debugger;
    // For updating the item's view
    let itemIndex = this.store.items.findIndex(
      (item: ItemData) => item.static_data.url === url
    );
    if (itemIndex === -1) {
      return;
    }

    // For updating the user count for this item
    let userItemIndex = this.store.userItems.findIndex(
      (userItem: UserItem) => userItem.url === url
    );

    if (userItemIndex === -1) {
      // New user

      if (userUpdateData!.quantity === 0) {
        // Elad - enforce this in the form itself
        alert("Cannot participate with 0 items");
        return;
      }

      this.store.userItems.push({
        url: url!,
        quantity: userUpdateData!.quantity,
      });
      this.store.items[itemIndex].current_group_size! +=
        userUpdateData!.quantity;
      debugger;
      this.store.contactData = {
        delivery_address: userUpdateData.deliveryAddress,
        email: userUpdateData.email,
      };
      // this.store.contactData.delivery_address = userUpdateData.deliveryAddress;
      // this.store.contactData.email = userUpdateData.email;
      return;
    }

    // Existing user

    let diff =
      userUpdateData!.quantity - this.store.userItems[userItemIndex].quantity;
    this.store.items[itemIndex].current_group_size! += diff;
    this.store.userItems[userItemIndex].quantity! = userUpdateData!.quantity;

    if (this.store.userItems[userItemIndex].quantity === 0) {
      // Remove this item from the user's items
      // Elad: Refund the user!
      this.store.userItems.splice(userItemIndex, 1);
    }

    if (
      this.store.items[itemIndex].current_group_size! === 0 ||
      this.store.items[itemIndex].current_group_size! >=
        this.store.items[itemIndex].static_data.group_size_goal
    ) {
      // Remove the item entirely, as it has no subscribers.
      this.store.items.splice(itemIndex, 1);
    }
  }
}

export const laptopsStore = new CategoryStore(Categories[0].toLowerCase());

export const keyboardsStore = new CategoryStore(Categories[1].toLowerCase());

export const mousesStore = new CategoryStore(Categories[2].toLowerCase());

export const mousePadsStore = new CategoryStore(Categories[3].toLowerCase());
