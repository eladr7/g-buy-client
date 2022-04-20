import React, { createContext, useContext, useReducer } from "react";
import {
  AsyncDispatchFunc,
  Categories,
  CategoriesStore,
  StoreAction,
  STORE_ACTIONS,
} from "../consts";
import { SecretjsContext } from "./SecretjsContext";
import { getItemsFromServer } from "./ServerAPIFunctions";
import { StoresReducer } from "./StoresReducer";

interface IContextProps {
  stores: CategoriesStore;
  asyncDispatch: AsyncDispatchFunc;
}
export const StoresContext = createContext({} as IContextProps);

interface StoresContextProviderProps {}
export const StoresContextProvider: React.FC<StoresContextProviderProps> = (
  props
) => {
  const { secretjs } = useContext(SecretjsContext);

  const [stores, dispatch] = useReducer(StoresReducer, {}, () => {
    let storesInit: CategoriesStore = {};
    Categories.map((category: string) => {
      storesInit[category] = {
        items: [],
        loaded: false,
      };
    });
    return storesInit;
  });

  const asyncDispatch = async (action: StoreAction) => {
    switch (action.type) {
      case STORE_ACTIONS.LOAD_ITEMS:
        let items = await getItemsFromServer(action.data.category, secretjs!);
        dispatch({
          type: STORE_ACTIONS.LOAD_ITEMS,
          data: {
            category: action.data.category,
            items,
          },
        });
        break;
      case STORE_ACTIONS.APPEND_ITEM:
        break;
      case STORE_ACTIONS.REMOVE_ITEM:
        dispatch({
          type: STORE_ACTIONS.REMOVE_ITEM,
          data: {
            category: action.data.category,
            id: action.data.item!.id,
          },
        });
        break;
      default:
        throw new TypeError("No such action");
    }
  };

  return (
    <StoresContext.Provider value={{ stores, asyncDispatch }}>
      {props.children}
    </StoresContext.Provider>
  );
};
