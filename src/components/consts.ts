export const Categories = [
    "Laptops",
    "Keyboards",
    "Mouses",
    "Mouse-pads",
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
  img_url: string;
  seller_address: string;
  seller_email: string;
  price: string;
  wanted_price: string;
  group_size_goal: number;
}

export type ItemData = {
  static_data: StaticItemData;
  current_group_size?: number;
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
  delivery_address: string;
}

export type CategoryStoreData = {
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
  fetchedData?: CategoryStoreData;
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
export type RemoveCategoryItem = (url: string) => Promise<void>;

export const SUCCESS_STATUS = "success";