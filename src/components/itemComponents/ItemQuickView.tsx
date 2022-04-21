import React, { useContext, useEffect, useState } from "react";
import { findDOMNode } from "react-dom";
import {
  ItemData,
  ItemQuickViewData,
  ItemUserDetails,
  STORE_ACTIONS,
} from "../consts";
import { StoresContext } from "../context/StoresContextProvider";

interface ItemQuickViewProps {
  itemQuickViewData: ItemQuickViewData | undefined;
  openModal: boolean;
  closeModal: () => void;
  category: string;
}

export const ItemQuickView: React.FC<ItemQuickViewProps> = ({
  itemQuickViewData,
  openModal,
  closeModal,
  category,
}) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [email, setEmail] = useState<string>();
  const [deliveryAddress, setDeliveryAddress] = useState<string>();

  const { asyncDispatch } = useContext(StoresContext);

  useEffect(() => {
    if (itemQuickViewData?.usersItemDetails) {
      setQuantity(itemQuickViewData.usersItemDetails.quantity);
      setEmail(itemQuickViewData.usersItemDetails.email);
      setDeliveryAddress(itemQuickViewData.usersItemDetails.deliveryAddress);
    }

    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const handleClickOutside = (event: any) => {
    var node = document.getElementById("node");
    const domNode = findDOMNode(node);
    if (!domNode || !domNode.contains(event.target)) {
      closeModal();
    }
  };

  const updateUser = () => {
    let userUpdateData: ItemUserDetails = {
      accountAddress: itemQuickViewData!.accountAddress,
      deliveryAddress: deliveryAddress!,
      email: email!,
      quantity: quantity!,
    };

    // if (!itemQuickViewData) {
    //   // Creation of a new item
    //   return;
    // }

    // Update an existing item
    // Elad: Check something changed
    // let initialQuantity = itemQuickViewData.usersItemDetails?.quantity;
    // if (initialQuantity !== quantity) {
    //   alert("Nothing changed")
    // }

    asyncDispatch({
      type: STORE_ACTIONS.UPDATE_ITEM,
      data: {
        category,
        url: itemQuickViewData!.item.url,
        userUpdateData,
      },
    });
  };

  const userForm = (itemQuickViewData: ItemQuickViewData) => (
    <form onSubmit={updateUser}>
      <input
        type="text"
        name="account-address"
        value={itemQuickViewData.accountAddress}
        readOnly={itemQuickViewData.usersItemDetails !== null}
      />
      <input
        type="email"
        pattern=".+@[a-z0-9]+\.[a-z]{2,3}"
        required
        value={email}
        // onChange={(e) => setEmail(e.target.value)}
        readOnly={itemQuickViewData.usersItemDetails !== null}
      />
      <input
        type="text"
        name="delivery-address"
        value={deliveryAddress}
        // onChange={(e) => setDeliveryAddress(e.target.value)}
        readOnly={itemQuickViewData.usersItemDetails !== null}
      />
      <input
        type="number"
        name="quantity"
        min="0"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
      />

      <input type="submit" value="Apply" />
    </form>
  );

  if (!itemQuickViewData) {
    return <></>;
  }

  return (
    <div className={openModal ? "modal-wrapper active" : "modal-wrapper"}>
      <div className="modal" id="node">
        <button type="button" className="close" onClick={() => closeModal()}>
          &times;
        </button>
        <div>
          <p>{itemQuickViewData.item!.name}</p>
          <div>
            <p>Price: {itemQuickViewData.item!.price}$</p>
            <p>Wanted price: {itemQuickViewData.item!.wantedPrice}$</p>
          </div>
          <div>
            <p>Group size goal: {itemQuickViewData.item!.groupSizeGoal}</p>
          </div>
        </div>
        {userForm(itemQuickViewData)}
      </div>
    </div>
  );
};

// The account address (automatically filled)
// Email address
// Delivery address
// Quantity (Will check if the is user already registered for this porduct)
// The product's name

// '{"update_item": {
//   "link": "https://blabla.com?bla&bla1",
//   "img": "https://blabla.com?bla&bla1&img1"
//   "price": "1000",
//   "wanted_price": "800",
//   "group_size_goal": "10",
//   "user_details": {
//     "account_address": "sdkjhas",
//     "email": "bla@bla.com", // A good idea to be able to change, not for this POC
//     "delivery_address": "bla st, bla apt, bla  bla", // A good idea to be able to change, not for this POC
//     ?"quantity": "2"
//   }
// }}'
