import "./App.css"
import { useState } from "react"
import {
  calculateAllocation,
  calculateExpenseShares
} from "./allocation"
import type {
  Allocation,
  ExpenseShare,
  Item,
  Preferences,
  Roommate
} from "./types"
import { validateSplit } from "./validation"

function App() {
  const [roommates, setRoommates] =
    useState<Roommate[]>([])

  const [items, setItems] =
    useState<Item[]>([])

  const [preferences, setPreferences] =
    useState<Preferences>({})

  const [allocation, setAllocation] =
    useState<Allocation | null>(null)

  const [expenseShares, setExpenseShares] =
    useState<ExpenseShare | null>(null)

  const [error, setError] =
    useState("")

  const [name, setName] =
    useState("")

  const [itemName, setItemName] =
    useState("")

  const [type, setType] =
    useState<"chore" | "expense">("chore")

  const [cost, setCost] =
    useState("")

  function addRoommate() {
    if (!name.trim()) return

    setRoommates([
      ...roommates,
      {
        id: Date.now(),
        name: name.trim()
      }
    ])

    setName("")
    setAllocation(null)
    setExpenseShares(null)
  }

  function removeRoommate(id: number) {
    setRoommates(
      roommates.filter(
        roommate => roommate.id !== id
      )
    )

    const updated = {
      ...preferences
    }

    delete updated[id]

    setPreferences(updated)
    setAllocation(null)
    setExpenseShares(null)
  }

  function addItem() {
    if (!itemName.trim()) return

    if (
      type === "expense" &&
      (!cost || Number(cost) <= 0)
    ) {
      setError(
        "Enter a valid expense amount."
      )
      return
    }

    setItems([
      ...items,
      {
        id: Date.now(),
        label: itemName.trim(),
        type,
        cost:
          type === "expense"
            ? Number(cost)
            : 0
      }
    ])

    setItemName("")
    setCost("")
    setError("")
    setAllocation(null)
    setExpenseShares(null)
  }

  function removeItem(id: number) {
    setItems(
      items.filter(item => item.id !== id)
    )

    const updated = {
      ...preferences
    }

    roommates.forEach(roommate => {
      if (updated[roommate.id]) {
        delete updated[roommate.id][id]
      }
    })

    setPreferences(updated)
    setAllocation(null)
    setExpenseShares(null)
  }

  function updatePreference(
    roommateId: number,
    itemId: number,
    value: string
  ) {
    if (value === "") {
      setPreferences({
        ...preferences,
        [roommateId]: {
          ...preferences[roommateId],
          [itemId]: ""
        }
      })

      setAllocation(null)
      setExpenseShares(null)
      return
    }

    const number = Number(value)

    if (number < 0 || number > 100) {
      return
    }

    setPreferences({
      ...preferences,
      [roommateId]: {
        ...preferences[roommateId],
        [itemId]: number
      }
    })

    setAllocation(null)
    setExpenseShares(null)
  }

  function getTotal(id: number) {
    return Object.values(
      preferences[id] || {}
    ).reduce(
      (sum, value) =>
        sum + (Number(value) || 0),
      0
    )
  }

  function calculate() {
    const message = validateSplit(
      roommates,
      items,
      preferences
    )

    if (message) {
      setError(message)
      setAllocation(null)
      setExpenseShares(null)
      return
    }

    const result =
      calculateAllocation(
        roommates,
        items,
        preferences
      )

    setError("")
    setAllocation(result)

    setExpenseShares(
      calculateExpenseShares(
        roommates,
        items,
        result
      )
    )
  }

  const totalExpenses =
    items
      .filter(
        item => item.type === "expense"
      )
      .reduce(
        (sum, item) => sum + item.cost,
        0
      )

  return (
    <main>
      <header>
        <p>Splitzy</p>
        <h1>Who's splitting?</h1>
      </header>

      <section>
        <h2>Roommates</h2>

        <div className="input-row">
          <input
            value={name}
            onChange={e =>
              setName(e.target.value)
            }
            placeholder="Roommate name"
          />

          <button onClick={addRoommate}>
            Add
          </button>
        </div>

        {roommates.map(roommate => (
          <div
            className="entry"
            key={roommate.id}
          >
            <span>
              {roommate.name}
            </span>

            <button
              onClick={() =>
                removeRoommate(
                  roommate.id
                )
              }
            >
              ×
            </button>
          </div>
        ))}
      </section>

      <section>
        <h2>Chores & expenses</h2>

        <div className="input-row">
          <input
            value={itemName}
            onChange={e =>
              setItemName(e.target.value)
            }
            placeholder="Cleaning, groceries..."
          />

          <select
            value={type}
            onChange={e => {
              setType(
                e.target.value as
                  | "chore"
                  | "expense"
              )
              setError("")
            }}
          >
            <option value="chore">
              Chore
            </option>

            <option value="expense">
              Expense
            </option>
          </select>

          {type === "expense" && (
            <input
              type="number"
              min="0"
              value={cost}
              onChange={e =>
                setCost(e.target.value)
              }
              placeholder="₹"
            />
          )}

          <button onClick={addItem}>
            Add
          </button>
        </div>

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        {items.map(item => (
          <div
            className="entry"
            key={item.id}
          >
            <span>
              {item.label}

              {item.type === "expense" &&
                ` — ₹${item.cost}`}
            </span>

            <button
              onClick={() =>
                removeItem(item.id)
              }
            >
              ×
            </button>
          </div>
        ))}
      </section>

      {roommates.length > 0 &&
        items.length > 0 && (
          <section>
            <h2>Preferences</h2>

            {roommates.map(roommate => {
              const total =
                getTotal(roommate.id)

              return (
                <div
                  className="preference-card"
                  key={roommate.id}
                >
                  <h3>
                    {roommate.name}
                  </h3>

                  {items.map(item => (
                    <div
                      className="preference"
                      key={item.id}
                    >
                      <span>
                        {item.label}
                      </span>

                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={
                          preferences[
                            roommate.id
                          ]?.[item.id] ?? ""
                        }
                        onChange={e =>
                          updatePreference(
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
                      total === 100
                        ? "total-valid"
                        : "total-invalid"
                    }
                  >
                    Total: {total}/100
                  </strong>

                  {total > 100 && (
                    <p className="error">
                      Preferences exceed 100.
                    </p>
                  )}

                  {total < 100 && (
                    <p className="hint">
                      Add {100 - total} more
                      points.
                    </p>
                  )}
                </div>
              )
            })}

            <button onClick={calculate}>
              Calculate split →
            </button>
          </section>
        )}

      {allocation && (
        <section className="results">
          <h2>Your Split</h2>

          {totalExpenses > 0 && (
            <p className="hint">
              Total expenses: ₹
              {totalExpenses}
            </p>
          )}

          {roommates.map(roommate => (
            <div
              className="result"
              key={roommate.id}
            >
              <h3>
                {roommate.name}
              </h3>

              {allocation[
                roommate.id
              ].map(item => (
                <div
                  className="result-item"
                  key={item.id}
                >
                  <span>
                    {item.label}
                  </span>

                  <small>
                    Preference:{" "}
                    {
                      preferences[
                        roommate.id
                      ][item.id]
                    }

                    {item.type ===
                      "expense" &&
                      ` · ₹${item.cost}`}
                  </small>
                </div>
              ))}

              {expenseShares && (
                <strong>
                  Expense share: ₹
                  {expenseShares[
                    roommate.id
                  ].toFixed(2)}
                </strong>
              )}
            </div>
          ))}
        </section>
      )}
    </main>
  )
}

export default App