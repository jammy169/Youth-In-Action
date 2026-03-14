// src/components/Profile.jsx
import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/signin'); // Redirect if not logged in
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/signin');
    } catch (error) {
      console.error('Sign out error:', error.message);
    }
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh'}}>
      <div style={{
        padding: "2rem",
        maxWidth: "400px",
        margin: "auto",
        textAlign: "center",
        background: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)"
      }}>
        <h2>My Profile</h2>
        <img
          src={user.photoURL || "https://via.placeholder.com/150"}
          alt="Profile"
          style={styles.avatar}
        />
        <p><strong>Name:</strong> {user.displayName || "Anonymous"}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <button onClick={handleLogout} style={styles.logoutButton}>Sign Out</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "400px",
    margin: "auto",
    textAlign: "center",
    background: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)"
  },
  avatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    marginBottom: "1rem"
  },
  logoutButton: {
    marginTop: "1rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#ff4d4f",
    border: "none",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default Profile;
