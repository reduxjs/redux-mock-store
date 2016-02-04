import expect from 'expect';
import { applyMiddleware } from 'redux';

const isFunction = arg => typeof arg === 'function';

export default function configureStore(middlewares = []) {

  return function mockStore(getState, expectedActions, done) {
    if (!expectedActions) {
      throw new Error('expectedActions should be an expected action or an array of actions.');
    } else if (!Array.isArray(expectedActions)) {
      expectedActions = [expectedActions];
    } else {
      expectedActions = Array.prototype.slice.call(expectedActions);
    }

    if (typeof done !== 'undefined' && !isFunction(done)) {
      throw new Error('done should either be undefined or function.');
    }

    function mockStoreWithoutMiddleware() {
      const self = {
        getState() {
          return isFunction(getState) ? getState() : getState;
        },

        dispatch(action) {
          if (isFunction(action)) {
            return action(self);
          }

          const expectedAction = expectedActions.shift();

          try {
            if (isFunction(expectedAction)) {
              expectedAction(action);
            } else {
              expect(action).toEqual(expectedAction);
            }

            if (done && !expectedActions.length && !self.error) {
              done();
            }

            return action;
          } catch (e) {
            self.error = true;
            if (done) {
              done(e);
            }
            throw e;
          }
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
