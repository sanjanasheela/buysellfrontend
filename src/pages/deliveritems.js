import React, { useState, useEffect } from 'react';
import Navbar from '../navbar';
import './css/deliver.css'
function DeliverItems() {
  const [ordersToDeliver, setOrdersToDeliver] = useState([]);
  const [otpInputs, setOtpInputs] = useState({});
  const sellerId = JSON.parse(localStorage.getItem('userProfile'))?._id;

  useEffect(() => {
    if (!sellerId) return;

    const fetchDeliverOrders = async () => {
      try {
        const baseUrl = process.env.REACT_APP_API_URL || 'https://buysell-73zq.onrender.com';
        const response = await fetch(`${baseUrl}/deliver/${sellerId}`);
        const data = await response.json();
        console.log(data);
        setOrdersToDeliver(data.orders || []);
      } catch (error) {
        console.error('Failed to fetch orders to deliver:', error);
      }
    };

    fetchDeliverOrders();
  }, [sellerId]);

  const handleOtpChange = (orderId, value) => {
    setOtpInputs(prev => ({ ...prev, [orderId]: value }));
  };

  const handleDeliver = async (order) => {
    const { buyerId, sellerId, transactionId, totalAmount, _id ,items} = order;
    const otp = otpInputs[_id];
  
    if (!otp) {
      alert('Please enter the OTP');
      return;
    }
  
    try {
      // Step 1: Complete the transaction
      const response = await fetch('https://buysell-73zq.onrender.com/deliver/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerId,
          sellerId,
          transactionId,
          totalAmount,
          otp,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        alert(data.message || 'Failed to complete transaction');
        return;
      }
  
      alert(data.message); // success message

      // ✅ Step 2: Update item quantities for each delivered item
    for (const item of items) {
      console.log('item',item);
      await fetch(`https://buysell-73zq.onrender.com/sell/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id:item.itemId,
          orderedQuantity: item.quantity || 1,
         
          
        }),
      });
    }


      // Step 3: Update local state only after successful deletion on server
      setOrdersToDeliver((prevOrders) => prevOrders.filter((o) => o._id !== _id));
  
      // Clear the OTP input for this order
      setOtpInputs((prev) => {
        const newInputs = { ...prev };
        delete newInputs[_id];
        return newInputs;
      });
  
    } catch (error) {
      console.error('Error completing transaction:', error);
      alert('Something went wrong. Please try again.');
    }
  };
  
  return (
    <>
      <Navbar />
      <div className="deliver-container">
        <h2>Deliver Items</h2>
  
        {ordersToDeliver.length === 0 ? (
          <p>No items to deliver.</p>
        ) : (
          ordersToDeliver.map(order => (
            <div key={order._id} className="order-card">
              <p><strong>Transaction ID:</strong> {order.transactionId}</p>
              <p><strong>Buyer ID:</strong> {order.buyerId}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Total Amount:</strong> ₹{order.totalAmount.toFixed(2)}</p>
              <p><strong>OTP:</strong> {order.otpHash}</p>
  
              <div>
                <strong>Items:</strong>
                <ul>
                  {order.items.map(item => (
                    <li key={item._id}>
                      {item.name} - ₹{item.price.toFixed(2)} x {item.quantity || 1}
                    </li>
                  ))}
                </ul>
              </div>
  
              <input
                type="text"
                placeholder="Enter OTP"
                value={otpInputs[order._id] || ''}
                onChange={(e) => handleOtpChange(order._id, e.target.value)}
              />
              <button onClick={() => handleDeliver(order)}>Mark as Delivered</button>
            </div>
          ))
        )}
      </div>
    </>
  );
  
}

export default DeliverItems;
