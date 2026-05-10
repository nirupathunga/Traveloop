import { useMemo, useState, useEffect } from 'react'
import { mockAPI } from '../services/mockAPI.js'

export function Dashboard() {
  return (
    <section className="space-y-4">
      <div className="rounded-3xl bg-slate-950/80 p-6 shadow-sm shadow-slate-950/20">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/90">Dashboard</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-100">Overview</h2>
        <p className="mt-2 max-w-2xl text-slate-400">
          Your central travel operations hub for trips, alerts, and personalized planning.
        </p>
      </div>
    </section>
  )
}

export function MyTrips() {
  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-semibold text-slate-100">My Trips</h2>
      <p className="text-slate-400">Review upcoming travel plans, manage reservations, and track progress.</p>
    </section>
  )
}

function calculateDays(start, end) {
  if (!start || !end) return 0
  const startDate = new Date(start)
  const endDate = new Date(end)
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return 0
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.max(1, Math.floor((endDate - startDate) / msPerDay) + 1)
}

export function ItineraryBuilder() {
  const [currentTrip, setCurrentTrip] = useState(null)
  const [stops, setStops] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Load or create current trip on mount
  useEffect(() => {
    const loadTrip = async () => {
      try {
        const trips = await mockAPI.getTrips()
        let trip = trips.find(t => t.isCurrent) || trips[0]

        if (!trip) {
          // Create a new trip if none exists
          trip = await mockAPI.createTrip({
            name: 'My Trip',
            isCurrent: true
          })
        }

        setCurrentTrip(trip)
        const tripStops = await mockAPI.getStops(trip.id)

        // Load activities for each stop
        const stopsWithActivities = await Promise.all(
          tripStops.map(async (stop) => {
            const activities = await mockAPI.getActivities(stop.id)
            return { ...stop, activities }
          })
        )

        setStops(stopsWithActivities)
      } catch (error) {
        console.error('Error loading trip:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTrip()
  }, [])

  const totalTripCost = useMemo(
    () =>
      stops.reduce(
        (sum, stop) =>
          sum +
          stop.activities.reduce(
            (activitySum, activity) => activitySum + (parseFloat(activity.cost) || 0),
            0,
          ),
        0,
      ),
    [stops],
  )

  const updateStop = async (stopId, field, value) => {
    try {
      setSaving(true)
      const updatedStop = await mockAPI.updateStop(stopId, { [field]: value })
      if (updatedStop) {
        setStops(current =>
          current.map(stop =>
            stop.id === stopId ? { ...stop, [field]: value } : stop
          )
        )
      }
    } catch (error) {
      console.error('Error updating stop:', error)
    } finally {
      setSaving(false)
    }
  }

  const addStop = async () => {
    if (!currentTrip) return

    try {
      setSaving(true)
      const newStop = await mockAPI.createStop({
        tripId: currentTrip.id,
        city: '',
        start: '',
        end: '',
        order: stops.length
      })

      setStops(current => [...current, { ...newStop, activities: [] }])
    } catch (error) {
      console.error('Error adding stop:', error)
    } finally {
      setSaving(false)
    }
  }

  const addActivity = async (stopId) => {
    try {
      setSaving(true)
      const newActivity = await mockAPI.createActivity({
        stopId,
        name: '',
        cost: ''
      })

      setStops(current =>
        current.map(stop =>
          stop.id === stopId
            ? { ...stop, activities: [...stop.activities, newActivity] }
            : stop
        )
      )
    } catch (error) {
      console.error('Error adding activity:', error)
    } finally {
      setSaving(false)
    }
  }

  const updateActivity = async (stopId, activityId, field, value) => {
    try {
      setSaving(true)
      const updatedActivity = await mockAPI.updateActivity(activityId, { [field]: value })
      if (updatedActivity) {
        setStops(current =>
          current.map(stop =>
            stop.id === stopId
              ? {
                  ...stop,
                  activities: stop.activities.map(activity =>
                    activity.id === activityId ? { ...activity, [field]: value } : activity
                  )
                }
              : stop
          )
        )
      }
    } catch (error) {
      console.error('Error updating activity:', error)
    } finally {
      setSaving(false)
    }
  }

  const removeActivity = async (stopId, activityId) => {
    try {
      setSaving(true)
      await mockAPI.deleteActivity(activityId)

      setStops(current =>
        current.map(stop =>
          stop.id === stopId
            ? {
                ...stop,
                activities: stop.activities.filter(activity => activity.id !== activityId)
              }
            : stop
        )
      )
    } catch (error) {
      console.error('Error removing activity:', error)
    } finally {
      setSaving(false)
    }
  }

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
                <p className="mt-3 text-4xl font-semibold text-slate-100">${totalTripCost.toFixed(2)}</p>
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
              onClick={addStop}
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
          const stopCost = stop.activities.reduce(
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
                          onChange={(event) => updateStop(stop.id, 'city', event.target.value)}
                          placeholder="Enter city"
                          disabled={saving}
                          className="w-full rounded-3xl border border-slate-700/80 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 disabled:opacity-50"
                        />
                      </label>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="space-y-2 text-sm text-slate-300">
                          <span>Start date</span>
                          <input
                            type="date"
                            value={stop.start}
                            onChange={(event) => updateStop(stop.id, 'start', event.target.value)}
                            disabled={saving}
                            className="w-full rounded-3xl border border-slate-700/80 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 disabled:opacity-50"
                          />
                        </label>
                        <label className="space-y-2 text-sm text-slate-300">
                          <span>End date</span>
                          <input
                            type="date"
                            value={stop.end}
                            onChange={(event) => updateStop(stop.id, 'end', event.target.value)}
                            disabled={saving}
                            className="w-full rounded-3xl border border-slate-700/80 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 disabled:opacity-50"
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
                        onClick={() => addActivity(stop.id)}
                        disabled={saving}
                        className="rounded-3xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <p className="text-sm text-slate-500">{stop.activities.length} items</p>
                  </div>

                  <div className="space-y-4">
                    {stop.activities.length > 0 ? (
                      stop.activities.map((activity) => (
                        <div
                          key={activity.id}
                          className="grid gap-3 rounded-3xl border border-slate-800/70 bg-slate-950/80 p-4 sm:grid-cols-[1.5fr_1fr_80px]"
                        >
                          <label className="space-y-2 text-sm text-slate-300">
                            <span>Activity name</span>
                            <input
                              value={activity.name}
                              onChange={(event) =>
                                updateActivity(stop.id, activity.id, 'name', event.target.value)
                              }
                              placeholder="Name"
                              disabled={saving}
                              className="w-full rounded-3xl border border-slate-700/80 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 disabled:opacity-50"
                            />
                          </label>
                          <label className="space-y-2 text-sm text-slate-300">
                            <span>Cost</span>
                            <input
                              type="number"
                              min="0"
                              value={activity.cost}
                              onChange={(event) =>
                                updateActivity(stop.id, activity.id, 'cost', event.target.value)
                              }
                              placeholder="0"
                              disabled={saving}
                              className="w-full rounded-3xl border border-slate-700/80 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 disabled:opacity-50"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => removeActivity(stop.id, activity.id)}
                            disabled={saving}
                            className="inline-flex items-center justify-center rounded-3xl bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-semibold text-slate-100">City Search</h2>
      <p className="text-slate-400">Discover destinations, destination guides, and travel inspiration.</p>
    </section>
  )
}

export function ActivitySearch() {
  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-semibold text-slate-100">Activity Search</h2>
      <p className="text-slate-400">Find experiences and book adventures tailored to your itinerary.</p>
    </section>
  )
}

export function Budget() {
  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-semibold text-slate-100">Budget</h2>
      <p className="text-slate-400">Track expenses, set travel budgets, and keep your trip costs under control.</p>
    </section>
  )
}

export function PackingList() {
  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-semibold text-slate-100">Packing List</h2>
      <p className="text-slate-400">Organize the essentials you need to pack for every destination.</p>
    </section>
  )
}

export function SharedView() {
  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-semibold text-slate-100">Shared View</h2>
      <p className="text-slate-400">Collaborate with travel partners on shared itineraries and plans.</p>
    </section>
  )
}

export function FlightFinder() {
  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-semibold text-slate-100">Flight Finder</h2>
      <p className="text-slate-400">Search flights, compare routes, and lock in the best fares.</p>
    </section>
  )
}

export function HotelFinder() {
  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-semibold text-slate-100">Hotel Finder</h2>
      <p className="text-slate-400">Browse stays, compare hotels, and save your favorite accommodations.</p>
    </section>
  )
}

export function TravelJournal() {
  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-semibold text-slate-100">Travel Journal</h2>
      <p className="text-slate-400">Capture memories, notes, and highlights from your trips.</p>
    </section>
  )
}

export function LocalGuides() {
  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-semibold text-slate-100">Local Guides</h2>
      <p className="text-slate-400">Access trusted recommendations and local insights for every city.</p>
    </section>
  )
}

export function TravelAlerts() {
  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-semibold text-slate-100">Travel Alerts</h2>
      <p className="text-slate-400">Stay informed with real-time travel warnings and itinerary updates.</p>
    </section>
  )
}

export function Profile() {
  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-semibold text-slate-100">Profile</h2>
      <p className="text-slate-400">Manage your account preferences, saved trips, and travel settings.</p>
    </section>
  )
}
