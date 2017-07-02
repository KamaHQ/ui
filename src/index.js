import "semantic-ui-css/semantic.css";
import "xterm/dist/xterm.css";
import "./style.css";

import "babel-polyfill";

import { rxConnect } from "rx-connect";
import rx5Adapter from "rx-connect/lib/rx5Adapter";
rxConnect.adapter = rx5Adapter;

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

const services = {};

const history = useRouterHistory(createHashHistory)();

const middlewares = [
    applyMiddleware(
        routerMiddleware(history),
    ),
];

if (process.env.NODE_ENV !== "production") {
    middlewares.push(
        applyMiddleware(createLogger({
            duration: true,
            collapsed: true,
        }))
    );
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

import rootEpic from './epics';

const epicMiddleware = createEpicMiddleware(rootEpic);

const store = createStore(
    reducers,
    composeEnhancers(
        applyMiddleware(
            epicMiddleware,
            routerMiddleware(history),
            createLogger({
                duration: true,
                collapsed: true,
            })
        )
    )
);

ReactDOM.render((
    <Provider store={ store }>
        <Router history={ history }>
            { routes }
        </Router>
    </Provider>
), document.body); // Don't mount on body, m'kay?



