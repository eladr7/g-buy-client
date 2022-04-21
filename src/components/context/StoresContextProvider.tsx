import React, { createContext, useContext, useReducer } from "react";
import {
  AsyncDispatchFunc,
  Categories,
  CategoriesStore,
  StoreAction,
  STORE_ACTIONS,
} from "../consts";
import { SecretjsContext } from "./SecretjsContext";
import {
  getItemsFromServer,
  removeItemFromServer,
  updateItemInServer,
} from "./ServerAPIFunctions";
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
    let succeded: boolean = false;
    const {
      data: { category, url, userUpdateData },
    } = action;

    switch (action.type) {
      case STORE_ACTIONS.LOAD_ITEMS:
        let items = await getItemsFromServer(category, secretjs!);
        dispatch({
          type: STORE_ACTIONS.LOAD_ITEMS,
          data: {
            category: category,
            items,
          },
        });
        break;

      case STORE_ACTIONS.APPEND_ITEM:
        break;

      case STORE_ACTIONS.UPDATE_ITEM:
        // Elad: Consider just getting the items and perform all the calculations
        // on the server side
        succeded = await updateItemInServer(
          category,
          url!,
          userUpdateData!,
          secretjs!
        );
        if (succeded) {
          dispatch({
            type: STORE_ACTIONS.UPDATE_ITEM,
            data: {
              category,
              url,
              userUpdateData,
            },
          });
          return;
        }
        alert("Item update failed");
        throw new TypeError("Item update failed");

      case STORE_ACTIONS.REMOVE_ITEM:
        succeded = await removeItemFromServer(category, url!, secretjs!);

        if (succeded) {
          dispatch({
            type: STORE_ACTIONS.REMOVE_ITEM,
            data: {
              category,
              url,
            },
          });
          return;
        }
        alert("Item removal failed");
        throw new TypeError("Item removal failed");

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
