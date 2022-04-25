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
  sellerAddress: string;
  sellerEmail: string;
  price: number;
  wantedPrice: number;
  groupSizeGoal: number;
  currentGroupSize?: number;
};

export type UserItem = {
  url: string,
  quantity: number
}

export type ItemQuickViewData = {
  item: ItemData | null,
  accountAddress: string,
  userItemDetails: UserItemDetails | null
}

export type ContactData = {
  email: string;
  deliveryAddress: string;
}

export type CategoryStore = {
  items: ItemData[];
  userItems: UserItem[];
  contactData: ContactData;
  loaded: boolean;
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

