import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import MainNavigation from '../../components/MainNavigation';
import { SideNavContext } from '../../App';
import SideNav from '../../components/SideNav';
// @ts-ignore
import danielAvatar from '../../assets/Ellipse 1192.png';
import './DriverDashboard.css';

const DriverDashboard = () => {
    const navigate = useNavigate();
    const { setIsOpen } = useContext(SideNavContext);

    return (
        <div className="driver-dashboard">
            <SideNav />
            {/* Top area with grey background */}
            <div className="dd-header-area">
                <div className="status-bar-wrapper">
                    <StatusBar dark />
                </div>
                
                <div className="dd-top-bar">
                    <button className="dd-icon-btn menu" onClick={() => setIsOpen(true)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A202C" strokeWidth="2" strokeLinecap="round">
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    {/* Page title=false (No title here) */}
                    <button className="dd-icon-btn bell">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#000" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="dd-scroll-area">
                <h1 className="dd-greeting">Hello, Daniel</h1>

                <div className="dd-content-container">
                    {/* Stats Section */}
                    <div className="dd-stats-section">
                        <div className="dd-stats-earnings">
                            <p className="dd-stats-label">Total Earnings</p>
                            <div className="dd-earnings-value-wrap">
                                <div className="dd-wallet-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M4 7C4 5.34315 5.34315 4 7 4H17C18.6569 4 20 5.34315 20 7V17C20 18.6569 18.6569 20 17 20H7C5.34315 20 4 18.6569 4 17V7Z" fill="#0056B3"/>
                                        <path d="M16 11H20V13H16C15.4477 13 15 12.5523 15 12C15 11.4477 15.4477 11 16 11Z" fill="#FFFFFF"/>
                                        <circle cx="17" cy="12" r="1" fill="#0056B3"/>
                                    </svg>
                                </div>
                                <span className="dd-earnings-value">Gh¢1,000</span>
                            </div>
                        </div>

                        <div className="dd-stats-row">
                            <div className="dd-stats-item">
                                <p className="dd-stats-label">Rides Today</p>
                                <span className="dd-stats-value">34</span>
                            </div>
                            <div className="dd-stats-item">
                                <p className="dd-stats-label">Miz Miles Bal.</p>
                                <span className="dd-stats-value">34<span className="dd-miz-suffix">/miz</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Active Ride Section */}
                    <div className="dd-section dd-active-ride-section">
                        <div className="dd-section-header">
                            <h2 className="dd-section-title">Active Ride</h2>
                            <span className="dd-view-all blue">View All</span>
                        </div>

                        <div className="dd-active-cards">
                            {[1, 2].map((id) => (
                                <div className="dd-active-card" key={id}>
                                    <div className="dd-avatar-wrap">
                                        <div className="dd-avatar-pulse-ring"></div>
                                        <img src={danielAvatar} alt="Rider" />
                                    </div>
                                    <div className="dd-active-info">
                                        <div className="dd-active-info-top">
                                            <span className="dd-active-name">Tema</span>
                                            <span className="dd-active-date">28 Feb, 10:10 AM</span>
                                        </div>
                                        <span className="dd-route-text">From <strong>Ashaiman</strong> &nbsp;&nbsp;To: <strong>Tema</strong></span>
                                        <span className="dd-starts-text">Starts in: <strong>1 Hr 12 mins</strong></span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Rides Section */}
                    <div className="dd-section dd-upcoming-ride-section">
                        <div className="dd-section-header">
                            <h2 className="dd-section-title">Upcoming Rides</h2>
                            <span className="dd-view-all yellow">View All</span>
                        </div>

                        <div className="dd-upcoming-card">
                            <div className="dd-upcoming-top">
                                <div className="dd-upcoming-icon-wrap">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="5" cy="6" r="3" stroke="#0056B3" strokeWidth="2" />
                                        <path d="M8 6H19L5 18H16" stroke="#0056B3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="19" cy="18" r="3" stroke="#0056B3" strokeWidth="2" />
                                    </svg>
                                </div>
                                <div className="dd-upcoming-top-info">
                                    <h3 className="dd-upcoming-title">Accra- GHc 22.00</h3>
                                    <div className="dd-upcoming-meta">
                                        <span>Estimate Usage: <strong>5 Hrs</strong></span>
                                        <span className="dd-pipe">|</span>
                                        <span>Total Dist.: <strong>85 km</strong></span>
                                    </div>
                                </div>
                            </div>

                            <div className="dd-divider"></div>

                            <div className="dd-route-list">
                                <div className="dd-route-line"></div>
                                <div className="dd-route-row" style={{ marginBottom: '16px' }}>
                                    <div className="dd-route-icon blue-point">
                                        <div className="blue-dot-inner"></div>
                                    </div>
                                    <span className="dd-route-address">Lorem ipsum dolor sit amet</span>
                                </div>
                                <div className="dd-route-row">
                                    <div className="dd-route-icon yellow-pin">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.6193 11.5 9.5 10.3807 9.5 9C9.5 7.61929 10.6193 6.5 12 6.5C13.3807 6.5 14.5 7.61929 14.5 9C14.5 10.3807 13.3807 11.5 12 11.5Z" fill="#FFCC00" />
                                        </svg>
                                    </div>
                                    <span className="dd-route-address">Lorem ipsum dolor sit amet</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <MainNavigation activeTab="home" />
        </div>
    );
};

export default DriverDashboard;
