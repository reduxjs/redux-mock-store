import { applyMiddleware } from "redux";
import isPlainObject from "lodash.isplainobject";

const isFunction = (arg) => typeof arg === "function";
/**
 * @deprecated
 *
 * The Redux team does not recommend using this package for testing. Instead, check out our {@link https://redux.js.org/recipes/writing-tests testing docs} to learn more about testing Redux code.
 *
 * Testing with a mock store leads to potentially confusing behaviour, such as state not updating when actions are dispatched. Additionally, it's a lot less useful to assert on the actions dispatched rather than the observable state changes.
 *
 * You can test the entire combination of action creators, reducers, and selectors in a single test, for example:
 * ```js
 * it("should add a todo", () => {
 *   const store = makeStore(); // a user defined reusable store factory
 *
 *   store.dispatch(addTodo("Use Redux"));
 *
 *   expect(selectTodos(store.getState())).toEqual([{ text: "Use Redux", completed: false }]);
 * });
 * ```
 *
 * This avoids common pitfalls of testing each of these in isolation, such as mocked state shape becoming out of sync with the actual application.
 */
export function configureStore(middlewares = []) {
  return function mockStore(getState = {}) {
    function mockStoreWithoutMiddleware() {
      let actions = [];
      let listeners = [];

      const self = {
        getState() {
          return isFunction(getState) ? getState(actions) : getState;
        },

        getActions() {
          return actions;
        },

        dispatch(action) {
          if (!isPlainObject(action)) {
            throw new Error(
              "Actions must be plain objects. " +
                "Use custom middleware for async actions."
            );
          }

          if (typeof action.type === "undefined") {
            throw new Error(
              'Actions may not have an undefined "type" property. ' +
                "Have you misspelled a constant? " +
                "Action: " +
                JSON.stringify(action)
            );
          }

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

          return () => {
            const index = listeners.indexOf(cb);

            if (index < 0) {
              return;
            }
            listeners.splice(index, 1);
          };
        },

        replaceReducer(nextReducer) {
          if (!isFunction(nextReducer)) {
            throw new Error("Expected the nextReducer to be a function.");
          }
        },
      };

      return self;
    }

    const mockStoreWithMiddleware = applyMiddleware(...middlewares)(
      mockStoreWithoutMiddleware
    );

    return mockStoreWithMiddleware();
  };
}

export default configureStore;
