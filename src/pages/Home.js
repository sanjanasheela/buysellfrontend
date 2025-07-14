import React, { useEffect, useState } from 'react';
import Navbar from '../navbar';
import { handleError, handleSuccess } from '../utils';
import './css/home.css'


function Profile() {
  const [user, setUser] = useState({
    firstname: '',
    lastname: '',
    email: '',
    age: '',
    contactnumber: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  // Load userProfile from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('userProfile');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse userProfile from localStorage', err);
      }
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    try {
      localStorage.setItem('userProfile', JSON.stringify(user));
      handleSuccess('Profile updated successfully');
      setIsEditing(false);
      // TODO: Optionally send updated user data to backend via API call to save changes permanently
    } catch (error) {
      handleError('Failed to update profile');
    }
  };

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <h2>Profile</h2>
  
        <div>
          <label>First Name:</label>
          {isEditing ? (
            <input
              name="firstname"
              value={user.firstname}
              onChange={handleChange}
            />
          ) : (
            <span>{user.firstname}</span>
          )}
        </div>
  
        <div>
          <label>Last Name:</label>
          {isEditing ? (
            <input
              name="lastname"
              value={user.lastname}
              onChange={handleChange}
            />
          ) : (
            <span>{user.lastname}</span>
          )}
        </div>
  
        <div>
          <label>Email:</label>
          {isEditing ? (
            <input
              name="email"
              value={user.email}
              onChange={handleChange}
              type="email"
            />
          ) : (
            <span>{user.email}</span>
          )}
        </div>
  
        <div>
          <label>Age:</label>
          {isEditing ? (
            <input
              name="age"
              value={user.age}
              onChange={handleChange}
              type="number"
              min="0"
            />
          ) : (
            <span>{user.age}</span>
          )}
        </div>
  
        <div>
          <label>Contact Number:</label>
          {isEditing ? (
            <input
              name="contactnumber"
              value={user.contactnumber}
              onChange={handleChange}
              type="tel"
            />
          ) : (
            <span>{user.contactnumber}</span>
          )}
        </div>
  
        <div className="button-group">
          {isEditing ? (
            <>
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
        </div>
      </div>
    </>
  );
  
}

export default Profile;
