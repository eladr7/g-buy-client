import React, { useEffect, useState } from "react";
import { ItemData, ItemQuickViewData, UserItemDetails } from "./consts";
import ItemsViewLoader from "./itemComponents/ItemsViewLoader";
import { ItemQuickView } from "./itemComponents/ItemQuickView";
import { CategoryStore } from "./context/CategoryStore";
import { observer } from "mobx-react";
import { SecretjsStore, secretjsStore } from "./context/SecretjsStore";

interface ItemsGalleryProps {
  category: string;
  store: CategoryStore;
}

const ItemsGallery: React.FC<ItemsGalleryProps> = ({ category, store }) => {
  const [itemQuickView, setItemQuickView] = useState<ItemQuickViewData>();
  const [modalActive, setModalActive] = useState<boolean>(false);

  const [searchPhrase, setSearchPhrase] = useState<string>("");
  useEffect(() => {
    store.getItemsFromServer(
      secretjsStore.secretjsClient!,
      secretjsStore.contractHash
    );
  }, [store.store]);

  const addItem = () => {
    let itemQuickViewData: ItemQuickViewData = {
      item: null,
      accountAddress: secretjsStore.secretjs!.address,
      userItemDetails: null,
    };
    setModalActive(true);
    setItemQuickView(itemQuickViewData);
  };

  const openModal = (itemQuickViewData: ItemQuickViewData) => {
    setModalActive(true);
    setItemQuickView(itemQuickViewData);
  };

  const closeModal = () => {
    setModalActive(false);
  };

  const removeCategoryItem = async (url: string) => {
    await store.removeItem(
      secretjsStore.secretjs,
      secretjsStore.contractHash,
      url
    );
  };

  const addCategoryItem =
    (store: CategoryStore, secretjsStore: SecretjsStore) =>
    async (item: ItemData) => {
      await store.addItemToCategory(
        secretjsStore.secretjs,
        secretjsStore.contractHash,
        item
      );
    };

  const updateCategoryItem = async (
    url: string,
    item: ItemData,
    userUpdateData: UserItemDetails,
    oldQuantity: number
  ) => {
    await store.updateItem(
      secretjsStore.secretjs,
      secretjsStore.contractHash,
      url,
      item,
      userUpdateData,
      oldQuantity
    );
  };

  let itemsView = ItemsViewLoader.getFilteredItemsView(
    store.store,
    searchPhrase,
    openModal,
    removeCategoryItem
  );

  return (
    <div className="clear-fix">
      <input
        type="search"
        placeholder="Search for items"
        onChange={(e) => setSearchPhrase(e.target.value)}
      />
      <button title="Add a new item" onClick={addItem}>
        +
      </button>
      {itemsView}
      {itemQuickView && (
        <ItemQuickView
          itemQuickViewData={itemQuickView}
          openModal={modalActive}
          closeModal={closeModal}
          category={category}
          addCategoryItem={addCategoryItem(store, secretjsStore)}
          updateCategoryItem={updateCategoryItem}
        />
      )}
    </div>
  );
};

const ObservedItemsGallery = observer(ItemsGallery);
export default ObservedItemsGallery;
