export function calculateAllocation(roommates, items, preferences) {
  const allocation = Object.fromEntries(
    roommates.map(roommate => [roommate.id, []])
  )

  items.forEach(item => {
    const roommate = roommates.reduce((best, current) => {
      const bestValue = preferences[best.id]?.[item.id] ?? 100
      const currentValue = preferences[current.id]?.[item.id] ?? 100

      return currentValue < bestValue ? current : best
    })

    allocation[roommate.id].push(item)
  })

  return allocation
}