import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import HomeIndicator from '../components/HomeIndicator';
import profileImg from '../assets/lady_profile.png';
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
            <StatusBar dark />

            {/* Header */}
            <header className="ep-header">
                <button className="ep-back-btn" onClick={() => navigate(-1)}>
                    <svg width="9" height="16" viewBox="0 0 9 16" fill="none">
                        <path d="M8 1L1 8L8 15" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Back</span>
                </button>
                <h1 className="ep-title">Edit Profile</h1>
                <div style={{ width: 60 }} />
            </header>

            {/* Scrollable Body */}
            <div className="ep-body">
                {/* Avatar */}
                <div className="ep-avatar-wrap">
                    <img src={profile.image} alt="Profile" className="ep-avatar" />
                    <label className="ep-camera-badge">
                        <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" fill="#0056B3" />
                            <circle cx="12" cy="13" r="4" fill="white" />
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
                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                        <circle cx="13" cy="12" r="8.5" stroke="#64748B" strokeWidth="1.8" />
                        <circle cx="13" cy="12" r="4" stroke="#64748B" strokeWidth="1.8" />
                        <path d="M13 22L10.5 19.5H15.5L13 22Z" fill="#64748B" />
                    </svg>
                    <span>Home</span>
                </button>
                <button className="ep-tab" onClick={() => navigate('/upcoming-trips')}>
                    <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
                        <rect x="4" y="2" width="14" height="18" rx="2" stroke="#64748B" strokeWidth="1.8" />
                        <path d="M4 4H2v18a2 2 0 0 0 2 2h14v-2" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round" />
                        <circle cx="15" cy="15" r="4.5" stroke="#64748B" strokeWidth="1.8" />
                        <path d="M4 7h12" stroke="#64748B" strokeWidth="1.4" />
                    </svg>
                    <span>Trips</span>
                </button>
                <button className="ep-tab" onClick={() => navigate('/favorite-rides')}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                        <path d="M12 21L10.55 19.72C5.4 15.09 2 12.05 2 8.3C2 5.25 4.5 2.75 7.5 2.75C9.25 2.75 10.9 3.55 12 4.85C13.1 3.55 14.75 2.75 16.5 2.75C19.5 2.75 22 5.25 22 8.3C22 12.05 18.6 15.09 13.45 19.72L12 21Z" stroke="#64748B" strokeWidth="1.8" strokeLinejoin="round" />
                    </svg>
                    <span>Favorites</span>
                </button>
                <button className="ep-tab active">
                    <div className="ep-tab-indicator" />
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
}

export default ProfileSetup;
