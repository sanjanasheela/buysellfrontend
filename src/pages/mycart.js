import React, { useEffect, useState } from "react";
import Navbar from "../navbar";
import "./css/cart.css";
function MyCart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  const user = JSON.parse(localStorage.getItem("userProfile"));
  const baseUrl = "http://localhost:8080/cart";

  useEffect(() => {
    if (user && user._id) {
      fetchCart();
    }
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch(`${baseUrl}/${user._id}`);
      if (!response.ok) throw new Error("Failed to fetch cart");

      const data = await response.json();
      console.log("Cart data:", data);

      // Combine all items from all sellers
      const mergedItems = data.carts.flatMap((cart) => {
        return (cart.items || []).map((item) => ({
          ...item,
          // sellerId: cart.sellerId, // Ensure sellerId is included
        }));
      });

      setCartItems(mergedItems);

      const cost = mergedItems.reduce(
        (sum, item) => sum + item.price * (item.quantity || 1),
        0
      );
      setTotalCost(cost);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const handleRemove = async (itemIdToRemove) => {
    try {
      console.log(user._id, itemIdToRemove);
      const response = await fetch(
        `${baseUrl}/${user._id}/remove/${itemIdToRemove}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove item");
      }

      const result = await response.json();
      console.log("Item removed:", result);

      // Update cartItems in frontend state
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.itemId !== itemIdToRemove)
      );

      // Recalculate total cost
      const newTotalCost = result.cart.items.reduce(
        (sum, item) => sum + item.price * (item.quantity || 1),
        0
      );
      setTotalCost(newTotalCost);
    } catch (error) {
      console.error("Error removing item from cart:", error.message);
      alert("Failed to remove item from cart.");
    }
  };
  const handleOrder = async () => {
    if (cartItems.length === 0) {
      alert("Cart is empty.");
      return;
    }

    // Group items by sellerId
    const sellerItemMap = {};
    cartItems.forEach((item) => {
      if (!sellerItemMap[item.sellerId]) {
        sellerItemMap[item.sellerId] = [];
      }
      sellerItemMap[item.sellerId].push({
        sellerId:item.sellerId,
        itemId: item.itemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity ?? 1,
      });
    });
    console.log(cartItems);

    // Send one order per seller
    for (const [sellerId, items] of Object.entries(sellerItemMap)) {
      const totalAmount = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const orderData = {
        transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        buyerId: user._id,
       
        items,
        totalAmount,

      };

      console.log("Sending order data:", JSON.stringify(orderData, null, 2));

      try {
        const response = await fetch(`http://localhost:8080/orderhis`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });

        const result = await response.json();

        if (response.ok) {
          console.log("Order placed:", result);
        } else {
          console.error("Failed order:", result);
          alert(result.message || "Failed to place order for some items.");
        }
      } catch (err) {
        console.error("Error placing order:", err);
        alert("Something went wrong while placing the order.");
      }
    }
    // ...after all orders are placed
    try {
      const clearResponse = await fetch(
        `http://localhost:8080/cart/${user._id}/clear`,
        {
          method: "DELETE",
        }
      );

      if (!clearResponse.ok) {
        const errorData = await clearResponse.json();
        throw new Error(errorData.message || "Failed to clear cart");
      }

      console.log("Cart cleared successfully.");
      // setCartItems([]);
      // setTotalCost(0);
      alert("All orders placed and cart cleared!");
    } catch (clearErr) {
      console.error("Error clearing cart:", clearErr);
      alert("Order placed, but failed to clear cart.");
    }
    // Clear cart after placing all orders
    fetchCart();
    alert("All orders placed successfully!");
  };

  const handleBuyNow = async (item) => {
    const orderData = {
      transactionId: `TXN-${Date.now()}`, // Unique transaction ID
      buyerId: user._id,

      items: [
        {
          sellerId: item.sellerId, // Make sure `item` includes sellerId
          itemId: item.itemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity ?? 1,
        },
      ],
      totalAmount: item.price * (item.quantity ?? 1),
    };

    console.log("Sending order data:", orderData); // ✅ Print to check

    try {
      const response = await fetch(`http://localhost:8080/orderhis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      const result = await response.json();
      console.log("Order placed:", result);
      await handleRemove(item.itemId);

      alert("Item ordered successfully!");
    } catch (err) {
      console.error("Error ordering item:", err);
      alert("Failed to order item");
    }
  };

  if (!user) {
    return <p>Please log in to see your cart.</p>;
  }

  return (
    <>
      <Navbar />
      <div className="cart-container">
        <h2>My Cart</h2>
        {cartItems.map((item) => (
          <div className="cart-item" key={item._id || item.itemId || item.name}>
            <div className="item-info">
              <p>
                <strong>{item.name || "Unnamed Item"}</strong>
              </p>
              <p>
                ₹{item.price ?? "N/A"} X {item.quantity ?? 1}
              </p>
              <p>
                <strong>Seller ID:</strong> {item.sellerId ?? "Unknown"}
              </p>
            </div>
            <div>
              <button onClick={() => handleRemove(item.itemId)}>Remove</button>
              <button onClick={() => handleBuyNow(item)}>Buy Now</button>
            </div>
            <hr />
          </div>
        ))}
        <p className="cart-total">Total: ₹{totalCost}</p>
        <button onClick={handleOrder}>Place Final Order</button>
      </div>
    </>
  );
}

export default MyCart;
