import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Registration from './pages/Registration'
import Verification from './pages/Verification'
import SetPassword from './pages/SetPassword'
import ProfileSetup from './pages/ProfileSetup'
import Success from './pages/Success'
import Onboarding from './pages/Onboarding'
import DriverDetails from './pages/DriverDetails'
import SignIn from './pages/SignIn'
import SendVerification from './pages/SendVerification'
import EnableLocation from './pages/EnableLocation'
import AddPaymentMethod from './pages/AddPaymentMethod'
import Payment from './pages/Payment'
import HomeScreenTransport from './pages/HomeScreenTransport'
import SearchLocation from './pages/SearchLocation'
import AvailableRideList from './pages/AvailableRideList'
import UpcomingTrips from './pages/UpcomingTrips'
import BookedRideDetails from './pages/BookedRideDetails'
import FavoriteRides from './pages/FavoriteRides'
import NoFavoriteData from './pages/NoFavoriteData'
import DriverOnWay from './pages/DriverOnWay'
import RateTripDriver from './pages/RateTripDriver'
import Chat from './pages/Chat'
import Notifications from './pages/Notifications'
import AccountSettings from './pages/AccountSettings'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/onboarding" replace />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/send-verification" element={<SendVerification />} />
                <Route path="/verify_otp" element={<Verification />} />
                <Route path="/set-password" element={<SetPassword />} />
                <Route path="/profile-setup" element={<ProfileSetup />} />
                <Route path="/driver-details" element={<DriverDetails />} />
                <Route path="/success" element={<Success />} />
                <Route path="/enable-location" element={<EnableLocation />} />
                <Route path="/add-payment-method" element={<AddPaymentMethod />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/home_screen_Transport" element={<HomeScreenTransport />} />
                <Route path="/available-rides" element={<AvailableRideList />} />
                <Route path="/search-location" element={<SearchLocation />} />
                <Route path="/upcoming-trips" element={<UpcomingTrips />} />
                <Route path="/booked-ride-details" element={<BookedRideDetails />} />
                <Route path="/favorite-rides" element={<FavoriteRides />} />
                <Route path="/no-favorite-data" element={<NoFavoriteData />} />
                <Route path="/driver-on-way" element={<DriverOnWay />} />
                <Route path="/rate_trip_driver" element={<RateTripDriver />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/account-settings" element={<AccountSettings />} />
                <Route path="*" element={<Navigate to="/onboarding" replace />} />
            </Routes>
        </Router>
    )
}

export default App
