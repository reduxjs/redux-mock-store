/* eslint max-nested-callbacks: "off" */
/* eslint @typescript-eslint/no-var-requires: "off" */
/* eslint @typescript-eslint/no-unused-vars: "off" */
import { Store, Action } from 'redux'
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk'

import configureMockStore from '.'

const mockStore = configureMockStore()

describe('@jedmao/redux-mock-store', () => {
	it('exports a default function named "configureMockStore"', () => {
		expect(typeof configureMockStore).toBe('function')
		expect(configureMockStore.name).toBe('configureMockStore')
	})

	it('exports a cjs module with a circular default prop', () => {
		const cjs = require('.')
		expect(cjs).toBe(configureMockStore)
		expect(cjs.default).toBe(cjs)
		expect(cjs.default.default).toBe(cjs)
	})

	describe('getState', () => {
		describe('function scenario', () => {
			it('returns the result of getState()', () => {
				const store = mockStore(() => 42)

				expect(store.getState()).toBe(42)
			})

			it('is called with actions', () => {
				const action = { type: 'ADD_ITEM' }
				const getState = jest.fn()
				const store = mockStore(getState)

				store.dispatch(action)
				store.getState()

				expect(getState).toHaveBeenCalledWith([action])
				expect(getState).toHaveBeenCalledWith(store.getActions())
			})
		})

		describe('non-function scenario', () => {
			it('returns the initial state', () => {
				const initialState = {}

				const store = mockStore(initialState)

				expect(store.getState()).toBe(initialState)
			})
		})
	})

	describe('dispatch', () => {
		it('throws when action is undefined', () => {
			const store = mockStore()

			expect(() => {
				store.dispatch(undefined)
			}).toThrow(
				'Actions must be plain objects. ' +
					'Use custom middleware for async actions.',
			)
		})

		it('throws when action is a function', () => {
			const store = mockStore()

			expect(() => {
				store.dispatch((() => {}) as any)
			}).toThrow(
				'Actions must be plain objects. ' +
					'Use custom middleware for async actions.',
			)
		})

		it('throws when action.type is undefined', () => {
			const action = { types: 'ADD_ITEM' }
			const store = mockStore()

			expect(() => {
				store.dispatch(action as any)
			}).toThrow(
				'Actions may not have an undefined "type" property. ' +
					'Have you misspelled a constant? ' +
					'Action: ' +
					'{"types":"ADD_ITEM"}',
			)
		})

		it('returns dispatched action if no errors thrown', () => {
			const action = { type: 'ADD_ITEM' }
			const store = mockStore()

			store.dispatch(action)

			const [first] = store.getActions()
			expect(first).toBe(action)
		})

		it('stores 2 dispatched actions', () => {
			const store = mockStore()
			const actions = [{ type: 'ADD_ITEM' }, { type: 'REMOVE_ITEM' }]

			store.dispatch(actions[0])
			store.dispatch(actions[1])

			expect(store.getActions()).toEqual(actions)
		})
	})

	describe('clearActions', () => {
		it('clears actions', () => {
			const action = { type: 'ADD_ITEM' }
			const store = mockStore()

			store.dispatch(action)
			expect(store.getActions()).toEqual([action])

			store.clearActions()
			expect(store.getActions()).toEqual([])
		})
	})

	describe('subscribe', () => {
		it('subscribes to dispatched actions', done => {
			const store = mockStore()
			const action = { type: 'ADD_ITEM' }

			store.subscribe(a => {
				expect(store.getActions()[0]).toEqual(action)
				expect(action).toBe(a)
				done()
			})
			store.dispatch(action)
		})

		it('returns an unsubscribe function that unsubscribes all subscribers', done => {
			const store = mockStore()
			const action = { type: 'ADD_ITEM' }
			const timeoutId = setTimeout(done, 10000)
			const unsubscribe = store.subscribe(() => {
				throw new Error('should never be called')
			})

			try {
				unsubscribe()
				store.dispatch(action)
				done()
			} catch (err) {
				done.fail(err)
			} finally {
				clearTimeout(timeoutId)
			}
		})

		it('does not throw subsequent unsubscribe calls', () => {
			const store = mockStore()
			const unsubscribe = store.subscribe(() => {})

			unsubscribe()

			expect(unsubscribe).not.toThrow()
		})

		it('throws if non-function passed as a listener', () => {
			const store = mockStore()

			expect(() => store.subscribe(42 as any)).toThrow(
				'Listener must be a function.',
			)
		})
	})

	describe('replaceReducer', () => {
		it('throws', () => {
			const store = mockStore()

			expect(() => store.replaceReducer(state => state)).toThrow(
				'Cannot replace reducer in a mock store. ' +
					'Try supplying a function to getStore instead.',
			)
		})
	})

	describe('a store with a redux-thunk middleware', () => {
		const mockStoreWithMiddleware = configureMockStore<
			any,
			any,
			ThunkDispatch<any, any, any>
		>([thunk])
		it('handles async actions', done => {
			const store = mockStoreWithMiddleware()
			const increment = { type: 'INCREMENT_COUNTER' }

			store.dispatch<Promise<void>>(incrementAsync()).then(() => {
				expect(store.getActions()[0]).toEqual(increment)
				done()
			})

			function incrementAsync(): ThunkAction<Promise<void>, any, any, any> {
				return async dispatch => {
					dispatch(increment)
				}
			}
		})

		it('handles errors thrown in test function', async () => {
			const store = mockStoreWithMiddleware()
			const error = { error: 'Something went wrong' }

			expect.assertions(1)

			return expect(
				store.dispatch<Promise<void>>(() => Promise.reject(error)),
			).rejects.toBe(error)
		})

		it('calls the middleware', () => {
			const mockMiddleware = (spy: jest.Mock) => (_store: Store) => (
				next: (action: Action) => void,
			) => (action: Action) => {
				spy()
				return next(action)
			}

			const spy = jest.fn()
			const mockStoreWithCustomMiddleware = configureMockStore([
				mockMiddleware(spy),
			])
			const action = { type: 'ADD_ITEM' }
			const store = mockStoreWithCustomMiddleware()

			store.dispatch(action)

			expect(spy).toHaveBeenCalled()
		})
	})

	describe('TypeScript generics', () => {
		it('allows configuration w/o any types defined', () => {
			const state = { foo: 'bar' }
			const mockStore = configureMockStore()

			const store = mockStore(state)

			expect(store.getState()).toBe(state)
		})

		it('allows providing state type alone', () => {
			const state = { foo: 'bar' }
			const mockStore = configureMockStore<typeof state>()

			const store = mockStore(state)

			expect(store.getState()).toBe(state)
		})

		it('allows providing action type', () => {
			const action: Action<'FOO'> = { type: 'FOO' }
			const mockStore = configureMockStore<any, typeof action>()
			const store = mockStore()

			store.dispatch(action)

			expect(store.getActions()[0]).toBe(action)
		})
	})
})
