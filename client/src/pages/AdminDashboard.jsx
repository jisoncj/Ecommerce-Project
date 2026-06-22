import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { orderStatus: newStatus });
      setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-32"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-black mb-8">Admin Dashboard</h1>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm overflow-hidden">
          <h2 className="text-xl font-bold mb-6">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-sm font-semibold text-gray-500">Order ID</th>
                  <th className="pb-3 text-sm font-semibold text-gray-500">User</th>
                  <th className="pb-3 text-sm font-semibold text-gray-500">Date</th>
                  <th className="pb-3 text-sm font-semibold text-gray-500">Total</th>
                  <th className="pb-3 text-sm font-semibold text-gray-500">Status</th>
                  <th className="pb-3 text-sm font-semibold text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map(order => (
                  <tr key={order._id}>
                    <td className="py-4 font-mono text-sm text-gray-600">{order._id.substring(order._id.length - 8)}</td>
                    <td className="py-4">
                      <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                      <p className="text-sm text-gray-500">{order.user?.email}</p>
                    </td>
                    <td className="py-4 text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 font-bold text-gray-900">${order.totalAmount.toFixed(2)}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-4">
                      <select 
                        value={order.orderStatus}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                      >
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
