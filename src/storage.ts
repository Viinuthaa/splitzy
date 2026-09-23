import type {
  Item,
  Preferences,
  Roommate
} from "./types"

export type SavedSplit = {
  roommates: Roommate[]
  items: Item[]
  preferences: Preferences
}

const STORAGE_KEY = "splitzy-saved-split"

export function saveSplit(
  roommates: Roommate[],
  items: Item[],
  preferences: Preferences
) {
  const split: SavedSplit = {
    roommates,
    items,
    preferences
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(split)
  )
}

export function loadSplit(): SavedSplit | null {
  const saved =
    localStorage.getItem(STORAGE_KEY)

  if (!saved) return null

  try {
    return JSON.parse(saved)
  } catch {
    return null
  }
}

export function deleteSavedSplit() {
  localStorage.removeItem(STORAGE_KEY)
}