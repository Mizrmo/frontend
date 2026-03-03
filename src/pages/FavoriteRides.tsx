import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import HomeIndicator from '../components/HomeIndicator';
import './FavoriteRides.css';

const FavoriteRides = () => {
    const navigate = useNavigate();

    const favoriteRides = [
        { id: 1, title: 'Community One', date: '17 Oct, 24', price: 'GH¢22.00', location: 'Community one' },
        { id: 2, title: 'Community One', date: '17 Oct, 24', price: 'GH¢22.00', location: 'Community one' },
    ];

    const favoriteDrivers = [
        { id: 3, title: 'Community One', date: '17 Oct, 24', price: 'GH¢22.00', location: 'Community one' },
        { id: 4, title: 'Community One', date: '17 Oct, 24', price: 'GH¢22.00', location: 'Community one' },
        { id: 5, title: 'Community One', date: '17 Oct, 24', price: 'GH¢22.00', location: 'Community one' },
        { id: 6, title: 'Community One', date: '17 Oct, 24', price: 'GH¢22.00', location: 'Community one' },
    ];

    return (
        <div className="fr-screen">
            <StatusBar dark />

            {/* ── Header ── */}
            <header className="fr-header">
                <button className="fr-back-btn" onClick={() => navigate(-1)}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    <span>Back</span>
                </button>
                <h1 className="fr-header-title">Favourites</h1>
                <div style={{ width: 60 }} />
            </header>

            {/* ── Search Bar ── */}
            <div className="fr-search-wrap">
                <div className="fr-search-bar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <input type="text" placeholder="search ride or driver" className="fr-search-input" />
                </div>
            </div>

            <div className="fr-scroll">
                {/* ── Rides Section ── */}
                <p className="fr-section-label">3 Rides</p>
                <div className="fr-list">
                    {favoriteRides.map(ride => (
                        <div key={ride.id} className="fr-card">
                            <div className="fr-card-icon-wrap">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="#0056B3" strokeWidth="2" fill="#EFF6FF" />
                                    <path d="M8 12C8 12 9.5 10 12 10C14.5 10 16 12 16 12C16 12 14.5 14 12 14C9.5 14 8 12 8 12Z" stroke="#0056B3" strokeWidth="2" />
                                    <circle cx="12" cy="12" r="2" fill="#0056B3" />
                                </svg>
                            </div>
                            <div className="fr-card-content">
                                <h3 className="fr-card-title">{ride.title}</h3>
                                <p className="fr-card-sub">
                                    {ride.date}  |  {ride.price}  |  {ride.location}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Drivers Section ── */}
                <p className="fr-section-label" style={{ marginTop: 24 }}>3 Drivers</p>
                <div className="fr-list">
                    {favoriteDrivers.map(driver => (
                        <div key={driver.id} className="fr-card">
                            <div className="fr-card-icon-wrap">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="#0056B3" strokeWidth="2" fill="#EFF6FF" />
                                    <path d="M8 12C8 12 9.5 10 12 10C14.5 10 16 12 16 12C16 12 14.5 14 12 14C9.5 14 8 12 8 12Z" stroke="#0056B3" strokeWidth="2" />
                                    <circle cx="12" cy="12" r="2" fill="#0056B3" />
                                </svg>
                            </div>
                            <div className="fr-card-content">
                                <h3 className="fr-card-title">{driver.title}</h3>
                                <p className="fr-card-sub">
                                    {driver.date}  |  {driver.price}  |  {driver.location}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Add FAB ── */}
            <button className="fr-fab" onClick={() => navigate('/home_screen_Transport')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFCC00" strokeWidth="3">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </button>

            {/* ── Bottom Nav Bar ── */}
            <nav className="ut-tab-bar">
                <button className="ut-nav-btn" onClick={() => navigate('/home_screen_Transport')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" color="#94A3B8">
                        <circle cx="12" cy="11" r="8" stroke="currentColor" strokeWidth="2.1" />
                        <circle cx="12" cy="11" r="4" stroke="currentColor" strokeWidth="2.1" />
                        <path d="M12 21L9 18H15L12 21Z" fill="currentColor" />
                    </svg>
                    <span style={{ fontWeight: 400 }}>Home</span>
                </button>
                <button className="ut-nav-btn" onClick={() => navigate('/upcoming-trips')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="3" width="20" height="18" rx="2" stroke="#94A3B8" strokeWidth="1.8" />
                        <path d="M1 5.5h22M10 10l-2 2 2 2m4-4l2 2-2 2" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontWeight: 400 }}>Trips</span>
                </button>
                <button className="ut-nav-btn active">
                    <div className="ut-nav-icon-bg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" color="#fff">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor" />
                            <path d="M16 6.5C17.5 6.5 18.5 7.5 18.5 8.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                            <circle cx="16" cy="7.5" r="1.2" fill="white" />
                        </svg>
                    </div>
                    <span style={{ fontWeight: 400 }}>Favorites</span>
                </button>
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

export default FavoriteRides;
