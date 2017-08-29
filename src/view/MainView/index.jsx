import React from "react";
import { Link } from "react-router";

import NodesIndicator from "./NodesIndicator";

export default class MainView extends React.Component {
    render() {
        const { children } = this.props;

        const { params : { organization, project, build } = {} } = this.props;

        return (
            <div style={{ height: "100%" }}>
                <div className="ui top menu">
                    <Link to="/" className="header item" activeClassName="active" onlyActiveOnIndex={ true }>Kama</Link>

                    <div className="ui large breadcrumb item borderless">
                        { project && <Link to={`${organization}/${project}`} className="section">{organization}</Link> }
                        { project && <div className="divider"> / </div> }
                        { project && <Link to={`${organization}/${project}`} activeClassName="active" className="section" onlyActiveOnIndex>{project}</Link> }
                        { build && <div className="divider"> / </div> }
                        { build && <Link to={`${organization}/${project}/${build}`} activeClassName="active" className="section">#{build}</Link> }
                    </div>
                    {/* TODO
                    <div className="right menu">
                        <Link to={`/settings`} activeClassName="active" className="item"><i className="large setting icon" style={{ marginRight: 0 }}></i></Link>
                        <div className="item"><NodesIndicator /></div>
                    </div>
                    */}
                </div>
                {children}
            </div>
        )
    }
}
