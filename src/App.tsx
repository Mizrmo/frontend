import React from 'react'
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
import UserDocuments from './pages/AccountProfile/UserDocuments'
import ContactInformation from './pages/AccountProfile/ContactInformation'
import GhanaCard from './pages/AccountProfile/GhanaCard'
import HelpSupport from './pages/AccountProfile/HelpSupport'
import VehicleDetails from './pages/Authentication/VehicleDetails'
import DriverDashboard from './pages/DriverDashboard/DriverDashboard'
import DriverHomeTransport from './pages/DriverDashboard/DriverHomeTransport'
import AdvertiseRide from './pages/DriverDashboard/AdvertiseRide'
import DriverSearchLocation from './pages/DriverDashboard/DriverSearchLocation'
import RideAdvertisedConfirmation from './pages/DriverDashboard/RideAdvertisedConfirmation'
import IncomingRequest from './pages/DriverDashboard/IncomingRequest'
import DriverStartRide from './pages/DriverDashboard/DriverStartRide'
import DriverUpcomingTrips from './pages/DriverDashboard/DriverUpcomingTrips'
import DriverRideDetails from './pages/DriverDashboard/DriverRideDetails'
import DriverRateRider from './pages/DriverDashboard/DriverRateRider'
import DriverFavoriteRides from './pages/DriverDashboard/DriverFavoriteRides'
import MizMilesHome from './pages/MizMiles/MizMilesHome'
import MizMilesRewards from './pages/MizMiles/MizMilesRewards'
import MizMilesRedeemConfirm from './pages/MizMiles/MizMilesRedeemConfirm'
import SideNav from './components/SideNav'
import DriverAccountSettings from './pages/DriverAccount/DriverAccountSettings'
import DriverProfile from './pages/DriverAccount/DriverProfile'
import EditProfile from './pages/DriverAccount/EditProfile'
import DriverDocuments from './pages/DriverAccount/DriverDocuments'
import DriverGhanaCard from './pages/DriverAccount/DriverGhanaCard'
import DriverContactInfo from './pages/DriverAccount/DriverContactInfo'
import DriverTransactions from './pages/DriverAccount/DriverTransactions'
import DriverWithdrawal from './pages/DriverAccount/DriverWithdrawal'
import DriverPayment from './pages/DriverAccount/DriverPayment'


// Global Context for SideNav
export const SideNavContext = React.createContext({
    isOpen: false,
    setIsOpen: (val: boolean) => {},
});

function App() {
    const [isSideNavOpen, setIsSideNavOpen] = React.useState(false);

    return (
        <SideNavContext.Provider value={{ isOpen: isSideNavOpen, setIsOpen: setIsSideNavOpen }}>
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
                <Route path="/documents" element={<UserDocuments />} />
                <Route path="/contact-info" element={<ContactInformation />} />
                <Route path="/ghana-card" element={<GhanaCard />} />
                <Route path="/help-support" element={<HelpSupport />} />
                <Route path="/driver-dashboard" element={<DriverDashboard />} />
                <Route path="/driver-home" element={<DriverHomeTransport />} />
                <Route path="/advertise_ride" element={<AdvertiseRide />} />
                <Route path="/driver-search-location" element={<DriverSearchLocation />} />
                <Route path="/ride_advertised_confirmation" element={<RideAdvertisedConfirmation />} />
                <Route path="/incoming-request" element={<IncomingRequest />} />
                <Route path="/driver_start_ride" element={<DriverStartRide />} />
                <Route path="/driver_upcoming_trips" element={<DriverUpcomingTrips />} />
                <Route path="/driver-ride-details" element={<DriverRideDetails />} />
                <Route path="/rate_trip_rider" element={<DriverRateRider />} />
                <Route path="/driver-favorite-rides" element={<DriverFavoriteRides />} />
                <Route path="/driver-account" element={<DriverAccountSettings />} />
                <Route path="/driver-profile" element={<DriverProfile />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/driver-documents" element={<DriverDocuments />} />
                <Route path="/driver-ghana-card" element={<DriverGhanaCard />} />
                <Route path="/driver-contact-info" element={<DriverContactInfo />} />
                <Route path="/driver-transactions" element={<DriverTransactions />} />
                <Route path="/driver-withdrawal" element={<DriverWithdrawal />} />
                <Route path="/driver-payment" element={<DriverPayment />} />

                <Route path="/miz-miles" element={<MizMilesHome />} />
                <Route path="/miz-miles-rewards" element={<MizMilesRewards />} />
                <Route path="/miz-miles-confirm" element={<MizMilesRedeemConfirm />} />
                <Route path="*" element={<Navigate to="/onboarding" replace />} />
                </Routes>
            </Router>
        </SideNavContext.Provider>
    )
}

export default App
