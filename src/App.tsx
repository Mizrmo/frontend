import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Registration from './pages/Authentication/Registration'
import Verification from './pages/Authentication/Verification'
import SetPassword from './pages/Authentication/SetPassword'
import ProfileSetup from './pages/Authentication/ProfileSetup'
import Success from './pages/Communication/Success'
import Onboarding from './pages/Onboarding/Onboarding'
import DriverDetails from './pages/Communication/DriverDetails'
import SignIn from './pages/Authentication/SignIn'
import SendVerification from './pages/Authentication/SendVerification'
import SetNewPassword from './pages/Authentication/SetNewPassword'
import EnableLocation from './pages/Booking/EnableLocation'
import AddPaymentMethod from './pages/Booking/AddPaymentMethod'
import Payment from './pages/Booking/Payment'
import HomeScreenTransport from './pages/Booking/HomeScreenTransport'
import SearchLocation from './pages/Booking/SearchLocation'
import AvailableRideList from './pages/Booking/AvailableRideList'
import UpcomingTrips from './pages/Booking/UpcomingTrips'
import BookedRideDetails from './pages/Booking/BookedRideDetails'
import FavoriteRides from './pages/Booking/FavoriteRides'
import NoFavoriteData from './pages/Booking/NoFavoriteData'
import DriverOnWay from './pages/Communication/DriverOnWay'
import RateTripDriver from './pages/Communication/RateTripDriver'
import Chat from './pages/Communication/Chat'
import Notifications from './pages/Communication/Notifications'
import AccountSettings from './pages/AccountProfile/AccountSettings'
import VehicleDetails from './pages/Authentication/VehicleDetails'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/onboarding" replace />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/send-verification" element={<SendVerification />} />
                <Route path="/set-new-password" element={<SetNewPassword />} />
                <Route path="/verify_otp" element={<Verification />} />
                <Route path="/set-password" element={<SetPassword />} />
                <Route path="/profile-setup" element={<ProfileSetup />} />
                <Route path="/driver-details" element={<DriverDetails />} />
                <Route path="/vehicle-details" element={<VehicleDetails />} />
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
