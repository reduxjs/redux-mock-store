import expect from 'expect';
import sinon from 'sinon';
import mockMiddleware from './mock/middleware';
import configureStore from '../src/index';

const mockStore = configureStore([]);

describe('Redux mockStore', () => {

  it('throws an error if expectedActions is not provided', () => {
    expect(() => mockStore({}))
    .toThrow(/expectedActions/);
  });

  it('converts a single expected action to an array', () => {
    const store = mockStore({}, {});

    expect(store).toExist();
  });

  it('throws an error if done is not a function or undefined', () => {
    expect(() => mockStore({}, [], {}))
    .toThrow(/done/);
  });

  it('returns the store if done is valid', () => {
    const store = mockStore({}, [], () => {});

    expect(store).toExist();
  });

  it('calls getState if it is a function', () => {
    const getState = sinon.spy();
    const store = mockStore(getState, [], () => {});

    store.getState();
    expect(getState.called).toBe(true);
  });

  it('returns the initial state', () => {
    const initialState = { items: [], count: 0 };
    const store = mockStore(initialState, [], () => {});

    expect(store.getState()).toBe(initialState);
  });

  it('should return if the tests is successful', (done) => {
    const action = { type: 'ADD_ITEM' };
    const store = mockStore({}, [action], done);

    store.dispatch(action);
  });

  it('handles actions that return functions', () => {
    const action = { type: 'ADD_ITEM' };
    const store = mockStore({}, [action]);

    store.dispatch(
      ({ dispatch }) => dispatch(action)
    );
  });

  it('handles async actions', done => {
    const clock = sinon.useFakeTimers();
    const action = async ({ dispatch }) => {
      const value = await Promise.resolve({ type: 'ASYNC' })
      dispatch(value)
    };
    const store = mockStore({}, [{ type: 'ASYNC' }], done);
    store.dispatch(action);
    clock.tick(1);
    clock.restore();
  });

  it('should call the middleware', (done) => {
    const spy = sinon.spy();
    const middlewares = [mockMiddleware(spy)];
    const mockStoreWithMiddleware = configureStore(middlewares);
    const action = { type: 'ADD_ITEM' };

    const store = mockStoreWithMiddleware({}, [action], done);
    store.dispatch(action);
    expect(spy.called).toBe(true);
  });

  it('should use test function instead of matching action if supplied', (done) => {
    const action = { type: 'ADD_ITEM' };
    const action2 = { type: 'SET_TIMESTAMP', stamp: Date.now() };
    const action3 = { type: 'DELETE_ITEM' };
    const store = mockStore({}, [
      action,
      (a) => {
        expect(a.type).toBe('SET_TIMESTAMP');
      },
      action3
    ], done);

    store.dispatch(action);
    store.dispatch(action2);
    store.dispatch(action3);
  });

  it('should handle when test function throws an error', (done) => {
    const action = { type: 'ADD_ITEM' };
    const store = mockStore({}, [(incomingAction) => {
      if (incomingAction.type !== 'ADD_TODO') {
        throw Error('Expected action of type ADD_TODO');
      }
    }], sinon.stub().throws('Should not be called'));

    expect(() => store.dispatch(action)).toThrow('Expected action of type ADD_TODO');
    done();
  });

  it('handles multiple actions', done => {
    const store = mockStore({}, [{ type: 'ADD_ITEM' }, { type: 'REMOVE_ITEM' }], done);
    try {
      store.dispatch({ type: 'UNEXPECTED_ACTION' });
      store.dispatch({ type: 'REMOVE_ITEM' });
    } catch (e) {
      expect(e.actual.type).toBe('UNEXPECTED_ACTION');
      expect(e.expected.type).toBe('ADD_ITEM');
      // done(e);
    }
  });

  it('does not modify the expectedActions when dispatching', () => {
    let expectedActions = [{ type: 'ADD_ITEM' }, { type: 'REMOVE_ITEM' }];
    const store = mockStore({}, expectedActions);
    store.dispatch({ type: 'ADD_ITEM' });
    store.dispatch({ type: 'REMOVE_ITEM' });
    expect(expectedActions.length).toEqual(2);
  });
});
