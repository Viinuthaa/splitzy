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
      const bestPreference = Number(
        preferences[best.id]?.[item.id] ?? 100
      )

      const currentPreference = Number(
        preferences[current.id]?.[item.id] ?? 100
      )

      if (currentPreference < bestPreference) {
        return current
      }

      if (currentPreference === bestPreference) {
        return allocation[current.id].length <
          allocation[best.id].length
          ? current
          : best
      }

      return best
    })

    allocation[roommate.id].push(item)
  })

  return allocation
}