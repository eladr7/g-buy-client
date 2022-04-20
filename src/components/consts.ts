export const Categories = [
    "Laptops",
    "Keyboards",
    "Mouses",
    "Mouse pads",
];

export type ItemData = {
  productName: string;
  currentPrice: number;
  wantedPrice: number;
  groupSizeGoal: number;
  id: number;
};

export type CategoryStore = {
  items: ItemData[];
  loaded: boolean
}

export type CategoriesStore = {
  [items: string]: CategoryStore;
}

export const STORE_ACTIONS = {
  LOAD_ITEMS: "LOAD_ITEMS",
  APPEND_ITEM: "APPEND_ITEM",
  REMOVE_ITEM: "REMOVE_ITEM"
}

export type StoreActionData = {
  category: string;
  item?: ItemData;
  items?: ItemData[];
  id?: number;
}

export type StoreAction = {
  type: string;
  data: StoreActionData
}

export type DispatchFunc =  ({ type, data }: StoreAction) => void;
export type AsyncDispatchFunc = (action: StoreAction) => void;

