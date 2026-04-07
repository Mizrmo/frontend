import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import MainNavigation from '../../components/MainNavigation';
import HomeIndicator from '../../components/HomeIndicator';
// @ts-ignore
import danielAvatar from '../../assets/Ellipse 1192.png';
import './DriverProfile.css';

const DriverProfile = () => {
    const navigate = useNavigate();

    return (
        <div className="dp-screen">
            <StatusBar dark />
            <header className="dp-header">
                <button className="dp-back-btn" onClick={() => navigate(-1)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    <span>Back</span>
                </button>
                <h1 className="dp-title">Profile</h1>
                <button className="dp-edit-btn" onClick={() => navigate('/edit-profile')}>Edit Profile</button>
            </header>

            <div className="dp-scroll-area nice-scroll">
                {/* Profile Info */}
                <div className="dp-profile-info">
                    <div className="dp-avatar-container">
                        <img src={danielAvatar} alt="Daniel Asante" className="dp-avatar" />
                        <div className="dp-camera-badge">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#0056B3">
                                <path d="M12 15.5c2.485 0 4.5-2.015 4.5-4.5s-2.015-4.5-4.5-4.5-4.5 2.015-4.5 4.5 2.015 4.5 4.5 4.5z" />
                                <path d="M20 5h-3.17L15 3H9L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-8 13.5c-3.03 0-5.5-2.47-5.5-5.5s2.47-5.5 5.5-5.5 5.5 2.47 5.5 5.5-2.47 5.5-5.5 5.5z" />
                            </svg>
                        </div>
                    </div>
                    <div className="dp-user-details">
                        <h2>Daniel Asante</h2>
                        <p>+233 50 123 4567</p>
                        <button className="dp-switch-btn">
                            <div className="dp-yellow-dot">
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                    <circle cx="5" cy="5" r="4.5" stroke="white" strokeWidth="1"/>
                                </svg>
                            </div>
                            Switch Profile
                        </button>
                    </div>
                </div>

                {/* Earnings Section */}
                <div className="dp-section">
                    <div className="dp-section-header">
                        <div className="dp-icon-bg">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8z"/>
                            </svg>
                        </div>
                        <h3>Earnings</h3>
                    </div>
                    <div className="dp-earnings-grid">
                        <div className="dp-earning-col">
                            <span className="dp-earning-label">Daily Earning</span>
                            <span className="dp-earning-value">GH¢355.99</span>
                        </div>
                        <div className="dp-earning-col">
                            <span className="dp-earning-label">Weekly Earning</span>
                            <span className="dp-earning-value">GH¢2,491.93</span>
                        </div>
                        <div className="dp-earning-col">
                            <span className="dp-earning-label">Monthly Earning</span>
                            <span className="dp-earning-value">GH¢9,967.72</span>
                        </div>
                    </div>
                </div>

                {/* Rides Section */}
                <div className="dp-section">
                    <div className="dp-section-header">
                        <div className="dp-icon-bg">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                            </svg>
                        </div>
                        <h3>Rides</h3>
                    </div>
                    <div className="dp-info-list">
                        <div className="dp-info-row">
                            <span className="dp-info-label">Daily</span>
                            <span className="dp-info-value">12</span>
                        </div>
                        <div className="dp-info-row">
                            <span className="dp-info-label">Weekly</span>
                            <span className="dp-info-value">54</span>
                        </div>
                        <div className="dp-info-row">
                            <span className="dp-info-label">Monthly</span>
                            <span className="dp-info-value">245</span>
                        </div>
                    </div>
                </div>

                {/* Driver's License Section */}
                <div className="dp-section">
                    <div className="dp-section-header">
                        <div className="dp-icon-bg">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 13H5v-2h10v2zm4-4h-4v-2h4v2zm0-4h-4V7h4v2z"/>
                            </svg>
                        </div>
                        <h3>Driver's License</h3>
                    </div>
                    <div className="dp-info-list" style={{ borderBottom: 'none' }}>
                        <div className="dp-info-row">
                            <span className="dp-info-label">DL Number</span>
                            <span className="dp-info-value">DLFA12457981235</span>
                        </div>
                        <div className="dp-info-row">
                            <span className="dp-info-label">DL Expiry Date</span>
                            <span className="dp-info-value">12 Jan 2023</span>
                        </div>
                        <div className="dp-info-row">
                            <span className="dp-info-label">Experience</span>
                            <span className="dp-info-value">12 Years</span>
                        </div>
                    </div>
                </div>
            </div>

            <MainNavigation activeTab="profile" isDriver={true} />
            <HomeIndicator dark />
        </div>
    );
};

export default DriverProfile;
