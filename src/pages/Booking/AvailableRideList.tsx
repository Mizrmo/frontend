import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
import MainNavigation from '../../components/MainNavigation';
import danielAvatar from '../../assets/Ellipse 1192.png';
import visaLogo from '../../assets/visa-logo.png';
import mtnLogo from '../../assets/mtn-logo-img.png';
import './AvailableRideList.css';
import './Payment.css';

const rides = [
    { id: 1, driver: 'Daniel Asante', price: 'GH¢22', car: 'Toyota Vitz', seats: '3 seats', location: 'Community one', time: '5mins away' },
    { id: 2, driver: 'Joseph Mensah', price: 'GH¢18', car: 'Honda Civic', seats: '4 seats', location: 'Community two', time: '8mins away' },
    { id: 3, driver: 'Bernard Ofori', price: 'GH¢25', car: 'Toyota Corolla', seats: '4 seats', location: 'Community one', time: '3mins away' },
    { id: 4, driver: 'Victoria Ama', price: 'GH¢20', car: 'Hyundai Tucson', seats: '5 seats', location: 'Community four', time: '10mins away' },
    { id: 5, driver: 'Adjoa Asiedu', price: 'GH¢15', car: 'Kia Picanto', seats: '4 seats', location: 'Community one', time: '6mins away' },
    { id: 6, driver: 'Kingsley Boateng', price: 'GH¢30', car: 'Ford Explorer', seats: '6 seats', location: 'Tema Station', time: '12mins away' },
];


