import React, { useState, useEffect } from "react";
import PlantCard from "./PlantCard";

function PlantList() {
  const [plants, setPlants] = useState([]);
  const [newPlant, setNewPlant] = useState({ name: "", price: "", image: "" });
  const [updatedPlant, setUpdatedPlant] = useState({ id: null, name: "", price: "" });
  const [searchTerm, setSearchTerm] = useState(""); 

  // Fetch the plants data when the component mounts
  useEffect(() => {
    fetch("https://react-hooks-cc-plantshop-gbhg.onrender.com/plants") // Corrected the endpoint
      .then((res) => res.json())
      .then(setPlants)
      .catch(console.error); // Added error handling for debugging
  }, []);

  // Add a new plant
  const handleAddPlant = (e) => {
    e.preventDefault();
    if (!newPlant.image) {
      setNewPlant({ ...newPlant, image: "https://via.placeholder.com/150" });
    }
    fetch("https://react-hooks-cc-plantshop-gbhg.onrender.com/plants", { // Corrected endpoint
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
    if (!updatedPlant.name || !updatedPlant.price) return; 
    fetch(`https://react-hooks-cc-plantshop-gbhg.onrender.com/plants/${id}`, { 
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
    fetch(`https://react-hooks-cc-plantshop-gbhg.onrender.com/plants/${id}`, { 
      method: "DELETE",
    })
      .then(() => setPlants((prev) => prev.filter((p) => p.id !== id)))
      .catch(console.error); 
  };

  
  const handleMarkAsSold = (id) => {
    fetch(`https://react-hooks-cc-plantshop-gbhg.onrender.com/plants/${id}`, { 
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

      <div className="search">
        <input
          type="text"
          placeholder="Search Plants"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="plant-cards">
        {filteredPlants.map((plant) => (
          <PlantCard key={plant.id} plant={plant}>
     
            {!plant.sold && (
              <button onClick={() => handleMarkAsSold(plant.id)}>Mark as Sold</button>
            )}
            <button onClick={() => handleDeletePlant(plant.id)}>Delete</button>
            <button
              onClick={() => setUpdatedPlant({ id: plant.id, name: plant.name, price: plant.price })}
            >
              Edit
            </button>
           
            {updatedPlant.id === plant.id && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdatePlant(plant.id);
                }}
              >
                <input
                  type="text"
                  placeholder="Name"
                  value={updatedPlant.name}
                  onChange={(e) => setUpdatedPlant({ ...updatedPlant, name: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={updatedPlant.price}
                  onChange={(e) => setUpdatedPlant({ ...updatedPlant, price: e.target.value })}
                />
                <button type="submit">Update</button>
              </form>
            )}
          </PlantCard>
        ))}
      </div>
    </div>
  );
}

export default PlantList;
