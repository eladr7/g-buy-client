import { CategoryStore, StoreAction, STORE_ACTIONS } from "../consts";
import { addItemToServer, getItemsFromServer, makePayment, removeItemFromServer, updateItemInServer } from "./ServerAPIFunctions";

export const asyncDispatchFunc = (store: CategoryStore, secretjs: any, dispatch: any) =>  async (action: StoreAction) => {
    let succeded: boolean = false;
    const {
      data: { category, url, userUpdateData, item },
    } = action;

    switch (action.type) {
      case STORE_ACTIONS.LOAD_ITEMS:
        if (store.loaded === true) {
          return;
        }
        let fetchedData = await getItemsFromServer(category, secretjs!);
        dispatch({
          type: STORE_ACTIONS.LOAD_ITEMS,
          data: {
            category: category,
            fetchedData,
          },
        });
        break;

      case STORE_ACTIONS.APPEND_ITEM:
        succeded = await addItemToServer(category, item!, secretjs!);
        if (succeded) {
          dispatch({
            type: STORE_ACTIONS.APPEND_ITEM,
            data: {
              category,
              item,
            },
          });
          return;
        }
        alert("Item update failed");
        throw new TypeError("Item update failed");

      case STORE_ACTIONS.UPDATE_ITEM:
        // Elad: Consider just getting the items and perform all the calculations
        // on the server side
        // Elad: Check in the client if to remove - and send remove instead of update.

        let oldQuantity = action.data.oldQuantity!;
        let newQuantity = action.data.userUpdateData!.quantity;

        if (oldQuantity === newQuantity) {
            alert("Same quantity - nothing to update!")
            return
        }
        let wantedPrice = action.data.item!.static_data.wanted_price;
        let payed = await makePayment(secretjs!, oldQuantity, newQuantity, wantedPrice)
        if (!payed) {
            alert("Payment failed")
            return
        }
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