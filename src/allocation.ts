import type {
  Allocation,
  Item,
  Preferences,
  Roommate
} from "./types"

export function calculateAllocation(
  roommates: Roommate[],
  items: Item[],
  preferences: Preferences
): Allocation {
  const allocation: Allocation = Object.fromEntries(
    roommates.map(roommate => [roommate.id, []])
  )

  items.forEach(item => {
    const roommate = roommates.reduce((best, current) => {
      const bestValue =
        Number(preferences[best.id]?.[item.id] ?? 100)

      const currentValue =
        Number(preferences[current.id]?.[item.id] ?? 100)

      return currentValue < bestValue ? current : best
    })

    allocation[roommate.id].push(item)
  })

  return allocation
}