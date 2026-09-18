import './App.css'
import { useState } from 'react'

function App() {
  const [roommates, setRoommates] = useState([])
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [itemName, setItemName] = useState('')
  const [type, setType] = useState('chore')
  const [cost, setCost] = useState('')

  function addRoommate() {
    if (!name.trim()) return

    setRoommates([
      ...roommates,
      { id: Date.now(), name: name.trim() }
    ])
    setName('')
  }

  function removeRoommate(id) {
    setRoommates(roommates.filter(roommate => roommate.id !== id))
  }

  function addItem() {
    if (!itemName.trim()) return

    setItems([
      ...items,
      {
        id: Date.now(),
        label: itemName.trim(),
        type,
        cost: type === 'expense' ? Number(cost) : 0
      }
    ])

    setItemName('')
    setCost('')
  }

  function removeItem(id) {
    setItems(items.filter(item => item.id !== id))
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
    </main>
  )
}

export default App