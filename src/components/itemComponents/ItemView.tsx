import React, { useContext } from "react";
import {
  AsyncDispatchFunc,
  ItemData,
  ItemQuickViewData,
  UserItemDetails,
  STORE_ACTIONS,
} from "../consts";
import { SecretjsContext } from "../context/SecretjsContext";

interface ItemViewProps {
  index: number;
  item: ItemData;
  openModal: (itemQuickViewData: ItemQuickViewData) => void;
  asyncDispatch: AsyncDispatchFunc;
}

export const ItemView: React.FC<ItemViewProps> = ({
  index,
  item,
  openModal,
  asyncDispatch,
}) => {
  const { secretjs } = useContext(SecretjsContext);
  const getUserDetailsForItem = (accountAddress: string, item: ItemData) => {
    let usersItemDetails: UserItemDetails[];
    usersItemDetails = item.usersDetails.filter(
      (userDetails: UserItemDetails) =>
        userDetails.accountAddress === accountAddress
    );
    if (usersItemDetails.length > 0) {
      return usersItemDetails[0];
    }

    return null;
  };

  const getEditOrJoin = (accountAddress: string, item: ItemData) => {
    let usersItemDetails = getUserDetailsForItem(secretjs!.address, item);
    return usersItemDetails ? (
      <div>
        <button
          className="open-modal-btn"
          onClick={() => openModal({ item, accountAddress, usersItemDetails })}
        >
          Edit/Leave
        </button>
        <div>
          You chose to buy: {usersItemDetails.quantity} unit/s of this item
        </div>
      </div>
    ) : (
      <button
        className="open-modal-btn"
        onClick={() =>
          openModal({ item, accountAddress, usersItemDetails: null })
        }
      >
        Join
      </button>
    );
  };

  const removeButton = (): React.ReactNode => {
    return (
      item.creatorAddress === secretjs?.address && (
        <button
          onClick={() =>
            asyncDispatch({
              type: STORE_ACTIONS.REMOVE_ITEM,
              data: {
                category: item.category,
                url: item.url,
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
      <p>{item.name}</p>
      <div>
        <p>Price: {item.price}$</p>
        <p>Wanted price: {item.wantedPrice}$</p>
      </div>
      <div>
        <p>Current group size: {item.currentGroupSize}</p>
        <p>Group size goal: {item.groupSizeGoal}</p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <a href={item.url}>URL</a>
        <img src={item.imgUrl} alt="" />
      </div>
      <div className="object">
        {removeButton()}
        {getEditOrJoin(secretjs!.address, item)}
      </div>
    </div>
  );
};
