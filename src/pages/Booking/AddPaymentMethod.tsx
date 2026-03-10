import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
import visaLogo from '../../assets/visa-logo.png';
import './AddPaymentMethod.css';
import './Payment.css';

const AddPaymentMethod = () => {
    const navigate = useNavigate();

    const handleBackdropClick = () => {
        navigate('/payment');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/home_screen_Transport');
    };

    return (
        <div className="add-payment-screen no-scroll">
            <div className="payment-background-content">
                <div className="status-bar-wrapper">
                    <StatusBar dark />
                    <header className="payment-header">
                        <button className="back-btn-circle" onClick={() => navigate(-1)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </button>
                        <h1 className="payment-title-main" style={{ position: 'absolute', width: '100%', left: 0, textAlign: 'center', zIndex: -1 }}>Payment</h1>
                        <div className="header-action-placeholder"></div>
                    </header>
                </div>

                <div className="payment-scroll-container">
                    <div className="section-header">
                        <h2>Saved Methods</h2>
                        <button className="add-new-btn">Add New</button>
                    </div>

                    <div className="payment-methods-grid">
                        <div className="payment-card-premium visa-card">
                            <div className="card-top">
                                <img src={visaLogo} alt="Visa" className="card-brand-logo" />
                                <div className="card-chip"></div>
                            </div>
                            <div className="card-middle">
                                <span className="premium-card-number">•••• •••• •••• 8970</span>
                            </div>
                            <div className="card-bottom">
                                <div className="card-holder"><span className="value">Jane Doe</span></div>
                                <div className="card-expiry-wrap"><span className="value">12/26</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="backdrop-overlay-blur" onClick={handleBackdropClick}></div>

            <div className="modal-sheet-exact">
                <div className="drag-handle-exact"></div>

                <form className="form-container-exact" onSubmit={handleSubmit}>
                    <div className="form-group-exact">
                        <label className="field-label-exact">Account Name</label>
                        <input type="text" className="input-field-exact" defaultValue="Jane Doe" required />
                    </div>

                    <div className="form-group-exact">
                        <label className="field-label-exact">Account Number</label>
                        <input type="text" className="input-field-exact" defaultValue="123236" required />
                    </div>

                    <div className="form-group-exact">
                        <label className="field-label-exact">Bank</label>
                        <div className="select-wrapper-exact">
                            <select className="select-field-exact" defaultValue="CalBank">
                                <option value="CalBank">CalBank</option>
                                <option value="Standard Chartered">Standard Chartered</option>
                                <option value="GCB Bank">GCB Bank</option>
                                <option value="Ecobank">Ecobank</option>
                                <option value="Access Bank">Access Bank</option>
                            </select>
                            <svg className="chevron-icon-exact" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 9l6 6 6-6" />
                            </svg>
                        </div>
                    </div>

                    <button type="submit" className="submit-button-exact">
                        Submit
                    </button>
                </form>
            </div>

            <HomeIndicator dark />
        </div>
    );
};

export default AddPaymentMethod;
