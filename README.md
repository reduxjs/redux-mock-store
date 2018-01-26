# redux-mock-store [![Circle CI](https://circleci.com/gh/arnaudbenard/redux-mock-store/tree/master.svg?style=svg)](https://circleci.com/gh/arnaudbenard/redux-mock-store/tree/master)


![npm](https://nodei.co/npm/redux-mock-store.png?downloads=true&downloadRank=true&stars=true)

A mock store for testing your redux async action creators and middleware. The mock store will create an array of dispatched actions which serve as an action log for tests.

Please note that this library is designed to test the action-related logic, not the reducer-related one. In other words, it does not update Redux store. If you want a complex test combining action and reducer together, take a look at other libraries (e.g., [redux-actions-assertions](https://github.com/redux-things/redux-actions-assertions)). Refer issue [#71](https://github.com/arnaudbenard/redux-mock-store/issues/71) for more detail.

## Install

```
npm install redux-mock-store --save-dev
```
## Documentation

You can see the latest documentation [here](http://arnaudbenard.com/redux-mock-store/).

### Old version (`< 1.x.x`)

https://github.com/arnaudbenard/redux-mock-store/blob/v0.0.6/README.md


## License

The MIT License
