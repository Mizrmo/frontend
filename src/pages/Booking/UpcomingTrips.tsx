import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
import MainNavigation from '../../components/MainNavigation';
// @ts-ignore
import danielAvatar from '../../assets/Ellipse 1192.png';
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
            <div className="status-bar-wrapper">
                <StatusBar dark />
            </div>

            {/* ── Header Area ── */}
            <div className="ut-header-area">
                <header className="ut-header">
                    <button className="ut-back-btn" onClick={() => window.history.back()}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="5" cy="6" r="3" stroke="#0056B3" strokeWidth="2" />
                                        <path d="M8 6H19L5 18H16" stroke="#0056B3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="19" cy="18" r="3" stroke="#0056B3" strokeWidth="2" />
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
            <MainNavigation activeTab="trips" />

            <HomeIndicator dark />
        </div>
    );
};

export default UpcomingTrips;
