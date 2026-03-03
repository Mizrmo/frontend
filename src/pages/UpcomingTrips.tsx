import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import HomeIndicator from '../components/HomeIndicator';
import danielAvatar from '../assets/Ellipse 1192.png';
import './UpcomingTrips.css';

const upcomingRides = [
    { id: 1, name: 'Daniel', avatar: danielAvatar, date: '28 Feb, 10:10 AM', from: 'Ashaiman', to: 'Tema', startsIn: '1 Hr 12 mins' },
    { id: 2, name: 'Kendrick', avatar: danielAvatar, date: '28 Feb, 10:10 AM', from: 'Ashaiman', to: 'Tema', startsIn: '1 Hr 12 mins' },
    { id: 3, name: 'Kendrick', avatar: danielAvatar, date: '28 Feb, 10:10 AM', from: 'Ashaiman', to: 'Tema', startsIn: '1 Hr 12 mins' },
    { id: 4, name: 'Kendrick', avatar: danielAvatar, date: '28 Feb, 10:10 AM', from: 'Ashaiman', to: 'Tema', startsIn: '1 Hr 12 mins' },
];

const completedGroups = [
    {
        label: 'Today',
        rides: [
            { id: 1, name: 'Daniel', avatar: danielAvatar, date: '28 Feb, 10:10 AM', from: 'Ashaiman', to: 'Tema', startsIn: '1 Hr 12 mins' },
            { id: 2, name: 'Toby', avatar: danielAvatar, date: '28 Feb, 10:10 AM', from: 'Ashaiman', to: 'Tema', startsIn: '1 Hr 12 mins' },
        ],
    },
    {
        label: 'Yesterday',
        rides: [
            { id: 3, name: 'Gracie', avatar: danielAvatar, date: '28 Feb, 10:10 AM', from: 'Ashaiman', to: 'Tema', startsIn: '1 Hr 12 mins' },
            { id: 4, name: 'Ella', avatar: danielAvatar, date: '28 Feb, 10:10 AM', from: 'Ashaiman', to: 'Tema', startsIn: '1 Hr 12 mins' },
            { id: 5, name: 'Jermaine', avatar: danielAvatar, date: '28 Feb, 10:10 AM', from: 'Ashaiman', to: 'Tema', startsIn: '1 Hr 12 mins' },
        ],
    },
];

