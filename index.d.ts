declare module '~redux-mock-store/lib' {
	import * as Redux from 'redux'

	function createMockStore<T>(middlewares?: Redux.Middleware[]): createMockStore.mockStore<T>

	namespace createMockStore {
		type mockStore<T> = (state?: T) => IStore<T>;

		type IStore<T> = {
			dispatch(any): any
			getState(): T
			getActions(): Object[]
			clearActions(): void
			subscribe(): Function
		}
	}

	export = createMockStore
}

declare module 'redux-mock-store/lib' {
	import main = require('~redux-mock-store/lib')
	export = main
}

declare module 'redux-mock-store' {
	import main = require('~redux-mock-store/lib')
	export = main
}
