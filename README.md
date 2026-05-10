# Traveloop - Travel Planning App

A modern travel planning application built with React, Vite, and Tailwind CSS. Features a comprehensive itinerary builder with persistent data storage and real-time budget synchronization.

## Features

- **🔐 Authentication**: Secure login system with persistent sessions
- **📊 Dashboard**: Quick stats overview with budget, trips, and smart tips
- **🗺️ Itinerary Builder**: Create multi-stop trips with activities and live cost tracking
- **💰 Budget Breakdown**: Real-time pie chart visualization of expense categories
- **📦 Packing List**: Interactive checklist for travel essentials
- **👤 Profile**: User profile with travel stats and verification badge
- **🔍 Search Features**: City and activity search with trending recommendations
- **🚀 Feature Previews**: Coming soon sections for advanced features
- **💾 Persistent Data**: All trip data survives page refreshes using localStorage
- **🔄 Shared State**: Itinerary and Budget screens sync via React Context
- **⚡ Real-time Budget**: Live calculation of total trip costs as you add activities
- **🗂️ Relational Data Structure**: Trips → Stops → Activities with proper relationships

## Architecture

### State Management
- **TripContext**: Central React Context providing shared trip state
- **All screens** consume from context to ensure consistent data
- Routes are wrapped with `<TripProvider>` for context availability

### Data Flow

```
TripProvider (Context)
├── Itinerary Builder
│   ├── Add Stop → db.addStopToTrip()
│   └── Add Activity → db.addActivityToStop()
├── Budget Screen
│   ├── Read activities from context
│   └── Calculate breakdown & totals
└── localStorage (db.js)
```

### Persistence

All data is stored in localStorage with three relational tables:
- **Trips**: Top-level trip containers
- **Stops**: Cities/destinations linked by `tripId`
- **Activities**: Individual activities linked by `stopId`

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Tech Stack

- **React 19** - UI framework with Hooks & Context API
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **React Router** - Navigation
- **Recharts** - Data visualization (pie charts)
- **localStorage** - Data persistence

## Project Structure

```
src/
├── components/
│   └── Layout.jsx          # Main layout with sidebar
├── context/
│   └── TripContext.jsx     # Shared trip state & methods
├── screens/
│   └── screens.jsx         # All screen components
├── services/
│   ├── db.js               # Relational localStorage layer
│   └── mockAPI.js          # Legacy: kept for backward compatibility
├── utils/
│   └── date.js             # Date calculation helpers
├── App.jsx                 # Main app with routing & provider
├── main.jsx                # App entry point
└── index.css               # Global styles
```

## How It Works

### 1. Add a Stop (City)
- Click "+ Add stop" in Itinerary Builder
- Enter city name and date range
- Stop is saved to db.js immediately

### 2. Add Activities
- Click "+ Activity" within a stop
- Enter activity name and cost
- Total Trip Cost updates instantly via context

### 3. View Budget Breakdown
- Navigate to Budget screen
- See pie chart of Activities, Transport, Food costs
- View average daily cost
- All data syncs automatically from Itinerary Builder

### 4. Persistence
- Refresh the page
- All stops and activities remain (stored in localStorage)
- Budget calculations are live from stored data

## Context API Usage

All screens access shared state via `useTripContext()`:

```javascript
const {
  currentTrip,
  stops,
  activities,
  totalTripCost,
  totalDays,
  loading,
  saving,
  addStopToTrip,
  addActivityToStop,
  updateStop,
  updateActivity,
  removeActivity,
  getActivitiesForStop
} = useTripContext()
```

## Development

The app includes:
- Hot module replacement (HMR)
- ESLint configuration
- Responsive design
- Loading and saving states
- Form validation
- Error handling

## Hackathon Features

✅ **Authentication**: Persistent login system  
✅ **14 Screen Routes**: Complete navigation structure  
✅ **Auto-Seeding**: Demo trip loads immediately ($199 total)  
✅ **Live Updates**: Context ensures instant synchronization  
✅ **Interactive Packing List**: Functional checklist component  
✅ **Professional UI**: Cyber-Dark glassmorphism design  
✅ **Budget Visualization**: Recharts pie chart with live data  
✅ **Search Interfaces**: Sleek search bars with recommendations  
✅ **Feature Previews**: Coming soon sections with animated badges  
✅ **Smart AI Insights**: Dynamic budget alerts based on spending  
✅ **Budget Health Indicator**: Real-time status badges (Healthy/Attention)  
✅ **Automated Defaults**: Activities auto-populate with $10 cost  
✅ **Developer Portfolio**: Professional profile with project showcase  
✅ **API Integration Roadmap**: OpenWeather, FlightAware, Amadeus, GDS  
✅ **Premium Beta Badges**: Cyan-glowing "Beta - Early Access" indicators  
✅ **Innovation Ambassador**: SRIT Student Innovation Ambassador branding  

## Smart Logic Demonstrations

### AI Budget Insights
- **Under $500**: "Budget Alert: Your current spend is optimized. Consider local street food in Coimbatore to save an extra 10%."
- **Over $500**: "Spend Warning: You are entering the premium tier. Review your hotel costs to stay within the student traveler average."

### Real-Time Budget Health
- **Under $300**: Cyan "Healthy" badge (optimal spending)
- **Over $300**: Red pulsing "Attention" badge (requires review)

### Automated Activity Creation
- New activities automatically get $10 default cost
- Category defaults to "General"
- Instant budget increment on click

### Developer Credentials
- **Nirupathunga M** - Student Innovation Ambassador & ASME PR Head
- **Projects**: Traveloop MVP, ZenSpace Physics Engine, SmartSync 4.0 (₹15L), AI Quality Inspection (ASME EFx Winner)
- **Badges**: Verified Developer, ASME EFx Winner

## Technical Integration Roadmap

### Travel Alerts
- **OpenWeather API**: Real-time weather monitoring and alerts
- **FlightAware API**: Live flight status and delay notifications

### Flight & Hotel Booking
- **Amadeus GDS**: Global Distribution System integration
- **Live Booking Engines**: Real-time availability and pricing

### AI-Powered Features
- **Sentiment Analysis**: Travel journal mood detection
- **Smart Recommendations**: AI-driven activity suggestions
- **Dynamic Collaboration**: Real-time shared trip editing  
✅ **Professional UI**: Tailwind CSS travel-tech aesthetic  

## Future Enhancements

- Real database integration (Supabase/Firebase)
- User authentication
- Trip sharing and collaboration
- Activity recommendations
- Currency conversion
- Offline support
- Advanced budget forecasting
