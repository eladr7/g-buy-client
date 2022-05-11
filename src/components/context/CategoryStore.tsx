import { makeAutoObservable, observable } from "mobx";
import { fromUtf8, SecretNetworkClient } from "secretjs";
import {
  ItemData,
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

const CONTRACT_ADDRESS = "secret16ypyj8ydfy88axst8a8klhqef5t5zyjqkc3nst";

const addItemToCategory = async (
  secretjsClient: SecretNetworkClient,
  contractHash: string,
  item: ItemData
) => {
  const result = await secretjsClient.tx.compute.executeContract(
    {
      sender: secretjsClient.address,
      contractAddress: CONTRACT_ADDRESS,
      codeHash: contractHash, // optional but way faster
      msg: {
        add_item: {
          ...item.static_data,
        },
      },
      sentFunds: [], // optional
    },
    {
      gasLimit: 100_000,
    }
  );
  const {
    add_item: { status },
  } = JSON.parse(fromUtf8(result.data[0])) as AddItemResult;

  if (status !== SUCCESS_STATUS) {
    alert("Item update failed");
    throw new TypeError("Failed to add item");
  }

  return item;
};

// MobX implementation
export class CategoryStore {
  category: string;
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
  }

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

    if (result.status !== SUCCESS_STATUS) {
      alert("Fethcing the items failed " + result.status);
      return [];
    }

    this.store.items = result.items;
    this.store.contactData = result.contact_data;
    this.store.userItems = result.user_items;
    this.store.loaded = true;
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
        sentFunds: [], // optional
      },
      {
        gasLimit: 100_000,
      }
    );
    try {
      const {
        update_item: { status },
      } = JSON.parse(fromUtf8(result.data[0])) as UpdateItemResult;

      return status === SUCCESS_STATUS;
    } catch {
      return result.data.length > 0;
    }
  }

  async updateItemInLocalStore(url: string, userUpdateData: UserItemDetails) {
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
        alert("Cannot participate with 0 items");
        return;
      }

      this.store.userItems.push({
        url: url!,
        quantity: userUpdateData!.quantity,
      });
      this.store.items[itemIndex].current_group_size! +=
        userUpdateData!.quantity;
      this.store.contactData = {
        delivery_address: userUpdateData.deliveryAddress,
        email: userUpdateData.email,
      };
      return;
    }

    // Existing user

    let diff =
      userUpdateData!.quantity - this.store.userItems[userItemIndex].quantity;
    this.store.items[itemIndex].current_group_size! += diff;
    this.store.userItems[userItemIndex].quantity! = userUpdateData!.quantity;

    if (this.store.userItems[userItemIndex].quantity === 0) {
      // Remove this item from the user's items
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
