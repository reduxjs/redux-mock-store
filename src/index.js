import { applyMiddleware } from 'redux'

const isFunction = arg => typeof arg === 'function'

export default function configureStore (middlewares = []) {
  return function mockStore (state = {}) {
    function mockStoreWithoutMiddleware () {
      let actions = []
      let listeners = []
      let reducer = function(){};

      const self = {
        getState () {
          return isFunction(state) ? state() : state
        },

        getActions () {
          return actions
        },

        dispatch (action) {
          if (typeof action === 'undefined') {
            throw new Error(
              'Actions may not be an undefined.'
            )
          }

          if (typeof action.type === 'undefined') {
            throw new Error(
              'Actions may not have an undefined "type" property. ' +
              'Have you misspelled a constant? ' +
              'Action: ' +
              JSON.stringify(action)
            )
          }

          actions.push(action)
          state = reducer(state,action);

          for (let i = 0; i < listeners.length; i++) {
            listeners[i]()
          }

          return action
        },

        clearActions () {
          actions = []
        },

        subscribe (cb) {
          if (isFunction(cb)) {
            listeners.push(cb)
          }

          return () => {
            const index = listeners.indexOf(cb)

            if (index < 0) {
              return
            }
            listeners.splice(index, 1)
          }
        },

        replaceReducer (nextReducer) {
          if (!isFunction(nextReducer)) {
            throw new Error('Expected the nextReducer to be a function.')
          }
          reducer = nextReducer;
        }
      }

      return self
    }

    const mockStoreWithMiddleware = applyMiddleware(
      ...middlewares
    )(mockStoreWithoutMiddleware)

    return mockStoreWithMiddleware()
  }
}
