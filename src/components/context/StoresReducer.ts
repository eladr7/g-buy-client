import { STORE_ACTIONS, ItemData, CategoriesStore, StoreAction } from "../consts";


export const StoresReducer = (state: CategoriesStore, action: StoreAction) => {
  switch (action.type) {
    case STORE_ACTIONS.LOAD_ITEMS:

      if (state[action.data.category] && state[action.data.category].loaded === true) {
        return state;
      }
      state[action.data.category].items = action.data.items!;
      state[action.data.category].loaded = true;
      return state;
    // return [
    //   ...state,
    //   {
    //     calculation: action.calculation.calculation,
    //     id: uuidv4(),
    //   },
    // ];
    case STORE_ACTIONS.APPEND_ITEM:
      state[action.data.category].items.push(action.data.item!)
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
      state[action.data.category].items = state[action.data.category].items.filter(
        (item: ItemData) => item.id !== action.data.id
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
