import React, { useState } from "react";

function NewPlantForm({ addPlant }) {
  // Local state for the new plant form fields
  const [newPlant, setNewPlant] = useState({
    name: "",
    image: "",
    price: "",
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPlant((prevPlant) => ({
      ...prevPlant,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Generate a unique id for the new plant
    const plantWithId = {
      ...newPlant,
      id: Date.now(), // Use the current timestamp for a unique id
    };
    // Pass the new plant data to the parent component (PlantPage)
    addPlant(plantWithId);
    // Reset the form fields after submission
    setNewPlant({ name: "", image: "", price: "" });
  };

  return (
    <div className="new-plant-form">
      <h2>New Plant</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Plant name"
          value={newPlant.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={newPlant.image}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          step="0.01"
          placeholder="Price"
          value={newPlant.price}
          onChange={handleChange}
        />
        <button type="submit">Add Plant</button>
      </form>
    </div>
  );
}

export default NewPlantForm;
