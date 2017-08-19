import "./style.css";
import _ from "lodash";
import moment from "moment";

import React from "react";
import Rx from "rxjs";
import Terminal from "xterm";

export default class TerminalView extends React.Component {

    term = new Terminal({
        cursorBlink: false,
        tabStopWidth: 4,
        disableStdin: true,
        // cols: 142,
        // rows: 48
    });

    constructor(props) {
        super(props);

        this.props$ = new Rx.BehaviorSubject(props);

        Terminal.loadAddon('fit');

        this.term.on('open', () => {
            this.resize = Rx.Observable.fromEvent(window, 'resize')
                .debounceTime(100)
                .startWith({})
                .do(() => this.term.fit())
                .subscribe();
        })
    }

    componentWillReceiveProps(nextProps) {
        this.props$.next(nextProps);
    }

    componentDidMount() {
        this.term.open(this.terminalEl, false);

        this.subscription = this.props$
            .pluck("params", "build")
            .distinctUntilChanged()
            .filter(it => it)
            .switchMap(number => this.props$.map(({ params: { organization, project } }) => `${organization}/${project}`).distinctUntilChanged().switchMap(key => Rx.Observable.defer(() => {
                this.term.clear();
                let lastHit = undefined;
                return Rx.Observable
                    .defer(() => Rx.Observable
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
                                        { term: { number } },
                                        { term: { key } }
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
                    });
            })))
            .subscribe();
    }

    componentWillUnmount() {
        this.resize && this.resize.unsubscribe();
        this.subscription && this.subscription.unsubscribe();
    }

    render() {
        return (
            <div className="build-log">
                <div ref={ it => { this.terminalEl = it } } className={ `${this.props.className} build-log__container` }/>
            </div>
        );
    }
}
