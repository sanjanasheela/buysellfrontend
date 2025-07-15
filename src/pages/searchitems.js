import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar";
import "./css/search.css";
function SearchItems() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const navigate = useNavigate();

  // Extract unique categories from items
  const allCategories = Array.from(
    new Set(
      items.flatMap((item) =>
        Array.isArray(item.category) ? item.category : [item.category]
      )
    )
  );

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("https://buysell-73zq.onrender.com/sell/list");
        const data = await res.json();
        setItems(data);
        setFilteredItems(data); // Show all items initially
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };

    fetchItems();
  }, []);

  // Filter items automatically whenever search term or selected categories change
  useEffect(() => {
    const filtered = items.filter((item) => {
      const nameMatch = item.itemname
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const categories = Array.isArray(item.category)
        ? item.category
        : [item.category];
      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.some((cat) => categories.includes(cat));

      return nameMatch && categoryMatch;
    });

    setFilteredItems(filtered);
  }, [searchTerm, selectedCategories, items]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((c) => c !== category)
        : [...prevSelected, category]
    );
  };

  return (
    <>
      <Navbar />
      <div className="page-content">
        <h2>All Items</h2>

        <div className="main-section">
          {/* Left side: Search and items */}
          <div style={{ flex: 3 }}>
            <input
              className="search-input"
              type="text"
              placeholder="Search items by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div
              className="items-grid"
              
            >
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div
                    key={item._id}
                    className="item-card"
                    style={{
                      borderLeftColor: "purple",
                      borderLeftStyle: "solid",
                      borderLeftWidth: "5px",
                    }}
                    onClick={() => {
                      localStorage.setItem(
                        "selectedItem",
                        JSON.stringify(item)
                      );
                      navigate(`/item/${item._id}`);
                    }}
                  >
                    <h4>{item.itemname}</h4>
                    <p>Price: ₹{item.price}</p>
                    <p>Description: {item.description}</p>
                    <p>
                      Category:{" "}
                      {Array.isArray(item.category)
                        ? item.category.join(", ")
                        : item.category}
                    </p>
                    <p>Seller ID: {item.sellerid}</p>
                    <p>Quantity in stock: {item.sellquantity}</p>
                  </div>
                ))
              ) : (
                <p>No items found.</p>
              )}
            </div>
          </div>

          {/* Right side: Filter section */}
          <div>
            <h3>Filter by Category</h3>
            {allCategories.map((category) => (
              <div key={category} style={{ marginBottom: "8px" }}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  {" " + category}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchItems;
