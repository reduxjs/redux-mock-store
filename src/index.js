import { applyMiddleware } from 'redux'

const isFunction = arg => typeof arg === 'function'

export default function configureStore (middlewares = []) {
  return function mockStore (getState = {}) {
    function mockStoreWithoutMiddleware () {
      let actions = []
      let listeners = []

      const self = {
        getState () {
          return isFunction(getState) ? getState(actions) : getState
        },

        getActions () {
          return actions
        },

        getAction (fn) {
          return actions.find(fn)
        },

        getActionByType (type) {
          return self.getAction(a => a.type === type)
        },

        isActionTypeDispatched (type) {
          return self.getActionByType(type) !== undefined
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
