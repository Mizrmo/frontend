import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import HomeIndicator from '../components/HomeIndicator';
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
            <StatusBar dark />

            <header className="as-header">
                <button className="as-back-btn" onClick={() => navigate(-1)}>
                    <svg width="9" height="16" viewBox="0 0 9 16" fill="none">
                        <path d="M8 1L1 8L8 15" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Back</span>
                </button>
                <h1 className="as-title">Setting</h1>
                <div style={{ width: 60 }} />
            </header>

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
                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                        <circle cx="13" cy="12" r="8.5" stroke="#64748B" strokeWidth="1.8" />
                        <circle cx="13" cy="12" r="4" stroke="#64748B" strokeWidth="1.8" />
                        <path d="M13 22L10.5 19.5H15.5L13 22Z" fill="#64748B" />
                    </svg>
                    <span>Home</span>
                </button>

                {/* Trips */}
                <button className="as-tab" onClick={() => navigate('/upcoming-trips')}>
                    <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
                        <rect x="4" y="2" width="14" height="18" rx="2" stroke="#64748B" strokeWidth="1.8" />
                        <path d="M4 4H2v18a2 2 0 0 0 2 2h14v-2" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round" />
                        <circle cx="15" cy="15" r="4.5" stroke="#64748B" strokeWidth="1.8" />
                        <path d="M4 7h12" stroke="#64748B" strokeWidth="1.4" />
                    </svg>
                    <span>Trips</span>
                </button>

                {/* Favorites */}
                <button className="as-tab" onClick={() => navigate('/favorite-rides')}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                        <path d="M12 21L10.55 19.72C5.4 15.09 2 12.05 2 8.3C2 5.25 4.5 2.75 7.5 2.75C9.25 2.75 10.9 3.55 12 4.85C13.1 3.55 14.75 2.75 16.5 2.75C19.5 2.75 22 5.25 22 8.3C22 12.05 18.6 15.09 13.45 19.72L12 21Z" stroke="#64748B" strokeWidth="1.8" strokeLinejoin="round" />
                    </svg>
                    <span>Favorites</span>
                </button>

                {/* Profile — active */}
                <button className="as-tab active">
                    <div className="as-tab-indicator" />
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill="#0056B3" />
                        <circle cx="12" cy="7" r="4" fill="#0056B3" />
                    </svg>
                    <span>Profile</span>
                </button>
            </nav>

            <HomeIndicator dark />
        </div>
    );
};

export default AccountSettings;
