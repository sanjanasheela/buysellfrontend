import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.valid) {
            navigate('/home');
          } else {
            localStorage.removeItem('token');
          }
        })
        .catch(err => {
          console.error("Token verification error:", err);
          localStorage.removeItem('token');
        });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) {
      return handleError('Email and password are required');
    }

    try {
      const url = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/auth/login`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginInfo)
      });

      const result = await response.json();

      const { success, message, jwtToken, name, error } = result;

      if (success) {
        handleSuccess(message || "Login successful");
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('loggedInUser', name);

        const userInfoUrl = `http://localhost:8000/auth/user/${email}`;
        const userResponse = await fetch(userInfoUrl, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${jwtToken}`
          }
        });
        const userResult = await userResponse.json();

        if (userResult.success) {
          localStorage.setItem('userProfile', JSON.stringify(userResult.user));
        }

        navigate('/home');
      } else {
        const details = error?.details?.[0]?.message || message || "Login failed";
        handleError(details);
      }
    } catch (err) {
      console.error("Login error:", err);
      handleError(err.message || "Something went wrong during login");
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
          // overflow: hidden;
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
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor='email'>Email</label>
            <input
              onChange={handleChange}
              type='email'
              name='email'
              placeholder='Enter your email...'
              value={loginInfo.email}
            />
          </div>
          <div>
            <label htmlFor='password'>Password</label>
            <input
              onChange={handleChange}
              type='password'
              name='password'
              placeholder='Enter your password...'
              value={loginInfo.password}
            />
          </div>
          <button type='submit'>Login</button>
          <span>
            Don&apos;t have an account?
            <Link to="/signup">Signup</Link>
          </span>
        </form>
      </div>
    </>
  );
}

export default Login;
