# Traveloop - Travel Planning App

A modern travel planning application built with React, Vite, and Tailwind CSS. Features a comprehensive itinerary builder with persistent data storage.

## Features

- **Responsive Layout**: Professional travel-tech design with sidebar navigation
- **Itinerary Builder**: Create multi-stop trips with activities and budget tracking
- **Persistent Data**: All trip data survives page refreshes using localStorage
- **Real-time Budget**: Live calculation of total trip costs as you add activities
- **Relational Data Structure**: Trips → Stops → Activities with proper relationships

## Data Persistence

The app uses a mock API layer with localStorage for data persistence:

- **Trips**: Top-level trip containers
- **Stops**: Cities/destinations within a trip with date ranges
- **Activities**: Individual activities per stop with names and costs

Data structure:
```javascript
{
  trips: [{ id, name, isCurrent, createdAt, updatedAt }],
  stops: [{ id, tripId, city, start, end, order, createdAt, updatedAt }],
  activities: [{ id, stopId, name, cost, createdAt, updatedAt }]
}
```

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

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **React Router** - Navigation
- **localStorage** - Data persistence

## Project Structure

```
src/
├── components/
│   └── Layout.jsx          # Main layout with sidebar
├── screens/
│   └── screens.jsx         # All screen components
├── services/
│   └── mockAPI.js          # Data persistence layer
├── App.jsx                 # Main app with routing
├── main.jsx                # App entry point
└── index.css               # Global styles
```

## Development

The app includes:
- Hot module replacement (HMR)
- ESLint configuration
- Responsive design
- Loading states and error handling
- Form validation and user feedback

## Future Enhancements

- Real database integration (Supabase/Firebase)
- User authentication
- Trip sharing and collaboration
- Activity recommendations
- Currency conversion
- Offline support
