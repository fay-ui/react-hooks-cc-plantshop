import React from "react";

function Search({ searchTerm, handleSearchChange }) {
  return (
    <div className="searchbar">
      <label htmlFor="search">Search Plants:</label>
      <input
        type="text"
        id="search"
        placeholder="Type a name to search..."
        value={searchTerm} // Use the searchTerm value from the parent component
        onChange={handleSearchChange} // Call the parent function to update the searchTerm
      />
    </div>
  );
}

export default Search;
