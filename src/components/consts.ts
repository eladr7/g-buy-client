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

export type StoreAction = {
  type: string;
  category: string;
  item?: ItemData;
  id?: number;
}

export type dispatchFunc =  ({ type, category, item, id }: StoreAction) => void;