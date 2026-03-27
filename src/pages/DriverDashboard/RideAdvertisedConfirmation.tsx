import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
import carImg from '../../assets/cars/ToyotaVitz.png';
import '../Booking/AvailableRideList.css';
import './RideAdvertisedConfirmation.css';

const RideAdvertisedConfirmation = () => {
    const navigate = useNavigate();

    return (
        <div className="rac-screen">
            {/* Exactly as Available Rides Screen - Blurred */}
            <div className="rac-bg-overlay blurred">
                <div className="rides-top-nav-container">
                    <StatusBar dark={true} />
                    <div className="nav-actions-row">
                        <div className="back-text-btn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                            <span>Back</span>
                        </div>
                    </div>
                </div>

                <div className="rides-page-header">
                    <h1 className="available-rides-title">Available rides</h1>
                    <p className="cars-found-subtitle">18 cars found</p>
                </div>

                <div className="rides-scroll-frame">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="modern-ride-card">
                            <div className="ride-card-left">
                                <div className="blue-z-icon">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                        <circle cx="5" cy="6" r="3" stroke="#0056B3" strokeWidth="2" />
                                        <path d="M8 6H19L5 18H16" stroke="#0056B3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="19" cy="18" r="3" stroke="#0056B3" strokeWidth="2" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ride-card-right">
                                <div className="ride-card-header">
                                    <span className="driver-name-text">Daniel Asante</span>
                                    <span className="price-bold">GH¢22</span>
                                </div>
                                <div className="ride-card-specs">
                                    <span>Toyota Vitz</span><span className="spec-pipe">|</span>
                                    <span>3 seats</span><span className="spec-pipe">|</span>
                                    <span>Community one</span>
                                </div>
                                <div className="ride-card-time-row">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                                    </svg>
                                    <span>5mins away</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dark Backdrop */}
            <div className="rac-backdrop" onClick={() => navigate('/driver-home')} />

            {/* Popup Modal */}
            <div className="rac-popup">
                {/* Close Button */}
                <button className="rac-close-btn" onClick={() => navigate('/driver-home')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>

                {/* Illustration Frame 427319777 */}
                <div className="rac-illustration-frame">
                    <div className="rac-circle-bg">
                        <img src={carImg} alt="Car" className="rac-car-icon" />
                    </div>
                </div>

                {/* Content */}
                <div className="rac-content">
                    <h2 className="rac-title">Ride Advertised</h2>
                    <p className="rac-message">
                        New ride advertise has been created successfully
                    </p>
                </div>
            </div>

            {/* Home Indicator */}
            <div className="rac-home-indicator">
                <HomeIndicator dark />
            </div>
        </div>
    );
};

export default RideAdvertisedConfirmation;
