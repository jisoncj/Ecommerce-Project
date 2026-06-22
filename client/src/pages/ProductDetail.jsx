import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import { StarIcon } from '@heroicons/react/20/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product", err);
        setError("Failed to load product. It might have been removed.");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-red-50 border border-red-200 text-red-600 p-8 rounded-2xl text-center">
          <p className="text-xl font-medium">{error}</p>
          <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-white rounded-full font-medium text-red-600 border border-red-200 hover:bg-red-50">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Images Section */}
          <div className="w-full md:w-1/2">
            <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden mb-4 border border-gray-100 shadow-sm">
              <img 
                src={product.images[mainImage]} 
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            </div>
            
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button 
                    key={index}
                    onClick={() => setMainImage(index)}
                    className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 ${
                      mainImage === index ? 'border-blue-600' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 flex flex-col pt-4">
            <div className="mb-2 flex items-center gap-4 text-sm font-medium uppercase tracking-widest text-gray-400">
              <span>{product.category}</span>
              {product.brand && (
                <>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>{product.brand}</span>
                </>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
              {product.name}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  i < Math.round(product.rating) 
                    ? <StarIcon key={i} className="h-5 w-5" /> 
                    : <StarOutlineIcon key={i} className="h-5 w-5 text-gray-300" />
                ))}
              </div>
              <span className="text-gray-500 font-medium">{product.rating.toFixed(1)} from {product.numReviews} reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 mb-8 pb-8 border-b border-gray-100">
              <span className="text-4xl font-black text-gray-900">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through mb-1">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Action Area */}
            <div className="mt-auto bg-gray-50 p-6 rounded-3xl border border-gray-100">
              <div className="flex items-center gap-6 mb-6">
                <span className="font-semibold text-gray-900">Quantity</span>
                <div className="flex items-center bg-white rounded-full border border-gray-200">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black rounded-l-full"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-semibold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black rounded-r-full"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
                <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>

              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
              >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
