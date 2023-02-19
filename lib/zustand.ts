import { create } from 'zustand'
import { getTags } from './utils'
import { Todos } from './zod'

export type FilterType = 'tag' | 'search'

export type Filter = {
	type: FilterType
	value: string
}

type ListStore = {
	items: Todos
	update: (fn: (items: Todos) => Todos) => void
	loadingTodos: boolean
	setLoadingTodos: (loading: boolean) => void
	selected: number
	setSelected: (id: number | ((n: number) => number)) => void
	filters: Filter[]
	setFilters: (fn: (items: Filter[]) => Filter[]) => void
}

export const useListStore = create<ListStore>()((set, get) => ({
	items: [],
	update: (fn) => set(({ items }) => ({ items: fn(items) })),
	loadingTodos: false,
	setLoadingTodos: (loading) => set({ loadingTodos: loading }),
	selected: 0,
	setSelected: (id) =>
		set(({ selected }) => ({ selected: typeof id === 'function' ? id(selected) : id })),
	filters: [],
	setFilters: (fn) => set(({ filters }) => ({ filters: fn(filters) })),
}))

type DragStore = {
	dragging: boolean
	setDragging: (dragging: boolean) => void
	lastDragged: string
	setLastDragged: (id: string) => void
}

export const useDragStore = create<DragStore>()((set) => ({
	dragging: false,
	setDragging: (dragging) => set({ dragging }),
	lastDragged: '',
	setLastDragged: (id) => set({ lastDragged: id }),
}))
