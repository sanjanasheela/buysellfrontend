import React, { useState, useEffect } from 'react';
import Navbar from '../navbar';
import { handleError, handleSuccess } from '../utils';
import './css/sell.css'
function Sell() {
  const [formData, setFormData] = useState({
    itemname: '',
    price: '',
    description: '',
    category: '',
    sellerId: '', 
    sellquantity:'',
  });


  useEffect(() => {
    const storedUser = localStorage.getItem('userProfile');
    if (storedUser) {
      const user = JSON.parse(storedUser);
   
      setFormData((prev) => ({
        ...prev,
        sellerId: user.id || user._id || '', 
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { itemname, price, description, category, sellerId,sellquantity } = formData;
    if (!itemname || !price || !description || !category || !sellerId ||!sellquantity) {
      return handleError('Please fill all fields');
    }
    const categoryArray = category.split(',').map(cat => cat.trim()).filter(cat => cat !== '');

    try {
      const url = `${process.env.REACT_APP_API_URL || "https://buysell-73zq.onrender.com"}/sell`;
      console.log('endingto url',url);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemname,
          price: Number(price),
          description,
          category: categoryArray,
          sellerid: sellerId, 
          sellquantity: sellquantity,// match backend spelling (lowercase `id`)
        }),
      });

      const result = await response.json();
      console.log('respone',response);
      if (response.ok) {
        handleSuccess("Item listed for sale!");
        setFormData({
          itemname: '',
          price: '',
          description: '',
          category: '',
          sellerId:'',
          sellquantity:'',
        });
      } else {
        handleError(result.message || "Failed to list item.");
      }
    } catch (error) {
      handleError(error.message || "Something went wrong.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="sell-container">
        <h1>Welcome to Sell Page</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Item name:</label>
            <input
              type="text"
              name="itemname"
              value={formData.itemname}
              onChange={handleChange}
            />
          </div>
  
          <div>
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
  
          <div>
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
  
          <div>
            <label>Category:</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Quantity left:</label>
            <input
              type="number"
              name="sellquantity"
              value={formData.sellquantity}
              onChange={handleChange}
            />
          </div>
  
          <button type="submit">Sell Item</button>
        </form>
      </div>
    </>
  );
  
}

export default Sell;
