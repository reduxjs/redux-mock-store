export default function mockMiddleware(spy) {
  return next => action => {
    spy();
    console.log('next', next);
    next.dispatch(action);
  };
}
