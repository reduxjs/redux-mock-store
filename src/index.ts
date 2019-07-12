import {
	Action,
	AnyAction,
	applyMiddleware,
	Middleware,
	Observable,
	Reducer,
	Store,
	StoreEnhancerStoreCreator,
	Unsubscribe,
} from 'redux'
import isFunction from 'lodash.isfunction'
import isPlainObject from 'lodash.isplainobject'

/**
 * A mock store for testing Redux async action creators and middleware.
 */
export default function configureMockStore<
	S = any,
	A extends Action = AnyAction,
	DispatchExts extends {} | void = void
>(middlewares: Middleware[] = []): MockStoreCreator<S, A, DispatchExts> {
	return mockStore
	/**
	 * @returns An instance of the configured mock store.
	 * @note Call this function to reset your store after every test.
	 */
	function mockStore(
		getState: S | MockGetState<S> = {} as S,
	): DispatchExts extends void
		? MockStore<S, A>
		: MockStoreEnhanced<S, A, DispatchExts> {
		return applyMiddleware(...middlewares)(
			creator as StoreEnhancerStoreCreator<any, any>,
		)(undefined) as any

		function creator(): MockStore<S, A> {
			let actions: A[] = []
			const listeners: ((action: A) => void)[] = []

			return {
				getState() {
					return isFunction(getState) ? getState(actions) : getState
				},

				getActions() {
					return actions
				},

				clearActions() {
					actions = []
				},

				dispatch<T extends A>(action: T): T {
					if (!isPlainObject(action)) {
						throw new TypeError(
							'Actions must be plain objects. ' +
								'Use custom middleware for async actions.',
						)
					}

					if (typeof action.type === 'undefined') {
						throw new TypeError(
							'Actions may not have an undefined "type" property. ' +
								'Have you misspelled a constant? ' +
								'Action: ' +
								JSON.stringify(action),
						)
					}

					actions.push(action)

					for (const listener of listeners) {
						listener(action)
					}

					return action
				},

				subscribe(listener: (action: A) => void): Unsubscribe {
					if (!isFunction(listener)) {
						throw new TypeError('Listener must be a function.')
					}

					listeners.push(listener)

					return unsubscribe

					function unsubscribe() {
						const index = listeners.indexOf(listener)
						if (index === -1) {
							return
						}

						listeners.splice(index, 1)
					}
				},

				/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
				replaceReducer(_nextReducer: Reducer<S, A>): never {
					throw new Error(
						'Cannot replace reducer in a mock store. ' +
							'Try supplying a function to getStore instead.',
					)
				},

				/* istanbul ignore next */
				[Symbol.observable](): Observable<S> {
					throw new Error('Not implemented')
				},
			}
		}
	}
}

export type MockStoreCreator<
	S = {},
	A extends Action = AnyAction,
	DispatchExts extends {} | void = void
> = (
	state?: S | MockGetState<S>,
) => DispatchExts extends void
	? MockStore<S, A>
	: MockStoreEnhanced<S, A, DispatchExts>

export type MockGetState<S = {}> = (actions: AnyAction[]) => S

export type MockStoreEnhanced<
	S,
	A extends Action = AnyAction,
	DispatchExts = {}
> = MockStore<S, A> & {
	dispatch: DispatchExts
}

export interface MockStore<S = any, A extends Action = AnyAction>
	extends Store<S, A> {
	clearActions(): void
	getActions(): A[]
	subscribe(listener: (action: A) => void): Unsubscribe
}

// @ts-ignore
module.exports = Object.assign(exports.default, exports)
