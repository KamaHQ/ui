import React from "react";
import { Route, IndexRoute, IndexRedirect } from 'react-router'

import MainView from "./view/MainView";
import DashboardView from "./view/MainView/DashboardView";
import ProjectView from "./view/MainView/DashboardView/ProjectView";
import TerminalView from "./view/MainView/DashboardView/ProjectView/TerminalView";

import SettingsView from "./view/MainView/SettingsView";

export default (
    <Route path="/" component={ MainView }>
        <IndexRoute component={ DashboardView } />
        <Route path=":organization/:project">
            <IndexRoute component={ ProjectView } />
            <Route path=":build" component={ TerminalView } />
        </Route>

        <Route path="settings" component={ SettingsView } />

        <Route path="**" component={() => <h3>404 page not found</h3> } />
    </Route>
)
