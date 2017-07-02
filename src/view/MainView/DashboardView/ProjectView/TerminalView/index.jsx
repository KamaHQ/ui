import "./style.css";
import _ from "lodash";
import moment from "moment";

import React from "react";
import Rx from "rxjs";
import Xterm from "xterm/dist/xterm.js";
import fit from "xterm/dist/addons/fit/fit";

import ReactiveGraphQLClient from "../../../../../utils/ReactiveGraphQLClient";

export default class Terminal extends React.Component {

    term = new Xterm({
        cursorBlink: false,
        tabStopWidth: 4,
        disableStdin: true,
        // cols: 142,
        // rows: 48
    });

    constructor(props) {
        super(props);

        this.props$ = new Rx.BehaviorSubject(props);
    }

    componentWillReceiveProps(nextProps) {
        this.props$.next(nextProps);
    }

    componentDidMount() {
        this.term.open(this.terminalEl);
        this.term.fit();

        this.subscription = this.props$
            .pluck("params", "build")
            .distinctUntilChanged()
            .filter(it => it)
            .switchMap(build => this.props$.map(({ params: { organization, project } }) => `${organization}/${project}`).distinctUntilChanged().switchMap(key => ReactiveGraphQLClient
                .query("/graphql",
                    `{
                        execution(key:"${key}", number:${build}) {
                            taskId
                        }
                    }`
                )
                .pluck("execution", "taskId")
                .take(1)
            ))
            .switchMap(executionId => Rx.Observable.defer(() => {
                this.term.clear();
                let lastHit = undefined;
                return Rx.Observable.defer(() => Rx.Observable
                        .ajax({ method: "POST", url: "/plugins/logging-elasticsearch/logz", body: JSON.stringify({
                            size: 100,
                            sort: [
                                { timestamp: "asc" },
                                { _uid: "asc" },
                            ],
                            search_after: lastHit ? lastHit.sort : [0, null],
                            query: {
                                bool: {
                                    must: [
                                        { term: { executionId } }
                                    ]
                                }
                            }
                        })})
                    )
                    .pluck("response", "hits", "hits")
                    .catch(() => Rx.Observable.empty())
                    .repeatWhen(it => it.delay(1000))
                    .filter(it => it.length > 0)
                    .do(items => {
                        for (const { _source: { message, timestamp } } of items) {
                            const prefix = "[" + moment(timestamp).format("HH:mm:ss.SSS") + "] ";
                            if (_.endsWith(message, "\n")) {
                                this.term.writeln(prefix + message.slice(0, -1));
                            } else {
                                this.term.write(prefix + message);
                            }
                            this.term.fit();
                            this.term.scrollToBottom();
                        }
                        lastHit = _.last(items)
                    })
            }))
            .subscribe();
    }

    componentWillUnmount() {
        this.subscription && this.subscription.unsubscribe();
    }

    render() {
        return (
            <div style={{ height: "90%", margin: 15, padding: 15, backgroundColor: "#393939" }}>
                <div ref={ it => this.terminalEl = it } className={ this.props.className } style={{ height: "100%", backgroundColor: "#393939" }} />
            </div>
        );
    }
}
