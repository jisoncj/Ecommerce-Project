import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/20/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className="group relative block bg-white rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-gray-100">
      
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.badge && (
          <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
            {product.badge}
          </span>
        )}
        {product.originalPrice && product.originalPrice > product.price && (
          <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
            Sale
          </span>
        )}
      </div>

      {/* Image Gallery Container */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-50 mb-4">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        {/* On hover show second image if it exists */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
      </div>

      {/* Content */}
      <div>
        <h3 className="text-sm text-gray-500 font-medium mb-1 uppercase tracking-wide">{product.category}</h3>
        <h2 className="text-lg font-bold text-gray-900 line-clamp-1 mb-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h2>
        
        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              i < Math.round(product.rating) 
                ? <StarIcon key={i} className="h-4 w-4" /> 
                : <StarOutlineIcon key={i} className="h-4 w-4 text-gray-300" />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-2">({product.numReviews})</span>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-gray-900">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm font-medium text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
