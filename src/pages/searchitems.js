import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Package, Tag, User, Hash } from "lucide-react";
import Navbar from "../navbar";
import "./css/search.css";

function SearchItems() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // Extract unique categories from items
  const allCategories = Array.from(
    new Set(
      items.flatMap((item) =>
        Array.isArray(item.category) ? item.category : [item.category]
      )
    )
  ).filter(Boolean);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("http://localhost:8000/sell/list");
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        setItems(data);
        setFilteredItems(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching items:", err);
        setError("Failed to load items. Please try again later.");
      } finally {
        setIsLoading(false);
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
      const descriptionMatch = item.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) || false;
      
      const categories = Array.isArray(item.category)
        ? item.category
        : [item.category];
      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.some((cat) => categories.includes(cat));

      return (nameMatch || descriptionMatch) && categoryMatch;
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

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSearchTerm("");
  };

  const handleItemClick = (item) => {
    try {
      localStorage.setItem("selectedItem", JSON.stringify(item));
      navigate(`/item/${item._id}`);
    } catch (error) {
      console.error("Error storing item data:", error);
      navigate(`/item/${item._id}`);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="page-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading items...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="page-content">
          <div className="error-container">
            <Package size={48} className="error-icon" />
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button 
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page-content">
        <header className="page-header">
          <h1>Discover Products</h1>
          <p className="page-subtitle">
            Browse through {items.length} amazing products from our marketplace
          </p>
        </header>

        <div className="search-section">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              className="search-input"
              type="text"
              placeholder="Search products by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            Filters
            {selectedCategories.length > 0 && (
              <span className="filter-count">{selectedCategories.length}</span>
            )}
          </button>
        </div>

        <div className="main-section">
          {/* Left side: Items grid */}
          <div className="items-section">
            <div className="results-header">
              <span className="results-count">
                {filteredItems.length} product{filteredItems.length !== 1 ? 's' : ''} found
              </span>
              {(selectedCategories.length > 0 || searchTerm) && (
                <button className="clear-filters" onClick={clearAllFilters}>
                  Clear all filters
                </button>
              )}
            </div>

            {filteredItems.length > 0 ? (
              <div className="items-grid">
                {filteredItems.map((item) => (
                  <div
                    key={item._id}
                    className="item-card"
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="item-header">
                      <h3 className="item-name">{item.itemname}</h3>
                      <div className="item-price">{formatPrice(item.price)}</div>
                    </div>
                    
                    <p className="item-description">
                      {item.description?.length > 100 
                        ? `${item.description.substring(0, 100)}...` 
                        : item.description}
                    </p>
                    
                    <div className="item-details">
                      <div className="detail-item">
                        <Tag size={14} />
                        <span>
                          {Array.isArray(item.category)
                            ? item.category.join(", ")
                            : item.category}
                        </span>
                      </div>
                      
                      <div className="detail-item">
                        <Package size={14} />
                        <span>{item.sellquantity} in stock</span>
                      </div>
                      
                      <div className="detail-item">
                        <User size={14} />
                        <span>ID: {item.sellerid}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <Package size={48} className="no-results-icon" />
                <h3>No products found</h3>
                <p>Try adjusting your search terms or filters</p>
              </div>
            )}
          </div>

          {/* Right side: Filter section */}
          <aside className={`filter-sidebar ${showFilters ? 'show-mobile' : ''}`}>
            <div className="filter-header">
              <h3>
                <Filter size={18} />
                Filter by Category
              </h3>
              {selectedCategories.length > 0 && (
                <button 
                  className="clear-category-filters"
                  onClick={() => setSelectedCategories([])}
                >
                  Clear
                </button>
              )}
            </div>
            
            <div className="filter-options">
              {allCategories.map((category) => (
                <label key={category} className="filter-option">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  <span className="checkmark"></span>
                  <span className="category-name">{category}</span>
                  <span className="category-count">
                    ({items.filter(item => 
                      Array.isArray(item.category) 
                        ? item.category.includes(category)
                        : item.category === category
                    ).length})
                  </span>
                </label>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

export default SearchItems;