/**
 * Example usage of the TraveloopDB service
 * This demonstrates the relational data structure and CRUD operations
 */

import { db } from './db.js'

// Example: Create a trip
const trip = db.createTrip({
  name: 'European Adventure',
  isCurrent: true,
  description: 'A 2-week trip through Europe'
})

console.log('Created trip:', trip)

// Example: Add stops to the trip
const stop1 = db.createStop({
  tripId: trip.id,
  city: 'Paris',
  start: '2024-06-01',
  end: '2024-06-05',
  order: 1
})

const stop2 = db.createStop({
  tripId: trip.id,
  city: 'Rome',
  start: '2024-06-06',
  end: '2024-06-10',
  order: 2
})

console.log('Created stops:', [stop1, stop2])

// Example: Add activities to stops
const activity1 = db.createActivity({
  stopId: stop1.id,
  name: 'Eiffel Tower Visit',
  cost: '85.00'
})

const activity2 = db.createActivity({
  stopId: stop1.id,
  name: 'Louvre Museum',
  cost: '75.00'
})

const activity3 = db.createActivity({
  stopId: stop2.id,
  name: 'Colosseum Tour',
  cost: '60.00'
})

console.log('Created activities:', [activity1, activity2, activity3])

// Example: Query data
console.log('All trips:', db.getTrips())
console.log('Stops for trip:', db.getStopsByTripId(trip.id))
console.log('Activities for Paris stop:', db.getActivitiesByStopId(stop1.id))

// Example: Update data
db.updateActivity(activity1.id, { cost: '95.00' })
console.log('Updated activity:', db.getActivityById(activity1.id))

// Example: Get statistics
console.log('Database stats:', db.getStats())

// Example: Export/Import (for backup/restore)
const exportedData = db.export()
console.log('Exported data length:', exportedData.length)

// Clean up example data
db.clearAll()
console.log('Database cleared, final stats:', db.getStats())
