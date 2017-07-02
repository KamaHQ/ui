import React from "react";
import { connect } from "react-redux";

@connect(state => state.topology)
export default class NodesIndicator extends React.PureComponent {
    render() {
        const { servers } = this.props;

        if (servers === undefined) {
            return <i className="spinner loading icon"/>;
        }

        return (
            <div>
                <div className="ui label"><i className="server icon"/>{servers}</div>
            </div>
        );
    }
}