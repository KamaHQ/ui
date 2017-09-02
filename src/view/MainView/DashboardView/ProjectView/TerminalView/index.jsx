import "./style.css";
import _ from "lodash";
import moment from "moment";

import React from "react";
import Rx from "rxjs";
import Terminal from "xterm";

import EventSourceObservable from "../../../../../utils/EventSourceObservable";

export default class TerminalView extends React.Component {

    term = new Terminal({
        cursorBlink: false,
        tabStopWidth: 4,
        disableStdin: true,
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

                return EventSourceObservable
                    .create(`/plugins/logging-elasticsearch/${encodeURIComponent(key)}/${number}/logz`)
                    .do(({ message, timestamp }) => {
                        const prefix = "[" + moment(timestamp).format("HH:mm:ss.SSS") + "] ";
                        if (_.endsWith(message, "\n")) {
                            this.term.writeln(prefix + message.slice(0, -1));
                        } else {
                            this.term.write(prefix + message);
                        }
                        this.term.fit();
                        // TODO do not scroll if user did manual scrolling aka "follow logs" checkbox
                        this.term.scrollToBottom();
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
