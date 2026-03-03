import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import HomeIndicator from '../components/HomeIndicator';
import './NoFavoriteData.css';

const NoFavoriteData = () => {
    const navigate = useNavigate();

    return (
        <div className="nf-screen" onClick={() => navigate('/home_screen_Transport')}>
            <StatusBar dark />

            {/* ── Header ── */}
            <header className="nf-header">
                <button className="nf-back-btn" onClick={(e) => { e.stopPropagation(); navigate(-1); }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    <span>Back</span>
                </button>
                <h1 className="nf-header-title">Favourites</h1>
                <button className="nf-skip-btn">Skip</button>
            </header>

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
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" stroke="#94A3B8" strokeWidth="1.8" strokeLinejoin="round" />
                        <path d="M9 21V12h6v9" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Home</span>
                </button>
                <button className="ut-nav-btn" onClick={() => navigate('/upcoming-trips')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="3" width="20" height="18" rx="2" stroke="#94A3B8" strokeWidth="1.8" />
                        <path d="M1 5.5h22M10 10l-2 2 2 2m4-4l2 2-2 2" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Trips</span>
                </button>
                <button className="ut-nav-btn active">
                    <div className="ut-nav-icon-bg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <span>Favorites</span>
                </button>
                <button className="ut-nav-btn" onClick={() => navigate('/profile-setup')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="7" r="4" stroke="#94A3B8" strokeWidth="1.8" />
                    </svg>
                    <span>Profile</span>
                </button>
            </nav>

            <HomeIndicator dark />
        </div>
    );
};

export default NoFavoriteData;
