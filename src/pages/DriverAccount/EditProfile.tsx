import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import MainNavigation from '../../components/MainNavigation';
import HomeIndicator from '../../components/HomeIndicator';
// @ts-ignore
import danielAvatar from '../../assets/Ellipse 1192.png';
import './EditProfile.css';

const EditProfile = () => {
    const navigate = useNavigate();
    
    // Form state matching the mockup values
    const [formData, setFormData] = useState({
        name: 'Daniel Asante',
        email: 'danielasante@gmail.com',
        gender: 'Male', // Mockup had a typo here showing a DOB, corrected to 'Male'
        dob: '23/05/1995',
        occupation: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // Logic to save profile changes
        console.log('Saving profile for', formData.name);
        navigate(-1);
    };

    return (
        <div className="ep-screen">
            <StatusBar dark />
            <header className="ep-header">
                <button className="ep-back-btn" onClick={() => navigate(-1)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    <span>Back</span>
                </button>
                <h1 className="ep-title">Edit Profile</h1>
            </header>

            <div className="ep-content nice-scroll">
                {/* Profile Image Section */}
                <div className="ep-avatar-container">
                    <img src={danielAvatar} alt="Profile" className="ep-avatar" />
                    <div className="ep-camera-badge">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#0056B3">
                            <path d="M12 15.5c2.485 0 4.5-2.015 4.5-4.5s-2.015-4.5-4.5-4.5-4.5 2.015-4.5 4.5 2.015 4.5 4.5 4.5z" />
                            <path d="M20 5h-3.17L15 3H9L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-8 13.5c-3.03 0-5.5-2.47-5.5-5.5s2.47-5.5 5.5-5.5 5.5 2.47 5.5 5.5-2.47 5.5-5.5 5.5z" />
                        </svg>
                    </div>
                </div>

                {/* Form Section */}
                <div className="ep-form">
                    <div className="ep-input-group">
                        <label>Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            className="ep-input" 
                            value={formData.name} 
                            onChange={handleChange} 
                            placeholder="Full Name"
                        />
                    </div>

                    <div className="ep-input-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            className="ep-input" 
                            value={formData.email} 
                            onChange={handleChange} 
                            placeholder="Email Address"
                        />
                    </div>

                    <div className="ep-input-group">
                        <label>Gender</label>
                        <input 
                            type="text" 
                            name="gender" 
                            className="ep-input" 
                            value={formData.gender} 
                            onChange={handleChange} 
                            placeholder="Gender"
                        />
                    </div>

                    <div className="ep-input-group">
                        <label>DOB</label>
                        <input 
                            type="text" 
                            name="dob" 
                            className="ep-input" 
                            value={formData.dob} 
                            onChange={handleChange} 
                            placeholder="Date of Birth"
                        />
                    </div>

                    <div className="ep-input-group">
                        <label>Occupation</label>
                        <input 
                            type="text" 
                            name="occupation" 
                            className="ep-input" 
                            value={formData.occupation} 
                            onChange={handleChange} 
                            placeholder="Your Occupation"
                        />
                    </div>

                    <button className="ep-save-btn" onClick={handleSave}>
                        Save Changes
                    </button>
                </div>
            </div>

            <MainNavigation activeTab="profile" isDriver={true} />
            <HomeIndicator dark />
        </div>
    );
};

export default EditProfile;
