import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import '/home/sanjanasheela/Documents/webd/BUY-SELL/v2/BUY-SELL/frontend/srcnavbar.css'
import './navbar.css';
function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  return(
  <nav>
  <div className="nav-links">
    <div className="nav-item"><Link to="/home">Home</Link></div>
    <div className="nav-item"><Link to="/searchitems">Search</Link></div>
    <div className="nav-item"><Link to="/ordershistory">Order History</Link></div>
    <div className="nav-item"><Link to="/deliveritems">Delivery</Link></div>
    <div className="nav-item"><Link to="/sell">Sell</Link></div>
    <div className="nav-item"><Link to="/mycart">My Cart</Link></div>
  </div>
  <button onClick={handleLogout}>Logout</button>
</nav>
  );

  
}

export default Navbar;
