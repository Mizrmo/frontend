import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
import './NoFavoriteData.css';

const NoFavoriteData = () => {
    const navigate = useNavigate();

    return (
        <div className="nf-screen" onClick={() => navigate('/home_screen_Transport')}>
            <div className="status-bar-wrapper">
                <StatusBar dark />
                {/* ── Header ── */}
                <header className="nf-header">
                    <button className="nf-back-btn" onClick={(e) => { e.stopPropagation(); navigate(-1); }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                        <span>Back</span>
                    </button>
                    <h1 className="nf-header-title" style={{ position: 'absolute', width: '100%', left: 0, textAlign: 'center', zIndex: -1 }}>Favourites</h1>
                    <button className="nf-skip-btn">Skip</button>
                </header>
            </div>

            {/* ── Empty State Content ── */}
            <div className="nf-content">
                <div className="nf-illustration">
                    <svg width="122" height="154" viewBox="0 0 122 154" fill="none">
                        {/* The pin background shape - darkened */}
                        <path d="M61 154C61 154 122 103.322 122 64.1292C122 28.7118 94.6897 0 61 0C27.3103 0 0 28.7118 0 64.1292C0 103.322 61 154 61 154Z" fill="#CBD5E1" />
                        {/* The grey central circle */}
                        <circle cx="61" cy="62" r="30" fill="#F1F5F9" />
                        {/* The zigzag crack line */}
                        <path d="M0 68L20 54L45 78L75 58L100 82L122 66" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <h2 className="nf-message">No Data Found</h2>
            </div>

            {/* ── Bottom Nav Bar ── */}
            <nav className="ut-tab-bar" onClick={(e) => e.stopPropagation()}>
                <button className="ut-nav-btn" onClick={() => navigate('/home_screen_Transport')}>
                    <div className="tab-icon-wrap" style={{ width: '24px', height: '24px' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 21.5s-8-5.5-8-11.5c0-4.42 3.58-8 8-8s8 3.58 8 8c0 6-8 11.5-8 11.5z" stroke="black" strokeWidth="2" />
                            <circle cx="12" cy="10" r="5" stroke="black" strokeWidth="2" />
                            <circle cx="12" cy="10" r="2" fill="black" />
                        </svg>
                    </div>
                    <span>Home</span>
                </button>
                <button className="ut-nav-btn" onClick={() => navigate('/upcoming-trips')}>
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
                <button className="ut-nav-btn active" onClick={() => navigate('/favorite-rides')}>
                    <div className="tab-icon-wrap" style={{ width: '24px', height: '24px' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0056B3" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="#0056B3" />
                            <path d="M17.5 7.5a1.5 1.5 0 0 1 1.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <span style={{ color: '#0056B3', fontWeight: '600' }}>Favorites</span>
                </button>
                <button className="ut-nav-btn" onClick={() => navigate('/account-settings')}>
                    <div className="tab-icon-wrap" style={{ width: '25px', height: '25px' }}>
                        <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>
                    <span>Profile</span>
                </button>
            </nav>

            <HomeIndicator dark />
        </div>
    );
};

export default NoFavoriteData;
