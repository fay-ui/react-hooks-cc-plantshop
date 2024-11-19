import React, { useState } from "react";
import NewPlantForm from "./NewPlantForm";
import PlantList from "./PlantList";
import Search from "./Search";

function PlantPage() {
  const [plants, setPlants] = useState([
    {
      id: 1,
      name: "Aloe",
      image: "./images/aloe.jpg",
      price: 15.99,
    },
    {
      id: 2,
      name: "ZZ Plant",
      image: "./images/zz-plant.jpg",
      price: 25.98,
    },
    {
      id: 3,
      name: "Pilea peperomioides",
      image: "./images/pilea.jpg",
      price: 5.99,
    },
    {
      id: 4,
      name: "Pothos",
      image: "./images/pothos.jpg",
      price: 12.11,
    },
    {
      id: 5,
      name: "Jade",
      image: "./images/jade.jpg",
      price: 10.37,
    },
    {
      id: 6,
      name: "Monstera Deliciosa",
      image: "./images/monstera.jpg",
      price: 25.99,
    },
    {
      id: 7,
      name: "Fiddle Leaf Fig",
      image: "./images/fiddle-leaf-fig.jpg",
      price: 55.0,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  // Update the searchTerm based on user input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter plants based on searchTerm
  const filteredPlants = plants.filter((plant) =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to add a new plant to the list
  const addPlant = (newPlant) => {
    setPlants((prevPlants) => [...prevPlants, newPlant]);
  };

  return (
    <main>
      <NewPlantForm addPlant={addPlant} />
      <Search searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
      <PlantList plants={filteredPlants} />
    </main>
  );
}

export default PlantPage;
