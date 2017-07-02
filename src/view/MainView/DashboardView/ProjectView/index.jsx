import React from "react";
import { rxConnect, ofActions } from "rx-connect";
import Rx from "rxjs";
import moment from "moment";
import { connect } from "react-redux";

import { Link } from "react-router";

import ReactiveGraphQLClient from "../../../../utils/ReactiveGraphQLClient";

@connect(({ user }) => ({ user }))
@rxConnect(function* (props$) {
    yield props$.map(({ user, params: { organization, project } }) => ({ user, organization, project }));

    const actions = {
        start$: new Rx.Subject()
    };

    yield Observable::ofActions(actions);

    const key$ = props$.map(({ params: { organization, project } }) => `${organization}/${project}`).distinctUntilChanged();

    yield key$.map(projectKey => ({ projectKey }));

    yield actions.start$
        .withLatestFrom(key$)
        .flatMap(([, key]) => ReactiveGraphQLClient
            .query(
                "/graphql",
                `mutation {
                    startBuild(key:"${key}") {
                        number
                    }
                }`
            )
            .catch(() => Rx.Observable.empty())
            .ignoreElements()
        );

    yield key$.switchMap(key => ReactiveGraphQLClient
        .query(
            "/graphql",
            `{
                project(key:"${key}") {
                    executions(last:10) {
                        number
                        status
                    }
                }
            }`
        )
        .retryWhen(it$ => it$.do(e => console.error(e)).delay(1000))
        .repeatWhen(it$ => it$.delay(1000))
        .pluck("project")
        .filter(it => it)
        .map(({ executions }) => ({ executions }))
    );
})
export default class ProjectView extends React.Component {
    render() {
        const { user, executions, organization, project } = this.props;

        const { start } = this.props;

        return (
            <div className="ui main container">
                <div className="ui header">Branches:</div>

                <div className="ui segment" style={{ borderLeft: "5px solid #21BA45" }}>
                    <div className="ui internally divided stackable grid">
                        <div className="ui two wide column">
                            <h4 className="ui header">Master</h4>
                        </div>
                        <div className="ui four wide column">
                            <div className="ui grid">
                                <div className="sixteen wide column">
                                    <b>Last build:</b> {executions && executions[0] && moment(executions[0].timestamp).fromNow().toString()}
                                </div>
                                <div className="sixteen wide column">
                                    { user && user.authorities && user.authorities.includes("ROLE_ADMIN") && (
                                        <button className="ui positive basic button" onClick={ e => start() }>Build</button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="ten wide column">
                            { executions && (
                                <div className="ui horizontal segments">
                                    { executions.map(({ number, status }) => {
                                        const icon = {
                                            IN_PROGRESS: "spinner loading",
                                            FAILED: "red remove",
                                            COMPLETED: "green checkmark",
                                            WAITING: "wait grey"
                                        }[status] || "help grey";
                                        return (
                                            <Link to={`${organization}/${project}/${number}`} key={number} className="ui compact center aligned segment">
                                                <div className="ui mini statistic">
                                                    <div className="value">
                                                        <i className={ icon + ' icon' } />
                                                    </div>
                                                    <div className="build number label">#{number}</div>
                                                </div>
                                            </Link>
                                        );
                                    }) }
                                </div>
                            ) }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
