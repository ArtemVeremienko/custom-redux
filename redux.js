// Create store function with getState, dispatch and subscribe methods
export const createStore = (reducer, prelodedState, enhancer) => {
  if (enhancer) {
    return enhancer(createStore)(reducer, prelodedState)
  }
  let currentState = prelodedState
  const subscribers = []

  const getState = () => currentState

  const dispatch = (action) => {
    currentState = reducer(currentState, action)
    subscribers.forEach((listener) => listener())
    return action
  }

  const subscribe = (listener) => {
    subscribers.push(listener)
    return () => {
      const index = subscribers.indexOf(listener)
      subscribers.splice(index, 1)
    }
  }

  return {
    getState,
    dispatch,
    subscribe,
  }
}

export const applyMiddleware = (...middlewares) => (createStore) => (reducer, prelodedState) => {
  const store = createStore(reducer, prelodedState)

  let dispatch = () => {
    throw new Error('Dispatching while constructing middleware')
  }

  const middlewareAPI = {
    getState: store.getState,
    dispatch: (...args) => dispatch(...args),
  }

  const chain = middlewares.map((middleware) => middleware(middlewareAPI))

  dispatch = compose(...chain)(store.dispatch)

  return {
    ...store,
    dispatch,
  }
}

export const compose = (...funcs) => (...args) => funcs.reduceRight((a, b) => b(a), ...args)

export const logger = ({ getState }) => (next) => (action) => {
  console.group('dispatch: ', action.type)
  console.log('prev state', getState())
  console.log('action    ', action)
  const returnValue = next(action)
  console.log('next state', getState())
  console.groupEnd()
  return returnValue
}

export const thunk = ({ getState, dispatch }) => (next) => (action) => {
  if (typeof action === 'function') {
    return action(dispatch, getState)
  }

  return next(action)
}
