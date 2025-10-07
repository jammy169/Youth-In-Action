// src/components/Profile.jsx
import React, { useEffect, useState, useRef } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, query, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { useNavigate } from 'react-router-dom';
import ProfilePictureFallback from './components/ProfilePictureFallback';
import './Profile.css';
import './supabaseConfig'; // Setup Supabase bucket and policies

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [clearPreview, setClearPreview] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const createBasicProfile = (userEmail) => {
    return {
      firstName: 'User',
      lastName: 'Name',
      email: userEmail,
      phone: '00 000 000 0000',
      age: '20',
      sitio: 'MAGHILLS',
      barangay: 'POBLACION',
      joinedYear: '2025',
      bio: 'Passionate volunteer dedicated to making a positive impact in the community.'
    };
  };

  // Get user data from both users collection and registrations to populate profile
  const getUserDataFromRegistrations = async (userEmail, userId) => {
    try {
      console.log('📊 Getting user data for:', userEmail, 'UID:', userId);
      
      // First, try to get data from users collection (from SignUp)
      try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('📊 Found user data from users collection:', userData);
          
          // Handle both firstName/lastName (from event registrations) and displayName (from signup)
          const firstName = userData.firstName || (userData.displayName ? userData.displayName.split(' ')[0] : 'User');
          const lastName = userData.lastName || (userData.displayName ? userData.displayName.split(' ').slice(1).join(' ') : 'Name');
          
          return {
            firstName: firstName,
            lastName: lastName,
            email: userEmail,
            phone: userData.phone || '00 000 000 0000',
            age: userData.age || '20',
            sitio: userData.sitio || 'MAGHILLS',
            barangay: userData.barangay || 'POBLACION',
            joinedYear: '2025',
            bio: 'Passionate volunteer dedicated to making a positive impact in the community.',
            // Additional data from registration
            emergencyContact: userData.emergencyContact || '',
            emergencyPhone: userData.emergencyPhone || '',
            experience: userData.experience || '',
            motivation: userData.motivation || '',
            dietaryRestrictions: userData.dietaryRestrictions || ''
          };
        }
      } catch (userError) {
        console.log('📊 No user data in users collection, checking registrations...');
      }
      
      // If no user data found, check registrations collection
      const registrationsRef = collection(db, 'registrations');
      const registrationsSnapshot = await getDocs(registrationsRef);
      
      // Find the most recent registration for this user
      let userData = null;
      console.log('📊 Total registrations found:', registrationsSnapshot.docs.length);
      
      registrationsSnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('📊 Checking registration:', data.email, 'vs', userEmail);
        if (data.email === userEmail) {
          userData = data;
          console.log('📊 Found user registration data:', data);
        }
      });
      
      console.log('📊 Final userData found:', userData);
      
      if (userData) {
        // Handle both firstName/lastName (from event registrations) and displayName (from signup)
        const firstName = userData.firstName || (userData.displayName ? userData.displayName.split(' ')[0] : 'User');
        const lastName = userData.lastName || (userData.displayName ? userData.displayName.split(' ').slice(1).join(' ') : 'Name');
        
        return {
          firstName: firstName,
          lastName: lastName,
          email: userEmail,
          phone: userData.phone || '00 000 000 0000',
          age: userData.age || '20',
          sitio: userData.sitio || 'MAGHILLS',
          barangay: userData.barangay || 'POBLACION',
          joinedYear: '2025',
          bio: 'Passionate volunteer dedicated to making a positive impact in the community.',
          // Additional data from registration
          emergencyContact: userData.emergencyContact || '',
          emergencyPhone: userData.emergencyPhone || '',
          experience: userData.experience || '',
          motivation: userData.motivation || '',
          dietaryRestrictions: userData.dietaryRestrictions || ''
        };
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error getting user data from registrations:', error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('Auth state changed:', currentUser); // Debug log
      if (currentUser) {
        setUser(currentUser);
        console.log('User authenticated:', currentUser.email); // Debug log
        console.log('User UID:', currentUser.uid); // Debug log
        
        // Try to get user data from registrations first
        try {
          console.log('📊 Attempting to get user data from registrations...');
          const registrationData = await getUserDataFromRegistrations(currentUser.email, currentUser.uid);
          
          if (registrationData) {
            console.log('✅ Found registration data, using it for profile:', registrationData);
            setUserProfile(registrationData);
            setEditForm(registrationData);
            setLoading(false);
            // Don't call fetchUserData if we have registration data
            return;
          } else {
            console.log('⚠️ No registration data found, creating basic profile');
            const basicProfile = createBasicProfile(currentUser.email);
            setUserProfile(basicProfile);
            setEditForm(basicProfile);
            setLoading(false);
          }
        } catch (error) {
          console.error('❌ Error getting registration data:', error);
          const basicProfile = createBasicProfile(currentUser.email);
          setUserProfile(basicProfile);
          setEditForm(basicProfile);
          setLoading(false);
        }
        
        // Only call fetchUserData if we don't have registration data
        await fetchUserData(currentUser.email, currentUser.uid);
      } else {
        console.log('No user authenticated, redirecting to signin'); // Debug log
        navigate('/signin');
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  // Add effect to refetch profile data when user changes
  useEffect(() => {
    if (user && user.uid && !userProfile?.profileImage) {
      console.log('User changed, refetching profile data...'); // Debug log
      fetchUserData(user.email, user.uid);
    }
  }, [user]);

  // Handle profile image updates from ProfilePicture component
  const handleImageUpdate = (newImageUrl) => {
    console.log('🖼️ Profile image updated:', newImageUrl)
    
    // Update the profile immediately
    setUserProfile(prev => {
      const updated = {
        ...prev,
        profileImage: newImageUrl
      };
      console.log('🔄 Updated user profile:', updated);
      return updated;
    });
    
    // Also refresh the profile data from Firestore to ensure consistency
    if (user && user.uid) {
      console.log('🔄 Refreshing profile data from Firestore...');
      fetchUserData(user.email, user.uid);
    }
  };

  // Handle image selection (when user selects a new image)
  const handleImageSelect = (file) => {
    console.log('🖼️ Image selected:', file.name);
    setSelectedImageFile(file);
  };

  const fetchUserData = async (userEmail, userId) => {
    console.log('Fetching user data for email:', userEmail, 'and UID:', userId); // Debug log
    try {
      // Always fetch user registrations first, regardless of profile status
      let userRegistrations = [];
      
      // Try 'registrations' collection first
      try {
        const registrationsRef = collection(db, 'registrations');
        const q = query(registrationsRef);
        const querySnapshot = await getDocs(q);
        
        console.log('Registrations found in "registrations" collection:', querySnapshot.docs.length); // Debug log
        
        userRegistrations = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(registration => registration.email === userEmail)
          .sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));
          
        console.log('User registrations from "registrations":', userRegistrations); // Debug log
      } catch (error) {
        console.log('Error fetching from "registrations" collection:', error);
      }
      
      // If no registrations found, try 'eventRegistrations' collection
      if (userRegistrations.length === 0) {
        try {
          const eventRegistrationsRef = collection(db, 'eventRegistrations');
          const q = query(eventRegistrationsRef);
          const querySnapshot = await getDocs(q);
          
          console.log('Registrations found in "eventRegistrations" collection:', querySnapshot.docs.length); // Debug log
          
          userRegistrations = querySnapshot.docs
            .map(doc => ({
              id: doc.id,
              ...doc.data()
            }))
            .filter(registration => registration.email === userEmail)
            .sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));
            
          console.log('User registrations from "eventRegistrations":', userRegistrations); // Debug log
        } catch (error) {
          console.log('Error fetching from "eventRegistrations" collection:', error);
        }
      }

      // Always set registrations first
      setRegistrations(userRegistrations);

      // First, try to fetch existing user profile from Firestore
      const userProfileRef = doc(db, 'userProfiles', userId);
      const userProfileDoc = await getDoc(userProfileRef);
      
      if (userProfileDoc.exists()) {
        console.log('Found existing user profile in Firestore:', userProfileDoc.data()); // Debug log
        const existingProfile = userProfileDoc.data();
        
        // Use existing profile data if available
        const profileData = {
          firstName: existingProfile.firstName || 'User',
          lastName: existingProfile.lastName || 'Name',
          email: existingProfile.email || userEmail,
          phone: existingProfile.phone || '00 000 000 0000',
          age: existingProfile.age || '20',
          sitio: existingProfile.sitio || 'MAGHILLS',
          barangay: existingProfile.barangay || 'POBLACION',
          joinedYear: existingProfile.joinedYear || '2025',
          bio: existingProfile.bio || 'Passionate volunteer dedicated to making a positive impact in the community.',
          profileImage: existingProfile.profileImage || null // Include the profile image
        };
        
        console.log('Using existing profile data:', profileData); // Debug log
        setUserProfile(profileData);
        setEditForm(profileData);
      } else {
        // If no existing profile, create from registration data or use default
        console.log('No existing profile found, creating from registrations...'); // Debug log
        
        let profileData;
        if (userRegistrations.length > 0) {
          const latestRegistration = userRegistrations[0];
          profileData = {
            firstName: latestRegistration.firstName || 'User',
            lastName: latestRegistration.lastName || 'Name',
            email: latestRegistration.email || userEmail,
            phone: latestRegistration.phone || '00 000 000 0000',
            age: latestRegistration.age || '20',
            sitio: latestRegistration.sitio || 'MAGHILLS',
            barangay: latestRegistration.barangay || 'POBLACION',
            joinedYear: latestRegistration.joinedYear || '2025',
            bio: latestRegistration.bio || 'Passionate volunteer dedicated to making a positive impact in the community.',
            profileImage: null // No profile image yet
          };
        } else {
          // Default profile if no registrations
          profileData = createBasicProfile(userEmail);
        }

        console.log('Profile data created:', profileData); // Debug log

        // Always set the profile data
        setUserProfile(profileData);
        setEditForm(profileData);
        
        console.log('Profile data set successfully'); // Debug log
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      
      // Fallback profile creation on error
      const fallbackProfile = createBasicProfile(userEmail);
      
      console.log('Setting fallback profile:', fallbackProfile); // Debug log
      setUserProfile(fallbackProfile);
      setEditForm(fallbackProfile);
    } finally {
      setLoading(false);
      console.log('Loading set to false'); // Debug log
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditForm({ ...userProfile });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({ ...userProfile });
    // Clear selected image when canceling
    setSelectedImageFile(null);
    // Clear preview in child component
    setClearPreview(true);
    setTimeout(() => setClearPreview(false), 100);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSaveProfile = async () => {
    try {
      let profileData = { ...editForm };
      
      // If there's a selected image, convert it to base64 and include it
      if (selectedImageFile) {
        console.log('🖼️ Converting selected image to base64...');
        const base64Image = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = (e) => reject(e);
          reader.readAsDataURL(selectedImageFile);
        });
        
        profileData.profileImage = base64Image;
        profileData.imageUpdatedAt = new Date().toISOString();
        console.log('✅ Image converted to base64');
      }

      // Save to Firestore user profiles collection
      const userProfileRef = doc(db, 'userProfiles', user.uid);
      await setDoc(userProfileRef, {
        ...profileData,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // Update local state
      setUserProfile(profileData);
      setIsEditing(false);
      
      // Clear selected image
      setSelectedImageFile(null);
      
      // Clear preview in child component
      setClearPreview(true);
      setTimeout(() => setClearPreview(false), 100);
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  const calculateProgress = () => {
    const totalHours = registrations.reduce((total, reg) => {
      // Only count hours from attended events (not just approved)
      if (reg.status === 'attended') {
        return total + (reg.serviceHours || 4); // Use actual service hours or default 4
      }
      return total;
    }, 0);

    const eventsJoined = registrations.filter(reg => reg.status === 'attended').length;
    const pendingEvents = registrations.filter(reg => reg.status === 'pending').length;

    // Define badge levels and their requirements
    const badgeLevels = [
      { name: 'First Timer', icon: '🌱', minHours: 0, maxHours: 9, color: '#27ae60', bgColor: '#e8f8f5' },
      { name: 'Active Volunteer', icon: '🔥', minHours: 10, maxHours: 29, color: '#f39c12', bgColor: '#fff3cd' },
      { name: 'Dedicated Helper', icon: '⭐', minHours: 30, maxHours: 59, color: '#9b59b6', bgColor: '#f4f1f8' },
      { name: 'Community Champion', icon: '🏆', minHours: 60, maxHours: 99, color: '#e67e22', bgColor: '#fdf2e9' },
      { name: 'Volunteer Master', icon: '👑', minHours: 100, maxHours: 199, color: '#e74c3c', bgColor: '#fdf2f2' },
      { name: 'Legendary Hero', icon: '🌟', minHours: 200, maxHours: Infinity, color: '#8e44ad', bgColor: '#f8f4fc' }
    ];

    // Find current badge
    const currentBadge = badgeLevels.find(badge => 
      totalHours >= badge.minHours && totalHours <= badge.maxHours
    ) || badgeLevels[0];

    // Find next badge
    const nextBadge = badgeLevels.find(badge => badge.minHours > totalHours);
    
    // Calculate hours to next badge
    const hoursToNextBadge = nextBadge ? nextBadge.minHours - totalHours : 0;

    // Calculate progress percentage to next badge
    const progressToNextBadge = nextBadge ? 
      Math.min(100, ((totalHours - currentBadge.minHours) / (nextBadge.minHours - currentBadge.minHours)) * 100) : 100;

    return {
      totalHours,
      eventsJoined,
      pendingEvents,
      currentBadge,
      nextBadge,
      hoursToNextBadge,
      progressToNextBadge,
      badgeLevels
    };
  };

  const getEventStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return '✅';
      case 'pending':
        return '⏳';
      case 'rejected':
        return '❌';
      default:
        return '📋';
    }
  };

  const getEventStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'Joined';
      case 'pending':
        return 'Pending';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  const getEventStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'status-approved';
      case 'pending':
        return 'status-pending';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-default';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const day = date.getDate();
    return `${month} ${day}`;
  };

  const refreshRegistrations = async () => {
    if (user && user.uid) {
      console.log('Manually refreshing registrations...'); // Debug log
      setLoading(true);
      
      // Try to fetch registrations again
      let userRegistrations = [];
      
      // Try 'registrations' collection
      try {
        const registrationsRef = collection(db, 'registrations');
        const q = query(registrationsRef);
        const querySnapshot = await getDocs(q);
        
        console.log('Refreshed - registrations found:', querySnapshot.docs.length);
        
        userRegistrations = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(registration => registration.email === user.email)
          .sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));
          
        console.log('Refreshed - user registrations:', userRegistrations);
      } catch (error) {
        console.log('Error refreshing from "registrations":', error);
      }
      
      // Try 'eventRegistrations' collection if no results
      if (userRegistrations.length === 0) {
        try {
          const eventRegistrationsRef = collection(db, 'eventRegistrations');
          const q = query(eventRegistrationsRef);
          const querySnapshot = await getDocs(q);
          
          console.log('Refreshed - eventRegistrations found:', querySnapshot.docs.length);
          
          userRegistrations = querySnapshot.docs
            .map(doc => ({
              id: doc.id,
              ...doc.data()
            }))
            .filter(registration => registration.email === user.email)
            .sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));
            
          console.log('Refreshed - user eventRegistrations:', userRegistrations);
        } catch (error) {
          console.log('Error refreshing from "eventRegistrations":', error);
        }
      }
      
      setRegistrations(userRegistrations);
      setLoading(false);
      
      if (userRegistrations.length > 0) {
        alert(`Found ${userRegistrations.length} event registration(s)!`);
      } else {
        alert('No event registrations found. Check console for details.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/signin');
    } catch (error) {
      console.error('Sign out error:', error.message);
    }
  };

  // Debug logging
  console.log('Current editing state:', isEditing);
  console.log('Current state:', { user, userProfile, loading });

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return (
      <div className="profile-container">
        <div className="error">Profile not found</div>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
      </div>

      <div className={`profile-content ${isEditing ? 'editing' : ''}`}>
        {/* User Profile Section */}
        <div className={`profile-section user-profile ${isEditing ? 'editing' : ''}`}>
          <div className="profile-avatar-section">
            <div className="profile-avatar-wrapper">
            <ProfilePictureFallback
              user={user}
              currentImageUrl={userProfile?.profileImage}
              onImageUpdate={handleImageUpdate}
              onImageSelect={handleImageSelect}
              isEditing={isEditing}
              clearPreview={clearPreview}
            />
            </div>
            <div className="joined-date">Joined {userProfile.joinedYear}</div>
            {!isEditing ? (
              <button className="edit-profile-btn" onClick={handleEditClick}>
                Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button className="save-btn" onClick={handleSaveProfile}>
                  Save
                </button>
                <button className="cancel-btn" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="profile-info">
            <div className="personal-info">
              <div className="info-item">
                <span className="label">Name:</span>
                {isEditing ? (
                  <div className="edit-inputs">
                    <input
                      type="text"
                      name="firstName"
                      value={editForm.firstName}
                      onChange={handleInputChange}
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={editForm.lastName}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                    />
                  </div>
                ) : (
                  <span className="value">{userProfile.firstName} {userProfile.lastName}</span>
                )}
              </div>
              <div className="info-item">
                <span className="label">Age:</span>
                {isEditing ? (
                  <input
                    type="number"
                    name="age"
                    value={editForm.age}
                    onChange={handleInputChange}
                    placeholder="Age"
                    min="16"
                    max="100"
                  />
                ) : (
                  <span className="value">{userProfile.age}</span>
                )}
              </div>
              <div className="info-item">
                <span className="label">Sitio:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="sitio"
                    value={editForm.sitio}
                    onChange={handleInputChange}
                    placeholder="Sitio"
                  />
                ) : (
                  <span className="value">{userProfile.sitio}</span>
                )}
              </div>
              <div className="info-item">
                <span className="label">Barangay:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="barangay"
                    value={editForm.barangay}
                    onChange={handleInputChange}
                    placeholder="Barangay"
                  />
                ) : (
                  <span className="value">{userProfile.barangay}</span>
                )}
              </div>
            </div>

            <div className="contact-info">
              <div className="info-item">
                <span className="label">Phone Number:</span>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                  />
                ) : (
                  <span className="value">{userProfile.phone}</span>
                )}
              </div>
              <div className="info-item">
                <span className="label">Email:</span>
                <span className="value">{userProfile.email}</span>
              </div>
            </div>

            <div className="bio-section">
              <label>Bio:</label>
              {isEditing ? (
                <textarea 
                  name="bio"
                  value={editForm.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <textarea 
                  value={userProfile.bio} 
                  readOnly 
                  placeholder="Tell us about yourself..."
                />
              )}
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className={`profile-section progress-section ${isEditing ? 'editing' : ''}`}>
          <h2>Progress</h2>
          <div className="progress-stats">
            <div className="stat-item">
              <div className="stat-value">{progress.totalHours}</div>
              <div className="stat-label">Total Service Hours</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{progress.eventsJoined}</div>
              <div className="stat-label">Events Joined</div>
            </div>
          </div>

          <div className="badge-section">
            {/* Current Badge - Compact Design */}
            <div className="current-badge" style={{
              background: progress.currentBadge.bgColor,
              border: `2px solid ${progress.currentBadge.color}`,
              color: progress.currentBadge.color
            }}>
              <div className="badge-header">
                <span className="badge-icon">{progress.currentBadge.icon}</span>
                <div className="badge-info">
                  <span className="badge-name">{progress.currentBadge.name}</span>
                  <span className="badge-hours">{progress.totalHours} hours earned</span>
                </div>
              </div>
              
              {/* Progress to Next Badge */}
              {progress.nextBadge && (
                <div className="next-badge-progress">
                  <div className="progress-info">
                    <span className="next-badge-name">{progress.nextBadge.name}</span>
                    <span className="hours-needed">{progress.hoursToNextBadge} more hours needed</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${progress.progressToNextBadge}%` }}></div>
                  </div>
                  <span className="progress-text">{Math.round(progress.progressToNextBadge)}% complete</span>
                </div>
              )}
            </div>

            {/* Quick Badge Preview - Horizontal Layout */}
            <div className="badge-preview">
              <h4>Badge Progress</h4>
              <div className="badge-row">
                {progress.badgeLevels.slice(0, 3).map((badge, index) => (
                  <div 
                    key={badge.name} 
                    className={`badge-preview-item ${progress.totalHours >= badge.minHours ? 'achieved' : 'locked'}`}
                    style={{
                      borderColor: progress.totalHours >= badge.minHours ? badge.color : '#ddd',
                      background: progress.totalHours >= badge.minHours ? badge.bgColor : '#f8f9fa'
                    }}
                  >
                    <span className="preview-icon">
                      {progress.totalHours >= badge.minHours ? badge.icon : '🔒'}
                    </span>
                    <span className="preview-name">{badge.name}</span>
                  </div>
                ))}
              </div>
              {progress.badgeLevels.length > 3 && (
                <div className="more-badges">
                  <span>+{progress.badgeLevels.length - 3} more levels</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Event Activity Feed */}
        <div className="profile-section activity-feed">
          <div className="section-header">
            <h2>Event Activity Feed</h2>
            <button className="see-all-btn">See All</button>
          </div>
          
          <div className="activity-list">
            {registrations.slice(0, 3).map((registration) => (
              <div key={registration.id} className={`activity-card ${getEventStatusColor(registration.status)}`}>
                <div className="activity-status">
                  <span className="status-icon">{getEventStatusIcon(registration.status)}</span>
                  <span className="status-text">[{getEventStatusText(registration.status)}]</span>
                </div>
                <div className="activity-event">
                  {registration.eventTitle} - {formatDate(registration.registrationDate)}
                </div>
              </div>
            ))}
            
            {registrations.length === 0 && (
              <div className="no-activities">
                <div className="no-activities-icon">📋</div>
                <h3>No events yet</h3>
                <p>Start your volunteering journey by joining an event!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="profile-actions">
        <button className="refresh-btn" onClick={refreshRegistrations} style={{ marginRight: '10px', background: '#3498db', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer' }}>
          Refresh Events
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
