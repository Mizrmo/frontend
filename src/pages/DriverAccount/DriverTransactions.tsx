import { useNavigate } from 'react-router-dom';
import StatusBar from '../../components/StatusBar';
import MainNavigation from '../../components/MainNavigation';
import walletIcon from '../../assets/Frame 427319755.png';
import './DriverTransactions.css';

const DriverTransactions = () => {
    const navigate = useNavigate();

    const transactions = [
        { id: 1, type: 'Received', ref: 'C079DB3D', amount: 'GH₵22.00', status: 'received', date: 'Today' },
        { id: 2, type: 'Received', ref: 'C079DB3D', amount: 'GH₵22.00', status: 'received', date: 'Today' },
        { id: 3, type: 'Withdrawn', ref: 'C079DB3D', amount: 'GH₵202.00', status: 'withdrawn', date: 'October 21, 2024' },
        { id: 4, type: 'Refund - Trip Issue', ref: 'C079DB3D-refund-C079DB3D', amount: 'GH₵22.00', status: 'refund', date: 'October 21, 2024' },
        { id: 5, type: 'Received', ref: 'C079DB3D', amount: 'GH₵22.00', status: 'received', date: 'October 21, 2024' },
        { id: 6, type: 'Refund - Trip Issue', ref: 'C079DB3D-refund-C079DB3D', amount: 'GH₵22.00', status: 'refund', date: 'October 21, 2024' },
    ];

    // Grouping transactions by date
    const groupedTransactions = transactions.reduce((groups: any, trans) => {
        const date = trans.date;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(trans);
        return groups;
    }, {});

    return (
        <div className="dt-screen">
            <StatusBar dark />
            
            <header className="dt-header">
                <button className="dt-back-btn" onClick={() => navigate(-1)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#414141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    <span>Back</span>
                </button>
                <h1 className="dt-title">Transactions</h1>
                <div style={{ width: 60 }} />
            </header>

            <div className="dt-content nice-scroll">
                {/* Summary Section */}
                <div className="dt-summary-card">
                    <div className="dt-summary-header">
                        <span className="dt-summary-label">Total Earnings</span>
                        <div className="dt-dropdown">
                            <span>Last year</span>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
                            </svg>
                        </div>
                    </div>
                    <div className="dt-earnings-row">
                        <div className="dt-wallet-icon">
                            <img src={walletIcon} alt="Wallet" />
                        </div>
                        <span className="dt-earnings-value">Gh₵1,000</span>
                    </div>

                    <div className="dt-stats-row">
                        <div className="dt-stat-item">
                            <span className="dt-stat-label">Rides Today</span>
                            <span className="dt-stat-value">34</span>
                        </div>
                        <div className="dt-stat-item">
                            <span className="dt-stat-label">Miz Miles Bal.</span>
                            <div className="dt-miles-value">
                                <span className="dt-miles-num">34</span>
                                <span className="dt-miles-unit">/miz</span>
                            </div>
                        </div>
                    </div>

                    <button 
                        className="dt-redeem-btn"
                        onClick={() => navigate('/driver-withdrawal')}
                    >
                        Redeem
                    </button>
                </div>

                {/* Transaction List */}
                <div className="dt-list">
                    {Object.keys(groupedTransactions).map((date) => (
                        <div key={date} className="dt-group">
                            <h2 className="dt-group-title">{date}</h2>
                            {groupedTransactions[date].map((trans: any) => (
                                <div key={trans.id} className="dt-item">
                                    <div className="dt-item-info">
                                        <h3 className="dt-item-type">{trans.type}</h3>
                                        <p className="dt-item-ref">Reference ID: {trans.ref}</p>
                                    </div>
                                    <span className={`dt-item-amount dt-amt-${trans.status}`}>
                                        {trans.amount}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="dt-footer">
                <MainNavigation activeTab="profile" isDriver={true} />
            </div>
        </div>
    );
};

export default DriverTransactions;
