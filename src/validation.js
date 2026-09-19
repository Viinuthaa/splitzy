export function validateSplit(roommates, items, preferences) {
  if (roommates.length < 2) {
    return 'Add at least two roommates.'
  }

  if (items.length < 1) {
    return 'Add at least one chore or expense.'
  }

  for (const roommate of roommates) {
    const values = Object.values(preferences[roommate.id] || {})

    if (values.some(value => value < 0 || value > 100)) {
      return `${roommate.name} has an invalid preference value.`
    }

    const total = values.reduce(
      (sum, value) => sum + (Number(value) || 0),
      0
    )

    if (total !== 100) {
      return `${roommate.name}'s preferences must total 100.`
    }
  }

  return ''
}