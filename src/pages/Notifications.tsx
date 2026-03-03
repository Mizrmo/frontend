import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import HomeIndicator from '../components/HomeIndicator';
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
            <StatusBar dark />

            {/* Header */}
            <header className="notif-header">
                <button className="notif-back-btn" onClick={() => navigate(-1)}>
                    <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
                        <path d="M9 1L1 9L9 17" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Back</span>
                </button>
                <h1 className="notif-title">Notification</h1>
                <div className="header-spacer" />
            </header>

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
