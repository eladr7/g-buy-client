import { debug } from "console";
import React from "react";
import { dispatchFunc, ItemData, STORE_ACTIONS } from "../consts";

interface ItemViewProps {
  index: number;
  item: ItemData;
  openModal: (item: ItemData) => void;
  dispatch: dispatchFunc;
  category: string;
}

export const ItemView: React.FC<ItemViewProps> = ({
  index,
  item,
  openModal,
  dispatch,
  category,
}) => {
  return (
    <div key={index.toString()}>
      <p className="object-name">{item.productName}</p>
      <div className="object">
        <button
          onClick={() =>
            dispatch({
              type: STORE_ACTIONS.REMOVE_ITEM,
              category,
              id: item.id,
            })
          }
        >
          -
        </button>
        <button className="open-modal-btn" onClick={() => openModal(item)}>
          Enlarge
        </button>
      </div>
    </div>
  );
};
