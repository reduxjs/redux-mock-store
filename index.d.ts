// Type definitions for Redux Mock Store v1.0.2
// Project: https://github.com/arnaudbenard/redux-mock-store
// Definitions by: Braulio Díez <https://github.com/brauliodiez/>>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

// How to import it:
// import configureStore = require('redux-mock-store');
// Usage:
// const mockStore = configureStore();

import {Store} from 'redux';

interface MockStore extends Store {
    getState():any;
    getActions():Array<any>;
    dispatch(action:any):any;
    clearActions():void;
    subscribe():any;
}

declare function configureStore(...args:any[]):(...args:any[]) => MockStore;
export = configureStore;
