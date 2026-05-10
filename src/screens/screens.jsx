import { useMemo, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { useTripContext } from '../context/TripContext.jsx'
import { calculateDays } from '../utils/date.js'

const TRAVEL_TIPS = [
  'Book flights on Tuesday and Wednesday for the best prices.',
  'Travel during off-season months to save 30-50% on accommodations.',
  'Set up price alerts 2-3 months before your planned trip.',
  'Use travel credit cards to earn points on every purchase.',
  'Pack light to avoid baggage fees and make travel easier.',
  'Download offline maps to avoid roaming charges.',
  'Join loyalty programs at hotels and airlines for exclusive deals.',
  'Eat where locals eat for authentic experiences and better prices.',
]

export function Dashboard() {
  const { totalTripCost, stops, trips } = useTripContext()
  const [tipIndex, setTipIndex] = useState(0)

  const currentTip = TRAVEL_TIPS[tipIndex]

  const nextTip = () => {
    setTipIndex((prev) => (prev + 1) % TRAVEL_TIPS.length)
  }

  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/70 p-6 shadow-sm shadow-slate-950/20">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/90">Dashboard</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-100">Travel Overview</h2>
        <p className="mt-2 max-w-2xl text-slate-400">
          Manage your trips, view budgets, and plan your next adventure.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/70 p-6 shadow-sm shadow-slate-950/20">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-cyan-500/10 p-3">
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <p className="text-sm text-slate-400">Current Budget</p>
              <p className="text-2xl font-semibold text-slate-100 transition-all duration-500">${totalTripCost.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/70 p-6 shadow-sm shadow-slate-950/20">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-cyan-500/10 p-3">
              <span className="text-2xl">🧳</span>
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Trips</p>
              <p className="text-2xl font-semibold text-slate-100">{trips.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/70 p-6 shadow-sm shadow-slate-950/20">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-cyan-500/10 p-3">
              <span className="text-2xl">📍</span>
            </div>
            <div>
              <p className="text-sm text-slate-400">Stops Planned</p>
              <p className="text-2xl font-semibold text-slate-100">{stops.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/70 p-6 shadow-sm shadow-slate-950/20">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="rounded-2xl bg-cyan-500/10 p-3">
              <span className="text-2xl">💡</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-cyan-400 mb-2">Travel Tip of the Day</p>
              <p className="text-slate-100">{currentTip}</p>
            </div>
          </div>
          <button
            onClick={nextTip}
            className="text-xs text-cyan-400 hover:text-cyan-300 transition"
          >
            Next →
          </button>
        </div>
      </div>
    </section>
  )
}

export function MyTrips() {
  const { trips, loading } = useTripContext()

  if (loading) {
    return (
      <section className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent"></div>
          <p className="text-slate-400">Loading trips...</p>
        </div>
      </section>
    )
  }

  if (!trips || trips.length === 0) {
    return (
      <section className="space-y-8">
        <div className="rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/70 p-6 shadow-sm shadow-slate-950/20">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/90">My Trips</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-100">No Trips Yet</h2>
          <p className="mt-2 max-w-2xl text-slate-400">
            You haven't created any trips yet. Start planning your first adventure!
          </p>
        </div>

        <div className="rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/70 p-12 text-center">
          <div className="mb-6">
            <span className="text-6xl">✈️</span>
          </div>
          <h3 className="text-2xl font-semibold text-slate-100 mb-2">Start Your First Trip</h3>
          <p className="text-slate-400 mb-6">Create a new trip and start planning your next adventure.</p>
          <a
            href="/itinerary-builder"
            className="inline-block rounded-3xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Start New Trip
          </a>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/70 p-6 shadow-sm shadow-slate-950/20">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/90">My Trips</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-100">Your Trips</h2>
        <p className="mt-2 max-w-2xl text-slate-400">
          Manage and view all your planned trips in one place.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {trips.map((trip) => {
          const tripStops = trip.stops || []
          const tripActivities = tripStops.flatMap(stop => stop.activities || [])
          const tripCost = tripActivities.reduce((sum, act) => sum + (parseFloat(act.cost) || 0), 0)
          const destination = tripStops.length > 0 ? tripStops[0].city : 'TBD'
          const dateRange = tripStops.length > 0 
            ? `${tripStops[0].start} to ${tripStops[tripStops.length - 1].end}`
            : 'No dates set'

          return (
            <div
              key={trip.id}
              className="rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/70 p-6 shadow-sm shadow-slate-950/20 transition hover:border-cyan-400/40 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-100 group-hover:text-cyan-300 transition">
                    {trip.name}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">📍 {destination}</p>
                </div>
                <span className="text-2xl">📅</span>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <p className="text-slate-400">
                  <span className="text-slate-500">Dates:</span> {dateRange}
                </p>
                <p className="text-slate-100 font-medium">
                  Budget: <span className="text-cyan-400">${tripCost.toFixed(2)}</span>
                </p>
              </div>

              <a
                href="/itinerary-builder"
                className="inline-block w-full text-center rounded-2xl bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500/20"
              >
                View Details
              </a>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function ItineraryBuilder() {
  const {
    currentTrip,
    stops,
    loading,
    saving,
    totalTripCost,
    addStopToTrip,
    addActivityToStop,
    updateStop,
    updateActivity,
    removeActivity,
  } = useTripContext()

  if (loading) {
    return (
      <section className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent"></div>
          <p className="text-slate-400">Loading your itinerary...</p>
        </div>
      </section>
    )
  }

  const handleAddStop = () => {
    if (!currentTrip) return
    addStopToTrip(currentTrip.id, {
      city: '',
      start: '',
      end: '',
      order: stops.length,
      activities: [],
    })
  }

  const handleAddActivity = (stopId) => {
    addActivityToStop(stopId, {
      stopId,
      name: '',
      cost: '',
    })
  }

  return (
    <section className="space-y-8">
      <div className="grid gap-5 lg:grid-cols-[1.7fr_1fr]">
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-800/70 bg-slate-950/85 p-6 shadow-sm shadow-slate-950/20">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/90">Itinerary Builder</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-100">Plan every stop and activity</h2>
            <p className="mt-2 max-w-2xl text-slate-400">
              Add stops with city and dates, then attach activities to each stop. Your budget updates automatically.
            </p>
            {saving && (
              <div className="mt-3 flex items-center gap-2 text-sm text-cyan-400">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent"></div>
                Saving changes...
              </div>
            )}
          </div>
          <div className="rounded-3xl border border-slate-800/70 bg-slate-950/85 p-6 shadow-sm shadow-slate-950/20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/90">Budget</p>
                <div className="flex items-center gap-3">
                  <p className="mt-3 text-4xl font-semibold text-slate-100 transition-all duration-500">${totalTripCost.toFixed(2)}</p>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    totalTripCost < 300
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'bg-red-500/20 text-red-400 animate-pulse'
                  }`}>
                    {totalTripCost < 300 ? 'Healthy' : 'Attention'}
                  </span>
                </div>
              </div>
              <div className="rounded-3xl bg-slate-900/95 px-4 py-3 text-sm text-slate-300">
                <p className="uppercase tracking-[0.32em] text-slate-500">Total Trip Cost</p>
                <p className="mt-2 text-slate-100">Live total from activities across all stops.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800/70 bg-slate-950/85 p-6 shadow-sm shadow-slate-950/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/90">Live preview</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-100">Trip structure</h3>
            </div>
            <button
              type="button"
              onClick={handleAddStop}
              disabled={saving}
              className="rounded-3xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Add stop
            </button>
          </div>
          <div className="mt-6 space-y-4 text-slate-400">
            <p>Use the timeline below to configure each stop and its activities.</p>
            <p>Each new activity immediately contributes to your total trip budget.</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {stops.map((stop, index) => {
          const stopActivities = stop.activities || []
          const stopCost = stopActivities.reduce(
            (sum, activity) => sum + (parseFloat(activity.cost) || 0),
            0,
          )

          return (
            <div key={stop.id} className="flex gap-6 rounded-[2rem] border border-slate-800/70 bg-slate-950/85 p-6 shadow-sm shadow-slate-950/20">
              <div className="flex w-16 flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-200 ring-1 ring-cyan-500/20">
                  {index + 1}
                </div>
                {index < stops.length - 1 && <div className="mt-3 h-full w-px bg-slate-800/70"></div>}
              </div>

              <div className="flex-1 space-y-5">
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-3 rounded-3xl border border-slate-800/70 bg-slate-900/90 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-100">Stop {index + 1}</h3>
                        <p className="text-sm text-slate-500">City and date range</p>
                      </div>
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-400">
                        {calculateDays(stop.start, stop.end)} days
                      </span>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="space-y-2 text-sm text-slate-300">
                        <span>City</span>
                        <input
                          value={stop.city}
                          onChange={(event) => updateStop(stop.id, { city: event.target.value })}
                          placeholder="Enter city"
                          className="w-full rounded-3xl border border-slate-700/80 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                        />
                      </label>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="space-y-2 text-sm text-slate-300">
                          <span>Start date</span>
                          <input
                            type="date"
                            value={stop.start}
                            onChange={(event) => updateStop(stop.id, { start: event.target.value })}
                            className="w-full rounded-3xl border border-slate-700/80 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                          />
                        </label>
                        <label className="space-y-2 text-sm text-slate-300">
                          <span>End date</span>
                          <input
                            type="date"
                            value={stop.end}
                            onChange={(event) => updateStop(stop.id, { end: event.target.value })}
                            className="w-full rounded-3xl border border-slate-700/80 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-800/70 bg-slate-900/90 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400/90">Stop budget</p>
                        <p className="mt-2 text-3xl font-semibold text-slate-100">${stopCost.toFixed(2)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddActivity(stop.id)}
                        className="rounded-3xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                      >
                        + Activity
                      </button>
                    </div>
                    <p className="mt-3 text-sm text-slate-400">
                      Add named activities and cost estimates for this stop.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/90 p-5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-slate-100">Activities</h4>
                    <p className="text-sm text-slate-500">{stopActivities.length} items</p>
                  </div>

                  <div className="space-y-4">
                    {stopActivities.length > 0 ? (
                      stopActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="grid gap-3 rounded-3xl border border-slate-800/70 bg-slate-950/80 p-4 sm:grid-cols-[1.5fr_1fr_80px]"
                        >
                          <label className="space-y-2 text-sm text-slate-300">
                            <span>Activity name</span>
                            <input
                              value={activity.name}
                              onChange={(event) => updateActivity(activity.id, { name: event.target.value })}
                              placeholder="Name"
                              className="w-full rounded-3xl border border-slate-700/80 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                            />
                          </label>
                          <label className="space-y-2 text-sm text-slate-300">
                            <span>Cost</span>
                            <input
                              type="number"
                              min="0"
                              value={activity.cost}
                              onChange={(event) => updateActivity(activity.id, { cost: event.target.value })}
                              placeholder="0"
                              className="w-full rounded-3xl border border-slate-700/80 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => removeActivity(activity.id)}
                            className="inline-flex items-center justify-center rounded-3xl bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-3xl border border-dashed border-slate-700/80 bg-slate-950/80 p-5 text-sm text-slate-500">
                        No activities yet. Use the button above to add a new activity for this stop.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function CitySearch() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/70 p-6 shadow-sm shadow-slate-950/20">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/90">City Search</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-100">Discover Your Next Destination</h2>
        <p className="mt-2 max-w-2xl text-slate-400">
          Explore cities around the world with personalized recommendations.
        </p>
      </div>

      <div className="rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/70 p-6 shadow-sm shadow-slate-950/20">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for cities..."
            className="w-full rounded-3xl border border-slate-700/80 bg-slate-900/90 px-4 py-3 pl-12 text-slate-100 outline-none transition focus:border-cyan-400"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        </div>

        <div className="mt-6">
          <p className="text-sm text-slate-400 mb-4">Trending Destinations</p>
          <div className="flex flex-wrap gap-2">
            {['Paris', 'London', 'Tokyo'].map((city) => (
              <button
                key={city}
                onClick={() => setSearchQuery(city)}
                className="rounded-full bg-slate-800/50 px-4 py-2 text-sm text-slate-300 transition hover:bg-cyan-500/20 hover:text-cyan-400"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function ActivitySearch() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/70 p-6 shadow-sm shadow-slate-950/20">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/90">Activity Search</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-100">Find Amazing Experiences</h2>
        <p className="mt-2 max-w-2xl text-slate-400">
          Discover unique activities and attractions for your trip.
        </p>
      </div>

      <div className="rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/70 p-6 shadow-sm shadow-slate-950/20">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for activities..."
            className="w-full rounded-3xl border border-slate-700/80 bg-slate-900/90 px-4 py-3 pl-12 text-slate-100 outline-none transition focus:border-cyan-400"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🎯</span>
        </div>

        <div className="mt-6">
          <p className="text-sm text-slate-400 mb-4">Popular Activities</p>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { name: 'Museum Tours', icon: '🏛️' },
              { name: 'Food Tours', icon: '🍽️' },
              { name: 'Adventure Sports', icon: '🏔️' },
              { name: 'Cultural Experiences', icon: '🎭' }
            ].map((activity) => (
              <div
                key={activity.name}
                className="rounded-2xl border border-slate-800/70 bg-slate-900/50 p-4 transition hover:bg-slate-900/70"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{activity.icon}</span>
                  <span className="text-slate-100">{activity.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Budget() {
  const { activities, loading, totalDays } = useTripContext()

  const budgetData = useMemo(() => {
    if (!activities || activities.length === 0) {
      return { breakdown: [], totalCost: 0, totalDays: 0, averagePerDay: 0 }
    }

    const activitiesCost = activities.reduce(
      (sum, activity) => sum + (parseFloat(activity.cost) || 0),
      0,
    )
    const transportCost = Math.round(activitiesCost * 0.3)
    const foodCost = Math.round(activitiesCost * 0.4)
    const totalCost = activitiesCost + transportCost + foodCost
    const averagePerDay = totalDays > 0 ? totalCost / totalDays : 0

    const breakdown = [
      { name: 'Activities', value: activitiesCost, color: '#06b6d4' },
      { name: 'Transport',  value: transportCost,  color: '#10b981' },
      { name: 'Food',       value: foodCost,        color: '#f59e0b' },
    ].filter((item) => item.value > 0)

    return { breakdown, totalCost, totalDays, averagePerDay }
  }, [activities, totalDays])

  if (loading) {
    return (
      <section className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent"></div>
          <p className="text-slate-400">Loading budget data...</p>
        </div>
      </section>
    )
  }

  if (!activities || activities.length === 0) {
    return (
      <section className="space-y-4">
        <div className="rounded-3xl bg-slate-950/80 p-6 shadow-sm shadow-slate-950/20">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/90">Budget Breakdown</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-100">No Trip Data</h2>
          <p className="mt-2 max-w-2xl text-slate-400">
            Create a trip and add stops with activities in the Itinerary Builder to see your budget breakdown.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-slate-800/70 bg-slate-950/85 p-6 shadow-sm shadow-slate-950/20">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/90">Budget Breakdown</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-100">Automatic Budget Estimation</h2>
        <p className="mt-2 max-w-2xl text-slate-400">
          Real-time expense analysis based on your itinerary. Activity costs are calculated from your planned activities, with estimated transport and food costs.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-800/70 bg-slate-950/85 p-6 shadow-sm shadow-slate-950/20">
          <h3 className="text-xl font-semibold text-slate-100 mb-6">Expense Categories</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetData.breakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {budgetData.breakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`$${value.toFixed(2)}`, '']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '0.75rem',
                    color: '#e2e8f0',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry) => (
                    <span style={{ color: entry.color }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800/70 bg-slate-950/85 p-6 shadow-sm shadow-slate-950/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-400/90">Total Budget</p>
                <p className="mt-2 text-3xl font-semibold text-slate-100">${budgetData.totalCost.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Trip Duration</p>
                <p className="text-lg font-semibold text-slate-100">{budgetData.totalDays} days</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800/70 bg-slate-950/85 p-6 shadow-sm shadow-slate-950/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-400/90">Average Per Day</p>
                <p className="mt-2 text-3xl font-semibold text-slate-100">${budgetData.averagePerDay.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Daily Budget</p>
                <p className="text-lg font-semibold text-slate-100">Recommended</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800/70 bg-slate-950/85 p-6 shadow-sm shadow-slate-950/20">
            <h4 className="text-lg font-semibold text-slate-100 mb-4">Category Breakdown</h4>
            <div className="space-y-3">
              {budgetData.breakdown.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-300">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-100">${item.value.toFixed(2)}</p>
                    <p className="text-sm text-slate-500">
                      {budgetData.totalCost > 0
                        ? ((item.value / budgetData.totalCost) * 100).toFixed(1)
                        : 0}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800/70 bg-slate-950/85 p-6 shadow-sm shadow-slate-950/20">
        <h3 className="text-xl font-semibold text-slate-100 mb-4">Budget Insights</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-slate-900/90 p-4">
            <p className="text-sm text-cyan-400/90 font-medium">Activities Focus</p>
            <p className="mt-2 text-slate-300 text-sm">
              {budgetData.breakdown.find((b) => b.name === 'Activities')?.value > 0
                ? 'You have detailed activity costs planned. Great job!'
                : 'Add activities to your itinerary for more accurate budgeting.'}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-900/90 p-4">
            <p className="text-sm text-green-400/90 font-medium">Transport Estimate</p>
            <p className="mt-2 text-slate-300 text-sm">
              Estimated at 30% of activity costs. Adjust based on your travel style.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-900/90 p-4">
            <p className="text-sm text-yellow-400/90 font-medium">Food Estimate</p>
            <p className="mt-2 text-slate-300 text-sm">
              Estimated at 40% of activity costs. Consider local dining preferences.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export function PackingList() {
  const [items, setItems] = useState([
    { id: 1, name: 'Passport', packed: false },
    { id: 2, name: 'Universal Adapter', packed: false },
    { id: 3, name: 'Sunscreen', packed: false },
    { id: 4, name: 'Laptop Charger', packed: false },
  ])

  const togglePacked = (id) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, packed: !item.packed } : item
    ))
  }

  const packedCount = items.filter(item => item.packed).length

  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/70 p-6 shadow-sm shadow-slate-950/20">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/90">Packing List</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-100">Never Forget Essentials</h2>
        <p className="mt-2 max-w-2xl text-slate-400">
          Smart packing checklist to ensure you have everything for your trip.
        </p>
      </div>

      <div className="rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/70 p-6 shadow-sm shadow-slate-950/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-100">Travel Essentials</h3>
          <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm text-cyan-400">
            {packedCount}/{items.length} packed
          </span>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-2xl border border-slate-800/70 bg-slate-900/50 p-4 transition hover:bg-slate-900/70"
            >
              <input
                type="checkbox"
                checked={item.packed}
                onChange={() => togglePacked(item.id)}
                className="h-5 w-5 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500"
              />
              <span className={`text-lg ${item.packed ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                {item.name}
              </span>
              {item.packed && (
                <span className="ml-auto text-cyan-400">✓</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function SharedView() {
  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/70 p-6 shadow-sm shadow-slate-950/20">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/90">Shared View</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-100">Collaborate on Trips</h2>
        <p className="mt-2 max-w-2xl text-slate-400">
          Share itineraries with friends and family for collaborative planning.
        </p>
      </div>

      <div className="rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/70 p-6 shadow-sm shadow-slate-950/20">
        <div className="flex items-center gap-4 mb-6">
          <div className="rounded-2xl bg-cyan-500/10 p-3">
            <span className="text-2xl">👥</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-100">Generating Dynamic Collaboration Links</h3>
            <p className="text-slate-400">Real-time collaboration with live editing and shared trip planning</p>
          </div>
        </div>
        <div className="rounded-2xl bg-slate-900/50 p-4">
          <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-300 animate-pulse shadow-lg shadow-cyan-500/20">
            Beta - Early Access
          </span>
        </div>
      </div>
    </section>
  )
}

export function FlightFinder() {
  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/70 p-6 shadow-sm shadow-slate-950/20">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/90">Flight Finder</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-100">Find the Best Flights</h2>
        <p className="mt-2 max-w-2xl text-slate-400">
          Compare prices and book flights with integrated booking system.
        </p>
      </div>

      <div className="rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/70 p-6 shadow-sm shadow-slate-950/20">
        <div className="flex items-center gap-4 mb-6">
          <div className="rounded-2xl bg-cyan-500/10 p-3">
            <span className="text-2xl">✈️</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-100">Connecting to GDS & Amadeus Live Booking Engines</h3>
            <p className="text-slate-400">Real-time flight search with competitive pricing and instant booking</p>
          </div>
        </div>
        <div className="rounded-2xl bg-slate-900/50 p-4">
          <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-300 animate-pulse shadow-lg shadow-cyan-500/20">
            AI-Sync Pending
          </span>
        </div>
      </div>
    </section>
  )
}

export function HotelFinder() {
  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/70 p-6 shadow-sm shadow-slate-950/20">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/90">Hotel Finder</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-100">Book Perfect Accommodations</h2>
        <p className="mt-2 max-w-2xl text-slate-400">
          Find hotels, resorts, and unique stays for every destination.
        </p>
      </div>

      <div className="rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/70 p-6 shadow-sm shadow-slate-950/20">
        <div className="flex items-center gap-4 mb-6">
          <div className="rounded-2xl bg-cyan-500/10 p-3">
            <span className="text-2xl">🏨</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-100">Connecting to GDS & Amadeus Live Booking Engines</h3>
            <p className="text-slate-400">Comprehensive hotel search with real-time availability and competitive rates</p>
          </div>
        </div>
        <div className="rounded-2xl bg-slate-900/50 p-4">
          <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-300 animate-pulse shadow-lg shadow-cyan-500/20">
            AI-Sync Pending
          </span>
        </div>
      </div>
    </section>
  )
}

export function TravelJournal() {
  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/70 p-6 shadow-sm shadow-slate-950/20">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/90">Travel Journal</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-100">Document Your Adventures</h2>
        <p className="mt-2 max-w-2xl text-slate-400">
          Keep memories alive with photos, notes, and travel stories.
        </p>
      </div>

      <div className="rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/70 p-6 shadow-sm shadow-slate-950/20">
        <div className="flex items-center gap-4 mb-6">
          <div className="rounded-2xl bg-cyan-500/10 p-3">
            <span className="text-2xl">📔</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-100">AI-Powered Journaling & Sentiment Analysis coming in v2.0</h3>
            <p className="text-slate-400">Smart photo recognition, automatic tagging, and mood-based travel insights</p>
          </div>
        </div>
        <div className="rounded-2xl bg-slate-900/50 p-4">
          <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-300 animate-pulse shadow-lg shadow-cyan-500/20">
            Beta - Early Access
          </span>
        </div>
      </div>
    </section>
  )
}

export function LocalGuides() {
  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/70 p-6 shadow-sm shadow-slate-950/20">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/90">Local Guides</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-100">Expert Local Insights</h2>
        <p className="mt-2 max-w-2xl text-slate-400">
          Get authentic recommendations from locals and travel experts.
        </p>
      </div>

      <div className="rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/70 p-6 shadow-sm shadow-slate-950/20">
        <div className="flex items-center gap-4 mb-6">
          <div className="rounded-2xl bg-cyan-500/10 p-3">
            <span className="text-2xl">🧭</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-100">Feature Preview</h3>
            <p className="text-slate-400">Local expert recommendations</p>
          </div>
        </div>
        <div className="rounded-2xl bg-slate-900/50 p-4">
          <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-300 animate-pulse shadow-lg shadow-cyan-500/20">
            Beta - Early Access
          </span>
        </div>
      </div>
    </section>
  )
}

export function TravelAlerts() {
  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/70 p-6 shadow-sm shadow-slate-950/20">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/90">Travel Alerts</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-100">Stay Informed</h2>
        <p className="mt-2 max-w-2xl text-slate-400">
          Get real-time alerts about flight delays, weather changes, and travel updates.
        </p>
      </div>

      <div className="rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/70 p-6 shadow-sm shadow-slate-950/20">
        <div className="flex items-center gap-4 mb-6">
          <div className="rounded-2xl bg-cyan-500/10 p-3">
            <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-100">Integrating OpenWeather & FlightAware APIs</h3>
            <p className="text-slate-400">Real-time weather alerts, flight status updates, and travel disruption notifications</p>
          </div>
        </div>
        <div className="rounded-2xl bg-slate-900/50 p-4">
          <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-300 animate-pulse shadow-lg shadow-cyan-500/20">
            AI-Sync Pending
          </span>
        </div>
      </div>
    </section>
  )
}

export function Profile() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    preference: 'Budget',
  })
  const [saved, setSaved] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <section className="space-y-8 max-w-2xl">
      <div className="rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/70 p-6 shadow-sm shadow-slate-950/20">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/90">Settings</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-100">User Profile</h2>
        <p className="mt-2 max-w-2xl text-slate-400">
          Manage your account information and travel preferences.
        </p>
      </div>

      <div className="rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/70 p-6 shadow-sm shadow-slate-950/20">
        <div className="flex items-center gap-6 mb-8">
          <div className="h-20 w-20 rounded-full bg-cyan-500/10 flex items-center justify-center">
            <span className="text-3xl">👤</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-100">Account</h3>
            <p className="text-slate-400 text-sm mt-1">Update your personal information</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/50 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/50 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/50 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Travel Preference</label>
            <select
              name="preference"
              value={formData.preference}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/50 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            >
              <option value="Budget">Budget Traveler</option>
              <option value="Comfortable">Comfortable</option>
              <option value="Luxury">Luxury</option>
              <option value="Adventure">Adventure Seeker</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={handleSave}
            className="rounded-2xl bg-cyan-500 px-6 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Save Changes
          </button>
          {saved && (
            <span className="text-sm text-cyan-400">✓ Changes saved successfully</span>
          )}
        </div>
      </div>
    </section>
  )
}