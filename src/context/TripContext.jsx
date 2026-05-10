import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { db } from '../services/db.js'
import { calculateDays } from '../utils/date.js'

const TripContext = createContext(null)

export function useTripContext() {
  const context = useContext(TripContext)
  if (!context) {
    throw new Error('useTripContext must be used within a TripProvider')
  }
  return context
}

export function TripProvider({ children }) {
  const [currentTrip, setCurrentTrip] = useState(null)
  const [trips, setTrips] = useState([])
  const [stops, setStops] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadData = () => {
      setLoading(true)
      let allTrips = db.getTrips()

      // Seed a sample trip if none exist
      if (allTrips.length === 0) {
        const sampleTrip = db.saveTrip({ name: 'London Visit', isCurrent: true })
        db.addStopToTrip(sampleTrip.id, {
          city: 'London',
          start: '2026-06-01',
          end: '2026-06-08',
        })
        const stops = db.getStopsByTripId(sampleTrip.id)
        if (stops.length > 0) {
          db.addActivityToStop(stops[0].id, { name: 'Hotel', cost: '250' })
          db.addActivityToStop(stops[0].id, { name: 'Tours', cost: '200' })
          db.addActivityToStop(stops[0].id, { name: 'Dining', cost: '50' })
        }
        allTrips = db.getTrips()
      }

      setTrips(allTrips)
      const trip = db.getCurrentTrip() || allTrips[0]

      let loadedStops = db.getStopsByTripId(trip.id)

      // Seed a default stop if none exist
      if (loadedStops.length === 0) {
        db.addStopToTrip(trip.id, {
          city: 'Coimbatore',
          start: '2026-05-10',
          end: '2026-05-13',
        })
        loadedStops = db.getStopsByTripId(trip.id)
      }

      // Load activities per stop from DB
      let allActivities = loadedStops.flatMap((stop) =>
        db.getActivitiesByStopId(stop.id)
      )

      // Seed demo activities if none exist
      if (allActivities.length === 0 && loadedStops.length > 0) {
        db.addActivityToStop(loadedStops[0].id, { name: 'Traveloop Pro', cost: '29' })
        db.addActivityToStop(loadedStops[0].id, { name: 'Hotel Stay', cost: '120' })
        db.addActivityToStop(loadedStops[0].id, { name: 'Networking Dinner', cost: '50' })
        allActivities = loadedStops.flatMap((stop) =>
          db.getActivitiesByStopId(stop.id)
        )
      }

      // Attach activities array to each stop so screens.jsx can render them directly
      const stopsWithActivities = loadedStops.map((stop) => ({
        ...stop,
        activities: allActivities.filter((a) => a.stopId === stop.id),
      }))

      setCurrentTrip(trip)
      setStops(stopsWithActivities)
      setActivities(allActivities)
      setLoading(false)
    }

    loadData()
  }, [])

  const getActivitiesForStop = (stopId) =>
    activities.filter((activity) => activity.stopId === stopId)

  const totalTripCost = useMemo(
    () =>
      activities.reduce(
        (sum, activity) => sum + (parseFloat(activity.cost) || 0),
        0
      ),
    [activities]
  )

  const totalDays = useMemo(
    () =>
      stops.reduce(
        (sum, stop) => sum + calculateDays(stop.start, stop.end),
        0
      ),
    [stops]
  )

  const addStopToTrip = (tripId, stopData) => {
    setSaving(true)
    const newStop = db.addStopToTrip(tripId, stopData)
    // Always ensure activities array exists on the stop object
    const stopWithActivities = { ...newStop, activities: [] }
    setStops((current) => [...current, stopWithActivities])
    setSaving(false)
    return stopWithActivities
  }

  const addActivityToStop = (stopId, activityData) => {
    setSaving(true)
    // Merge with defaults: cost $10 and category 'General'
    const defaultActivityData = {
      cost: '10',
      category: 'General',
      ...activityData
    }
    const newActivity = db.addActivityToStop(stopId, defaultActivityData)

    // Update flat activities list
    setActivities((current) => [...current, newActivity])

    // Also push the new activity into the correct stop's activities array
    // so the itinerary builder renders it immediately without a page reload
    setStops((current) =>
      current.map((stop) =>
        stop.id === stopId
          ? { ...stop, activities: [...(stop.activities || []), newActivity] }
          : stop
      )
    )

    setSaving(false)
    return newActivity
  }

  // Handles both signatures:
  //   updateStop(id, { city: 'Paris' })       ← object form (preferred)
  //   updateStop(id, 'city', 'Paris')          ← legacy string form (safe fallback)
  const updateStop = (stopId, fieldOrUpdates, value) => {
    setSaving(true)
    const updates =
      typeof fieldOrUpdates === 'string'
        ? { [fieldOrUpdates]: value }
        : fieldOrUpdates

    const updatedStop = db.updateStop(stopId, updates)
    if (updatedStop) {
      setStops((current) =>
        current.map((stop) =>
          stop.id === stopId ? { ...stop, ...updates } : stop
        )
      )
    }
    setSaving(false)
    return updatedStop
  }

  // Handles both signatures:
  //   updateActivity(id, { cost: '99' })       ← object form (preferred)
  //   updateActivity(id, 'cost', '99')          ← legacy string form (safe fallback)
  const updateActivity = (activityId, fieldOrUpdates, value) => {
    setSaving(true)
    const updates =
      typeof fieldOrUpdates === 'string'
        ? { [fieldOrUpdates]: value }
        : fieldOrUpdates

    const updatedActivity = db.updateActivity(activityId, updates)
    if (updatedActivity) {
      // Update flat activities list
      setActivities((current) =>
        current.map((activity) =>
          activity.id === activityId ? { ...activity, ...updates } : activity
        )
      )
      // Also update inside the stop's activities array so stopCost recalculates live
      setStops((current) =>
        current.map((stop) => ({
          ...stop,
          activities: (stop.activities || []).map((a) =>
            a.id === activityId ? { ...a, ...updates } : a
          ),
        }))
      )
    }
    setSaving(false)
    return updatedActivity
  }

  const removeActivity = (activityId) => {
    setSaving(true)
    db.deleteActivity(activityId)

    // Remove from flat list
    setActivities((current) =>
      current.filter((activity) => activity.id !== activityId)
    )
    // Remove from stop's activities array so the count and stopCost update instantly
    setStops((current) =>
      current.map((stop) => ({
        ...stop,
        activities: (stop.activities || []).filter((a) => a.id !== activityId),
      }))
    )
    setSaving(false)
  }

  return (
    <TripContext.Provider
      value={{
        currentTrip,
        trips,
        stops,
        activities,
        loading,
        saving,
        totalTripCost,
        totalDays,
        getActivitiesForStop,
        addStopToTrip,
        addActivityToStop,
        updateStop,
        updateActivity,
        removeActivity,
      }}
    >
      {children}
    </TripContext.Provider>
  )
}