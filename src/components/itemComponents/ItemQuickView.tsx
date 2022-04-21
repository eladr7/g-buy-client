import React, { useContext, useEffect, useState } from "react";
import { findDOMNode } from "react-dom";
import {
  ItemData,
  ItemQuickViewData,
  UserItemDetails,
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
  const [url, setUrl] = useState<string>("");
  const [imgUrl, setImgUrl] = useState<string>("");

  const [itemName, setItemName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [wantedPrice, setWantedPrice] = useState<number>(0);
  const [groupSizeGoal, setGroupSizeGoal] = useState<number>(0);

  const [quantity, setQuantity] = useState<number>(0);
  const [email, setEmail] = useState<string>();
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");

  const { asyncDispatch } = useContext(StoresContext);

  useEffect(() => {
    if (itemQuickViewData?.item) {
      setItemName(itemQuickViewData.item.name);
      setPrice(itemQuickViewData.item.price);
      setWantedPrice(itemQuickViewData.item.wantedPrice);
      setGroupSizeGoal(itemQuickViewData.item.groupSizeGoal);
    }

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
    let userUpdateData: UserItemDetails = {
      accountAddress: itemQuickViewData!.accountAddress,
      deliveryAddress: deliveryAddress!,
      email: email!,
      quantity: quantity!,
    };

    if (!itemQuickViewData?.item) {
      // Add a new item!

      let itemData: ItemData = {
        name: itemName,
        category,
        url,
        imgUrl: imgUrl,
        creatorAddress: itemQuickViewData!.accountAddress,
        price,
        wantedPrice,
        groupSizeGoal,
        // currentGroupSize: 0,
        usersDetails: [userUpdateData],
      };
      asyncDispatch({
        type: STORE_ACTIONS.APPEND_ITEM,
        data: {
          category,
          item: itemData,
        },
      });
      return;
    }

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
        url: itemQuickViewData!.item!.url,
        userUpdateData,
      },
    });
  };

  const getInputComp = (
    name: string,
    type: string,
    value: any,
    onChange: (e: any) => void,
    readOnly: boolean
  ) => {
    return (
      <div>
        <label htmlFor={name}>{name}</label>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
        />
      </div>
    );
  };

  const fillForm = (itemQuickViewData: ItemQuickViewData) => (
    // Elad: Add form validation
    <form
      onSubmit={updateUser}
      style={{ display: "flex", flexDirection: "column" }}
    >
      {!itemQuickViewData.item && (
        <>
          {getInputComp(
            "url",
            "text",
            url,
            (e) => setUrl(e.target.value),
            false
          )}
          {getInputComp(
            "image",
            "text",
            imgUrl,
            (e) => setImgUrl(e.target.value),
            false
          )}
        </>
      )}

      {getInputComp(
        "name",
        "text",
        itemName,
        (e) => setItemName(e.target.value),
        itemQuickViewData.item !== null
      )}

      {getInputComp(
        "price",
        "number",
        price,
        (e) => setPrice(parseInt(e.target.value)),
        itemQuickViewData.item !== null
      )}

      {getInputComp(
        "wanted price",
        "number",
        wantedPrice,
        (e) => setWantedPrice(parseInt(e.target.value)),
        itemQuickViewData.item !== null
      )}

      {getInputComp(
        "group size goal",
        "number",
        groupSizeGoal,
        (e) => setGroupSizeGoal(parseInt(e.target.value)),
        itemQuickViewData.item !== null
      )}

      {getInputComp(
        "account address",
        "text",
        itemQuickViewData.accountAddress,
        (e) => {},
        true
      )}

      <div>
        <label htmlFor="email-address">Email</label>
        <input
          type="email"
          name="email-address"
          pattern=".+@[a-z0-9]+\.[a-z]{2,3}"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          readOnly={itemQuickViewData.usersItemDetails !== null}
        />
      </div>

      {getInputComp(
        "delivery address",
        "text",
        deliveryAddress,
        (e) => setDeliveryAddress(e.target.value),
        itemQuickViewData.usersItemDetails !== null
      )}
      <div>
        <label htmlFor="quantity">Quantity</label>
        <input
          type="number"
          name="quantity"
          min="0"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />
      </div>

      <input
        type="submit"
        value="Apply"
        style={{ width: "10%", marginLeft: "45%", marginTop: "5%" }}
      />
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
        {fillForm(itemQuickViewData)}
      </div>
    </div>
  );
};
