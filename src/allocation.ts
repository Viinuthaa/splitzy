import type {
  Allocation,
  ExpenseShare,
  Item,
  Preferences,
  Roommate
} from "./types"

function expenseTotal(items: Item[]) {
  return items
    .filter(item => item.type === "expense")
    .reduce((sum, item) => sum + item.cost, 0)
}

export function calculateAllocation(
  roommates: Roommate[],
  items: Item[],
  preferences: Preferences
): Allocation {
  const allocation = Object.fromEntries(
    roommates.map(roommate => [
      roommate.id,
      []
    ])
  ) as Allocation

  const lastAssigned = new Map<number, number>()

  roommates.forEach(roommate => {
    lastAssigned.set(roommate.id, -1)
  })

  items.forEach((item, itemIndex) => {
    const scores = roommates.map(roommate => {
      const assigned =
        allocation[roommate.id]

      const preference = Number(
        preferences[roommate.id]?.[
          item.id
        ] ?? 0
      )

      return {
        roommate,
        preference,
        count: assigned.length,
        expenses: expenseTotal(assigned),
        score:
          preference -
          assigned.length * 10,
        lastAssigned:
          lastAssigned.get(
            roommate.id
          ) ?? -1
      }
    })

    const bestScore = Math.max(
      ...scores.map(value => value.score)
    )

    const scoreTies = scores.filter(
      value => value.score === bestScore
    )

    const fewestItems = Math.min(
      ...scoreTies.map(
        value => value.count
      )
    )

    const itemTies = scoreTies.filter(
      value => value.count === fewestItems
    )

    const lowestExpenses = Math.min(
      ...itemTies.map(
        value => value.expenses
      )
    )

    const expenseTies = itemTies.filter(
      value =>
        value.expenses === lowestExpenses
    )

    const winner = expenseTies.reduce(
      (best, current) =>
        current.lastAssigned <
        best.lastAssigned
          ? current
          : best
    )

    allocation[winner.roommate.id].push(
      item
    )

    lastAssigned.set(
      winner.roommate.id,
      itemIndex
    )
  })

  return allocation
}

export function calculateExpenseShares(
  roommates: Roommate[],
  allocation: Allocation
): ExpenseShare {
  const shares = Object.fromEntries(
    roommates.map(roommate => [
      roommate.id,
      0
    ])
  ) as ExpenseShare

  roommates.forEach(roommate => {
    shares[roommate.id] =
      allocation[roommate.id]
        .filter(
          item => item.type === "expense"
        )
        .reduce(
          (sum, item) =>
            sum + item.cost,
          0
        )
  })

  return shares
}