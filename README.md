[![Circle CI](https://circleci.com/gh/arnaudbenard/redux-mock-store/tree/master.svg?style=svg)](https://circleci.com/gh/arnaudbenard/redux-mock-store/tree/master)

# redux-mock-store

A mock store for your testing your redux async action creators and middleware

## Install

```
npm install redux-mock-store --save-dev
```

## How to use

```js

// actions.test.js

import configureStore from 'redux-mock-store';

const middlewares = []; // add your middlewares like `redux-thunk`
const mockStore = configureStore(middlewares);

// Test in mocha
it('should dispatch action', (done) => {
  const getState = {}; // initial state of the store
  const action = { type: 'ADD_TODO' };
  const expectedActions = [action];

  const store = mockStore(getState, expectedActions, done);
  store.dispatch(action);
})
```

## License

MIT
