import { STORE_ACTIONS, ItemData, CategoriesStore, StoreAction } from "../consts";


export const StoresReducer = (state: CategoriesStore, action: StoreAction) => {
  switch (action.type) {
    case STORE_ACTIONS.LOAD_ITEMS:

      if (state[action.category] && state[action.category].loaded === true) {
        return state;
      }
      // state[action.category] = getItemsFromServer(action.category)
      let item: ItemData = {
        productName: "This is a " + action.category + " item",
        currentPrice: 1000,
        wantedPrice: 800,
        groupSizeGoal: 10,
        id: Math.random()
      };
      state[action.category].items = [item];
      state[action.category].loaded = true;
      return state;
    // return [
    //   ...state,
    //   {
    //     calculation: action.calculation.calculation,
    //     id: uuidv4(),
    //   },
    // ];
    case STORE_ACTIONS.APPEND_ITEM:
      state[action.category].items.push(action.item!)
      // Elad: add the logic to insert into the DB
      return state;
      // return [
      //   ...state,
      //   {
      //     calculation: action.calculation.calculation,
      //     id: Math.random(),
      //     // id: uuidv4(),
      //   },
      // ];
    case STORE_ACTIONS.REMOVE_ITEM:
      state[action.category].items = state[action.category].items.filter(
        (item: ItemData) => item.id !== action.id
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
