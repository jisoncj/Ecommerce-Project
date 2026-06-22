import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { TrashIcon } from '@heroicons/react/24/outline';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center min-h-[calc(100vh-64px)] flex flex-col justify-center items-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Discover our premium collection.</p>
        <Link to="/" className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition duration-200">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Shopping Cart</h1>
          <button 
            onClick={clearCart}
            className="text-sm font-medium text-red-500 hover:text-red-700 underline"
          >
            Clear Cart
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <li key={item.product._id} className="p-6 flex flex-col sm:flex-row items-center gap-6">
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.name}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover bg-gray-50 flex-shrink-0"
                    />
                    
                    <div className="flex-1 text-center sm:text-left">
                      <Link to={`/product/${item.product._id}`} className="text-lg font-bold text-gray-900 hover:text-blue-600 mb-1 line-clamp-2">
                        {item.product.name}
                      </Link>
                      <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                        {item.product.category}
                      </p>
                      
                      <div className="flex items-center justify-center sm:justify-start gap-4">
                        <div className="flex items-center bg-gray-50 rounded-full border border-gray-200">
                          <button 
                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black rounded-l-full"
                          >-</button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black rounded-r-full"
                            disabled={item.quantity >= item.product.stock}
                          >+</button>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item.product._id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-white border border-gray-200 hover:border-red-200 rounded-full"
                          aria-label="Remove item"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-xl font-black text-gray-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs font-medium text-gray-400 mt-1">
                          ${item.product.price.toFixed(2)} each
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sticky top-24">
              <h2 className="text-xl font-black text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping estimate</span>
                  <span className="font-semibold text-gray-900">${(getCartTotal() > 100 ? 0 : 15).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax estimate</span>
                  <span className="font-semibold text-gray-900">${(getCartTotal() * 0.08).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-100 py-6 mb-6">
                <div className="flex justify-between items-end">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-black text-blue-600">
                    ${(getCartTotal() + (getCartTotal() > 100 ? 0 : 15) + (getCartTotal() * 0.08)).toFixed(2)}
                  </span>
                </div>
              </div>
              
              {user ? (
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-colors"
                >
                  Proceed to Checkout
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/login?redirect=cart')}
                  className="w-full py-4 bg-gray-900 text-white rounded-full font-bold text-lg hover:bg-black transition-colors"
                >
                  Login to Checkout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
