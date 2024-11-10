import React from "react";

function PlantCard({ plant, children }) {
  return (
    <div className={`plant-card ${plant.sold ? "sold" : ""}`}>
      
      <img src={plant.image} alt={plant.name} width="150" height="150" />
      
      <h4>{plant.name}</h4>
      <p>Price: ${plant.price}</p>
      
      {plant.sold && <p className="sold-tag">Sold</p>}
      
      <div>{children}</div>
    </div>
  );
}

export default PlantCard;
