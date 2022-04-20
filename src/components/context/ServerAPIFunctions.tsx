import { fromUtf8, SecretNetworkClient } from "secretjs";
import { ItemData } from "../consts";

type FetchedItems = {
  fetched_items: {
    items: ItemData[];
    status: string;
  };
};

const SUCCESS_STATUS = "Fetched successfully";

const CONTRACT_ADDRESS = "secret13ut7y0jzgjsh6qn3hrn6t2lspezxpr3tjptdn8";
const CODE_ID = 460;

// This endpoint is a reverse proxy for a main-net scrt node
const NODE_URL = "https://elad.uksouth.cloudapp.azure.com";
const CHAIN_ID = "secret-4";

export const getItemsFromServer = async (category: string, secretjs: any) => {
  let item: ItemData = {
    productName: "This is a " + category + " item",
    currentPrice: 1000,
    wantedPrice: 800,
    groupSizeGoal: 10,
    id: Math.random(),
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
