import "./App.css"
import { useEffect, useState } from "react"
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
import {
  deleteSavedSplit,
  loadSplit,
  saveSplit
} from "./storage"
import {
  Items,
  PreferencesPanel,
  Results,
  Roommates
} from "./components.tsx"

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

  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [name, setName] = useState("")
  const [itemName, setItemName] = useState("")
  const [type, setType] =
    useState<"chore" | "expense">("chore")
  const [cost, setCost] = useState("")

  useEffect(() => {
    const saved = loadSplit()
    if (!saved) return

    setRoommates(saved.roommates)
    setItems(saved.items)
    setPreferences(saved.preferences)
  }, [])

  const clearResult = () => {
    setAllocation(null)
    setExpenseShares(null)
  }

  function addRoommate() {
    if (!name.trim()) return

    setRoommates([
      ...roommates,
      { id: Date.now(), name: name.trim() }
    ])

    setName("")
    clearResult()
  }

  function removeRoommate(id: number) {
    setRoommates(
      roommates.filter(r => r.id !== id)
    )

    const next = { ...preferences }
    delete next[id]

    setPreferences(next)
    clearResult()
  }

  function addItem() {
    if (!itemName.trim()) return

    if (
      type === "expense" &&
      (!cost || Number(cost) <= 0)
    ) {
      setError("Enter a valid expense amount.")
      return
    }

    setItems([
      ...items,
      {
        id: Date.now(),
        label: itemName.trim(),
        type,
        cost: type === "expense" ? Number(cost) : 0
      }
    ])

    setItemName("")
    setCost("")
    setError("")
    clearResult()
  }

  function removeItem(id: number) {
    setItems(items.filter(item => item.id !== id))

    const next = { ...preferences }

    roommates.forEach(roommate => {
      if (next[roommate.id]) {
        delete next[roommate.id][id]
      }
    })

    setPreferences(next)
    clearResult()
  }

  function updatePreference(
    roommateId: number,
    itemId: number,
    value: string
  ) {
    if (value !== "" &&
        (Number(value) < 0 ||
          Number(value) > 100)) {
      return
    }

    setPreferences({
      ...preferences,
      [roommateId]: {
        ...preferences[roommateId],
        [itemId]: value
      }
    })

    clearResult()
  }

  function total(id: number) {
    return Object.values(
      preferences[id] || {}
    ).reduce(
      (sum, value) =>
        sum + (Number(value) || 0),
      0
    )
  }

  function calculate() {
    const validation = validateSplit(
      roommates,
      items,
      preferences
    )

    if (validation) {
      setError(validation)
      clearResult()
      return
    }

    const result = calculateAllocation(
      roommates,
      items,
      preferences
    )

    setError("")
    setAllocation(result)
    setExpenseShares(
      calculateExpenseShares(
        roommates,
        result
      )
    )
  }

  function save() {
    if (!roommates.length || !items.length) {
      setMessage("Add roommates and items first.")
      return
    }

    saveSplit(
      roommates,
      items,
      preferences
    )

    setMessage("Split saved.")
  }

  function load() {
    const saved = loadSplit()

    if (!saved) {
      setMessage("No saved split found.")
      return
    }

    setRoommates(saved.roommates)
    setItems(saved.items)
    setPreferences(saved.preferences)
    clearResult()
    setMessage("Saved split loaded.")
  }

  function removeSaved() {
    deleteSavedSplit()
    setMessage("Saved split deleted.")
  }

  return (
    <main>
      <header>
        <p>Splitzy</p>
        <h1>Who's splitting?</h1>

        <div className="input-row">
          <button onClick={save}>Save split</button>
          <button onClick={load}>Load saved</button>
          <button onClick={removeSaved}>
            Delete saved
          </button>
        </div>

        {message && (
          <p className="hint">{message}</p>
        )}
      </header>

      <Roommates
        roommates={roommates}
        name={name}
        setName={setName}
        add={addRoommate}
        remove={removeRoommate}
      />

      <Items
        items={items}
        itemName={itemName}
        type={type}
        cost={cost}
        error={error}
        setItemName={setItemName}
        setType={setType}
        setCost={setCost}
        add={addItem}
        remove={removeItem}
      />

      {roommates.length > 0 &&
        items.length > 0 && (
          <PreferencesPanel
            roommates={roommates}
            items={items}
            preferences={preferences}
            update={updatePreference}
            total={total}
            calculate={calculate}
          />
        )}

      {allocation && expenseShares && (
        <Results
          roommates={roommates}
          allocation={allocation}
          preferences={preferences}
          expenseShares={expenseShares}
        />
      )}
    </main>
  )
}

export default App