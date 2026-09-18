export function validateSplit(roommates, items, preferences) {
  if (roommates.length < 2) {
    return 'Add at least two roommates.'
  }

  if (items.length < 1) {
    return 'Add at least one chore or expense.'
  }

  for (const roommate of roommates) {
    const total = Object.values(preferences[roommate.id] || {})
      .reduce((sum, value) => sum + value, 0)

    if (total !== 100) {
      return `${roommate.name}'s preferences must total 100.`
    }
  }

  return ''
}