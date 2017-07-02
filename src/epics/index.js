import { combineEpics } from 'redux-observable';
import listenToEvents from './listenToEvents';
import getUser from './getUser';

export default combineEpics(
    getUser,
    // TODO listenToEvents,
);
