import React, { useState, useEffect } from "react";
import PlantCard from "./PlantCard";

function PlantList() {
  const [plants, setPlants] = useState([]); // Ensure plants is always an array
  const [newPlant, setNewPlant] = useState({ name: "", price: "", image: "" });
  const [updatedPlant, setUpdatedPlant] = useState({ id: null, name: "", price: "" });
  const [searchTerm, setSearchTerm] = useState(""); 
  const [isLoading, setIsLoading] = useState(true);  // For loading state
  const [error, setError] = useState(null);  // For error handling

  // Fetch the plants data when the component mounts
  useEffect(() => {
    fetch("https://react-hooks-cc-plantshop-gbhg.onrender.com/plants")
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch plants');
        }
        return res.json();
      })
      .then((data) => {
        // Ensure the data is an array
        if (Array.isArray(data)) {
          setPlants(data);
        } else {
          console.error("Fetched data is not an array:", data);
          setPlants([]); // If not an array, set plants to an empty array
        }
        setIsLoading(false);  // Stop loading once the data is fetched
      })
      .catch((err) => {
        setError(err.message);  // Set error message to display
        setIsLoading(false);
        setPlants([]); // Set to empty array in case of error
      });
  }, []);

  // Add a new plant with validation
  const handleAddPlant = (e) => {
    e.preventDefault();

    // Input validation
    if (!newPlant.name || !newPlant.price) {
      alert("Name and Price are required.");
      return;
    }

    if (isNaN(newPlant.price)) {
      alert("Price must be a valid number.");
      return;
    }

    // Ensure image URL is set, default to placeholder if not provided
    const plantWithImage = {
      ...newPlant,
      image: newPlant.image || "https://via.placeholder.com/150", // Default image if not provided
    };

    fetch("https://react-hooks-cc-plantshop-gbhg.onrender.com/plants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(plantWithImage),
    })
      .then((res) => res.json())
      .then((data) => {
        setPlants((prev) => [...prev, data]); // Add the new plant to the state
        setNewPlant({ name: "", price: "", image: "" }); // Reset the form after submission
      })
      .catch((err) => {
        setError("Error adding plant: " + err.message);
        console.error("Error adding plant:", err);
      });
  };

  // Update plant details
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
          prev.map((p) => (p.id === id ? { ...p, ...data } : p))
        );
        setUpdatedPlant({ id: null, name: "", price: "" });  // Clear the update form
      })
      .catch(console.error);
  };

  // Delete a plant
  const handleDeletePlant = (id) => {
    fetch(`https://react-hooks-cc-plantshop-gbhg.onrender.com/plants/${id}`, {
      method: "DELETE",
    })
      .then(() => setPlants((prev) => prev.filter((p) => p.id !== id))) // Remove from local state
      .catch(console.error); 
  };

  // Mark plant as sold
  const handleMarkAsSold = (id) => {
    fetch(`https://react-hooks-cc-plantshop-gbhg.onrender.com/plants/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sold: true }),
    })
      .then((res) => res.json())
      .then(() => {
        setPlants((prev) =>
          prev.map((plant) => (plant.id === id ? { ...plant, sold: true } : plant))
        );
      })
      .catch(console.error); 
  };

  // Handle search term input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter plants by search term
  const filteredPlants = Array.isArray(plants) 
    ? plants.filter((plant) =>
        plant.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

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
          onChange={handleSearchChange}
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
