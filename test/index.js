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

  it('handles multiple actions', done => {
    const store = mockStore({}, [{ type: 'ADD_ITEM' }, { type: 'REMOVE_ITEM' }], done);
    try {
      store.dispatch({ type: 'ADD_ITEMS' });
      store.dispatch({ type: 'REMOVE_ITEM' });
    } catch (e) {
      expect(e.actual.type).toBe('ADD_ITEMS');
      expect(e.expected.type).toBe('ADD_ITEM');
      done();
    }
  });
});
