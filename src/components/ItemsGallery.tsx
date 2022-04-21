import React, { useContext, useEffect, useState } from "react";
import { ItemData, ItemQuickViewData, STORE_ACTIONS } from "./consts";
import { StoresContext } from "./context/StoresContextProvider";
import ItemsViewLoader from "./itemComponents/ItemsViewLoader";
import { ItemQuickView } from "./itemComponents/ItemQuickView";

interface ItemsGalleryProps {
  category: string;
}

export const ItemsGallery: React.FC<ItemsGalleryProps> = ({ category }) => {
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
    let name = prompt("Enter the item's name (as it appears in the site)");
    let url = prompt("Enter the item's URL");
    if (url === "" || name === "" || url === null || name === null) {
      return;
    }
    // Elad Check quantity is larger than 0!
    // asyncDispatch({
    //   type: STORE_ACTIONS.APPEND_ITEM,
    //   data: {
    //     category,
    //     item: {
    //       productName: "string",
    //       currentPrice: 12,
    //       wantedPrice: 12,
    //       groupSizeGoal: 12,
    //       id: 12,
    //     }
    //   }
    // });
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
