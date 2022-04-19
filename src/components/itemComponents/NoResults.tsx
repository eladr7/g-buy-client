import React from "react";

const NoResults = ({
  imgSrc = "https://res.cloudinary.com/sivadass/image/upload/v1494699523/icons/bare-tree.png",
  imgAlt = "Empty Tree",
  title = "Sorry, no objects matched your search!",
  suggestionMsg = "Enter a different keyword and try.",
}) => (
  <div className="no-results">
    <img src={imgSrc} alt={imgAlt} />
    <h2>{title}</h2>
    <p>{suggestionMsg}</p>
  </div>
);

export default NoResults;
