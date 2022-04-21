import React, { useContext, useEffect, useState } from "react";
import { ItemQuickViewData, STORE_ACTIONS } from "./consts";
import { StoresContext } from "./context/StoresContextProvider";
import ItemsViewLoader from "./itemComponents/ItemsViewLoader";
import { ItemQuickView } from "./itemComponents/ItemQuickView";
import { SecretjsContext } from "./context/SecretjsContext";

interface ItemsGalleryProps {
  category: string;
}

export const ItemsGallery: React.FC<ItemsGalleryProps> = ({ category }) => {
  const { secretjs } = useContext(SecretjsContext);

  const { stores, asyncDispatch } = useContext(StoresContext);

  const [itemQuickView, setItemQuickView] = useState<ItemQuickViewData>();
  const [modalActive, setModalActive] = useState<boolean>(false);

  const [searchPhrase, setSearchPhrase] = useState<string>("");

  useEffect(() => {
    asyncDispatch({
      type: STORE_ACTIONS.LOAD_ITEMS,
      data: {
        category,
      },
    });
  }, []);

  const addItem = () => {
    let itemQuickViewData: ItemQuickViewData = {
      item: null,
      accountAddress: secretjs!.address,
      usersItemDetails: null,
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

  let itemsView = ItemsViewLoader.getFilteredItemsView(
    stores[category],
    searchPhrase,
    openModal,
    asyncDispatch
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
        />
      )}
    </div>
  );
};
