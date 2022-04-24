import { url } from "inspector";
import { STORE_ACTIONS, ItemData, StoreAction, UserItemDetails, CategoryStore } from "../consts";


export const StoreReducer = (state: CategoryStore, action: StoreAction) => {
  let category = action.data.category;
  switch (action.type) {
    case STORE_ACTIONS.LOAD_ITEMS:
      if (state.loaded === true) {
        return state;
      }
      state.items = action.data.items!;
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
      let itemIndex = state.items.findIndex((item: ItemData) => item.url === action.data.url)
      if (itemIndex === -1) {
        return state
      }
      let itemToUpdate: ItemData = state.items[itemIndex];
      
      // Get the index of the old user details, if exists
      let userDetailsIndex: number = itemToUpdate.usersDetails.findIndex((userDetails: UserItemDetails) => userDetails.accountAddress === userUpdateData!.accountAddress)
    
      // If new user: push them to usersDetails and update currentGroupSize
      if (userDetailsIndex === -1) {
        state.items[itemIndex].groupSizeGoal += userUpdateData!.quantity;
        state.items[itemIndex].usersDetails.push(userUpdateData!)
        return {...state}
      }

      // It's an existing user
      let oldUserDetails: UserItemDetails = state.items[itemIndex].usersDetails[userDetailsIndex];         
      let diffQuantity: number = userUpdateData!.quantity - oldUserDetails.quantity;
      state.items[itemIndex].currentGroupSize! += diffQuantity;
      state.items[itemIndex].usersDetails[userDetailsIndex].quantity = userUpdateData!.quantity;

      // If this was the only user - remove the item itself!
      if (itemToUpdate.currentGroupSize === 0) {
        state.items.splice(itemIndex, 1);
        return {...state}
      }

      // If the user updated their quantity to zero - remove them.
      if (userUpdateData!.quantity === 0) {
        let index: number = itemToUpdate.usersDetails.findIndex((userDetails: UserItemDetails) => userDetails.accountAddress === userUpdateData!.accountAddress)
        state.items[itemIndex].usersDetails.splice(index, 1);
        return {...state}
      }


      return {...state}

    case STORE_ACTIONS.REMOVE_ITEM:
      state.items = state.items.filter(
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
