import './App.css'
import { useState } from 'react'

function App() {
  const [roommates, setRoommates] = useState([])
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [itemName, setItemName] = useState('')
  const [type, setType] = useState('chore')
  const [cost, setCost] = useState('')
  const [preferences, setPreferences] = useState({})

  function addRoommate() {
    if (!name.trim()) return

    const roommate = { id: Date.now(), name: name.trim() }

    setRoommates([...roommates, roommate])
    setPreferences({
      ...preferences,
      [roommate.id]: {}
    })
    setName('')
  }

  function removeRoommate(id) {
    setRoommates(roommates.filter(roommate => roommate.id !== id))

    const updated = { ...preferences }
    delete updated[id]
    setPreferences(updated)
  }

  function addItem() {
    if (!itemName.trim()) return

    const item = {
      id: Date.now(),
      label: itemName.trim(),
      type,
      cost: type === 'expense' ? Number(cost) : 0
    }

    setItems([...items, item])
    setItemName('')
    setCost('')
  }

  function removeItem(id) {
    setItems(items.filter(item => item.id !== id))
  }

  function updatePreference(roommateId, itemId, value) {
    setPreferences({
      ...preferences,
      [roommateId]: {
        ...preferences[roommateId],
        [itemId]: Number(value)
      }
    })
  }

  function getTotal(roommateId) {
    const values = preferences[roommateId] || {}
    return Object.values(values).reduce((sum, value) => sum + value, 0)
  }

  return (
    <main>
      <p>Splitzy</p>
      <h1>Set up your split</h1>

      <section>
        <h2>Roommates</h2>

        <div className="input-row">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Roommate name"
          />
          <button onClick={addRoommate}>Add</button>
        </div>

        {roommates.map(roommate => (
          <div className="entry" key={roommate.id}>
            <span>{roommate.name}</span>
            <button onClick={() => removeRoommate(roommate.id)}>×</button>
          </div>
        ))}
      </section>

      <section>
        <h2>Chores & expenses</h2>

        <div className="input-row">
          <input
            value={itemName}
            onChange={e => setItemName(e.target.value)}
            placeholder="Item name"
          />

          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="chore">Chore</option>
            <option value="expense">Expense</option>
          </select>

          {type === 'expense' && (
            <input
              type="number"
              value={cost}
              onChange={e => setCost(e.target.value)}
              placeholder="₹"
            />
          )}

          <button onClick={addItem}>Add</button>
        </div>

        {items.map(item => (
          <div className="entry" key={item.id}>
            <span>
              {item.label}
              {item.type === 'expense' && ` — ₹${item.cost}`}
            </span>
            <button onClick={() => removeItem(item.id)}>×</button>
          </div>
        ))}
      </section>

      {roommates.length > 0 && items.length > 0 && (
        <section>
          <h2>Set your preferences</h2>

          {roommates.map(roommate => (
            <div className="preference-card" key={roommate.id}>
              <h3>{roommate.name}</h3>

              {items.map(item => (
                <label className="preference" key={item.id}>
                  <span>{item.label}</span>

                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={preferences[roommate.id]?.[item.id] || ''}
                    onChange={e =>
                      updatePreference(
                        roommate.id,
                        item.id,
                        e.target.value
                      )
                    }
                  />
                </label>
              ))}

              <strong>
                Total: {getTotal(roommate.id)} / 100
              </strong>
            </div>
          ))}
        </section>
      )}
    </main>
  )
}

export default App