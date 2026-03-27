import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
import MainNavigation from '../../components/MainNavigation';
import './AccountSettings.css';

const AccountSettings = () => {
    const navigate = useNavigate();

    // Mock data removal requested by user to reduce scrolling

    interface SettingItem {
        id: string;
        label: string;
        sub: string;
        icon: string;
        danger?: boolean;
    }

    interface SettingSection {
        title: string;
        items: SettingItem[];
    }

    const sections: SettingSection[] = [
        {
            title: "ACCOUNT",
            items: [
                { id: "edit", label: "Edit Profile", sub: "Change name, photo, and bio", icon: "user" },
                { id: "miles", label: "Miz Miles", sub: "You have 1,240 points", icon: "miles" },
                { id: "document", label: "Documents", sub: "Manage licenses and verification", icon: "document" },
                { id: "payment", label: "Payment Methods", sub: "Add or manage cards", icon: "payment" },
            ]
        },
        {
            title: "SUPPORT",
            items: [
                { id: "help", label: "Help & Support", sub: "FAQs and contact support", icon: "help" },
                { id: "terms", label: "Terms and Policies", sub: "Our legal agreements", icon: "terms" },
                { id: "privacy", label: "Privacy Settings", sub: "Manage your data", icon: "privacy" },
            ]
        },
        {
            title: "SESSION",
            items: [
                { id: "logout", label: "Log Out", sub: "Sign out of your account", icon: "logout", danger: true },
            ]
        }
    ];

    const getIcon = (type: string, danger?: boolean) => {
        const color = danger ? "#EA4335" : "#0056B3";
        switch (type) {
            case 'user':
                return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
            case 'miles':
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 12V8H4v4a2 2 0 1 0 0 4v4h16v-4a2 2 0 1 0 0-4Z" />
                        <path d="M12 11v2" />
                        <path d="M8 11v2" />
                        <path d="M16 11v2" />
                    </svg>
                );
            case 'document':
                return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>;
            case 'payment':
                return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>;
            case 'help':
                return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" /></svg>;
            case 'terms':
                return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h8" /></svg>;
            case 'privacy':
                return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
            case 'logout':
                return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>;
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
                        <svg width="11" height="18" viewBox="0 0 11 18" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 16L2 9L9 2" />
                        </svg>
                        <span>Back</span>
                    </button>
                    <h1 className="as-title">Setting</h1>
                    <div style={{ width: 60 }} /> {/* Spacer to balance layout without Skip button */}
                </header>
            </div>



            <div className="as-content">
                {/* Settings Items */}
                {sections.map((section, idx) => (
                    <div key={idx} className="as-section">
                        <h3 className="as-section-title">{section.title}</h3>
                        <div className="as-card">
                            {section.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="as-item"
                                    onClick={() => {
                                        if (item.id === 'logout') navigate('/signin');
                                        if (item.id === 'edit') navigate('/profile-setup');
                                        if (item.id === 'document') navigate('/documents');
                                        if (item.id === 'help') navigate('/help-support');
                                    }}
                                >
                                    <div className="as-icon-box">
                                        {getIcon(item.icon, item.danger)}
                                    </div>
                                    <div className="as-label-container">
                                        <span className={`as-label ${item.danger ? 'danger' : ''}`}>{item.label}</span>
                                        <span className="as-sublabel">{item.sub}</span>
                                    </div>
                                    <div className="as-chevron">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 18l6-6-6-6" />
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Navigation Tab Bar */}
            <MainNavigation activeTab="profile" />

            <HomeIndicator dark />
        </div>
    );
};

export default AccountSettings;
