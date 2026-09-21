export type Roommate = {
  id: number
  name: string
}

export type Item = {
  id: number
  label: string
  type: "chore" | "expense"
  cost: number
}

export type Preferences = Record<
  number,
  Record<number, number | string>
>

export type Allocation = Record<number, Item[]>

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