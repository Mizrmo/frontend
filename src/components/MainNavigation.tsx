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

    // Sprite Y-positions for the compact 75px navbar row
    // Scaled block height ≈ 115px, Centering offset = (115 - 75) / 2 = 20px
    const getSpritePosition = () => {
        switch (activeTab) {
            case 'home': return '0 -20px';
            case 'trips': return '0 -135px';
            case 'favorites': return '0 -250px';
            case 'profile': return '0 -365px';
            default: return '0 -20px';
        }
    };

    return (
        <div className="nav-container-with-indicator">
            <div 
                className="main-navbar-background" 
                style={{ backgroundPosition: getSpritePosition() }}
            >
                <button className="nav-tap-area" onClick={() => navigate(isDriver ? '/driver-dashboard' : '/home_screen_Transport')} />
                <button className="nav-tap-area" onClick={() => navigate(isDriver ? '/driver_upcoming_trips' : '/upcoming-trips')} />
                <button className="nav-tap-area" onClick={() => navigate(isDriver ? '/driver-favorite-rides' : '/favorite-rides')} />
                <button className="nav-tap-area" onClick={() => navigate(isDriver ? '/driver-account' : '/account-settings')} />
            </div>
            <div className="nav-indicator-wrap">
                <HomeIndicator dark />
            </div>
        </div>
    );
};

export default MainNavigation;
