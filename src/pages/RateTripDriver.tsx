import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import HomeIndicator from '../components/HomeIndicator';
import danielAvatar from '../assets/Ellipse 1192.png';
import './RateTripDriver.css';

const RateTripDriver = () => {
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);

    return (
        <div className="rtd-screen">
            <StatusBar dark />

            <div className="rtd-content">
                <h1 className="rtd-title">Rate your trip</h1>
                <p className="rtd-subtitle">How was your trip with Daniel?</p>

                <div className="rtd-driver-card">
                    <img src={danielAvatar} alt="Daniel" className="rtd-avatar" />
                    <h2 className="rtd-driver-name">Daniel Asante</h2>
                    <p className="rtd-trips">Toyota Vitz • GT-1234-24</p>
                </div>

                <div className="rtd-star-container">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            className={`rtd-star-btn ${star <= rating ? 'active' : ''}`}
                            onClick={() => setRating(star)}
                        >
                            <svg width="40" height="40" viewBox="0 0 24 24" fill={star <= rating ? "#FFCC00" : "none"} stroke={star <= rating ? "#FFCC00" : "#CBD5E1"} strokeWidth="1.5">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" />
                            </svg>
                        </button>
                    ))}
                </div>

                <div className="rtd-feedback-section">
                    <h3 className="rtd-feedback-label">Your message</h3>
                    <textarea
                        className="rtd-textarea"
                        placeholder="Give your feedback to driver..."
                    ></textarea>
                </div>

                <button className="rtd-submit-btn" onClick={() => navigate('/home_screen_Transport')}>
                    Submit rate
                </button>

                <button className="rtd-skip-btn" onClick={() => navigate('/home_screen_Transport')}>
                    Skip
                </button>
            </div>

            <HomeIndicator dark />
        </div>
    );
};

export default RateTripDriver;
