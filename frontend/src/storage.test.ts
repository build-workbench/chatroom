import assert from 'node:assert/strict'
import { beforeEach, describe, it } from 'node:test'

import { clearAuth, loadAuth, saveTokens, saveUser, setLastRoomId } from './storage'
import type { User } from './types'

type StorageValue = string | null

class MemoryStorage implements Storage {
	private readonly data = new Map<string, string>()

	get length(): number {
		return this.data.size
	}

	clear(): void {
		this.data.clear()
	}

	getItem(key: string): StorageValue {
		return this.data.has(key) ? this.data.get(key) ?? null : null
	}

	key(index: number): StorageValue {
		return Array.from(this.data.keys())[index] ?? null
	}

	removeItem(key: string): void {
		this.data.delete(key)
	}

	setItem(key: string, value: string): void {
		this.data.set(key, value)
	}
}

beforeEach(() => {
	Object.defineProperty(globalThis, 'localStorage', {
		value: new MemoryStorage(),
		configurable: true,
		writable: true,
	})
})

describe('storage', () => {
	describe('loadAuth', () => {
		it('returns empty values when nothing is stored', () => {
			const auth = loadAuth()
			assert.equal(auth.accessToken, '')
			assert.equal(auth.refreshToken, '')
			assert.equal(auth.user, null)
			assert.equal(auth.lastRoomId, null)
		})

		it('returns stored tokens', () => {
			localStorage.setItem('chat_access', 'test-access')
			localStorage.setItem('chat_refresh', 'test-refresh')

			const auth = loadAuth()
			assert.equal(auth.accessToken, 'test-access')
			assert.equal(auth.refreshToken, 'test-refresh')
		})

		it('returns stored user', () => {
			const user: User = { id: 1, username: 'testuser' }
			localStorage.setItem('chat_user', JSON.stringify(user))

			const auth = loadAuth()
			assert.deepEqual(auth.user, user)
		})

		it('handles invalid user json', () => {
			localStorage.setItem('chat_user', 'invalid-json')

			const auth = loadAuth()
			assert.equal(auth.user, null)
		})

		it('returns stored last room id', () => {
			localStorage.setItem('chat_last_room', '42')

			const auth = loadAuth()
			assert.equal(auth.lastRoomId, 42)
		})

		it('returns null for invalid last room id', () => {
			localStorage.setItem('chat_last_room', 'invalid')

			const auth = loadAuth()
			assert.equal(auth.lastRoomId, null)
		})
	})

	describe('saveTokens', () => {
		it('stores both tokens', () => {
			saveTokens('access-123', 'refresh-456')

			assert.equal(localStorage.getItem('chat_access'), 'access-123')
			assert.equal(localStorage.getItem('chat_refresh'), 'refresh-456')
		})

		it('overwrites existing tokens', () => {
			saveTokens('old-access', 'old-refresh')
			saveTokens('new-access', 'new-refresh')

			assert.equal(localStorage.getItem('chat_access'), 'new-access')
			assert.equal(localStorage.getItem('chat_refresh'), 'new-refresh')
		})
	})

	describe('saveUser', () => {
		it('stores user as json', () => {
			const user: User = { id: 1, username: 'alice' }
			saveUser(user)

			assert.equal(localStorage.getItem('chat_user'), JSON.stringify(user))
		})

		it('removes user when null', () => {
			const user: User = { id: 1, username: 'alice' }
			saveUser(user)
			saveUser(null)

			assert.equal(localStorage.getItem('chat_user'), null)
		})
	})

	describe('setLastRoomId', () => {
		it('stores room id', () => {
			setLastRoomId(42)
			assert.equal(localStorage.getItem('chat_last_room'), '42')
		})

		it('removes room id when null', () => {
			setLastRoomId(42)
			setLastRoomId(null)
			assert.equal(localStorage.getItem('chat_last_room'), null)
		})

		it('removes room id when zero or negative', () => {
			setLastRoomId(42)
			setLastRoomId(0)
			assert.equal(localStorage.getItem('chat_last_room'), null)
		})
	})

	describe('clearAuth', () => {
		it('removes all auth data', () => {
			saveTokens('access', 'refresh')
			saveUser({ id: 1, username: 'test' })
			setLastRoomId(42)

			clearAuth()

			const auth = loadAuth()
			assert.equal(auth.accessToken, '')
			assert.equal(auth.refreshToken, '')
			assert.equal(auth.user, null)
			assert.equal(auth.lastRoomId, null)
		})
	})
})