const AvailableRideList = () => {
    const navigate = useNavigate();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [bookingConfirmed, setBookingConfirmed] = useState(false);
    const [rideBooked, setRideBooked] = useState(false);

    const openConfirm = () => { setConfirmOpen(true); setPaymentOpen(false); };
    const closeConfirm = () => setConfirmOpen(false);
    const openPayment = () => setPaymentOpen(true);
    const closePayment = () => setPaymentOpen(false);
    // Payment card tapped → payment success popup
    const handlePay = () => { setPaymentOpen(false); setConfirmOpen(false); setBookingConfirmed(true); };
    // "Done" on payment popup → ride booked popup
    const closeBooking = () => { setBookingConfirmed(false); setRideBooked(true); };
    // "×" on ride booked popup → go to details
    const closeRideBooked = () => {
        setRideBooked(false);
        navigate('/booked-ride-details');
    };

    const blurBg = confirmOpen || paymentOpen || bookingConfirmed || rideBooked;

    return (
        <div className="available-rides-screen">

            {/* ── PAGE CONTENT ── */}
            <div className={`arl-page-content${blurBg ? ' blurred' : ''}`}>
                <div className="rides-top-nav-container">
                    <StatusBar dark={true} />
                    <div className="nav-actions-row">
                        <button className="back-text-btn" onClick={() => navigate('/search-location')}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                            <span>Back</span>
                        </button>
                    </div>
                </div>

                <div className="rides-page-header">
                    <h1 className="available-rides-title">Available rides</h1>
                    <p className="cars-found-subtitle">18 cars found</p>
                </div>

                <div className="rides-scroll-frame">
                    {rides.map(ride => (
                        <div key={ride.id} className="modern-ride-card" onClick={openConfirm}>
                            <div className="ride-card-left">
                                <div className="blue-z-icon">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="5" cy="6" r="3" stroke="#0056B3" strokeWidth="2" />
                                        <path d="M8 6H19L5 18H16" stroke="#0056B3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="19" cy="18" r="3" stroke="#0056B3" strokeWidth="2" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ride-card-right">
                                <div className="ride-card-header">
                                    <span className="driver-name-text">{ride.driver}</span>
                                    <span className="price-bold">{ride.price}</span>
                                </div>
                                <div className="ride-card-specs">
                                    <span>{ride.car}</span><span className="spec-pipe">|</span>
                                    <span>{ride.seats}</span><span className="spec-pipe">|</span>
                                    <span>{ride.location}</span>
                                </div>
                                <div className="ride-card-time-row">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                                    </svg>
                                    <span>{ride.time}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <MainNavigation activeTab="home" />

                <HomeIndicator dark={true} />

                <HomeIndicator dark={true} />
            </div>

            {/* ── CONFIRM RIDE MODAL ── */}
            {confirmOpen && !paymentOpen && (
                <div className="cr-modal-root">
                    <div className="cr-modal-backdrop" onClick={closeConfirm} />
                    <div className="cr-sheet">
                        <div className="cr-handle" />
                        <h1 className="cr-title">Ride Confirmation</h1>
                        <div className="cr-body">

                            <div className="cr-location-block">
                                <div className="cr-loc-row">
                                    <div className="cr-loc-icon"><div className="cr-blue-marker" /></div>
                                    <div className="cr-loc-texts">
                                        <span className="cr-loc-title">Current location</span>
                                        <span className="cr-loc-sub">Ashaiman, main station</span>
                                    </div>
                                </div>
                                <div className="cr-connector">
                                    <div className="cr-dot" /><div className="cr-dot" /><div className="cr-dot" />
                                </div>
                                <div className="cr-loc-row">
                                    <div className="cr-loc-icon">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFCC00">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                        </svg>
                                    </div>
                                    <div className="cr-loc-texts">
                                        <span className="cr-loc-title">Drop off Location</span>
                                        <span className="cr-loc-sub">Community One</span>
                                    </div>
                                    <span className="cr-distance">2.2km</span>
                                </div>
                            </div>

                            <div className="cr-divider" />

                            <div className="cr-driver-row">
                                <div className="cr-avatar">
                                    <img src={danielAvatar} alt="Daniel Asante" />
                                </div>
                                <div className="cr-driver-texts">
                                    <span className="cr-driver-name">Daniel Asante</span>
                                    <div className="cr-driver-meta-row">
                                        <span className="cr-driver-age">26yrs</span>
                                        <span className="cr-meta-dot">•</span>
                                        <span className="cr-driver-role">Driver</span>
                                    </div>
                                </div>
                            </div>

                            <div className="cr-divider" />

                            <div className="cr-car-card">
                                <div className="cr-car-icon-bg">
                                    <svg width="34" height="34" viewBox="0 0 24 24" fill="#0056B3" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18.9 7.02c-.22-.68-.88-1.15-1.6-1.15H6.71c-.72 0-1.37.47-1.59 1.15L3.3 12.3c-.61.18-.8.88-.8 1.4v5.3c0 .55.45 1 1 1h1.5c.55 0 1-.45 1-1v-2h12v2c0 .55.45 1 1 1H20c.55 0 1-.45 1-1v-5.2c0-.52-.19-1.21-.8-1.4l-1.3-5.28zM6.6 7.87h10.8l1.04 3.3H5.56l1.04-3.3zM4.5 15.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm15 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                                    </svg>
                                </div>
                                <div className="cr-car-texts">
                                    <span className="cr-car-model">Toyota Vitz - GT 8432 -23</span>
                                    <div className="cr-car-rating">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="#FFCC00">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                        </svg>
                                        <span>4.5 (21 Reviews)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="cr-fare-section">
                                <div className="cr-fare-row">
                                    <div className="cr-fare-texts">
                                        <span className="cr-fare-label">Fare</span>
                                        <span className="cr-fare-sub">Total trip Cost</span>
                                    </div>
                                    <span className="cr-fare-amount">GH¢22.00</span>
                                </div>
                            </div>

                            <button className="cr-confirm-btn" onClick={openPayment}>
                                Confirm Ride
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── SELECT PAYMENT METHOD MODAL ── */}
            {paymentOpen && (
                <div className="cr-modal-root">
                    <div className="cr-modal-backdrop" onClick={closePayment} />
                    <div className="pm-sheet">
                        <div className="cr-handle" />
                        <h1 className="cr-title">Select Payment Method</h1>

                        <div className="pm-body">
                            {/* Fare summary */}
                            <div className="pm-fare-row">
                                <div className="pm-fare-texts">
                                    <span className="pm-fare-label">Fare</span>
                                    <span className="pm-fare-sub">Total Cost trip</span>
                                </div>
                                <span className="pm-fare-amount">GH¢22.00</span>
                            </div>

                            <div className="cr-divider" style={{ margin: '16px 0' }} />

                            {/* Payment method cards — same style as Payment.tsx */}
                            <div className="pm-methods-list">
                                {/* VISA Card */}
                                <div className="payment-card-premium visa-card" onClick={handlePay}>
                                    <div className="card-glass-effect" />
                                    <div className="card-top">
                                        <img src={visaLogo} alt="Visa" className="card-brand-logo" />
                                        <div className="card-chip" />
                                    </div>
                                    <div className="card-middle">
                                        <span className="premium-card-number">•••• •••• •••• 8970</span>
                                    </div>
                                    <div className="card-bottom">
                                        <div className="card-holder">
                                            <span className="label">Card Holder</span>
                                            <span className="value">Jane Doe</span>
                                        </div>
                                        <div className="card-expiry-wrap">
                                            <span className="label">Expires</span>
                                            <span className="value">12/26</span>
                                        </div>
                                    </div>
                                </div>

                                {/* MTN Card */}
                                <div className="payment-card-premium mtn-card" onClick={handlePay}>
                                    <div className="card-glass-effect" />
                                    <div className="card-top">
                                        <img src={mtnLogo} alt="MTN" className="card-brand-logo-mtn" />
                                        <span className="momo-label">Mobile Money</span>
                                    </div>
                                    <div className="card-middle">
                                        <span className="premium-card-number">••• ••• ••• 1234</span>
                                    </div>
                                    <div className="card-bottom">
                                        <div className="card-holder">
                                            <span className="label">Name</span>
                                            <span className="value">Jane Doe</span>
                                        </div>
                                        <div className="card-status">
                                            <span className="active-dot" />
                                            <span className="status-text">Active</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* ── RIDE BOOKING CONFIRMATION (centered dialog) ── */}
            {bookingConfirmed && (
                <div className="bk-overlay">
                    <div className="bk-dialog">
                        {/* Close button */}
                        <button className="bk-close-btn" onClick={closeBooking}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Success illustration */}
                        <div className="bk-illustration">
                            <div className="bk-circle-outer">
                                <div className="bk-circle-inner">
                                    <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="11" stroke="#0056B3" strokeWidth="1.5" fill="#EFF6FF" />
                                        <path d="M7 12.5l3.5 3.5 6.5-7" stroke="#0056B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Text */}
                        <h2 className="bk-title">Thank you</h2>
                        <p className="bk-sub">Your Payment was successful</p>
                        <p className="bk-sub">Thank you for riding with Us</p>

                        {/* Done button */}
                        <button className="bk-done-btn" onClick={closeBooking}>
                            Done
                        </button>
                    </div>
                </div>
            )}

            {/* ── RIDE BOOKED SUCCESSFULLY (second centered dialog) ── */}
            {rideBooked && (
                <div className="bk-overlay">
                    <div className="bk-dialog">
                        {/* Close (×) button */}
                        <button className="bk-close-btn" onClick={closeRideBooked}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Illustration — large grey circle matching design */}
                        <div className="bk-illustration">
                            <div className="bk-circle-outer">
                                <div className="bk-circle-inner">
                                    <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="11" stroke="#0056B3" strokeWidth="1.5" fill="#EFF6FF" />
                                        <path d="M5 17H3a1 1 0 0 1-1-1v-4c0-.85.6-1.57 1.41-1.87L5.5 9.5l1.5-3h10l1.5 3 2.09.63A2 2 0 0 1 22 12v4a1 1 0 0 1-1 1h-2" stroke="#0056B3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="7.5" cy="17.5" r="1.5" stroke="#0056B3" strokeWidth="1.6" />
                                        <circle cx="16.5" cy="17.5" r="1.5" stroke="#0056B3" strokeWidth="1.6" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <h2 className="bk-title">Thank you</h2>
                        <p className="bk-sub">Your ride has been booked successfully.</p>
                        <p className="bk-sub">Thank you for riding with Us</p>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AvailableRideList;
