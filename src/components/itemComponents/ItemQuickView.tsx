import React, { useEffect } from "react";
import { findDOMNode } from "react-dom";
import { ItemData } from "../consts";

interface ItemQuickViewProps {
  item: ItemData | undefined;
  openModal: boolean;
  closeModal: () => void;
}

export const ItemQuickView: React.FC<ItemQuickViewProps> = ({
  item,
  openModal,
  closeModal,
}) => {
  useEffect(() => {
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

  if (!item) {
    return <></>;
  }

  return (
    <div className={openModal ? "modal-wrapper active" : "modal-wrapper"}>
      <div className="modal" id="node">
        <button type="button" className="close" onClick={() => closeModal()}>
          &times;
        </button>
        <div>
          <p>{item!.productName}</p>
          <p>{item!.currentPrice}</p>
          <p>{item!.wantedPrice}</p>
          <p>{item!.groupSizeGoal}</p>
        </div>
      </div>
    </div>
  );
};
