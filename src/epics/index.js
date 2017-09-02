import { combineEpics } from 'redux-observable';
import getUser from './getUser';

export default combineEpics(
    getUser
);
