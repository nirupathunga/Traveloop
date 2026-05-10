import { useState } from 'react'
import { Login } from './components/Login'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import { TripProvider } from './context/TripContext.jsx'
import {
  Dashboard,
  MyTrips,
  ItineraryBuilder,
  CitySearch,
  ActivitySearch,
  Budget,
  PackingList,
  SharedView,
  FlightFinder,
  HotelFinder,
  TravelJournal,
  LocalGuides,
  TravelAlerts,
  Profile,
} from './screens/screens.jsx'

function App() {
  // Persistent authentication state
  const [isAuth, setIsAuth] = useState(() => {
    // Check localStorage for auth state
    return localStorage.getItem('traveloop_auth') === 'true'
  })

  const handleLogin = () => {
    setIsAuth(true)
    localStorage.setItem('traveloop_auth', 'true')
  }

  // If not authenticated, show ONLY the Login screen
  if (!isAuth) {
    return <Login onLogin={handleLogin} />
  }

  // 3. Once logged in, show the full Router
  return (
    <TripProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="my-trips" element={<MyTrips />} />
            <Route path="itinerary-builder" element={<ItineraryBuilder />} />
            <Route path="city-search" element={<CitySearch />} />
            <Route path="activity-search" element={<ActivitySearch />} />
            <Route path="budget" element={<Budget />} />
            <Route path="packing-list" element={<PackingList />} />
            <Route path="shared-view" element={<SharedView />} />
            <Route path="flight-finder" element={<FlightFinder />} />
            <Route path="hotel-finder" element={<HotelFinder />} />
            <Route path="travel-journal" element={<TravelJournal />} />
            <Route path="local-guides" element={<LocalGuides />} />
            <Route path="travel-alerts" element={<TravelAlerts />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TripProvider>
  )
}

export default App