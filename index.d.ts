// Type definitions for Redux Mock Store v1.0.2
// Project: https://github.com/arnaudbenard/redux-mock-store
// Definitions by: Braulio Díez <https://github.com/brauliodiez/>>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

// How to import it:
// import configureStore = require('redux-mock-store');
// Usage:
// const mockStore = configureStore();

import {Store, Middleware, Unsubscribe} from 'redux';

interface MockStore<S> extends Store<S> {
    getState():S;
    getActions():Array<any>;
    dispatch(action:any):any;
    clearActions():void;
    subscribe(listener: Function):Unsubscribe;
}

declare function configureStore<S>(...middlewares:any[]):(...args:any[]) => MockStore<S>;
export = configureStore;
