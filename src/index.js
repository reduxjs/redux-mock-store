import { applyMiddleware } from 'redux';

const isFunction = arg => typeof arg === 'function';

export default function configureStore(middlewares=[]) {

  return function mockStore(getState={}) {
    function mockStoreWithoutMiddleware() {
      let actions = [];
      let listeners = [];

      const self = {
        getState() {
          return isFunction(getState) ? getState() : getState;
        },

        getActions() {
          return actions;
        },

        dispatch(action) {
          actions.push(action);
          
          for (let i = 0; i < listeners.length; i++) {
            listeners[i]();
          }

          return action;
        },

        clearActions() {
          actions = [];
        },

        subscribe(cb) {
          if (isFunction(cb)) {
            listeners.push(cb);
          }
          return null;
        }
      };

      return self;
    }

    const mockStoreWithMiddleware = applyMiddleware(
      ...middlewares
    )(mockStoreWithoutMiddleware);

    return mockStoreWithMiddleware();
  };

}
