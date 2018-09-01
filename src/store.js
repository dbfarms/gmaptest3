import {
    createStore,
    applyMiddleware,
    combineReducers
  } from 'redux'
  import thunk from 'redux-thunk';
  
  import categories from './reducers/categoryReducer';
  
  const appReducer = combineReducers({
    
    //farmerOrder,
  });
  
  const rootReducer = (state, action) => {
    //debugger 
    if (action.type === 'LOG_OUT') {
      state = undefined
    }
  
    return appReducer(state, action)
  }
  
  const middleware = [thunk]; //for async actions
  
  export default createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(...middleware),
  );
  