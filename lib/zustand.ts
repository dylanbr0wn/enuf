import { create } from 'zustand'
import { Todos } from './zod'

type ListStore = {
	items: Todos
	update: (fn: (items: Todos) => Todos) => void
	loadingTodos: boolean
	setLoadingTodos: (loading: boolean) => void
}

export const useListStore = create<ListStore>()((set) => ({
	items: [],
	update: (fn) => set(({ items }) => ({ items: fn(items) })),
	loadingTodos: false,
	setLoadingTodos: (loading) => set({ loadingTodos: loading }),
}))
