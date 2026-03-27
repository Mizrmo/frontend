import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
import MainNavigation from '../../components/MainNavigation';
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
                        <svg width="11" height="18" viewBox="0 0 11 18" fill="none" stroke="#414141" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 16L2 9L9 2" />
                        </svg>
                        <span>Back</span>
                    </button>
                    <h1 className="ep-title">Edit Profile</h1>
                    <div style={{ width: 60 }} /> {/* Spacer */}
                </header>
            </div>

            {/* Scrollable Body */}
            <div className="ep-body nice-scroll">
                {/* Avatar */}
                <div className="ep-avatar-container">
                    <div className="ep-avatar-wrap">
                        <img src={profile.image} alt="Profile" className="ep-avatar" />
                        <label className="ep-camera-badge">
                            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#0056B3" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 4h3l2-2h6l2 2h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm8 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                            </svg>
                        </label>
                    </div>

                    {/* Switch Profile */}
                    <button className="ep-switch-btn" onClick={() => navigate(-1)}>
                        <div className="ep-switch-dot">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" fill="#FFC107" />
                                <path d="M16 12l-4-4v3H8v2h4v3l4-4z" fill="white" />
                            </svg>
                        </div>
                        <span>Switch Profile</span>
                    </button>
                </div>

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

            <MainNavigation activeTab="profile" />
            <HomeIndicator dark />
        </div>
    );
}

export default ProfileSetup;
