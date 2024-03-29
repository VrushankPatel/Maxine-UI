import React, { Component } from 'react';
import util from '../util/util';
class Status extends Component {
    state = {}

    render() {
        return (
            <div style={{ height: "150vh", fontFamily: "Jetbrains Mono" }} className="p-1 bg-light">
                <center>
                    {
                        this.props.currentTab === "Status" ? <iframe
                        className="statusIframe"
                        style={{ height: "150vh", width: "100vh", fontFamily: "Jetbrains Mono" }}
                        src={util.url + "/api/actuator/status"}
                        frameborder="0"
                        scrolling="no"
                        title="Status"></iframe> : ""
                    }
                </center>
            </div>
        );
    }
}

export default Status;