import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
import './Onboarding.css';
// @ts-ignore
import onboarding1 from '../../assets/onboarding1.png';
// @ts-ignore
import welcomeScreen from '../../assets/welcome-screen.png';
// @ts-ignore
import nextBtnImg from '../../assets/next button.png';

const Onboarding = () => {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const handleNext = () => {
        if (step < 5) {
            setStep(step + 1);
        }
    };

    const handleSkip = () => {
        setStep(5); // Skip directly to the welcome screen
    };

    const handleLogin = () => {
        navigate('/set-password');
    };


    const handleCreateAccount = () => {
        navigate('/register');
    };

    if (step === 1) {
        return (
            <div className="onboarding-screen screen-1" onClick={handleNext}>
                <div className="splash-bg-container">
                    <img src={onboarding1} alt="Splash Background" className="splash-bg-image" />
                </div>
                <HomeIndicator />
            </div>
        );
    }

    // Determine content based on step
    const getStepContent = (currentStep: number) => {
        switch (currentStep) {
            case 3:
                return {
                    title: 'Reduce Emissions, Make Impact',
                    text: 'Every shared ride means fewer cars on the road, cleaner air, and a greener planet. Together, we drive towards a sustainable future.',
                    layoutClass: 'step-3'
                };
            case 4:
                return {
                    title: 'Ride Safe, Ride Smart',
                    text: 'Our app ensures verified profiles and secure payments so you can enjoy stress-free rides every time.',
                    layoutClass: 'step-4'
                };
            case 5:
                return {
                    title: 'Welcome To Mizrmo',
                    text: 'We are a community built on respect for each other who share rides, share costs and share experiences. We are so glad you joined us.',
                    layoutClass: 'step-5'
                };
            default: // Step 2
                return {
                    title: 'Share Rides, Save Money!',
                    text: "Cut down on commuting costs by carpooling with people headed your way. It's easy, affordable, and hassle-free!",
                    layoutClass: 'step-2'
                };
        }
    };

    const content = getStepContent(step);
    const isWelcomeScreen = step === 5;

    return (
        <div className="onboarding-screen screen-2">
            <div className="status-bar-container">
                <StatusBar dark />
            </div>

            {/* Illustration Section */}
            <div className="welcome-illustration-section">
                <div className="welcome-image-asset-container">
                    <img src={welcomeScreen} alt="Illustration" />
                </div>
            </div>

            {/* Text Content */}
            <div className={`onboarding-text-content ${content.layoutClass}`}>
                <h1>{content.title}</h1>
                <p>{content.text}</p>
            </div>

            {/* Pagination & Actions */}
            <div className="onboarding-footer-section">
                {!isWelcomeScreen && (
                    <div className="pagination-indicator">
                        <div className={step === 2 ? 'dot-active' : 'dot-inactive'}></div>
                        <div className={step === 3 ? 'dot-active' : 'dot-inactive'}></div>
                        <div className={step === 4 ? 'dot-active' : 'dot-inactive'}></div>
                    </div>
                )}

                <div className="onboarding-actions-bottom">
                    {isWelcomeScreen ? (
                        <>
                            <button className="btn-primary" onClick={handleCreateAccount}>
                                Create An Account
                            </button>
                            <button className="btn-outline welcome-login-btn" onClick={handleLogin}>
                                Login
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '9px' }}>
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#414141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>

                        </>
                    ) : (
                        <>
                            <button className="btn-primary" onClick={handleNext}>
                                Next
                            </button>
                            <button className="btn-outline" onClick={handleSkip}>
                                Skip
                            </button>
                        </>
                    )}
                </div>
            </div>

            <HomeIndicator dark />
        </div>
    );
};

export default Onboarding;
