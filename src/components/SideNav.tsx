import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SideNavContext } from '../App';
import './SideNav.css';

const SideNav = () => {
    const { isOpen, setIsOpen } = useContext(SideNavContext);
    const navigate = useNavigate();

    const menuItems = [
        {
            label: 'Miz Miles',
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
            ),
            path: '/miz-miles',
        },
        {
            label: 'Trips',
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                </svg>
            ),
            path: '/driver-trips',
        },
        {
            label: 'Referral',
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 5v2" />
                    <path d="M15 11v2" />
                    <path d="M15 17v2" />
                    <path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z" />
                </svg>
            ),
            path: '/referral',
        },
        {
            label: 'Payment',
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                    <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
                    <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
                </svg>
            ),
            path: '/payment',
        },
        {
            label: 'Support',
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                </svg>
            ),
            path: '/support',
        },
        {
            label: 'About Us',
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    <line x1="12" y1="7" x2="12" y2="11" />
                    <line x1="12" y1="14" x2="12.01" y2="14" />
                </svg>
            ),
            path: '/about',
        },
    ];

    return (
        <>
            {/* ── Backdrop ── */}
            {isOpen && (
                <div className="side-nav-backdrop" onClick={() => setIsOpen(false)} />
            )}

            {/* ── Drawer ── */}
            <div className={`side-nav-drawer ${isOpen ? 'side-nav-drawer--open' : ''}`}>
                {/* Header */}
                <div className="side-nav-header">
                    <button className="side-nav-close" onClick={() => setIsOpen(false)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A202C" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Profile */}
                <div className="side-nav-profile">
                    <div className="side-nav-avatar">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="#555">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>
                    <div className="side-nav-profile-info">
                        <span className="side-nav-name">Kwabena Boa</span>
                        <span className="side-nav-role">Profile</span>
                    </div>
                </div>

                {/* Switch Profile */}
                <button className="side-nav-switch">
                    <span className="side-nav-switch-icon">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="#FFCC00">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 12l-4-4h8l-4 4z" />
                        </svg>
                    </span>
                    <span>Switch Profile</span>
                </button>

                <div className="side-nav-divider" />

                {/* Menu Items */}
                <nav className="side-nav-menu">
                    {menuItems.map((item) => (
                        <button
                            key={item.label}
                            className="side-nav-item"
                            onClick={() => {
                                setIsOpen(false);
                                navigate(item.path);
                            }}
                        >
                            <span className="side-nav-item-icon">{item.icon}</span>
                            <span className="side-nav-item-label">{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Logout */}
                <button className="side-nav-logout">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E53935" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>Logout</span>
                </button>
            </div>
        </>
    );
};

export default SideNav;
