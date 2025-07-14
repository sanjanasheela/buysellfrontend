import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    firstname: "",
    lastname: "",
    email: "",
    age: "",
    contactnumber: "",
    password: "",
  });

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { firstname, lastname, email, age, contactnumber, password } = signupInfo;
    if (!firstname || !lastname || !email || !age || !contactnumber || !password) {
      return handleError("Name, email, and password are required");
    }

    try {
      const url = `${process.env.REACT_APP_API_URL || "http://localhost:8080"}/auth/signup`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupInfo),
      });

      const result = await response.json();
      const { success, message, error } = result;

      if (success) {
        handleSuccess(message);
        localStorage.setItem("userProfile", JSON.stringify({ firstname, lastname, email, age, contactnumber }));
        setTimeout(() => navigate("/home"), 1000);
      } else {
        const details = error?.details?.[0]?.message || message || "Signup failed";
        handleError(details);
      }
    } catch (err) {
      handleError(err.message || "Something went wrong");
    }
  };

  return (
    <>
      <style>{`
        html, body {
          height: 100%;
          width: 100%;
          margin: 0;
          font-family: Arial, sans-serif;
          overflow: auto;
        }

        body {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          background-color: #f4f4f4;
          padding-top: 40px;
          padding-bottom: 200px;
        }

        .container {
          background-color: #fff;
          padding: 32px 48px;
          border-radius: 10px;
          width: 100%;
          max-width: 600px;
          box-shadow: 8px 8px 24px rgba(66, 68, 90, 0.2);
        }

        .container h1 {
          margin-bottom: 20px;
          text-align: center;
        }

        .container form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .container div {
          display: flex;
          flex-direction: column;
        }

        .container input {
          width: 100%;
          font-size: 18px;
          padding: 10px;
          border: none;
          outline: none;
          border-bottom: 1px solid #333;
        }

        .container input::placeholder {
          font-size: 14px;
          font-style: italic;
        }

        button {
          background-color: purple;
          border: none;
          font-size: 18px;
          color: white;
          border-radius: 6px;
          padding: 12px;
          cursor: pointer;
          margin-top: 10px;
          transition: background-color 0.3s;
        }

        button:hover {
          background-color: #5e0094;
        }

        span {
          font-size: 14px;
          text-align: center;
          margin-top: 12px;
        }

        span a {
          margin-left: 4px;
          color: purple;
          text-decoration: none;
        }

        span a:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="container">
        <h1>Signup</h1>
        <form onSubmit={handleSignup}>
          <div>
            <label htmlFor="firstname">First Name</label>
            <input
              type="text"
              name="firstname"
              placeholder="Enter your firstname..."
              value={signupInfo.firstname}
              onChange={handleChange}
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="lastname">Last Name</label>
            <input
              type="text"
              name="lastname"
              placeholder="Enter your lastname..."
              value={signupInfo.lastname}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email..."
              value={signupInfo.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="age">Age</label>
            <input
              type="number"
              name="age"
              placeholder="Enter your age..."
              value={signupInfo.age}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="contactnumber">Contact Number</label>
            <input
              type="tel"
              name="contactnumber"
              placeholder="Enter your contact number..."
              value={signupInfo.contactnumber}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password..."
              value={signupInfo.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit">Signup</button>
          <span>
            Already have an account?<Link to="/login">Login</Link>
          </span>
        </form>
        <ToastContainer />
      </div>
    </>
  );
}

export default Signup;
