import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
// @ts-ignore
import profileImg from '../../assets/lady_profile.png';
import './ProfileSetup.css';

function ProfileSetup() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        image: profileImg as string,
        name: 'Daniel Asante',
        email: 'danielasante@gmail.com',
        gender: '23/05/1995',
        dob: '23/05/1995',
        occupation: ''
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile({ ...profile, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="ep-screen">
            <div className="status-bar-wrapper">
                <StatusBar dark />
                {/* Header */}
                <header className="ep-header">
                    <button className="ep-back-btn" onClick={() => navigate(-1)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                        <span>Back</span>
                    </button>
                    <h1 className="ep-title">Edit Profile</h1>
                    <button className="ep-skip-btn" onClick={() => navigate('/home_screen_Transport')}>
                        Skip
                    </button>
                </header>
            </div>

            {/* Scrollable Body */}
            <div className="ep-body nice-scroll">
                {/* Avatar */}
                <div className="ep-avatar-wrap">
                    <img src={profile.image} alt="Profile" className="ep-avatar" />
                    <label className="ep-camera-badge">
                        <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" fill="#0056B3" />
                            <circle cx="12" cy="13" r="3" stroke="#0056B3" strokeWidth="2" />
                        </svg>
                    </label>
                </div>

                {/* Switch Profile */}
                <button className="ep-switch-btn" onClick={() => navigate(-1)}>
                    <div className="ep-switch-dot">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <path d="M6 9l6 6 6-6" />
                        </svg>
                    </div>
                    <span>Switch Profile</span>
                </button>

                {/* Form */}
                <div className="ep-form">
                    <div className="ep-field">
                        <label className="ep-label">Name</label>
                        <input
                            type="text"
                            className="ep-input"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        />
                    </div>

                    <div className="ep-field">
                        <label className="ep-label">Email</label>
                        <input
                            type="email"
                            className="ep-input"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                    </div>

                    <div className="ep-field">
                        <label className="ep-label">Gender</label>
                        <input
                            type="text"
                            className="ep-input"
                            value={profile.gender}
                            onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                        />
                    </div>

                    <div className="ep-field">
                        <label className="ep-label">DOB</label>
                        <input
                            type="text"
                            className="ep-input"
                            value={profile.dob}
                            onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                        />
                    </div>

                    <div className="ep-field">
                        <label className="ep-label">Occupation</label>
                        <input
                            type="text"
                            className="ep-input"
                            placeholder=""
                            value={profile.occupation}
                            onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                        />
                    </div>

                    <button className="ep-save-btn" onClick={() => navigate('/account-settings')}>
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Tab Bar  — Profile active */}
            <nav className="ep-tab-bar">
                <button className="ep-tab" onClick={() => navigate('/home_screen_Transport')}>
                    <div className="tab-icon-wrap" style={{ width: '24px', height: '24px' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 21.5s-8-5.5-8-11.5c0-4.42 3.58-8 8-8s8 3.58 8 8c0 6-8 11.5-8 11.5z" stroke="black" strokeWidth="2" />
                            <circle cx="12" cy="10" r="5" stroke="black" strokeWidth="2" />
                            <circle cx="12" cy="10" r="2" fill="black" />
                        </svg>
                    </div>
                    <span>Home</span>
                </button>
                <button className="ep-tab active" onClick={() => navigate('/upcoming-trips')}>
                    <div className="tab-icon-wrap" style={{ width: '28px', height: '28px' }}>
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <rect width="28" height="28" rx="4" fill="#0056B3" />
                            <path d="M4 8h20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                            <path d="M20 8v16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                            <circle cx="10" cy="16" r="4.5" fill="white" />
                        </svg>
                    </div>
                    <span style={{ color: '#0056B3', fontWeight: '600' }}>Trips</span>
                </button>
                <button className="ep-tab" onClick={() => navigate('/favorite-rides')}>
                    <div className="tab-icon-wrap" style={{ width: '24px', height: '24px' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            <path d="M17.5 7.5a1.5 1.5 0 0 1 1.5 1.5" stroke="black" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <span>Favorites</span>
                </button>
                <button className="ep-tab" onClick={() => navigate('/account-settings')}>
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
}

export default ProfileSetup;
