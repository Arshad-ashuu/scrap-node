"use client";
import React, { useState } from 'react';
import { SearchInput } from './components/SearchInput';
import { ProductCard } from './components/ProductCard';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false); // Initialize loading state

  const fetchData = async (searchQuery) => {
    setLoading(true); // Set loading to true when starting the fetch
    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const amazonResults = await response.json();
      setProducts(amazonResults);
    } catch (error) {
      console.error('Error fetching product data:', error);
    } finally {
      setLoading(false); // Set loading to false after fetch is complete
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Product Listings</h1>
      <SearchInput onSearch={fetchData} />
      
      {loading ? (
        <p className="text-lg font-semibold text-gray-700">Loading...</p> // Show loading text
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {products.map((product, index) => (
            <ProductCard
              key={index}
              title={product.title}
              image={product.image}
              price={product.price}
              from={product.from}

            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductPage;
