/**
 * Traveloop Database Service
 * Relational data storage using localStorage
 *
 * Schema:
 * - Trips: [{ id, name, isCurrent, createdAt, updatedAt, ... }]
 * - Stops: [{ id, tripId, city, start, end, order, createdAt, updatedAt, ... }]
 * - Activities: [{ id, stopId, name, cost, createdAt, updatedAt, ... }]
 */

class TraveloopDB {
  constructor() {
    this.storageKey = 'traveloop-db'
    this.initializeDatabase()
  }

  /**
   * Initialize the database structure in localStorage
   */
  initializeDatabase() {
    if (!localStorage.getItem(this.storageKey)) {
      const initialData = {
        trips: [],
        stops: [],
        activities: []
      }
      localStorage.setItem(this.storageKey, JSON.stringify(initialData))
    }
  }

  /**
   * Get all database data
   * @returns {Object} Database object with trips, stops, and activities arrays
   */
  getDatabase() {
    try {
      const data = localStorage.getItem(this.storageKey)
      return data ? JSON.parse(data) : { trips: [], stops: [], activities: [] }
    } catch (error) {
      console.error('Error reading database:', error)
      return { trips: [], stops: [], activities: [] }
    }
  }

  /**
   * Save database data to localStorage
   * @param {Object} data - Database object to save
   */
  saveDatabase(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data))
    } catch (error) {
      console.error('Error saving database:', error)
      throw new Error('Failed to save database')
    }
  }

  /**
   * Generate a unique ID for database records
   * @returns {string} Unique ID
   */
  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  /**
   * Get current timestamp in ISO format
   * @returns {string} ISO timestamp
   */
  getTimestamp() {
    return new Date().toISOString()
  }

  // ===============================
  // TRIPS OPERATIONS
  // ===============================

  /**
   * Get all trips
   * @returns {Array} Array of trip objects
   */
  getTrips() {
    const db = this.getDatabase()
    return db.trips
  }

  /**
   * Get a trip by ID
   * @param {string} tripId - Trip ID
   * @returns {Object|null} Trip object or null if not found
   */
  getTripById(tripId) {
    const trips = this.getTrips()
    return trips.find(trip => trip.id === tripId) || null
  }

  /**
   * Get the current active trip
   * @returns {Object|null} Current trip object or null if none
   */
  getCurrentTrip() {
    const trips = this.getTrips()
    return trips.find(trip => trip.isCurrent) || trips[0] || null
  }

  /**
   * Create a new trip
   * @param {Object} tripData - Trip data (name, isCurrent, etc.)
   * @returns {Object} Created trip object
   */
  createTrip(tripData) {
    const db = this.getDatabase()
    const newTrip = {
      id: this.generateId(),
      ...tripData,
      createdAt: this.getTimestamp(),
      updatedAt: this.getTimestamp()
    }

    db.trips.push(newTrip)
    this.saveDatabase(db)
    return newTrip
  }

  /**
   * Save a new trip to the database
   * @param {Object} tripData - Trip payload
   * @returns {Object} Created trip object
   */
  saveTrip(tripData) {
    return this.createTrip(tripData)
  }

  /**
   * Add a new stop to an existing trip
   * @param {string} tripId - The ID of the trip
   * @param {Object} stopData - Stop payload (city, start, end, order, etc.)
   * @returns {Object} Created stop object
   */
  addStopToTrip(tripId, stopData) {
    const stopPayload = {
      tripId,
      ...stopData
    }
    return this.createStop(stopPayload)
  }

  /**
   * Add a new activity to an existing stop
   * @param {string} stopId - The ID of the stop
   * @param {Object} activityData - Activity payload (name, cost, etc.)
   * @returns {Object} Created activity object
   */
  addActivityToStop(stopId, activityData) {
    const activityPayload = {
      stopId,
      ...activityData
    }
    return this.createActivity(activityPayload)
  }

  /**
   * Update a trip
   * @param {string} tripId - Trip ID
   * @param {Object} updates - Fields to update
   * @returns {Object|null} Updated trip object or null if not found
   */
  updateTrip(tripId, updates) {
    const db = this.getDatabase()
    const tripIndex = db.trips.findIndex(trip => trip.id === tripId)

    if (tripIndex === -1) {
      return null
    }

    db.trips[tripIndex] = {
      ...db.trips[tripIndex],
      ...updates,
      updatedAt: this.getTimestamp()
    }

    this.saveDatabase(db)
    return db.trips[tripIndex]
  }

  /**
   * Delete a trip and all related stops and activities
   * @param {string} tripId - Trip ID
   * @returns {boolean} True if deleted successfully
   */
  deleteTrip(tripId) {
    const db = this.getDatabase()

    // Remove the trip
    db.trips = db.trips.filter(trip => trip.id !== tripId)

    // Remove related stops
    const relatedStopIds = db.stops
      .filter(stop => stop.tripId === tripId)
      .map(stop => stop.id)

    db.stops = db.stops.filter(stop => stop.tripId !== tripId)

    // Remove related activities
    db.activities = db.activities.filter(activity =>
      !relatedStopIds.includes(activity.stopId)
    )

    this.saveDatabase(db)
    return true
  }

  // ===============================
  // STOPS OPERATIONS
  // ===============================

  /**
   * Get all stops for a specific trip
   * @param {string} tripId - Trip ID
   * @returns {Array} Array of stop objects
   */
  getStopsByTripId(tripId) {
    const db = this.getDatabase()
    return db.stops.filter(stop => stop.tripId === tripId)
  }

  /**
   * Get a stop by ID
   * @param {string} stopId - Stop ID
   * @returns {Object|null} Stop object or null if not found
   */
  getStopById(stopId) {
    const db = this.getDatabase()
    return db.stops.find(stop => stop.id === stopId) || null
  }

  /**
   * Create a new stop
   * @param {Object} stopData - Stop data (tripId, city, start, end, order, etc.)
   * @returns {Object} Created stop object
   */
  createStop(stopData) {
    const db = this.getDatabase()
    const newStop = {
      id: this.generateId(),
      ...stopData,
      createdAt: this.getTimestamp(),
      updatedAt: this.getTimestamp()
    }

    db.stops.push(newStop)
    this.saveDatabase(db)
    return newStop
  }

  /**
   * Update a stop
   * @param {string} stopId - Stop ID
   * @param {Object} updates - Fields to update
   * @returns {Object|null} Updated stop object or null if not found
   */
  updateStop(stopId, updates) {
    const db = this.getDatabase()
    const stopIndex = db.stops.findIndex(stop => stop.id === stopId)

    if (stopIndex === -1) {
      return null
    }

    db.stops[stopIndex] = {
      ...db.stops[stopIndex],
      ...updates,
      updatedAt: this.getTimestamp()
    }

    this.saveDatabase(db)
    return db.stops[stopIndex]
  }

  /**
   * Delete a stop and all related activities
   * @param {string} stopId - Stop ID
   * @returns {boolean} True if deleted successfully
   */
  deleteStop(stopId) {
    const db = this.getDatabase()

    // Remove the stop
    db.stops = db.stops.filter(stop => stop.id !== stopId)

    // Remove related activities
    db.activities = db.activities.filter(activity => activity.stopId !== stopId)

    this.saveDatabase(db)
    return true
  }

  // ===============================
  // ACTIVITIES OPERATIONS
  // ===============================

  /**
   * Get all activities for a specific stop
   * @param {string} stopId - Stop ID
   * @returns {Array} Array of activity objects
   */
  getActivitiesByStopId(stopId) {
    const db = this.getDatabase()
    return db.activities.filter(activity => activity.stopId === stopId)
  }

  /**
   * Get all activities for a trip by querying activities for each stop
   * @param {string} tripId - Trip ID
   * @returns {Array} Array of activity objects
   */
  getActivitiesByTripId(tripId) {
    const db = this.getDatabase()
    const stopIds = db.stops
      .filter(stop => stop.tripId === tripId)
      .map(stop => stop.id)

    return db.activities.filter(activity => stopIds.includes(activity.stopId))
  }

  /**
   * Get an activity by ID
   * @param {string} activityId - Activity ID
   * @returns {Object|null} Activity object or null if not found
   */
  getActivityById(activityId) {
    const db = this.getDatabase()
    return db.activities.find(activity => activity.id === activityId) || null
  }

  /**
   * Create a new activity
   * @param {Object} activityData - Activity data (stopId, name, cost, etc.)
   * @returns {Object} Created activity object
   */
  createActivity(activityData) {
    const db = this.getDatabase()
    const newActivity = {
      id: this.generateId(),
      ...activityData,
      createdAt: this.getTimestamp(),
      updatedAt: this.getTimestamp()
    }

    db.activities.push(newActivity)
    this.saveDatabase(db)
    return newActivity
  }

  /**
   * Update an activity
   * @param {string} activityId - Activity ID
   * @param {Object} updates - Fields to update
   * @returns {Object|null} Updated activity object or null if not found
   */
  updateActivity(activityId, updates) {
    const db = this.getDatabase()
    const activityIndex = db.activities.findIndex(activity => activity.id === activityId)

    if (activityIndex === -1) {
      return null
    }

    db.activities[activityIndex] = {
      ...db.activities[activityIndex],
      ...updates,
      updatedAt: this.getTimestamp()
    }

    this.saveDatabase(db)
    return db.activities[activityIndex]
  }

  /**
   * Delete an activity
   * @param {string} activityId - Activity ID
   * @returns {boolean} True if deleted successfully
   */
  deleteActivity(activityId) {
    const db = this.getDatabase()
    db.activities = db.activities.filter(activity => activity.id !== activityId)
    this.saveDatabase(db)
    return true
  }

  // ===============================
  // UTILITY METHODS
  // ===============================

  /**
   * Clear all data (useful for testing)
   */
  clearAll() {
    const emptyDb = { trips: [], stops: [], activities: [] }
    this.saveDatabase(emptyDb)
  }

  /**
   * Get database statistics
   * @returns {Object} Statistics object
   */
  getStats() {
    const db = this.getDatabase()
    return {
      trips: db.trips.length,
      stops: db.stops.length,
      activities: db.activities.length,
      totalCost: db.activities.reduce((sum, activity) => sum + (parseFloat(activity.cost) || 0), 0)
    }
  }

  /**
   * Export database as JSON string
   * @returns {string} JSON string of database
   */
  export() {
    return JSON.stringify(this.getDatabase(), null, 2)
  }

  /**
   * Import database from JSON string
   * @param {string} jsonData - JSON string of database
   */
  import(jsonData) {
    try {
      const data = JSON.parse(jsonData)
      if (data.trips && data.stops && data.activities) {
        this.saveDatabase(data)
        return true
      }
      throw new Error('Invalid database format')
    } catch (error) {
      console.error('Error importing database:', error)
      return false
    }
  }
}

// Export a singleton instance
export const db = new TraveloopDB()
