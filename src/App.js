import { Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";
import RefrshHandler from "./RefrshHandler";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Home from "./pages/Home";
import SeachItems from './pages/searchitems';
import Items from './pages/items';
import OrdersHistory from './pages/ordershistory';
import DeliverItems from './pages/deliveritems';
import MyCart from './pages/mycart';
import Sell from './pages/sell';
import Chatbot from './pages/chatbot'; 
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/login" />;
  };

  const token = localStorage.getItem("token");

  return (
    <div className="App" style={{ position: "relative", minHeight: "100vh" }}>
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />

      {/*  in */}
      {token && (
        <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 999 }}>
          <Chatbot />
        </div>
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/searchitems"
          element={
            <PrivateRoute>
              <SeachItems />
            </PrivateRoute>
          }
        />
        <Route
          path="/item/:id"
          element={
            <PrivateRoute>
              <Items />
            </PrivateRoute>
          }
        />
        <Route
          path="/ordershistory"
          element={
            <PrivateRoute>
              <OrdersHistory />
            </PrivateRoute>
          }
        />
        <Route
          path="/deliveritems"
          element={
            <PrivateRoute>
              <DeliverItems />
            </PrivateRoute>
          }
        />
        <Route
          path="/sell"
          element={
            <PrivateRoute>
              <Sell />
            </PrivateRoute>
          }
        />
        <Route
          path="/mycart"
          element={
            <PrivateRoute>
              <MyCart />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
