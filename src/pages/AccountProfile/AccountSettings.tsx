import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
import './AccountSettings.css';

const AccountSettings = () => {
    const navigate = useNavigate();

    const sections = [
        {
            title: "Account",
            items: [
                { id: "edit", label: "Edit profile", icon: "user" },
                { id: "miles", label: "Miz Miles", icon: "miles" },
                { id: "document", label: "Document", icon: "document" },
                { id: "payment", label: "Payment", icon: "payment" },
                { id: "contact", label: "Contact Information", icon: "contact" },
            ]
        },
        {
            title: "Support & About",
            items: [
                { id: "help", label: "Help & Support", icon: "help" },
                { id: "terms", label: "Terms and Policies", icon: "terms" },
                { id: "privacy", label: "Privacy", icon: "privacy" },
            ]
        },
        {
            title: "Actions",
            items: [
                { id: "report", label: "Report a problem", icon: "report" },
                { id: "logout", label: "Log out", icon: "logout", danger: true },
            ]
        }
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case 'user':
                return (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="black">
                        <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" />
                        <path d="M12 14C7.03 14 3 17.13 3 21H21C21 17.13 16.97 14 12 14Z" />
                    </svg>
                );
            case 'miles':
                return (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="black">
                        <rect x="2" y="4" width="9" height="7" rx="1" />
                        <rect x="13" y="4" width="9" height="7" rx="1" />
                        <rect x="2" y="13" width="9" height="7" rx="1" />
                        <rect x="13" y="13" width="9" height="7" rx="1" />
                    </svg>
                );
            case 'document':
                return (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="black">
                        <rect x="3" y="2" width="18" height="20" rx="2" />
                        <rect x="7" y="7" width="10" height="2" rx="1" fill="white" />
                        <rect x="7" y="11" width="10" height="2" rx="1" fill="white" />
                        <rect x="7" y="15" width="6" height="2" rx="1" fill="white" />
                    </svg>
                );
            case 'payment':
                return (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="black">
                        <rect x="2" y="5" width="20" height="14" rx="3" />
                        <rect x="2" y="9" width="20" height="3" fill="white" />
                        <rect x="5" y="14" width="4" height="2" rx="1" fill="white" />
                        <circle cx="17" cy="15" r="2" fill="white" />
                    </svg>
                );
            case 'contact':
                return (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="black">
                        <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.21 2.2z" />
                    </svg>
                );
            case 'help':
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="black" />
                        <path d="M9.5 9.5C9.5 8.12 10.62 7 12 7C13.38 7 14.5 8.12 14.5 9.5C14.5 10.5 13.5 11.5 12.5 12C12.2 12.17 12 12.5 12 12.83V13.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                        <circle cx="12" cy="16" r="0.75" fill="white" stroke="white" strokeWidth="0.5" />
                    </svg>
                );
            case 'terms':
                return (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="black" />
                        <circle cx="12" cy="8" r="1" fill="white" />
                        <rect x="11" y="11" width="2" height="6" rx="1" fill="white" />
                    </svg>
                );
            case 'privacy':
                return (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="black">
                        <path d="M18 10V7C18 4.24 15.76 2 13 2H11C8.24 2 6 4.24 6 7V10H4V22H20V10H18ZM8 7C8 5.35 9.35 4 11 4H13C14.65 4 16 5.35 16 7V10H8V7Z" />
                        <circle cx="12" cy="16" r="2" fill="white" />
                    </svg>
                );
            case 'report':
                return (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="black">
                        <path d="M4 21V4.5L5.5 3H20L18 10H20L18 17H5.5L4 21Z" />
                        <rect x="6" y="5" width="10" height="1.5" rx="0.75" fill="white" />
                    </svg>
                );
            case 'logout':
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="3" width="20" height="18" rx="6" fill="#FF3B30" />
                        <path d="M13 12H7M7 12L9 10M7 12L9 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className="as-screen">
            <div className="status-bar-wrapper">
                <StatusBar dark />
                <header className="as-header">
                    <button className="as-back-btn" onClick={() => navigate(-1)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                        <span>Back</span>
                    </button>
                    <h1 className="as-title" style={{ position: 'absolute', width: '100%', left: 0, textAlign: 'center', zIndex: -1 }}>Setting</h1>
                    <div style={{ width: 60 }} />
                </header>
            </div>

            <div className="as-content">
                {sections.map((section, idx) => (
                    <div key={idx} className="as-section">
                        <h2 className="as-section-title">{section.title}</h2>
                        <div className="as-card">
                            {section.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="as-item"
                                    onClick={() => {
                                        if (item.id === 'logout') navigate('/signin');
                                        if (item.id === 'edit') navigate('/profile-setup');
                                    }}
                                >
                                    <div className="as-icon">{getIcon(item.icon)}</div>
                                    <span className={`as-label ${item.danger ? 'danger' : ''}`}>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <nav className="as-tab-bar">
                {/* Home */}
                <button className="as-tab" onClick={() => navigate('/home_screen_Transport')}>
                    <div className="tab-icon-wrap" style={{ width: '24px', height: '24px' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 21.5s-8-5.5-8-11.5c0-4.42 3.58-8 8-8s8 3.58 8 8c0 6-8 11.5-8 11.5z" stroke="black" strokeWidth="2" />
                            <circle cx="12" cy="10" r="5" stroke="black" strokeWidth="2" />
                            <circle cx="12" cy="10" r="2" fill="black" />
                        </svg>
                    </div>
                    <span>Home</span>
                </button>

                {/* Trips */}
                <button className="as-tab" onClick={() => navigate('/upcoming-trips')}>
                    <div className="tab-icon-wrap" style={{ width: '28px', height: '28px' }}>
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <rect width="28" height="28" rx="4" fill="#94A3B8" />
                            <path d="M4 8h20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                            <path d="M20 8v16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                            <circle cx="10" cy="16" r="4.5" fill="white" />
                        </svg>
                    </div>
                    <span>Trips</span>
                </button>

                {/* Favorites */}
                <button className="as-tab" onClick={() => navigate('/favorite-rides')}>
                    <div className="tab-icon-wrap" style={{ width: '24px', height: '24px' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            <path d="M17.5 7.5a1.5 1.5 0 0 1 1.5 1.5" stroke="black" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <span>Favorites</span>
                </button>

                {/* Profile — active */}
                <button className="as-tab active" onClick={() => navigate('/account-settings')}>
                    <div className="tab-icon-wrap" style={{ width: '25px', height: '25px' }}>
                        <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#0056B3" strokeWidth="2.5">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill="#0056B3" stroke="#0056B3" />
                            <circle cx="12" cy="7" r="4" fill="#0056B3" stroke="#0056B3" />
                        </svg>
                    </div>
                    <span style={{ color: '#0056B3', fontWeight: '600' }}>Profile</span>
                </button>
            </nav>

            <HomeIndicator dark />
        </div>
    );
};

export default AccountSettings;
