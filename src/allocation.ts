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
  const allocation = Object.fromEntries(
    roommates.map(r => [r.id, []])
  ) as Allocation

  for (const item of items) {
    const roommate = roommates.reduce((best, current) => {
      const score = (id: number) =>
        Number(preferences[id]?.[item.id] ?? 0) -
        allocation[id].length * 10

      return score(current.id) > score(best.id)
        ? current
        : best
    })

    allocation[roommate.id].push(item)
  }

  return allocation
}

export function calculateExpenseShares(
  roommates: Roommate[],
  allocation: Allocation
): ExpenseShare {
  const shares = Object.fromEntries(
    roommates.map(r => [r.id, 0])
  ) as ExpenseShare

  for (const roommate of roommates) {
    shares[roommate.id] =
      allocation[roommate.id]
        .filter(item => item.type === "expense")
        .reduce((sum, item) => sum + item.cost, 0)
  }

  return shares
}