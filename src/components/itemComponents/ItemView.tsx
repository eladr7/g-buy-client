import React, { useContext } from "react";
import {
  AsyncDispatchFunc,
  ItemData,
  ItemQuickViewData,
  UserItemDetails,
  STORE_ACTIONS,
  ContactData,
} from "../consts";
import { SecretjsContext } from "../context/SecretjsContext";

interface ItemViewProps {
  index: number;
  item: ItemData;
  userQuantity: number;
  contactData: ContactData;
  openModal: (itemQuickViewData: ItemQuickViewData) => void;
  asyncDispatch: AsyncDispatchFunc;
}

export const ItemView: React.FC<ItemViewProps> = ({
  index,
  item,
  userQuantity,
  contactData,
  openModal,
  asyncDispatch,
}) => {
  const { secretjs } = useContext(SecretjsContext);

  const getEditOrJoin = (accountAddress: string, item: ItemData) => {
    let userItemDetails: UserItemDetails = {
      accountAddress: secretjs!.address,
      email: contactData.email,
      deliveryAddress: contactData.deliveryAddress,
      quantity: userQuantity,
    };
    return userQuantity > 0 ? (
      <div>
        <button
          className="open-modal-btn"
          onClick={() => openModal({ item, accountAddress, userItemDetails })}
        >
          Edit/Leave
        </button>
        <div>
          You chose to buy: {userItemDetails.quantity} unit/s of this item
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
      item.staticData.sellerAddress === secretjs?.address && (
        <button
          onClick={() =>
            asyncDispatch({
              type: STORE_ACTIONS.REMOVE_ITEM,
              data: {
                category: item.staticData.category,
                url: item.staticData.url,
              },
            })
          }
        >
          Remove this purchasing group
        </button>
      )
    );
  };

  return (
    <div
      key={index.toString()}
      style={{
        borderStyle: "dotted",
        width: "50%",
        marginLeft: "25%",
        marginTop: "5%",
        marginBottom: "5%",
      }}
      className="clear-fix"
    >
      <p>{item.staticData.name}</p>
      <div>
        <p>Price: {item.staticData.price}$</p>
        <p>Wanted price: {item.staticData.wantedPrice}$</p>
      </div>
      <div>
        <p>Current group size: {item.dynamicData.currentGroupSize}</p>
        <p>Group size goal: {item.staticData.groupSizeGoal}</p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <a href={item.staticData.url}>URL</a>
        <img src={item.staticData.imgUrl} alt="" />
      </div>
      <div className="object">
        {removeButton()}
        {getEditOrJoin(secretjs!.address, item)}
      </div>
    </div>
  );
};
