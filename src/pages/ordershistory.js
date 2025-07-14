import React, { useEffect, useState } from "react";
import Navbar from "../navbar";
import './css/orders.css'

function BuyerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = JSON.parse(localStorage.getItem("userProfile"))?._id;

  useEffect(() => {
    if (!userId) {
      setError("User ID not found");
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const baseUrl = "https://buysell-73zq.onrender.com/orderhis";

        // Fetch Buy Orders
        const buyRes = await fetch(`${baseUrl}/${userId}`);
        const buyText = await buyRes.text();
        let buyOrders = [];
        try {
          const buyData = JSON.parse(buyText);
          buyOrders = (buyData.orders || []).map(order => ({ ...order, orderType: "Buy" }));
        } catch {
          throw new Error("Failed to parse buyer orders");
        }

        // Fetch Sell Orders
        const sellRes = await fetch(`${baseUrl}/seller/${userId}`);
        const sellText = await sellRes.text();
        let sellOrders = [];
        try {
          const sellData = JSON.parse(sellText);
          sellOrders = (sellData.orders || []).map(order => ({ ...order, orderType: "Sell" }));
        } catch {
          throw new Error("Failed to parse seller orders");
        }

        // Merge buy and sell orders
        const allOrders = [...buyOrders, ...sellOrders];

        if (allOrders.length === 0) {
          setError("No orders found for you.");
          setOrders([]);
        } else {
          setOrders(allOrders);
          setError(null);
        }
      } catch (err) {
        setError(err.message);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <p>Error: {error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div>
        <Navbar />
        <p>No orders found for you.</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
     

 <div className="orders-container">
  <h2>Your Orders</h2>

  <div className="orders-grid">
    {orders.map((order) => (
      <div
        key={order._id}
        className={`order-card ${
          order.orderType === "Buy" ? "order-type-buy" : "order-type-sell"
        }`}
      >
        <p><strong>Order Type:</strong> {order.orderType}</p>

        <p>
          <strong>Status:</strong>{" "}
          <span className={`status ${
            order.status === "completed"
              ? "status-completed"
              : order.status === "pending"
              ? "status-pending"
              : "status-cancelled"
          }`}>
            {order.status}
          </span>
        </p>

        <p><strong>Transaction ID:</strong> {order.transactionId}</p>
        <p><strong>Seller ID:</strong> {order.items[0].sellerId}</p>

        {order.orderType === "Buy" && order.status !== "completed" && order.otpHash && (
          <p><strong>OTP:</strong> {order.otpHash}</p>
        )}

        <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
        <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>

        <h4>Items:</h4>
        {order.items.map((item, idx) => (
          <div className="item-details" key={idx}>
            {(order.orderType === "Sell" && order.status === "completed" || order.orderType === "Buy") && order.otpHash && (
              <>
                <p><strong>Item Name:</strong> {item.name || "N/A"}</p>
                <p><strong>Price per Item:</strong> ₹{item.price || "N/A"}</p>
                <p><strong>Quantity:</strong> {item.quantity || 1}</p>
                <p>
                  <strong>Subtotal:</strong>{" "}
                  ₹{item.price && item.quantity ? item.price * item.quantity : "N/A"}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    ))}
  </div>
</div>


    </div>
  );
}

export default BuyerOrders;
