class MockAPI {
  constructor() {
    this.storageKey = 'traveloop-data'
    this.initializeStorage()
  }

  initializeStorage() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify({
        trips: [],
        stops: [],
        activities: []
      }))
    }
  }

  getData() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey))
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return { trips: [], stops: [], activities: [] }
    }
  }

  saveData(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  // Trips
  async getTrips() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = this.getData()
        resolve(data.trips)
      }, 100) // Simulate network delay
    })
  }

  async createTrip(trip) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = this.getData()
        const newTrip = {
          id: Date.now().toString(),
          ...trip,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        data.trips.push(newTrip)
        this.saveData(data)
        resolve(newTrip)
      }, 100)
    })
  }

  async updateTrip(id, updates) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = this.getData()
        const tripIndex = data.trips.findIndex(t => t.id === id)
        if (tripIndex !== -1) {
          data.trips[tripIndex] = {
            ...data.trips[tripIndex],
            ...updates,
            updatedAt: new Date().toISOString()
          }
          this.saveData(data)
          resolve(data.trips[tripIndex])
        } else {
          resolve(null)
        }
      }, 100)
    })
  }

  async deleteTrip(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = this.getData()
        data.trips = data.trips.filter(t => t.id !== id)
        // Also delete related stops and activities
        data.stops = data.stops.filter(s => s.tripId !== id)
        data.activities = data.activities.filter(a => {
          const stop = data.stops.find(s => s.id === a.stopId)
          return !stop || stop.tripId !== id
        })
        this.saveData(data)
        resolve(true)
      }, 100)
    })
  }

  // Stops
  async getStops(tripId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = this.getData()
        const stops = data.stops.filter(s => s.tripId === tripId)
        resolve(stops)
      }, 100)
    })
  }

  async createStop(stop) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = this.getData()
        const newStop = {
          id: Date.now().toString(),
          ...stop,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        data.stops.push(newStop)
        this.saveData(data)
        resolve(newStop)
      }, 100)
    })
  }

  async updateStop(id, updates) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = this.getData()
        const stopIndex = data.stops.findIndex(s => s.id === id)
        if (stopIndex !== -1) {
          data.stops[stopIndex] = {
            ...data.stops[stopIndex],
            ...updates,
            updatedAt: new Date().toISOString()
          }
          this.saveData(data)
          resolve(data.stops[stopIndex])
        } else {
          resolve(null)
        }
      }, 100)
    })
  }

  async deleteStop(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = this.getData()
        data.stops = data.stops.filter(s => s.id !== id)
        // Also delete related activities
        data.activities = data.activities.filter(a => a.stopId !== id)
        this.saveData(data)
        resolve(true)
      }, 100)
    })
  }

  // Activities
  async getActivities(stopId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = this.getData()
        const activities = data.activities.filter(a => a.stopId === stopId)
        resolve(activities)
      }, 100)
    })
  }

  async createActivity(activity) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = this.getData()
        const newActivity = {
          id: Date.now().toString(),
          ...activity,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        data.activities.push(newActivity)
        this.saveData(data)
        resolve(newActivity)
      }, 100)
    })
  }

  async updateActivity(id, updates) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = this.getData()
        const activityIndex = data.activities.findIndex(a => a.id === id)
        if (activityIndex !== -1) {
          data.activities[activityIndex] = {
            ...data.activities[activityIndex],
            ...updates,
            updatedAt: new Date().toISOString()
          }
          this.saveData(data)
          resolve(data.activities[activityIndex])
        } else {
          resolve(null)
        }
      }, 100)
    })
  }

  async deleteActivity(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = this.getData()
        data.activities = data.activities.filter(a => a.id !== id)
        this.saveData(data)
        resolve(true)
      }, 100)
    })
  }
}

export const mockAPI = new MockAPI()
