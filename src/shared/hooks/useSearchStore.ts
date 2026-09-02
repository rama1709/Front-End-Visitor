import { create } from 'zustand'

interface SearchState {
  query: string
  setQuery: (query: string) => void
  clear: () => void
}

/**
 * Holds the value typed into the header search bar. Individual pages read
 * `query` and filter whatever data set is relevant to them (visitors,
 * employees, appointments, reports, ...), so the same input works
 * contextually across the app.
 */
export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  setQuery: (query) => set({ query }),
  clear: () => set({ query: '' }),
}))
