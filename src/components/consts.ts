export const Categories = [
    "Laptops",
    "Keyboards",
    "Mouses",
    "Mouse pads",
];

export type UserItemDetails = {
  accountAddress: string;
  email: string;
  deliveryAddress: string;
  quantity: number;
}

export type ItemData = {
  name: string;
  category: string;
  url: string;
  imgUrl: string;
  creatorAddress: string;
  price: number;
  wantedPrice: number;
  groupSizeGoal: number;
  currentGroupSize?: number;
  usersDetails: UserItemDetails[];
};

export type ItemQuickViewData = {
  item: ItemData | null,
  accountAddress: string,
  usersItemDetails: UserItemDetails | null
}

export type CategoryStore = {
  items: ItemData[];
  loaded: boolean
}

export const STORE_ACTIONS = {
  LOAD_ITEMS: "LOAD_ITEMS",
  APPEND_ITEM: "APPEND_ITEM",
  UPDATE_ITEM: "UPDATE_ITEM",
  REMOVE_ITEM: "REMOVE_ITEM"
}

export type StoreActionData = {
  category: string;
  item?: ItemData;
  items?: ItemData[];
  url?: string;
  userUpdateData?: UserItemDetails;
}

export type StoreAction = {
  type: string;
  data: StoreActionData
}

export type DispatchFunc =  ({ type, data }: StoreAction) => void;
export type AsyncDispatchFunc = (action: StoreAction) => Promise<void>;

