export default (spy, dispatchAction = false) => store => next => action => {
  spy();
  if (dispatchAction) {
    store.dispatch(action)
  }
  return next(action);
};
