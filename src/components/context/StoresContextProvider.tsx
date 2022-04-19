import React, { createContext, useReducer } from "react";
import { Categories, CategoriesStore, dispatchFunc } from "../consts";
import { StoresReducer } from "./StoresReducer";

interface IContextProps {
  stores: CategoriesStore;
  dispatch: dispatchFunc;
}

export const StoresContext = createContext({} as IContextProps);

interface StoresContextProviderProps {}
export const StoresContextProvider: React.FC<StoresContextProviderProps> = (
  props
) => {
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

  // const [stores, dispatch] = useReducer(StoresReducer, [], () => {
  //   const fromStore = localStorage.getItem("stores");
  //   return fromStore ? JSON.parse(fromStore) : [];
  // });

  // useEffect(() => {
  //   // localStorage.setItem('stores', '');
  //   localStorage.setItem("stores", JSON.stringify(stores));
  // }, [stores]);

  return (
    <StoresContext.Provider value={{ stores, dispatch }}>
      {props.children}
    </StoresContext.Provider>
  );
};
