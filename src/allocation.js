export function calculateAllocation(roommates, items, preferences) {
  const allocation = {}

  roommates.forEach(roommate => {
    allocation[roommate.id] = []
  })

  items.forEach(item => {
    let bestRoommate = roommates[0]
    let lowestValue = preferences[bestRoommate.id]?.[item.id] ?? 100

    roommates.forEach(roommate => {
      const value = preferences[roommate.id]?.[item.id] ?? 100

      if (value < lowestValue) {
        lowestValue = value
        bestRoommate = roommate
      }
    })

    allocation[bestRoommate.id].push(item)
  })

  return allocation
}