import React, { createContext, useContext, useReducer } from "react";
import { AsyncDispatchFunc, CategoryStore } from "../consts";
import { asyncDispatchFunc } from "./dispatcherAsyncWrapper";
import { SecretjsContext } from "./SecretjsContext";

import { StoreReducer } from "./StoreReducer";

interface IContextProps {
  store: CategoryStore;
  asyncDispatch: AsyncDispatchFunc;
}
export const StoreContext = createContext({} as IContextProps);

export const StoreContextProvider: React.FC<any> = (props) => {
  const { secretjs } = useContext(SecretjsContext);

  const [store, dispatch] = useReducer(
    StoreReducer,
    {
      items: [],
      userItems: [],
      contactData: { email: "", delivery_address: "" },
      loaded: false,
    },
    () => {
      return {
        items: [],
        userItems: [],
        contactData: { email: "", delivery_address: "" },
        loaded: false,
      };
    }
  );

  const asyncDispatch = asyncDispatchFunc(store, secretjs, dispatch);
  return (
    <StoreContext.Provider value={{ store, asyncDispatch }}>
      {props.children}
    </StoreContext.Provider>
  );
};
