import { ItemView } from "./ItemView";
import NoResults from "./NoResults";
import {
  CategoryStoreData,
  ContactData,
  ItemData,
  ItemQuickViewData,
  RemoveCategoryItem,
  UserItem,
} from "../consts";

const ItemsViewLoader = {
  // @private
  // Gets a list of objects and returns a CSSTransitionGroup object that contains an
  // array of ObjectView objects; or a NoResults object in case the input list of
  // objects is empty.
  getItemsView(
    items: ItemData[],
    openModalFunction: (itemQuickViewData: ItemQuickViewData) => void,
    removeCategoryItem: RemoveCategoryItem,
    userItems: UserItem[],
    contactData: ContactData
  ) {
    if (items.length <= 0) {
      return <NoResults />;
    }

    return (
      <div>
        {items.map((item: ItemData, index: number) => {
          let userItemIndex = userItems.findIndex(
            (userItem: UserItem) => userItem.url === item.static_data.url
          );
          let userQuantity =
            userItemIndex === -1 ? 0 : userItems[userItemIndex].quantity;

          return (
            <ItemView
              index={index}
              item={item}
              userQuantity={userQuantity}
              contactData={contactData}
              openModal={openModalFunction}
              removeCategoryItem={removeCategoryItem}
            />
          );
        })}
      </div>
    );
  },

  filterItems(categoryStore: CategoryStoreData, searchPhrase: string) {
    if (!categoryStore) return [];
    if (searchPhrase) {
      const searchingFor = (searchPhrase: string) => {
        return function (item: ItemData) {
          return item.static_data.name
            .toLowerCase()
            .includes(searchPhrase.toLowerCase());
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
    categoryStore: CategoryStoreData,
    searchPhrase: string,
    openModalFunction: (itemQuickViewData: ItemQuickViewData) => void,
    removeCategoryItem: RemoveCategoryItem
  ) {
    const filterredItems = this.filterItems(categoryStore, searchPhrase);

    const objectsViews = this.getItemsView(
      filterredItems,
      openModalFunction,
      removeCategoryItem,
      categoryStore.userItems,
      categoryStore.contactData
    );
    return objectsViews;
  },
};

export default ItemsViewLoader;
