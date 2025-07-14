import React, { useEffect, useState } from "react";
import Navbar from "../navbar";
import './css/items.css'
function ItemDetails() {
  const [item, setItem] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const savedItem = localStorage.getItem("selectedItem");
    if (savedItem) {
      setItem(JSON.parse(savedItem));
      localStorage.removeItem("selectedItem"); // Remove after use
    }
  }, []);

  const handleAddToCart = async () => {
    try {
      const userProfileString = localStorage.getItem("userProfile");
      const userProfile = JSON.parse(userProfileString);
      const userId = userProfile?._id;
  
      if (!userId) {
        alert("User not logged in.");
        return;
      }
  
      if (!item || !item._id) {
        alert("Item not loaded properly");
        return;
      }
  
    
      const postBody = {
        userId: userId,
        sellerId: item.sellerid,
        itemId: item._id,
        name: item.itemname,
        price: item.price,
        quantity: 1
      };
  
      console.log("POST body being sent:", postBody);
  
      const response = await fetch("http://localhost:8080/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postBody),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add to cart");
      }
  
      const data = await response.json();
      console.log("Cart item saved:", data);
      setAddedToCart(true);
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Failed to add item to cart");
    }
  };
  
  

  if (!item) {
    return (
      <div>
        <Navbar />
        <p>Loading item details...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="item-details-container">
        <h2>{item.itemname}</h2>
        <p><strong>Price:</strong> ₹{item.price}</p>
        <p><strong>Description:</strong> {item.description}</p>
        <p><strong>Category:</strong> {Array.isArray(item.category) ? item.category.join(", ") : item.category}</p>
        <p><strong>Seller ID:</strong> {item.sellerid}</p>
        <p><strong>Quantity left:</strong>{item.sellquantity}</p>
        <button onClick={handleAddToCart}>
          Add to Cart
        </button>
  
        {addedToCart && (
          <p className="added-message">Added to cart!</p>
        )}
      </div>
    </>
  );
  
}

export default ItemDetails;
