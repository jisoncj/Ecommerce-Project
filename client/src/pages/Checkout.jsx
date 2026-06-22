import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../services/api';
import { CartContext } from '../context/CartContext';

// Define Stripe promise outside of component to avoid recreating it
// Note: This relies on STRIPE_PUBLISHABLE_KEY which usually goes in env, 
// but for a beginner project without real transactions, we'll gracefully handle it if missing
const stripePromise = loadStripe('pk_test_your_stripe_public_key_here');

const CheckoutForm = ({ clientSecret, shippingAddress, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/orders`,
      },
      redirect: 'if_required'
    });

    if (paymentError) {
      setError(paymentError.message);
      setProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Payment successful, submit order to our backend
      onSuccess(paymentIntent.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button 
        disabled={!stripe || processing} 
        className="w-full py-4 bg-blue-600 text-white rounded-full font-bold shadow-lg disabled:opacity-50"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
    phone: ''
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create payment intent
      const res = await api.post('/payment/create-intent', {
        items: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        }))
      });
      
      setClientSecret(res.data.clientSecret);
      setStep(2);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error initializing payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (stripePaymentId) => {
    try {
      await api.post('/orders', {
        items: cartItems.map(item => ({
          product: item.product._id,
          name: item.product.name,
          image: item.product.images[0],
          price: item.product.price,
          quantity: item.quantity
        })),
        shippingAddress: address,
        paymentMethod: 'stripe',
        paymentStatus: 'paid',
        stripePaymentId
      });

      clearCart();
      navigate('/orders?success=true');
    } catch (err) {
      console.error(err);
      setError('Payment succeeded but order creation failed. Please contact support.');
    }
  };

  const totalAmount = getCartTotal() + (getCartTotal() > 100 ? 0 : 15) + (getCartTotal() * 0.08);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-black mb-8">Checkout</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <input type="text" placeholder="Full Name" required value={address.fullName} onChange={e => setAddress({...address, fullName: e.target.value})} className="w-full p-4 border rounded-xl" />
              <input type="text" placeholder="Street Address" required value={address.street} onChange={e => setAddress({...address, street: e.target.value})} className="w-full p-4 border rounded-xl" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="City" required value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="w-full p-4 border rounded-xl" />
                <input type="text" placeholder="Postal Code" required value={address.postalCode} onChange={e => setAddress({...address, postalCode: e.target.value})} className="w-full p-4 border rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Country" required value={address.country} onChange={e => setAddress({...address, country: e.target.value})} className="w-full p-4 border rounded-xl" />
                <input type="tel" placeholder="Phone Number" required value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} className="w-full p-4 border rounded-xl" />
              </div>
              <button disabled={loading} className="w-full mt-4 py-4 bg-gray-900 text-white rounded-full font-bold">
                {loading ? 'Processing...' : 'Continue to Payment'}
              </button>
            </form>
          </div>
        )}

        {step === 2 && clientSecret && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-2">Payment</h2>
            <p className="text-gray-500 mb-6">Total to pay: <span className="font-bold text-gray-900">${totalAmount.toFixed(2)}</span></p>
            
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm 
                clientSecret={clientSecret} 
                shippingAddress={address} 
                onSuccess={handlePaymentSuccess} 
              />
            </Elements>
            <button onClick={() => setStep(1)} className="mt-4 text-gray-500 underline text-sm w-full text-center">Back to Shipping</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
