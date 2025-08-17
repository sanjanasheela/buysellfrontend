import React, { useEffect, useState } from 'react';
import Navbar from '../navbar';
import { handleError, handleSuccess } from '../utils';
import './css/home.css';

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
    } catch (error) {
      handleError('Failed to update profile');
    }
  };

  const handleCancel = () => {
    // Reset to stored data
    const storedUser = localStorage.getItem('userProfile');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse userProfile from localStorage', err);
      }
    }
    setIsEditing(false);
  };

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-header">
            <h1>Profile</h1>
            <p>Manage your personal information</p>
          </div>

          <div className="profile-form">
            <div className="form-group">
              <label htmlFor="firstname">First Name</label>
              {isEditing ? (
                <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  value={user.firstname}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                />
              ) : (
                <div className="field-value">{user.firstname || 'Not provided'}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastname">Last Name</label>
              {isEditing ? (
                <input
                  id="lastname"
                  name="lastname"
                  type="text"
                  value={user.lastname}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                />
              ) : (
                <div className="field-value">{user.lastname || 'Not provided'}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              {isEditing ? (
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                />
              ) : (
                <div className="field-value">{user.email || 'Not provided'}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="age">Age</label>
              {isEditing ? (
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="0"
                  max="120"
                  value={user.age}
                  onChange={handleChange}
                  placeholder="Enter your age"
                />
              ) : (
                <div className="field-value">{user.age || 'Not provided'}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="contactnumber">Contact Number</label>
              {isEditing ? (
                <input
                  id="contactnumber"
                  name="contactnumber"
                  type="tel"
                  value={user.contactnumber}
                  onChange={handleChange}
                  placeholder="Enter your contact number"
                />
              ) : (
                <div className="field-value">{user.contactnumber || 'Not provided'}</div>
              )}
            </div>

            <div className="button-group">
              {isEditing ? (
                <>
                  <button className="btn btn-primary" onClick={handleSave}>
                    Save Changes
                  </button>
                  <button className="btn btn-secondary" onClick={handleCancel}>
                    Cancel
                  </button>
                </>
              ) : (
                <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;