const UpcomingTrips = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'rides' | 'completed'>('rides');

    return (
        <div className="ut-screen">
            <StatusBar dark />

            {/* ── Header ── */}
            <header className="ut-header">
                <button className="ut-back-btn" onClick={() => window.history.back()}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    <span>Back</span>
                </button>
                <h1 className="ut-header-title">Ride</h1>
                <div style={{ width: 60 }} />
            </header>

            {/* ── Tabs ── */}
            <div className="ut-tabs">
                <button
                    className={`ut-tab-btn${activeTab === 'rides' ? ' active' : ''}`}
                    onClick={() => setActiveTab('rides')}
                >
                    Rides
                </button>
                <button
                    className={`ut-tab-btn${activeTab === 'completed' ? ' active' : ''}`}
                    onClick={() => setActiveTab('completed')}
                >
                    Completed
                </button>
            </div>

            {/* ── Scrollable content ── */}
            <div className="ut-scroll">

                {activeTab === 'rides' && (
                    <>
                        {/* Active Ride */}
                        <p className="ut-section-label">Active Ride</p>
                        <div className="ut-active-card">
                            <div className="ut-active-top">
                                {/* Icon */}
                                <div className="ut-ride-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="#0056B3" strokeWidth="2" fill="#EFF6FF" />
                                        <path d="M8 12C8 12 9.5 10 12 10C14.5 10 16 12 16 12C16 12 14.5 14 12 14C9.5 14 8 12 8 12Z" stroke="#0056B3" strokeWidth="2" />
                                        <circle cx="12" cy="12" r="2" fill="#0056B3" />
                                    </svg>
                                </div>
                                {/* Title & meta */}
                                <div className="ut-active-info">
                                    <span className="ut-active-title">Accra- GHc 22.00</span>
                                    <span className="ut-active-meta">
                                        Estimated Arrival Time <strong>5 Hrs</strong> | Total Dist.: <strong>85 km</strong>
                                    </span>
                                </div>
                            </div>

                            <div className="ut-divider" />

                            {/* Route */}
                            <div className="ut-route">
                                <div className="ut-route-row">
                                    <span className="ut-dot blue" />
                                    <span className="ut-route-text">Ashaiman, main station</span>
                                </div>
                                <div className="ut-route-connector">
                                    <span className="ut-dash" /><span className="ut-dash" /><span className="ut-dash" />
                                </div>
                                <div className="ut-route-row">
                                    <span className="ut-pin">
                                        <svg width="16" height="20" viewBox="0 0 24 24" fill="#FFCC00">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                        </svg>
                                    </span>
                                    <span className="ut-route-text">Community One, Tema</span>
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Rides */}
                        <p className="ut-section-label" style={{ marginTop: 24 }}>Upcoming Rides</p>
                        <div className="ut-upcoming-list">
                            {upcomingRides.map(ride => (
                                <div
                                    key={ride.id}
                                    className="ut-upcoming-card"
                                    onClick={() => navigate('/booked-ride-details')}
                                >
                                    <img src={ride.avatar} alt={ride.name} className="ut-avatar" />
                                    <div className="ut-upcoming-info">
                                        <div className="ut-upcoming-row1">
                                            <span className="ut-upcoming-name">{ride.name}</span>
                                            <span className="ut-upcoming-date">{ride.date}</span>
                                        </div>
                                        <span className="ut-upcoming-route">
                                            From <strong>{ride.from}</strong>&nbsp;&nbsp;To: <strong>{ride.to}</strong>
                                        </span>
                                        <span className="ut-upcoming-starts">
                                            Starts in: <strong>{ride.startsIn}</strong>
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === 'completed' && (
                    <div className="ut-completed-wrap">
                        {completedGroups.map(group => (
                            <div key={group.label}>
                                {/* Day label */}
                                <p className="ut-section-label" style={{ marginTop: 16 }}>{group.label}</p>

                                {/* Cards */}
                                <div className="ut-upcoming-list">
                                    {group.rides.map(ride => (
                                        <div
                                            key={ride.id}
                                            className="ut-upcoming-card"
                                            onClick={() => navigate('/booked-ride-details')}
                                        >
                                            <img src={ride.avatar} alt={ride.name} className="ut-avatar" />
                                            <div className="ut-upcoming-info">
                                                <div className="ut-upcoming-row1">
                                                    <span className="ut-upcoming-name">{ride.name}</span>
                                                    <span className="ut-upcoming-date">{ride.date}</span>
                                                </div>
                                                <span className="ut-upcoming-route">
                                                    From <strong>{ride.from}</strong>&nbsp;&nbsp;To: <strong>{ride.to}</strong>
                                                </span>
                                                <span className="ut-upcoming-starts">
                                                    Starts in: <strong>{ride.startsIn}</strong>
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Bottom Nav Bar ── */}
            <nav className="ut-tab-bar">

                {/* Home */}
                <button className="ut-nav-btn" onClick={() => navigate('/home_screen_Transport')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" color="#94A3B8">
                        <circle cx="12" cy="11" r="8" stroke="currentColor" strokeWidth="2.1" />
                        <circle cx="12" cy="11" r="4" stroke="currentColor" strokeWidth="2.1" />
                        <path d="M12 21L9 18H15L12 21Z" fill="currentColor" />
                    </svg>
                    <span style={{ fontWeight: 400 }}>Home</span>
                </button>

                {/* Trips — active */}
                <button className="ut-nav-btn active">
                    <div className="ut-nav-icon-bg">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <rect x="4" y="2" width="13" height="17" rx="2" stroke="#fff" strokeWidth="1.8" />
                            <path d="M4 4H2v17a2 2 0 0 0 2 2h14v-2" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
                            <circle cx="14" cy="14" r="4" stroke="#fff" strokeWidth="1.8" />
                        </svg>
                    </div>
                    <span style={{ fontWeight: 400 }}>Trips</span>
                </button>

                {/* Favorites */}
                <button className="ut-nav-btn" onClick={() => navigate('/favorite-rides')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" color="#94A3B8">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor" />
                        <path d="M16 6.5C17.5 6.5 18.5 7.5 18.5 8.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                        <circle cx="16" cy="7.5" r="1.2" fill="white" />
                    </svg>
                    <span style={{ fontWeight: 400 }}>Favorites</span>
                </button>

                {/* Profile */}
                <button className="ut-nav-btn" onClick={() => navigate('/account-settings')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="7" r="4" stroke="#94A3B8" strokeWidth="1.8" />
                    </svg>
                    <span style={{ fontWeight: 400 }}>Profile</span>
                </button>

            </nav>

            <HomeIndicator dark />
        </div>
    );
};

export default UpcomingTrips;
