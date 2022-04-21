import React from "react";

import { ItemView } from "./ItemView";
import NoResults from "./NoResults";
import {
  AsyncDispatchFunc,
  CategoryStore,
  ItemData,
  ItemQuickViewData,
} from "../consts";

const ItemsViewLoader = {
  // @private
  // Gets a list of objects and returns a CSSTransitionGroup object that contains an
  // array of ObjectView objects; or a NoResults object in case the input list of
  // objects is empty.
  getItemsView(
    items: ItemData[],
    openModalFunction: (itemQuickViewData: ItemQuickViewData) => void,
    asyncDispatch: AsyncDispatchFunc
  ) {
    if (items.length <= 0) {
      return <NoResults />;
    }

    return (
      <div>
        {items.map((item: ItemData, index: number) => (
          <ItemView
            index={index}
            item={item}
            openModal={openModalFunction}
            asyncDispatch={asyncDispatch}
          />
        ))}
      </div>
    );
  },

  filterItems(categoryStore: CategoryStore, searchPhrase: string) {
    if (!categoryStore) return [];
    if (searchPhrase) {
      const searchingFor = (searchPhrase: string) => {
        return function (item: ItemData) {
          return item.name.toLowerCase().includes(searchPhrase.toLowerCase());
        };
      };
      return categoryStore.items.filter(searchingFor(searchPhrase));
    }
    return categoryStore.items;
  },

  // Returns a CSSTransitionGroup object with a list of items whith 'searchPhrase' in their
  // 'name:' property; or a NoResults object in case the searchPhrase doesn't match any.
  // Notice that if an empty searchPhrase is supplied, all items from ObjectsContainer will be
  // returned.
  getFilteredItemsView(
    categoryStore: CategoryStore,
    searchPhrase: string,
    openModalFunction: (itemQuickViewData: ItemQuickViewData) => void,
    asyncDispatch: AsyncDispatchFunc
  ) {
    const filterredItems = this.filterItems(categoryStore, searchPhrase);

    const objectsViews = this.getItemsView(
      filterredItems,
      openModalFunction,
      asyncDispatch
    );
    return objectsViews;
  },
};

export default ItemsViewLoader;
