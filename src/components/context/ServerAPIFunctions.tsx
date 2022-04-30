import { fromUtf8, SecretNetworkClient } from "secretjs";
import {
  ItemData,
  ContactData,
  UserItemDetails,
  UserItem,
  CategoryStore,
} from "../consts";

type SetViewingKeyResult = {
  set_viewing_key: {
    status: boolean;
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
    status: boolean;
  };
};

type UpdateItemResult = {
  update_item: {
    status: boolean;
  };
};

type RemoveItemResult = {
  remove_item: {
    status: boolean;
  };
};

const SUCCESS_STATUS = "Fetched successfully";

const CONTRACT_ADDRESS = "secret13ut7y0jzgjsh6qn3hrn6t2lspezxpr3tjptdn8";
const CODE_ID = 460;

// This endpoint is a reverse proxy for a main-net scrt node
const NODE_URL = "https://elad.uksouth.cloudapp.azure.com";
const CHAIN_ID = "secret-4";

export const makePayment = async (
  secretjs: any,
  oldQuantity: number,
  newQuantity: number,
  wantedPrice: number
) => {
  // secretcli tx bank send secret124yc2x4v7n3qe3q0zwd8a4vznm4247uynp7efr secret1nxcwlf5x86yluxr92fretj6yu77z6lnjtugqes 50000uscrt
  const contractHash = await secretjs.query.compute.codeHash(CODE_ID);

  let ammountToPay: number = 0;
  if (newQuantity - oldQuantity < 0) {
    // The user should be refunded, the refund will be made in the server side.
    // But the user will pay the transaction fee
    ammountToPay = 100000;
  } else {
    ammountToPay = wantedPrice * (newQuantity - oldQuantity);
  }

  const tx = await secretjs.tx.bank.send(
    {
      amount: [{ amount: ammountToPay.toString(), denom: "uscrt" }],
      fromAddress: secretjs!.address,
      toAddress: CONTRACT_ADDRESS, // Set recipient to sender for testing
    },
    {
      gasLimit: 20_000,
      gasPriceInFeeDenom: 0.25,
      memo: "Move payment to the site owner",
    }
  );

  return tx.code === 0;

  // // The user wants to purchase more items
  // const tx2 = await secretjs.tx.compute.executeContract(
  //   {
  //     sender: secretjs!.address,
  //     contractAddress: CONTRACT_ADDRESS,
  //     codeHash: contractHash, // optional but way faster
  //     msg: {
  //       transfer: {
  //         recipient: CONTRACT_ADDRESS,
  //         amount: ammountToPay.toString(),
  //       },
  //     },
  //     sentFunds: [], // optional
  //   },
  //   {
  //     gasLimit: 100_000,
  //   }
  // );
};

export const setViewingKeyInServer = async (
  viewingKey: string,
  secretjs: any
) => {
  return true;
  const contractHash = await secretjs.query.compute.codeHash(CODE_ID);
  const result = await secretjs.tx.compute.executeContract(
    {
      sender: secretjs.address,
      contractAddress: CONTRACT_ADDRESS,
      codeHash: contractHash, // optional but way faster
      msg: {
        set_viewing_key: {
          key: { viewingKey },
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
  return status;
};

export const getItemsFromServer = async (category: string, secretjs: any) => {
  let item: ItemData = {
    staticData: {
      name: "This is a " + category + " item",
      category,
      price: 1000,
      wantedPrice: 800,
      groupSizeGoal: 10,
      url: "https://www.ebay.com/itm/294315699490?_trkparms=pageci%3A5c749228-c0c0-11ec-8401-0e6a9719235b%7Cparentrq%3A47a2d6d61800a7b252a3ea29fffeaf7c%7Ciid%3A1",
      imgUrl: "https://i.ebayimg.com/images/g/ZicAAOSw8klhlTWz/s-l225.webp",
      sellerAddress: secretjs.address,
      sellerEmail: "bla@bla.com",
    },
    dynamicData: {
      currentGroupSize: 1,
    },
  };

  let fetchedDataMock: CategoryStore = {
    items: [item],
    userItems: [
      {
        url: "https://www.ebay.com/itm/294315699490?_trkparms=pageci%3A5c749228-c0c0-11ec-8401-0e6a9719235b%7Cparentrq%3A47a2d6d61800a7b252a3ea29fffeaf7c%7Ciid%3A1",
        quantity: 1,
      },
    ],
    contactData: { email: "user@email.com", deliveryAddress: "cool user crib" },
    loaded: true,
  };

  return fetchedDataMock;
  const viewingKey = localStorage.getItem("viewing-key");
  const contractHash = await secretjs.query.compute.codeHash(CODE_ID);
  const result = await secretjs.query.compute.queryContract({
    address: CONTRACT_ADDRESS,
    codeHash: contractHash,
    query: {
      get_items: {
        category: category,
        address: secretjs.address,
        key: viewingKey,
      },
    },
  });

  const {
    fetched_items: { items, user_items, contact_data, status },
  } = JSON.parse(fromUtf8(result.data[0])) as FetchedItems;

  if (status !== SUCCESS_STATUS) {
    alert(status);
    return [];
  }

  let fetchedData: CategoryStore = {
    items,
    userItems: user_items,
    contactData: contact_data,
    loaded: true,
  };

  return fetchedData;
};

export const addItemToServer = async (
  category: string,
  itme: ItemData,
  secretjs: any
) => {
  return true;
  const contractHash = await secretjs.query.compute.codeHash(CODE_ID);
  const result = await secretjs.tx.compute.executeContract(
    {
      sender: secretjs.address,
      contractAddress: CONTRACT_ADDRESS,
      codeHash: contractHash, // optional but way faster
      msg: {
        add_item: {
          ...itme, // elad: Adjust fileds names to server (e.g. sellerEmail... )
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

  // Elad: Charge the user!
  return status;
};

export const updateItemInServer = async (
  category: string,
  url: string,
  userUpdateData: UserItemDetails,
  secretjs: any
) => {
  return true;
  const contractHash = await secretjs.query.compute.codeHash(CODE_ID);
  const result = await secretjs.tx.compute.executeContract(
    {
      sender: secretjs.address,
      contractAddress: CONTRACT_ADDRESS,
      codeHash: contractHash, // optional but way faster
      msg: {
        update_item: {
          category,
          url,
          userDetails: {
            personal: {
              account_address: userUpdateData.accountAddress,
              contact_data: {
                email: userUpdateData.email,
                delivery_address: userUpdateData.deliveryAddress,
              },
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

  const {
    update_item: { status },
  } = JSON.parse(fromUtf8(result.data[0])) as UpdateItemResult;

  // Elad: Charge/refund the user!
  return status;
};

export const removeItemFromServer = async (
  category: string,
  url: string,
  secretjs: any
) => {
  return true;
  const viewingKey = localStorage.getItem("viewing-key");
  const contractHash = await secretjs.query.compute.codeHash(CODE_ID);
  const result = await secretjs.tx.compute.executeContract(
    {
      sender: secretjs.address,
      contractAddress: CONTRACT_ADDRESS,
      codeHash: contractHash, // optional but way faster
      msg: {
        remove_item: {
          category,
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

  const {
    remove_item: { status },
  } = JSON.parse(fromUtf8(result.data[0])) as RemoveItemResult;

  // Elad: Charge/refund the user!
  return status;
};
