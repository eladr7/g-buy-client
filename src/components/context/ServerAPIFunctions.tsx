import { fromUtf8, SecretNetworkClient } from "secretjs";
import { ItemData, ItemUserDetails } from "../consts";

type FetchedItems = {
  fetched_items: {
    items: ItemData[];
    status: string;
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

export const getItemsFromServer = async (category: string, secretjs: any) => {
  let userDetails: ItemUserDetails = {
    accountAddress: secretjs.address,
    email: "bla@bla.com",
    deliveryAddress: "bla st, bla apt, bla  bla",
    quantity: 1,
  };
  let usersDetails = [userDetails];
  let item: ItemData = {
    name: "This is a " + category + " item",
    category,
    price: 1000,
    wantedPrice: 800,
    groupSizeGoal: 10,
    currentGroupSize: 1,
    url: "https://www.ebay.com/itm/294315699490?_trkparms=pageci%3A5c749228-c0c0-11ec-8401-0e6a9719235b%7Cparentrq%3A47a2d6d61800a7b252a3ea29fffeaf7c%7Ciid%3A1",
    imgLink: "https://i.ebayimg.com/images/g/EecAAOSwbBphibLC/s-l225.webp",
    creatoreAddress: secretjs.address,
    usersDetails,
  };

  return [item];
  const contractHash = await secretjs.query.compute.codeHash(CODE_ID);
  const result = await secretjs.query.compute.queryContract({
    address: CONTRACT_ADDRESS,
    codeHash: contractHash,
    query: { get_items: { category: category } },
  });

  const {
    fetched_items: { items, status },
  } = JSON.parse(fromUtf8(result.data[0])) as FetchedItems;

  if (status !== SUCCESS_STATUS) {
    alert(status);
    return [];
  }

  return items;
};

export const updateItemInServer = async (
  category: string,
  url: string,
  userUpdateData: ItemUserDetails,
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
          userUpdateData: { ...userUpdateData },
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

  return status;
};

export const removeItemFromServer = async (
  category: string,
  url: string,
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
        remove_item: {
          category,
          url,
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

  return status;
};
