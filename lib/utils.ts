import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'
import { Todo, Todos } from './zod'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

/**
 * Lexigraphical Rank
 *
 * Below are functions to generate a rank string between 2 other rank strings.
 * This allows us to reorder items in a list and only perform 1 database update.
 *
 * Inspired by Jira's rank system
 *
 * Assumptions:
 * - The rank string is a string of lowercase chars
 * - The number of reorders is finite
 * - The number of items in the list is finite
 */

const RANK_INCREMENT = 4
const RANK_DECREMENT = 0 - 4
const RANK_LOWER_BOUND = 97
const RANK_UPPER_BOUND = 122
const RANK_MIDDLE = 109

function getSurroundingElements(array: Todos, id: string): [Todo | undefined, Todo | undefined] {
	const index = array.findIndex((item) => item.id === id)

	const previous = array[index - 1]
	const next = array[index + 1]
	return [previous, next]
}

function stringToChars(str: string): Uint8Array {
	return new TextEncoder().encode(str)
}

function charsToString(number: Uint8Array): string {
	return new TextDecoder().decode(number)
}

// Based of a existing rank array, and and dif, generate new rank
function getRank(arr: Uint8Array, dif: number): Uint8Array {
	const n = arr[arr.length - 1] + dif

	const newArr = Array.from(arr)

	if (dif === 0) {
		newArr.push(RANK_MIDDLE)
		return new Uint8Array(newArr)
	}

	if (n <= RANK_LOWER_BOUND) {
		newArr[arr.length - 1] = RANK_LOWER_BOUND
		newArr.push(RANK_MIDDLE - 1)
	} else if (n > RANK_UPPER_BOUND) {
		newArr[arr.length - 1] = RANK_UPPER_BOUND
		newArr.push(RANK_MIDDLE + 1)
	} else {
		newArr[arr.length - 1] = n
	}
	return new Uint8Array(newArr)
}

// Generates a rank between 2 elements
function getRankBetween([previous, next]: [Todo | undefined, Todo | undefined]): string {
	const prevRankStr = previous?.sort_rank
	const nextRankStr = next?.sort_rank
	if (!prevRankStr && !nextRankStr) {
		//only item in list
		return 'm'
	} else if (!nextRankStr && prevRankStr) {
		// last item in list
		const previousRankNumber = stringToChars(prevRankStr)
		let newRank = getRank(previousRankNumber, RANK_INCREMENT)
		return charsToString(newRank)
	} else if (!prevRankStr && nextRankStr) {
		// first item in list
		const nextRankNumber = stringToChars(nextRankStr)
		let newRank = getRank(nextRankNumber, RANK_DECREMENT)
		return charsToString(newRank)
	} else {
		// Between 2 exisiting items
		const prevRankArr = stringToChars(prevRankStr!)
		const nextRankArr = stringToChars(nextRankStr!)

		const prevRankLastElem = prevRankArr[prevRankArr.length - 1]
		const nextRankLastElem = nextRankArr[nextRankArr.length - 1]

		if (prevRankArr.length === nextRankArr.length) {
			// same number of chars, so we can just find the middle
			const middleRank = Math.round((nextRankLastElem + prevRankLastElem) / 2)

			if (middleRank === nextRankLastElem) {
				// handles case where there is a dif, but would end up being the same as the next rank
				return charsToString(getRank(prevRankArr, 0))
			}
			return charsToString(getRank(prevRankArr, middleRank - prevRankLastElem))
		} else if (prevRankArr.length > nextRankArr.length) {
			// prevRank is longer than nextRank, so we need to base off prevRank
			return charsToString(getRank(prevRankArr, RANK_INCREMENT))
		} else {
			// nextRank is longer than prevRank, so we need to base off nextRank
			return charsToString(getRank(nextRankArr, RANK_DECREMENT))
		}
	}
}

// generates a new rank
export function calcNewRank(todos: Todos, id: string): string {
	const newRank = getRankBetween(getSurroundingElements(todos, id))
	return newRank
}

export function getTitle(str: string) {
	return str.split('$')[0]
}

export function getTags(str: string) {
	const tags = str.split('$')
	return tags.slice(1)
}

export enum OS {
	Windows = 'Windows',
	MacOS = 'MacOS',
	UNIX = 'UNIX',
	Linux = 'Linux',
	Unknown = 'Unknown',
}

export function os(): OS {
	if (typeof window === 'undefined') return OS.Unknown
	let os = window.navigator.userAgent

	if (os.search('Windows') !== -1) {
		return OS.Windows
	} else if (os.search('Mac') !== -1) {
		return OS.MacOS
	} else if (os.search('X11') !== -1 && !(os.search('Linux') !== -1)) {
		return OS.UNIX
	} else if (os.search('Linux') !== -1 && os.search('X11') !== -1) {
		return OS.Linux
	} else {
		return OS.Unknown
	}
}
