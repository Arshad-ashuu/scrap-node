// src/components/ProductCard.js
import React from 'react';

interface ProductCardProps {
  title: string;
  image: string;
  price: string;
  from: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ title, image, price, from }) => (
  <div className="bg-white rounded-lg shadow-md p-4 text-center transition-transform transform hover:scale-105">
    <img src={image} alt={title} className="w-full h-48 object-cover rounded-md mb-4" />
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-xl text-gray-600">{price}</p>
    <p className="text-xl text-green-600">{from}</p>

  </div>
);
