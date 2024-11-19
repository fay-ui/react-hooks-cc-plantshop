import React, { useState, useEffect } from "react";
import PlantCard from "./PlantCard";

function PlantList() {
  const [plants, setPlants] = useState([]); // Store the plant list
  const [newPlant, setNewPlant] = useState({ name: "", price: "", image: "" });
  const [updatedPlant, setUpdatedPlant] = useState({ id: null, name: "", price: "" });
  const [searchTerm, setSearchTerm] = useState(""); 
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null); 

  // Fetch plants from the backend on component mount
  useEffect(() => {
    fetch("https://react-hooks-cc-plantshop-gbhg.onrender.com/plants")
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch plants');
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          const updatedPlants = data.map((plant) => ({
            ...plant,
            image: plant.image || "https://via.placeholder.com/150", // Fallback image
          }));
          setPlants(updatedPlants);  // Update state with fetched data
        } else {
          console.error("Fetched data is not an array:", data);
          setPlants([]);
        }
        setIsLoading(false); // Stop loading
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
        setPlants([]);
      });
  }, []);

  // Handle adding a new plant
  const handleAddPlant = (e) => {
    e.preventDefault();

    if (!newPlant.name || !newPlant.price) {
      alert("Name and Price are required.");
      return;
    }

    if (isNaN(newPlant.price)) {
      alert("Price must be a valid number.");
      return;
    }

    const plantWithImage = {
      ...newPlant,
      image: newPlant.image || "https://via.placeholder.com/150", // Default image if none provided
    };

    fetch("https://react-hooks-cc-plantshop-gbhg.onrender.com/plants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(plantWithImage),
    })
      .then((res) => res.json())
      .then((data) => {
        setPlants((prev) => [...prev, data]); // Add new plant to state
        setNewPlant({ name: "", price: "", image: "" }); // Reset form
      })
      .catch((err) => {
        setError("Error adding plant: " + err.message);
      });
  };

  // Handle updating plant details
  const handleUpdatePlant = (id) => {
    if (!updatedPlant.name || !updatedPlant.price) {
      alert("Please fill out all fields to update the plant.");
      return;
    }

    fetch(`https://react-hooks-cc-plantshop-gbhg.onrender.com/plants/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPlant),
    })
      .then((res) => res.json())
      .then((data) => {
        setPlants((prev) =>
          prev.map((plant) =>
            plant.id === id ? { ...plant, ...data } : plant
          )
        );  // Update the plant in the state
        setUpdatedPlant({ id: null, name: "", price: "" });  // Reset update form
      })
      .catch((err) => {
        setError("Error updating plant: " + err.message);
      });
  };

  // Handle deleting a plant
  const handleDeletePlant = (id) => {
    fetch(`https://react-hooks-cc-plantshop-gbhg.onrender.com/plants/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setPlants((prev) => prev.filter((plant) => plant.id !== id)); // Remove deleted plant from state
      })
      .catch((err) => {
        setError("Error deleting plant: " + err.message);
      });
  };

  // Handle searching for plants by name
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Update the search term on input change
  };

  // Filter the plants based on the search term
  const filteredPlants = plants.filter((plant) =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // **handleMarkAsSold** function
  const handleMarkAsSold = (id) => {
    fetch(`https://react-hooks-cc-plantshop-gbhg.onrender.com/plants/${id}`, {
      method: "PATCH", // Using PATCH method to update a specific plant
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sold: true }), // Mark the plant as sold
    })
      .then((res) => res.json())
      .then((updatedPlant) => {
        // Update the plant in the state to reflect the sold status
        setPlants((prev) =>
          prev.map((plant) =>
            plant.id === id ? { ...plant, sold: updatedPlant.sold } : plant
          )
        );
      })
      .catch((err) => {
        setError("Error marking plant as sold: " + err.message);
      });
  };

  return (
    <div className="plant-list">
      {/* Error Message */}
      {error && <p className="error">{error}</p>}

      {/* Add New Plant Form */}
      <form onSubmit={handleAddPlant}>
        <h3>Add a New Plant</h3>
        <input
          type="text"
          placeholder="Plant name"
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

      {/* Search Plants */}
      <div className="search">
        <input
          type="text"
          placeholder="Search Plants"
          value={searchTerm}
          onChange={handleSearchChange} // Trigger search filter
        />
      </div>

      {/* Loading Indicator */}
      {isLoading ? (
        <p>Loading plants...</p>
      ) : (
        <div className="plant-cards">
          {filteredPlants.map((plant) => (
            <PlantCard key={plant.id} plant={plant}>
              {/* Mark as Sold */}
              {!plant.sold && (
                <button onClick={() => handleMarkAsSold(plant.id)}>
                  Mark as Sold
                </button>
              )}

              {/* Delete Plant */}
              <button onClick={() => handleDeletePlant(plant.id)}>
                Delete
              </button>

              {/* Edit Plant */}
              <button
                onClick={() =>
                  setUpdatedPlant({
                    id: plant.id,
                    name: plant.name,
                    price: plant.price,
                  })
                }
              >
                Edit
              </button>

              {/* Update Form */}
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
                    onChange={(e) =>
                      setUpdatedPlant({ ...updatedPlant, name: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={updatedPlant.price}
                    onChange={(e) =>
                      setUpdatedPlant({ ...updatedPlant, price: e.target.value })
                    }
                  />
                  <button type="submit">Update</button>
                </form>
              )}
            </PlantCard>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlantList;
