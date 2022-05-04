import React, { FormEvent, useContext, useEffect, useState } from "react";
import { findDOMNode } from "react-dom";
import { ItemData, ItemQuickViewData, UserItemDetails } from "../consts";

interface ItemQuickViewProps {
  itemQuickViewData: ItemQuickViewData | undefined;
  openModal: boolean;
  closeModal: () => void;
  category: string;
  addCategoryItem: (item: ItemData) => Promise<void>;
  updateCategoryItem: (
    url: string,
    item: ItemData,
    userUpdateData: UserItemDetails,
    oldQuantity: number
  ) => Promise<void>;
}

export const ItemQuickView: React.FC<ItemQuickViewProps> = ({
  itemQuickViewData,
  openModal,
  closeModal,
  category,
  addCategoryItem,
  updateCategoryItem,
}) => {
  const [url, setUrl] = useState<string>("");
  const [imgUrl, setImgUrl] = useState<string>("");

  const [itemName, setItemName] = useState<string>("");
  const [price, setPrice] = useState<string>("0");
  const [wantedPrice, setWantedPrice] = useState<string>("0");
  const [groupSizeGoal, setGroupSizeGoal] = useState<number>(0);

  const [quantity, setQuantity] = useState<number>(0);
  const [email, setEmail] = useState<string>("");
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");

  useEffect(() => {
    // If opened via clicking an existing item (As opposed to adding a new item), set the items'
    // details
    if (itemQuickViewData?.item) {
      setItemName(itemQuickViewData.item.static_data.name);
      setPrice(itemQuickViewData.item.static_data.price);
      setWantedPrice(itemQuickViewData.item.static_data.wanted_price);
      setGroupSizeGoal(itemQuickViewData.item.static_data.group_size_goal);
    }

    // If the user who clicked the item already participates in it, fill their details.
    if (itemQuickViewData?.userItemDetails) {
      setQuantity(itemQuickViewData.userItemDetails.quantity);
      setEmail(itemQuickViewData.userItemDetails.email);
      setDeliveryAddress(itemQuickViewData.userItemDetails.deliveryAddress);
    }

    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);

      // Since thie component is only rendered once when entering a tab,
      // each time openModal changes, reset all the values.
      // Notice that openModal signifies whether or not this component is visible.
      setUrl("");
      setImgUrl("");
      setItemName("");

      setPrice("0");
      setWantedPrice("0");
      setGroupSizeGoal(0);
      setQuantity(0);

      setEmail("");
      setDeliveryAddress("");
    };
  }, [openModal]);

  const handleClickOutside = (event: any) => {
    var node = document.getElementById("node");
    const domNode = findDOMNode(node);
    if (!domNode || !domNode.contains(event.target)) {
      closeModal();
    }
  };

  const updateItem = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let userUpdateData: UserItemDetails = {
      accountAddress: itemQuickViewData!.accountAddress,
      deliveryAddress: deliveryAddress!,
      email: email!,
      quantity: quantity!,
    };
    debugger;
    // If the item doesn't already exist, add it
    // Elad: Change the logic to - only seller adds a product
    if (!itemQuickViewData?.item) {
      // Add a new item!

      let itemData: ItemData = {
        static_data: {
          name: itemName,
          category: category.toLowerCase(),
          url,
          img_url: imgUrl,
          seller_address: itemQuickViewData!.accountAddress,
          seller_email: email,
          price,
          wanted_price: wantedPrice,
          group_size_goal: groupSizeGoal,
        },
        current_group_size: 0,
      };

      addCategoryItem(itemData);
      closeModal();
      return;
    }

    // Update an existing item
    // Elad: Check something changed
    // let initialQuantity = itemQuickViewData.usersItemDetails?.quantity;
    // if (initialQuantity !== quantity) {
    //   alert("Nothing changed")
    // }
    let oldQuantity = itemQuickViewData.userItemDetails
      ? itemQuickViewData.userItemDetails.quantity
      : 0;

    updateCategoryItem(
      itemQuickViewData!.item!.static_data.url,
      itemQuickViewData.item,
      userUpdateData,
      oldQuantity
    );
    closeModal();
  };

  const input = (
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
    <form
      onSubmit={(e) => updateItem(e)}
      style={{ display: "flex", flexDirection: "column" }}
    >
      {/* If the item doesn't exist, add inputs for its url and image */}
      {!itemQuickViewData.item && (
        <>
          {input("url", "text", url, (e) => setUrl(e.target.value), false)}
          {input(
            "image",
            "text",
            imgUrl,
            (e) => setImgUrl(e.target.value),
            false
          )}
        </>
      )}

      {input(
        "name",
        "text",
        itemName,
        (e) => setItemName(e.target.value),
        itemQuickViewData.item !== null // if the item exists, this input should be readOnly
      )}

      {input(
        "price",
        "number",
        price,
        (e) => setPrice(e.target.value),
        itemQuickViewData.item !== null // if the item exists, this input should be readOnly
      )}

      {input(
        "wanted price",
        "number",
        wantedPrice,
        (e) => setWantedPrice(e.target.value),
        itemQuickViewData.item !== null // if the item exists, this input should be readOnly
      )}

      {input(
        "group size goal",
        "number",
        groupSizeGoal,
        (e) => setGroupSizeGoal(parseInt(e.target.value)),
        itemQuickViewData.item !== null // if the item exists, this input should be readOnly
      )}

      {input(
        "account address",
        "text",
        itemQuickViewData.accountAddress,
        (e) => {},
        true // The account address is always immutable as it's taken from the wallet
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
          // usersItemDetails not null means the user that clicked this item also already
          // participates in it, so they shouldn't be able to edit this field
          readOnly={itemQuickViewData.userItemDetails !== null}
        />
      </div>

      {/* Delivery address input should only be presented if the item is not currently added by the
       seller */}
      {itemQuickViewData.item !== null &&
        input(
          "delivery address",
          "text",
          deliveryAddress,
          (e) => setDeliveryAddress(e.target.value),
          // usersItemDetails not null means the user that clicked this item also already
          // participates in it, so they shouldn't be able to edit this field
          itemQuickViewData.userItemDetails !== null
        )}

      {/* Quantity input should only be presented if the item is not currently added by the
       seller */}
      {itemQuickViewData.item !== null && (
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
      )}

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
