import React from "react";

export default class SettingsView extends React.Component {
    render() {
        return (
            <div className="ui main container">
                <div className="ui grid">
                    <div className="four wide column">
                        <div className="ui vertical fluid large menu">
                            <div className="item">
                                <div className="header">General</div>
                                <div className="menu">
                                    <a className="active item">Home</a>
                                    <a className="item">Messages</a>
                                </div>
                            </div>
                            <div className="item">
                                <div className="header">Cluster</div>
                                <div className="menu">
                                    <a className="item">Nodes</a>
                                    <a className="item">Discovery</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="twelve wide stretched column">
                        <div className="ui segment">
                        <p>yoyoyo</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
