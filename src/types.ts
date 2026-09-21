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