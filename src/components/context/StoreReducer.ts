import { url } from "inspector";
import { STORE_ACTIONS, ItemData, StoreAction, UserItemDetails, CategoryStore, UserItem } from "../consts";


export const StoreReducer = (state: CategoryStore, action: StoreAction) => {
  let category = action.data.category;
  switch (action.type) {
    case STORE_ACTIONS.LOAD_ITEMS:
      if (state.loaded === true) {
        return state;
      }
      state.items = action.data.fetchedData!.items;
      state.contactData = action.data.fetchedData!.contactData;
      state.userItems = action.data.fetchedData!.userItems;
      state.loaded = true;
      return {...state};
    // return [
    //   ...state,
    //   {
    //     calculation: action.calculation.calculation,
    //     id: uuidv4(),
    //   },
    // ];
    case STORE_ACTIONS.APPEND_ITEM:
      state.items.push(action.data.item!)
      // Elad: add the logic to insert into the DB
      // Elad: Check quantity is larger than 0!
      return {...state};
      // return [
      //   ...state,
      //   {
      //     calculation: action.calculation.calculation,
      //     id: Math.random(),
      //     // id: uuidv4(),
      //   },
      // ];
    case STORE_ACTIONS.UPDATE_ITEM:
      const {
        data: {
          userUpdateData
        }
      } = action

      // For updating the item's view 
      let itemIndex = state.items.findIndex((item: ItemData) => item.staticData.url === action.data.url)
      if (itemIndex === -1) {
        return state
      }

      // For updating the user count for this item
      let userItemIndex = state.userItems.findIndex((userItem: UserItem) => userItem.url === action.data.url)

      if (userItemIndex === -1) {
        // New user

        if (userUpdateData!.quantity === 0) {
          // Elad - enforce this in the form itself
          alert("Cannot participate with 0 items")
          return state;
        }

        state.userItems.push({url: action.data.url!, quantity: userUpdateData!.quantity})
        state.items[itemIndex].dynamicData.currentGroupSize! += userUpdateData!.quantity
        return {...state}
      }

      // Existing user

      let diff = userUpdateData!.quantity - state.userItems[userItemIndex].quantity
      state.items[itemIndex].dynamicData.currentGroupSize! += diff
      state.userItems[userItemIndex].quantity! = userUpdateData!.quantity

      if (state.userItems[userItemIndex].quantity === 0) {
        // Remove this item from the user's items
        // Elad: Refund the user!
        state.userItems.splice(userItemIndex, 1);
      }
      
      if (state.items[itemIndex].dynamicData.currentGroupSize! === 0) {
        // Remove the item entirely, as it has no subscribers.
        state.items.splice(itemIndex, 1);
        return {...state}
      }

      return {...state}
    case STORE_ACTIONS.REMOVE_ITEM:
      state.items = state.items.filter(
        (item: ItemData) => item.staticData.url !== action.data.url
      )
      // Elad: add the logic to remove from the DB
      return {...state};
      // return state.filter(
      //   (calculation) => calculation.id !== action.calculation.id
      // );
    default:
      return state;
  }
};
