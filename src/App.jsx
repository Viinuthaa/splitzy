import './App.css'
import { useState } from 'react'
import { calculateAllocation } from './allocation'

function App() {
  const [roommates, setRoommates] = useState([])
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [itemName, setItemName] = useState('')
  const [type, setType] = useState('chore')
  const [cost, setCost] = useState('')
  const [preferences, setPreferences] = useState({})
  const [allocation, setAllocation] = useState(null)

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
    setAllocation(null)
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
    setAllocation(null)
  }

  function removeItem(id) {
    setItems(items.filter(item => item.id !== id))
    setAllocation(null)
  }

  function updatePreference(roommateId, itemId, value) {
    setPreferences({
      ...preferences,
      [roommateId]: {
        ...preferences[roommateId],
        [itemId]: Number(value)
      }
    })
    setAllocation(null)
  }

  function getTotal(roommateId) {
    return Object.values(preferences[roommateId] || {})
      .reduce((sum, value) => sum + value, 0)
  }

  function calculate() {
    setAllocation(calculateAllocation(roommates, items, preferences))
  }

  function getAssignedValue(roommateId, item) {
    return preferences[roommateId]?.[item.id] || 0
  }

  function getScores(split) {
    return roommates.map(roommate =>
      split[roommate.id].reduce(
        (sum, item) => sum + getAssignedValue(roommate.id, item),
        0
      )
    )
  }

  function getImbalance(scores) {
    if (!scores.length) return 0
    return Math.max(...scores) - Math.min(...scores)
  }

  function getEqualSplit() {
    const split = {}
    roommates.forEach(roommate => {
      split[roommate.id] = []
    })

    items.forEach((item, index) => {
      const roommate = roommates[index % roommates.length]
      split[roommate.id].push(item)
    })

    return split
  }

  const equalSplit = allocation ? getEqualSplit() : null
  const splitScores = allocation ? getScores(allocation) : []
  const equalScores = equalSplit ? getScores(equalSplit) : []

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

          <button className="calculate" onClick={calculate}>
            Calculate split →
          </button>
        </section>
      )}

      {allocation && (
        <section className="results">
          <p>Your split</p>
          <h2>Suggested allocation</h2>

          {roommates.map(roommate => {
            const assigned = allocation[roommate.id]

            return (
              <div className="result" key={roommate.id}>
                <h3>{roommate.name}</h3>

                {assigned.length === 0 ? (
                  <span>Nothing assigned</span>
                ) : (
                  assigned.map(item => (
                    <div className="result-item" key={item.id}>
                      <span>{item.label}</span>
                      <small>
                        {getAssignedValue(roommate.id, item)} points
                      </small>
                    </div>
                  ))
                )}

                <strong>
                  Assigned preference:{' '}
                  {getScores(allocation)[
                    roommates.findIndex(r => r.id === roommate.id)
                  ]}
                </strong>
              </div>
            )
          })}
        </section>
      )}

      {allocation && (
        <section className="comparison">
          <p>Comparison</p>
          <h2>How balanced is the split?</h2>

          <div className="comparison-box">
            <div>
              <span>Equal split</span>
              <strong>{getImbalance(equalScores)}</strong>
              <small>imbalance</small>
            </div>

            <div>
              <span>Splitzy</span>
              <strong>{getImbalance(splitScores)}</strong>
              <small>imbalance</small>
            </div>
          </div>

          <small>
            Lower imbalance means the assigned preference values are closer
            together.
          </small>
        </section>
      )}
    </main>
  )
}

export default App