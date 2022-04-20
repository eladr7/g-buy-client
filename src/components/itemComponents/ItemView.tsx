import { debug } from "console";
import React from "react";
import { DispatchFunc, ItemData, STORE_ACTIONS } from "../consts";

interface ItemViewProps {
  index: number;
  item: ItemData;
  openModal: (item: ItemData) => void;
  asyncDispatch: DispatchFunc;
  category: string;
}

export const ItemView: React.FC<ItemViewProps> = ({
  index,
  item,
  openModal,
  asyncDispatch,
  category,
}) => {
  return (
    <div key={index.toString()}>
      <p className="object-name">{item.productName}</p>
      <div className="object">
        <button
          onClick={() =>
            asyncDispatch({
              type: STORE_ACTIONS.REMOVE_ITEM,
              data: {
                category,
                id: item.id,
              },
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
