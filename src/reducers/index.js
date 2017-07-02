import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import topology from './topology';
import activeExecutions from './activeExecutions';
import user from './user';

export default combineReducers({
    routing: routerReducer,
    topology,
    activeExecutions,
    user
});
