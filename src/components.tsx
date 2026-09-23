import type {
  Allocation,
  ExpenseShare,
  Item,
  Preferences,
  Roommate
} from "./types"

type RoommatesProps = {
  roommates: Roommate[]
  name: string
  setName: (value: string) => void
  add: () => void
  remove: (id: number) => void
}

export function Roommates({
  roommates,
  name,
  setName,
  add,
  remove
}: RoommatesProps) {
  return (
    <section>
      <h2>Roommates</h2>

      <div className="input-row">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Roommate name"
        />
        <button onClick={add}>Add</button>
      </div>

      {roommates.map(roommate => (
        <div className="entry" key={roommate.id}>
          <span>{roommate.name}</span>
          <button onClick={() => remove(roommate.id)}>
            ×
          </button>
        </div>
      ))}
    </section>
  )
}

type ItemsProps = {
  items: Item[]
  itemName: string
  type: "chore" | "expense"
  cost: string
  error: string
  setItemName: (value: string) => void
  setType: (value: "chore" | "expense") => void
  setCost: (value: string) => void
  add: () => void
  remove: (id: number) => void
}

export function Items({
  items,
  itemName,
  type,
  cost,
  error,
  setItemName,
  setType,
  setCost,
  add,
  remove
}: ItemsProps) {
  return (
    <section>
      <h2>Chores & expenses</h2>

      <div className="input-row">
        <input
          value={itemName}
          onChange={e => setItemName(e.target.value)}
          placeholder="Cleaning, groceries..."
        />

        <select
          value={type}
          onChange={e =>
            setType(
              e.target.value as "chore" | "expense"
            )
          }
        >
          <option value="chore">Chore</option>
          <option value="expense">Expense</option>
        </select>

        {type === "expense" && (
          <input
            type="number"
            min="0"
            value={cost}
            onChange={e => setCost(e.target.value)}
            placeholder="₹"
          />
        )}

        <button onClick={add}>Add</button>
      </div>

      {error && <p className="error">{error}</p>}

      {items.map(item => (
        <div className="entry" key={item.id}>
          <span>
            {item.label}
            {item.type === "expense" &&
              ` — ₹${item.cost}`}
          </span>

          <button onClick={() => remove(item.id)}>
            ×
          </button>
        </div>
      ))}
    </section>
  )
}

type PreferencesProps = {
  roommates: Roommate[]
  items: Item[]
  preferences: Preferences
  update: (
    roommateId: number,
    itemId: number,
    value: string
  ) => void
  total: (id: number) => number
  calculate: () => void
}

export function PreferencesPanel({
  roommates,
  items,
  preferences,
  update,
  total,
  calculate
}: PreferencesProps) {
  return (
    <section>
      <h2>Preferences</h2>

      {roommates.map(roommate => {
        const value = total(roommate.id)

        return (
          <div
            className="preference-card"
            key={roommate.id}
          >
            <h3>{roommate.name}</h3>

            {items.map(item => (
              <div
                className="preference"
                key={item.id}
              >
                <span>{item.label}</span>

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={
                    preferences[roommate.id]?.[
                      item.id
                    ] ?? ""
                  }
                  onChange={e =>
                    update(
                      roommate.id,
                      item.id,
                      e.target.value
                    )
                  }
                />
              </div>
            ))}

            <strong
              className={
                value === 100
                  ? "total-valid"
                  : "total-invalid"
              }
            >
              Total: {value}/100
            </strong>

            {value < 100 && (
              <p className="hint">
                Add {100 - value} more points.
              </p>
            )}

            {value > 100 && (
              <p className="error">
                Preferences exceed 100.
              </p>
            )}
          </div>
        )
      })}

      <button onClick={calculate}>
        Calculate split →
      </button>
    </section>
  )
}

type ResultsProps = {
  roommates: Roommate[]
  allocation: Allocation
  preferences: Preferences
  expenseShares: ExpenseShare
}

export function Results({
  roommates,
  allocation,
  preferences,
  expenseShares
}: ResultsProps) {
  const totalExpenses = roommates.reduce(
    (sum, roommate) =>
      sum + expenseShares[roommate.id],
    0
  )

  return (
    <section className="results">
      <h2>Your Split</h2>

      <p className="hint">
        Total expenses: ₹{totalExpenses}
      </p>

      {roommates.map(roommate => {
        const items = allocation[roommate.id]

        const chores = items.filter(
          item => item.type === "chore"
        ).length

        const expenses = items.filter(
          item => item.type === "expense"
        ).length

        const preferenceScore =
          items.reduce(
            (sum, item) =>
              sum +
              Number(
                preferences[roommate.id]?.[
                  item.id
                ] ?? 0
              ),
            0
          )

        return (
          <div className="result" key={roommate.id}>
            <h3>{roommate.name}</h3>

            <p className="hint">
              {chores}{" "}
              {chores === 1 ? "chore" : "chores"}
              {" · "}
              {expenses}{" "}
              {expenses === 1
                ? "expense item"
                : "expense items"}
            </p>

            <strong>
              Preference score: {preferenceScore}
            </strong>

            {items.map(item => (
              <div
                className="result-item"
                key={item.id}
              >
                <span>{item.label}</span>

                <small>
                  Preference:{" "}
                  {
                    preferences[
                      roommate.id
                    ][item.id]
                  }

                  {item.type === "expense" &&
                    ` · ₹${item.cost}`}
                </small>
              </div>
            ))}

            <strong>
              Assigned expenses: ₹
              {expenseShares[
                roommate.id
              ].toFixed(2)}
            </strong>
          </div>
        )
      })}
    </section>
  )
}