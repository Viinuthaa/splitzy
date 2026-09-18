import './App.css'
import { useState } from 'react'

function App() {
  const [roommates, setRoommates] = useState([])

  function addRoommate() {
    setRoommates([...roommates, `Roommate ${roommates.length + 1}`])
  }

  function removeRoommate(index) {
    setRoommates(roommates.filter((_, i) => i !== index))
  }

  return (
    <main>
      <p>Splitzy</p>
      <h1>Who's splitting?</h1>

      <section>
        {roommates.map((roommate, index) => (
          <div className="roommate" key={index}>
            <span>{roommate}</span>
            <button onClick={() => removeRoommate(index)}>×</button>
          </div>
        ))}

        <button className="add" onClick={addRoommate}>
          + Add roommate
        </button>
      </section>

      {roommates.length >= 2 && (
        <button className="continue">Continue →</button>
      )}
    </main>
  )
}

export default App