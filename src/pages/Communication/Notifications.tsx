import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import HomeIndicator from '../../components/HomeIndicator';
import './Notifications.css';

const Notifications = () => {
    const navigate = useNavigate();

    const notifications = [
        { id: 1, title: "Ride has arrived", text: "Lorem ipsum dolor sit amet consectetur. Ultrici es tincidunt eleifend vitae", time: "15 min ago.", read: false },
        { id: 2, title: "Payment confirm", text: "Lorem ipsum dolor sit amet consectetur. Ultrici es tincidunt eleifend vitae", time: "25 min ago.", read: true },
        { id: 3, title: "Ride has arrived", text: "Lorem ipsum dolor sit amet consectetur. Ultrici es tincidunt eleifend vitae", time: "15 min ago.", read: false },
        { id: 4, title: "Ride has arrived", text: "Lorem ipsum dolor sit amet consectetur. Ultrici es tincidunt eleifend vitae", time: "25 min ago.", read: true },
        { id: 5, title: "Payment confirm", text: "Lorem ipsum dolor sit amet consectetur. Ultrici es tincidunt eleifend vitae", time: "25 min ago.", read: true },
        { id: 6, title: "Payment confirm", text: "Lorem ipsum dolor sit amet consectetur. Ultrici es tincidunt eleifend vitae", time: "15 min ago.", read: false }
    ];

    return (
        <div className="notif-screen">
            <div className="status-bar-wrapper">
                <StatusBar dark />
                <header className="notif-header">
                    <button className="notif-back-btn" onClick={() => navigate(-1)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                        <span>Back</span>
                    </button>
                    <h1 className="notif-title" style={{ position: 'absolute', width: '100%', left: 0, textAlign: 'center', zIndex: -1 }}>Notification</h1>
                    <div className="header-spacer" />
                </header>
            </div>

            {/* Notification List */}
            <div className="notif-list">
                {notifications.map((item) => (
                    <div key={item.id} className={`notif-item ${!item.read ? 'unread' : ''}`}>
                        <h3 className="notif-item-title">{item.title}</h3>
                        <p className="notif-item-text">{item.text}</p>
                        <span className="notif-item-time">{item.time}</span>
                    </div>
                ))}
            </div>

            <HomeIndicator dark />
        </div>
    );
};

export default Notifications;
