import React from "react";
import { rxConnect } from "rx-connect";
import Rx from "rxjs";
import { Link } from "react-router";
import moment from "moment";
import _ from "lodash";

import EventSourceObservable from "../../../utils/EventSourceObservable";
import ReactiveGraphQLClient from "../../../utils/ReactiveGraphQLClient";

class Repository extends React.Component {
    render() {
        const { repository = {} } = this.props;

        switch (repository.__typename) {
            case "GitHubRepository":
                const { owner, name } = repository;
                return <a href={`https://github.com/${owner}/${name}`} target="_blank"><i className="github icon" />{owner}/{name}</a>
            default:
                return <span>Unknown</span>;
        }
    }
}

@rxConnect(function* (props$) {
    yield props$.map(({ params: { organization } }) => ({ organization }));

    yield ReactiveGraphQLClient
        .query("/graphql", `{
            projects {
                key
                repository {
                    __typename
                    ... on GitHubRepository {
                        owner
                        name
                    }
                }
                executions(last: 1) {
                    number
                    timestamp
                }
            }
        }`)
        .retryWhen(it$ => it$.doOnNext(e => console.error(e)).delay(1000))
        .repeatWhen(it$ => it$.delay(1000))
        .map(({ projects }) => ({ projects }));
})
export default class DashboardView extends React.Component {
    render() {
        const { organization, projects } = this.props;

        return (
            <div className="ui main container">
                <div className="ui header">Projects:</div>

                <table className="ui padded very basic large celled table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Repository</th>
                            <th>Last build</th>
                        </tr>
                    </thead>
                    <tbody>
                        { projects && projects.map(({ key, repository, executions: [ execution = {} ] = [] }) => (
                            <tr key={key}>
                                <td><Link key={key} to={`${key}`}>{key}</Link></td>
                                <td><Repository repository={repository} /></td>
                                <td className="positive">
                                    <Link to={`${key}/${execution.number}`} className="right floated">#{execution.number}</Link>
                                    <div className="sub header">{moment(execution.timestamp).fromNow()}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}
