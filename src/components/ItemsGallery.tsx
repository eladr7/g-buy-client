import React, { useContext, useEffect, useState } from "react";
import { ItemData, STORE_ACTIONS } from "./consts";
import { StoresContext } from "./context/StoresContextProvider";
import ItemsViewLoader from "./itemComponents/ItemsViewLoader";
import { ItemQuickView } from "./itemComponents/ItemQuickView";

interface ItemsGalleryProps {
  category: string;
}

export const ItemsGallery: React.FC<ItemsGalleryProps> = ({ category }) => {
  const { stores, dispatch } = useContext(StoresContext);

  const [itemQuickView, setItemQuickView] = useState<ItemData>();
  const [modalActive, setModalActive] = useState<boolean>(false);

  const [searchPhrase, setSearchPhrase] = useState<string>(""); // Elad: Add + pagination

  const openModal = (item: ItemData) => {
    setModalActive(true);
    setItemQuickView(item);
  };

  const closeModal = () => {
    setModalActive(false);
  };

  useEffect(() => {
    dispatch({
      type: STORE_ACTIONS.LOAD_ITEMS,
      category,
    });
  }, []);

  let itemsView = ItemsViewLoader.getFilteredItemsView(
    stores[category],
    searchPhrase,
    openModal,
    dispatch,
    category
  );

  return (
    <div className="clear-fix">
      <input
        type="search"
        placeholder="Search for items"
        onChange={(e) => setSearchPhrase(e.target.value)}
      />
      {itemsView}
      <ItemQuickView
        item={itemQuickView}
        openModal={modalActive}
        closeModal={closeModal}
      />
    </div>
  );
};
