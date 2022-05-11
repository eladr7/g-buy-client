import React from "react";
import {
  ItemData,
  ItemQuickViewData,
  UserItemDetails,
  ContactData,
  RemoveCategoryItem,
} from "../consts";
import { secretjsStore } from "../context/SecretjsStore";

interface ItemViewProps {
  index: number;
  item: ItemData;
  userQuantity: number;
  contactData: ContactData;
  openModal: (itemQuickViewData: ItemQuickViewData) => void;
  removeCategoryItem: RemoveCategoryItem;
}

export const ItemView: React.FC<ItemViewProps> = ({
  index,
  item,
  userQuantity,
  contactData,
  openModal,
  removeCategoryItem,
}) => {
  const getEditOrJoin = (accountAddress: string, item: ItemData) => {
    let userItemDetails: UserItemDetails | null;

    userItemDetails =
      userQuantity > 0
        ? {
            accountAddress: secretjsStore.secretjs!.address,
            email: contactData.email,
            deliveryAddress: contactData.delivery_address,
            quantity: userQuantity,
          }
        : null;
    return userQuantity > 0 ? (
      <div>
        <button
          className="open-modal-btn"
          onClick={() => openModal({ item, accountAddress, userItemDetails })}
        >
          Edit/Leave
        </button>
        <div>
          You chose to buy: {userItemDetails!.quantity} unit/s of this item
        </div>
      </div>
    ) : (
      <button
        className="open-modal-btn"
        onClick={() =>
          openModal({ item, accountAddress, userItemDetails: null })
        }
      >
        Join
      </button>
    );
  };

  const removeButton = (): React.ReactNode => {
    return (
      item.static_data.seller_address === secretjsStore.secretjs?.address && (
        <button onClick={() => removeCategoryItem(item.static_data.url)}>
          Remove this purchasing group
        </button>
      )
    );
  };

  return (
    <div
      key={index}
      style={{
        borderStyle: "dotted",
        width: "50%",
        marginLeft: "25%",
        marginTop: "5%",
        marginBottom: "5%",
      }}
      className="clear-fix"
    >
      <p>{item.static_data.name}</p>
      <div>
        <p>Price: {item.static_data.price} SCRT</p>
        <p>Wanted price: {item.static_data.wanted_price} SCRT</p>
      </div>
      <div>
        <p>Current group size: {item.current_group_size}</p>
        <p>Group size goal: {item.static_data.group_size_goal}</p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <a href={item.static_data.url}>URL</a>
        <img src={item.static_data.img_url} alt="" />
      </div>
      <div className="object">
        {removeButton()}
        {getEditOrJoin(secretjsStore.secretjs!.address, item)}
      </div>
    </div>
  );
};
