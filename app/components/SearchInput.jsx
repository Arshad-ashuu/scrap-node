// src/components/SearchInput.js
"use client";
import React, { useState } from 'react';

export const SearchInput = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query); // Pass the query to the parent component
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={query}

        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for products..."
        className="border rounded p-2 text-black"
      />
      <button type="submit" className="ml-2 bg-blue-500 text-white rounded p-2">
        Search
      </button>
    </form>
  );
};
