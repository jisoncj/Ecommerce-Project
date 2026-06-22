import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/products/featured');
        setFeaturedProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching featured products", err);
        setError("Failed to load products. Make sure your server is running.");
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative bg-black text-white overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 select-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 select-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="py-24 md:py-32 lg:py-40">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Tech & Style.<br />Reimagined.
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mb-10 font-light">
              NEXUS brings you premium electronics and modern fashion in one seamless experience.
            </p>
            <div className="flex gap-4">
              <a href="#featured" className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
                Shop Now <ArrowRightIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-gray-900">Featured Collection</h2>
            <p className="text-gray-500 mt-2">Curated top picks for you.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-center">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
