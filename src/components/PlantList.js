import React, { useState, useEffect } from "react";
import PlantCard from "./PlantCard";

function PlantList() {
  const [plants, setPlants] = useState([]);
  const [newPlant, setNewPlant] = useState({ name: "", price: "", image: "" });
  const [updatedPlant, setUpdatedPlant] = useState({ id: null, name: "", price: "" });
  const [searchTerm, setSearchTerm] = useState(""); // Added state for search term

  // Fetching plants from the API
  useEffect(() => {
    fetch("http://localhost:6001/plants")
      .then((res) => res.json())
      .then(setPlants)
      .catch(console.error);
  }, []);

  // Handle adding a new plant
  const handleAddPlant = (e) => {
    e.preventDefault();
    if (!newPlant.image) {
      setNewPlant({ ...newPlant, image: "https://via.placeholder.com/150" });
    }
    fetch("http://localhost:6001/plants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPlant),
    })
      .then((res) => res.json())
      .then((data) => {
        setPlants((prev) => [...prev, data]);
        setNewPlant({ name: "", price: "", image: "" });
      })
      .catch(console.error);
  };

  
  const handleUpdatePlant = (id) => {
    fetch(`http://localhost:6001/plants/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPlant),
    })
      .then((res) => res.json())
      .then((data) => {
        setPlants((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...data } : p))
        );
        setUpdatedPlant({ id: null, name: "", price: "" });
      })
      .catch(console.error);
  };

  
  const handleDeletePlant = (id) => {
    fetch(`http://localhost:6001/plants/${id}`, { method: "DELETE" })
      .then(() => setPlants((prev) => prev.filter((p) => p.id !== id)))
      .catch(console.error);
  };

  // Handle marking a plant as sold
  const handleMarkAsSold = (id) => {
    fetch(`http://localhost:6001/plants/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sold: true }),
    })
      .then((res) => res.json())
      .then((updatedPlant) => {
        setPlants((prev) =>
          prev.map((plant) => (plant.id === id ? { ...plant, sold: true } : plant))
        );
      })
      .catch(console.error);
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  
  const filteredPlants = plants.filter((plant) =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  return (
    <div className="plant-list">
      <form onSubmit={handleAddPlant}>
        <h3>Add a New Plant</h3>
        <input
          type="text"
          placeholder="Name"
          value={newPlant.name}
          onChange={(e) => setNewPlant({ ...newPlant, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newPlant.price}
          onChange={(e) => setNewPlant({ ...newPlant, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newPlant.image}
          onChange={(e) => setNewPlant({ ...newPlant, image: e.target.value })}
        />
        <button type="submit">Add Plant</button>
      </form>

      {/* Search input */}
      <div className="search">
        <input
          type="text"
          placeholder="Search Plants"
          value={searchTerm}
          onChange={handleSearchChange} // Update search term as the user types
        />
      </div>

      {/* Display filtered plants */}
      <div className="plant-cards">
        {filteredPlants.map((plant) => (
          <PlantCard key={plant.id} plant={plant}>
            {!plant.sold && (
              <button onClick={() => handleMarkAsSold(plant.id)}>Mark as Sold</button>
            )}
            <button onClick={() => handleDeletePlant(plant.id)}>Delete</button>
            <button onClick={() => setUpdatedPlant({ id: plant.id, name: plant.name, price: plant.price })}>
              Edit
            </button>
          </PlantCard>
        ))}
      </div>
    </div>
  );
}

export default PlantList;
