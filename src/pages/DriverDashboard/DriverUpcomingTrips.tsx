import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
import MainNavigation from '../../components/MainNavigation';
import janeImg from '../../assets/lady_profile.png';
import './DriverUpcomingTrips.css';

const DriverUpcomingTrips = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = React.useState<'rides' | 'completed'>('rides');

    return (
        <div className="dut-screen">
            {/* 1. Header & Navigation (Fixed height 94px) */}
            <div className="dut-top-bar">
                <StatusBar dark />
                <div className="dut-nav-row">
                    <button className="dut-back-btn" onClick={() => navigate('/driver-home')}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                        <span>Back</span>
                    </button>
                    <h1 className="dut-page-title">Ride Request</h1>
                    <div className="dut-spacer" />
                </div>
            </div>

            {/* 2. Tabs Row */}
            <div className="dut-tabs-container">
                <div className={`dut-tab ${activeTab === 'rides' ? 'active' : ''}`} onClick={() => setActiveTab('rides')}>
                    <span className={`dut-tab-text ${activeTab !== 'rides' ? 'inactive' : ''}`}>Rides</span>
                    {activeTab === 'rides' && <div className="dut-tab-line" />}
                </div>
                <div className={`dut-tab ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => setActiveTab('completed')}>
                    <span className={`dut-tab-text ${activeTab !== 'completed' ? 'inactive' : ''}`}>Completed</span>
                    {activeTab === 'completed' && <div className="dut-tab-line" />}
                </div>
            </div>

            {/* 4. Content Area */}
            <div className="dut-scroll-area">
                {activeTab === 'rides' ? (
                    <>
                        <div className="dut-label-container">
                            <p className="dut-section-hint">Requests</p>
                        </div>
                        {[1, 2, 3, 4, 5].map((id) => (
                            <div className="dut-request-card" key={id}>
                                <div className="dut-card-body">
                                    <div className="dut-avatar-box">
                                        <img src={janeImg} alt="Passenger" />
                                    </div>
                                    <div className="dut-card-details">
                                        <h3 className="dut-passenger-name">Jane Asantewa</h3>
                                        <p className="dut-route-info">
                                            From: <span className="dut-loc-bold">Ashaiman</span> | To: <span className="dut-loc-bold">Community one</span>
                                        </p>
                                        <div className="dut-distance-row">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="#5A5A5A">
                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                            </svg>
                                            <span className="dut-distance-text">800m (5mins away)</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="dut-card-footer-btns">
                                    <button className="dut-btn-accept" onClick={() => navigate('/driver_start_ride')}>Accept</button>
                                    <button className="dut-btn-reject">Reject</button>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        <div className="dut-label-container">
                            <p className="dut-section-hint">Today</p>
                        </div>
                        {[1, 2].map((id) => (
                            <div className="dut-history-card" key={id}>
                                <div className="dut-card-top">
                                    <div className="dut-avatar-box">
                                        <img src={janeImg} alt="Passenger" />
                                    </div>
                                    <div className="dut-history-info">
                                        <div className="dut-history-header">
                                            <h3 className="dut-history-title">Tema</h3>
                                            <span className="dut-history-date">28 Feb, 10:10 AM</span>
                                        </div>
                                        <p className="dut-history-route">From <span className="dut-loc-bold">Ashaiman</span> To: <span className="dut-loc-bold">Tema</span></p>
                                        <p className="dut-history-stat">Starts in: <span className="dut-loc-bold">1 Hr 12 mins</span></p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="dut-label-container">
                            <p className="dut-section-hint">Yesterday</p>
                        </div>
                        {[3, 4, 5].map((id) => (
                            <div className="dut-history-card" key={id}>
                                <div className="dut-card-top">
                                    <div className="dut-avatar-box">
                                        <img src={janeImg} alt="Passenger" />
                                    </div>
                                    <div className="dut-history-info">
                                        <div className="dut-history-header">
                                            <h3 className="dut-history-title">Tema</h3>
                                            <span className="dut-history-date">28 Feb, 10:10 AM</span>
                                        </div>
                                        <p className="dut-history-route">From <span className="dut-loc-bold">Ashaiman</span> To: <span className="dut-loc-bold">Tema</span></p>
                                        <p className="dut-history-stat">Starts in: <span className="dut-loc-bold">1 Hr 12 mins</span></p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* Bottom Navigation */}
            <MainNavigation activeTab="trips" isDriver={true} />

            {/* Home Indicator */}
            <div className="dut-home-fix">
                <HomeIndicator dark />
            </div>
        </div>
    );
};

export default DriverUpcomingTrips;
