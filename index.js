import { applyMiddleware, createStore, logger, thunk } from './redux.js'

const INCREMENT = 'INCREMENT'
const INCREMENT_ASYNC = 'INCREMENT_ASYNC'

const initialState = 0

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT:
      return state + 1
    case INCREMENT_ASYNC:
      return state + action.payload
    default:
      return state
  }
}

const increment = () => ({
  type: INCREMENT,
})

const createAsync = (value = 1) => ({
  type: INCREMENT_ASYNC,
  payload: value,
})

const incrementAsync = () => (dispatch, getState) => {
  setTimeout(() => dispatch(createAsync()), 2000)
}

const store = createStore(reducer, null, applyMiddleware(thunk, logger))
const unsubscribe = store.subscribe(() => console.log('subscribe', store.getState()))
store.dispatch(increment())
store.dispatch(increment())
unsubscribe()
store.dispatch(increment())
store.dispatch(incrementAsync())
