import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
import './SignIn.css';

import { login } from '../../api/auth';

const SignIn = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleBack = () => navigate(-1);
    const handleSignUp = () => navigate('/register');
    const handleForgotPassword = () => navigate('/send-verification');

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await login({ identifier: formData.identifier, password: formData.password });
            if (response.token) {
                localStorage.setItem('token', response.token);
            }
            navigate('/home_screen_Transport');
        } catch (error: any) {
            console.error('Login failed:', error);
            alert('Login failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const EyeIcon = ({ slashed }: { slashed: boolean }) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            {slashed ? (
                <>
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="#94A3B3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14.12 14.12a3 3 0 11-4.24-4.24" stroke="#94A3B3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </>
            ) : (
                <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#94A3B3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="3" stroke="#94A3B3" strokeWidth="2.5" />
                </>
            )}
        </svg>
    );

    const CalendarIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="3" fill="#94A3B3" />
            <rect x="7" y="2" width="2" height="4" rx="1" fill="#94A3B3" />
            <rect x="15" y="2" width="2" height="4" rx="1" fill="#94A3B3" />
            <rect x="3" y="9" width="18" height="2" fill="white" />
            <circle cx="7" cy="14" r="1.2" fill="white" />
            <circle cx="12" cy="14" r="1.2" fill="white" />
            <circle cx="17" cy="14" r="1.2" fill="white" />
            <circle cx="7" cy="18" r="1.2" fill="white" />
            <circle cx="12" cy="18" r="1.2" fill="white" />
            <circle cx="17" cy="18" r="1.2" fill="white" />
        </svg>
    );

    return (
        <div className="signin-screen">
            {/* Status Bar */}
            <div className="si-status-bar">
                <StatusBar dark />
            </div>

            {/* Back Button */}
            <div className="si-header">
                <button className="si-back-btn" onClick={handleBack}>
                    <svg width="8" height="14" viewBox="0 0 10 18" fill="none">
                        <path d="M9 1L1 9L9 17" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Back</span>
                </button>
            </div>

            {/* Content */}
            <div className="si-content">
                {/* Title */}
                <h1 className="si-title">Sign in with your email or phone number</h1>

                {/* Form */}
                <form className="si-form" onSubmit={handleSignIn}>

                    {/* Password Field */}
                    <div className="si-input-wrap">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="si-input"
                        />
                        <div className="si-input-icons">
                            <button type="button" className="si-icon-btn" onClick={() => setShowPassword(!showPassword)}>
                                <EyeIcon slashed={!showPassword} />
                            </button>
                            <span className="si-icon-divider" />
                            <CalendarIcon />
                        </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="si-input-wrap">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="si-input"
                        />
                        <div className="si-input-icons">
                            <button type="button" className="si-icon-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                <EyeIcon slashed={!showConfirmPassword} />
                            </button>
                            <span className="si-icon-divider" />
                            <CalendarIcon />
                        </div>
                    </div>

                    {/* Forget Password */}
                    <div className="si-forgot-row">
                        <button type="button" className="si-forgot-btn" onClick={handleForgotPassword}>
                            Forget password?
                        </button>
                    </div>

                    {/* Sign In Button */}
                    <button type="submit" className="si-submit-btn" disabled={isLoading}>
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                {/* Divider */}
                <div className="si-divider">
                    <span className="si-divider-line" />
                    <span className="si-divider-text">or</span>
                    <span className="si-divider-line" />
                </div>

                {/* Social Buttons */}
                <div className="si-social-group">
                    <button className="si-social-btn">
                        {/* Gmail M icon */}
                        <svg width="20" height="20" viewBox="0 0 48 48">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                        </svg>
                        <span>Sign in with Gmail</span>
                    </button>

                    <button className="si-social-btn">
                        <svg width="20" height="20" viewBox="0 0 384 512" fill="currentColor">
                            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-31.4-97.3-66.2-101.7-91.8zM301.1 34.4c-22.3-26.6-52-44.3-88.5-44.3-1.6 0-4.1.2-5.7.2C208.2 59.4 238.4 100 274.5 131c1.6 1.4 4.5 2.1 6.1 2.1 34.2-42.6 42.8-72.1 20.5-98.7z" />
                        </svg>
                        <span>Sign in with Apple</span>
                    </button>
                </div>

                {/* Footer */}
                <div className="si-signup-footer">
                    <p>Don't have an account? <span className="si-signup-link" onClick={handleSignUp}>Sign Up</span></p>
                </div>
            </div>

            <HomeIndicator dark />
        </div>
    );
};

export default SignIn;
