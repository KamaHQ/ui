import "semantic-ui-css/semantic.css";
import "xterm/dist/xterm.css";
import "./style.css";

import React from "react";
import ReactDOM from "react-dom";
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Router, useRouterHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import createHashHistory from 'history/lib/createHashHistory';
import createLogger from 'redux-logger';
import { createEpicMiddleware } from 'redux-observable';

import routes from "./routes";
import reducers from "./reducers";
import rootEpic from './epics';

const services = {};

const history = useRouterHistory(createHashHistory)();

const middlewares = [];

if (process.env.NODE_ENV !== "production") {
    middlewares.push(createLogger({
            duration: true,
            collapsed: true,
        })
    );
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const epicMiddleware = createEpicMiddleware(rootEpic);

const store = createStore(
    reducers,
    composeEnhancers(
        applyMiddleware(
            epicMiddleware,
            routerMiddleware(history),
            ...middlewares
        )
    )
);

ReactDOM.render((
    <Provider store={ store }>
        <Router history={ history }>
            { routes }
        </Router>
    </Provider>
), document.body); // TODO Don't mount on body, m'kay? Figure out how to deal with xterm.js, it fails if not mounted on body



