import { url } from "inspector";
import { STORE_ACTIONS, ItemData, CategoriesStore, StoreAction, UserItemDetails } from "../consts";


export const StoresReducer = (state: CategoriesStore, action: StoreAction) => {
  let category = action.data.category;
  let categoryItems = state[category].items;
  switch (action.type) {
    case STORE_ACTIONS.LOAD_ITEMS:
      if (state[category] && state[category].loaded === true) {
        return state;
      }
      state[action.data.category].items = action.data.items!;
      state[category].loaded = true;
      return {...state};
    // return [
    //   ...state,
    //   {
    //     calculation: action.calculation.calculation,
    //     id: uuidv4(),
    //   },
    // ];
    case STORE_ACTIONS.APPEND_ITEM:
      state[category].items.push(action.data.item!)
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
      let itemIndex = categoryItems.findIndex((item: ItemData) => item.url === action.data.url)
      if (itemIndex === -1) {
        return state
      }
      let itemToUpdate: ItemData = categoryItems[itemIndex];
      
      // Get the index of the old user details, if exists
      let userDetailsIndex: number = itemToUpdate.usersDetails.findIndex((userDetails: UserItemDetails) => userDetails.accountAddress === userUpdateData!.accountAddress)
    
      // If new user: push them to usersDetails and update currentGroupSize
      if (userDetailsIndex === -1) {
        state[category].items[itemIndex].groupSizeGoal += userUpdateData!.quantity;
        state[category].items[itemIndex].usersDetails.push(userUpdateData!)
        // itemToUpdate.groupSizeGoal += userUpdateData!.quantity;
        // itemToUpdate.usersDetails.push(userUpdateData!)
        return {...state}
      }

      // It's an existing user
      let oldUserDetails: UserItemDetails = categoryItems[itemIndex].usersDetails[userDetailsIndex];         
      let diffQuantity: number = userUpdateData!.quantity - oldUserDetails.quantity;
      state[category].items[itemIndex].currentGroupSize! += diffQuantity;
      state[category].items[itemIndex].usersDetails[userDetailsIndex].quantity = userUpdateData!.quantity;

      // If this was the only user - remove the item itself!
      if (itemToUpdate.currentGroupSize === 0) {
        state[category].items.splice(itemIndex, 1);
        return {...state}
      }

      // If the user updated their quantity to zero - remove them.
      if (userUpdateData!.quantity === 0) {
        let index: number = itemToUpdate.usersDetails.findIndex((userDetails: UserItemDetails) => userDetails.accountAddress === userUpdateData!.accountAddress)
        state[category].items[itemIndex].usersDetails.splice(index, 1);
        // itemToUpdate.usersDetails.splice(index, 1);
        return {...state}
      }


      return {...state}

    case STORE_ACTIONS.REMOVE_ITEM:
      state[category].items = categoryItems.filter(
        (item: ItemData) => item.url !== action.data.url
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
