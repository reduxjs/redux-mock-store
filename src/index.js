import expect from 'expect';
import { applyMiddleware } from 'redux';

const isFunction = arg => typeof arg === 'function';

export default function configureStore(middlewares=[]) {

  return function mockStore(getState={}) {
    function mockStoreWithoutMiddleware() {
      let actions = [];

      const self = {
        getState() {
          return isFunction(getState) ? getState() : getState;
        },

        getActions() {
          return actions;
        },

        dispatch(action) {
          actions.push(action);

          return action;
        },

        clearActions() {
          actions = [];
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
