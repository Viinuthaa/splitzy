import type {
  Allocation,
  ExpenseShare,
  Item,
  Preferences,
  Roommate
} from "./types"

export function calculateAllocation(
  roommates: Roommate[],
  items: Item[],
  preferences: Preferences
): Allocation {
  const allocation: Allocation =
    Object.fromEntries(
      roommates.map(roommate => [
        roommate.id,
        []
      ])
    )

  items.forEach(item => {
    const roommate = roommates.reduce(
      (best, current) => {
        const bestPreference =
          Number(
            preferences[best.id]?.[item.id] ?? 0
          )

        const currentPreference =
          Number(
            preferences[current.id]?.[item.id] ?? 0
          )

        const bestScore =
          bestPreference -
          allocation[best.id].length * 10

        const currentScore =
          currentPreference -
          allocation[current.id].length * 10

        if (currentScore > bestScore) {
          return current
        }

        if (currentScore === bestScore) {
          return allocation[current.id].length <
            allocation[best.id].length
            ? current
            : best
        }

        return best
      }
    )

    allocation[roommate.id].push(item)
  })

  return allocation
}

export function calculateExpenseShares(
  roommates: Roommate[],
  items: Item[],
  allocation: Allocation
): ExpenseShare {
  const shares: ExpenseShare =
    Object.fromEntries(
      roommates.map(roommate => [
        roommate.id,
        0
      ])
    )

  const expenses = items.filter(
    item => item.type === "expense"
  )

  if (!expenses.length) {
    return shares
  }

  const total =
    expenses.reduce(
      (sum, item) => sum + item.cost,
      0
    )

  const equalShare =
    total / roommates.length

  roommates.forEach(roommate => {
    shares[roommate.id] = equalShare
  })

  return shares
}