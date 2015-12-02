import expect from 'expect';
import { applyMiddleware } from 'redux';

export default function configureStore(middlewares = []) {

  return function mockStore(getState, expectedActions, done) {
    if (!expectedActions) {
      throw new Error('expectedActions should be an expected action or an array of actions.');
    } else if (!Array.isArray(expectedActions)) {
      expectedActions = [expectedActions]
    }

    if (typeof done !== 'undefined' && typeof done !== 'function') {
      throw new Error('done should either be undefined or function.');
    }

    function mockStoreWithoutMiddleware() {
      return {
        getState() {
          return typeof getState === 'function' ?
            getState() :
            getState;
        },

        dispatch(action) {
          const expectedAction = expectedActions.shift();

          try {
            expect(action).toEqual(expectedAction);
            if (done && !expectedActions.length) {
              done();
            }
            return action;
          } catch (e) {
            if (done) {
              done(e);  
            } else {
              throw e;
            }
          }
        }
      };
    }

    const mockStoreWithMiddleware = applyMiddleware(
      ...middlewares
    )(mockStoreWithoutMiddleware);

    return mockStoreWithMiddleware();
  };

}
