import { combineReducers, legacy_createStore as createStore } from 'redux';
import authReducer from './redux/slices/authSlice';

const initialState = {
  sidebarShow: true,
  theme: 'light',
};

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  ui: changeState,
  auth: authReducer,
});

const store = createStore(rootReducer);
export default store;
