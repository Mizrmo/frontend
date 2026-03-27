import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainNavigation.css';

import HomeIndicator from './HomeIndicator';

interface MainNavigationProps {
    activeTab: 'home' | 'trips' | 'favorites' | 'profile';
    isDriver?: boolean;
}

const MainNavigation: React.FC<MainNavigationProps> = ({ activeTab, isDriver }) => {
    const navigate = useNavigate();

    const getIcon = (type: string, active: boolean) => {
        const color = active ? "#0056B3" : "#1A1A1A";
        const strokeWidth = active ? "2.5" : "2";

        switch (type) {
            case 'home':
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 21.5s-8-5.5-8-11.5c0-4.42 3.58-8 8-8s8 3.58 8 8c0 6-8 11.5-8 11.5z" stroke={color} strokeWidth={strokeWidth} />
                        <circle cx="12" cy="10" r="5" stroke={color} strokeWidth={strokeWidth} />
                        <circle cx="12" cy="10" r="2" fill={color} />
                    </svg>
                );
            case 'trips':
                return (
                    <svg width="24" height="24" viewBox="0 0 25 25" fill="none">
                        <path d="M1 5.5V1.5H24V23.5H4.5V20.5H1" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4.5 19.5V6.5H20.5V23.5H4.5Z" stroke={color} strokeWidth={strokeWidth} />
                        <circle cx="12.5" cy="15" r="4.5" stroke={color} strokeWidth={strokeWidth} />
                        <path d="M1.5 5.5L24 2.5" stroke={color} strokeWidth={strokeWidth} />
                    </svg>
                );
            case 'favorites':
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                );
            case 'profile':
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className="nav-container-with-indicator">
            <nav className="main-navbar">
                <button
                    className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
                    onClick={() => navigate('/driver-dashboard')}
                >
                    <div className="nav-icon-box">
                        {getIcon('home', activeTab === 'home')}
                    </div>
                    <span>Home</span>
                </button>

                <button
                    className={`nav-item ${activeTab === 'trips' ? 'active' : ''}`}
                    onClick={() => navigate('/upcoming-trips')}
                >
                    <div className="nav-icon-box">
                        {getIcon('trips', activeTab === 'trips')}
                    </div>
                    <span>{isDriver ? 'Request' : 'Trips'}</span>
                </button>

                <button
                    className={`nav-item ${activeTab === 'favorites' ? 'active' : ''}`}
                    onClick={() => navigate('/favorite-rides')}
                >
                    <div className="nav-icon-box">
                        {getIcon('favorites', activeTab === 'favorites')}
                    </div>
                    <span>Favorites</span>
                </button>

                <button
                    className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => navigate('/account-settings')}
                >
                    <div className="nav-icon-box">
                        {getIcon('profile', activeTab === 'profile')}
                    </div>
                    <span>Profile</span>
                </button>
            </nav>
            <div className="nav-indicator-wrap">
                <HomeIndicator dark />
            </div>
        </div>
    );
};

export default MainNavigation;
