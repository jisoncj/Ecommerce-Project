import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const showSuccessMessage = new URLSearchParams(location.search).get('success') === 'true';

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-32"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-12">
      <div className="max-w-5xl mx-auto px-4">
        {showSuccessMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-8 flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Payment successful! Your order has been placed.
            </div>
          </div>
        )}

        <h1 className="text-3xl font-black mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <div className="flex flex-wrap justify-between items-center border-b border-gray-100 pb-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Order ID</p>
                    <p className="font-mono text-gray-900">{order._id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Date</p>
                    <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Total</p>
                    <p className="font-bold text-gray-900">${order.totalAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {order.items.map(item => (
                    <div key={item._id} className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-gray-50" />
                      <div>
                        <p className="font-semibold text-gray-900 line-clamp-1">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
