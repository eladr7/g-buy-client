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

export type StaticItemData = {
  name: string;
  category: string;
  url: string;
  imgUrl: string;
  sellerAddress: string;
  sellerEmail: string;
  price: number;
  wantedPrice: number;
  groupSizeGoal: number;
}

export type DynamicItemData = {
  currentGroupSize?: number;
}

export type ItemData = {
  staticData: StaticItemData;
  dynamicData: DynamicItemData;
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
  fetchedData?: CategoryStore;
  url?: string;
  userUpdateData?: UserItemDetails;
  oldQuantity?: number;
}

export type StoreAction = {
  type: string;
  data: StoreActionData
}

export type DispatchFunc =  ({ type, data }: StoreAction) => void;
export type AsyncDispatchFunc = (action: StoreAction) => Promise<void>;

