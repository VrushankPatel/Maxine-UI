import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import util from '../util/util';


class Info extends Component {
    state = {}

    render() {
        return (
            <div style={{ height: "100vh", fontFamily: "Jetbrains Mono" }} className={`p-1 ${this.props.theme}`}>
                <center>
                    <Form.Label className="display-4">Info</Form.Label>
                </center>
                <center>
                <div className="p-4">
                <Table style={{width: "75%"}} className={`${this.props.theme} border border-secondary`} bordered hover>
                    <thead>
                        <tr>
                            <th style={{width: "30%"}}>Configuration</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Port</td>
                            <td>{this.props.port}</td>
                        </tr>
                        <tr>
                            <td>Default HeartBeat</td>
                            <td>{this.props.heartBeatTimeout} second(s)</td>
                        </tr>
                        <tr>
                            <td>Server Selection Strategy </td>
                            <td>{util.SSS[this.props.sss]}</td>
                        </tr>
                        <tr>
                            <td>Logging</td>
                            <td>
                                Type : {this.props.logAsync ? "Asynchronous" : "Synchronous"} <br/>
                                Format : {this.props.logFormat === "JSON" ? `JSON ${this.props.logJsonPrettify ? "Prettified" : "Compressed"}` : "PLAIN"} <br/>
                            </td>
                        </tr>
                        <tr>
                            <td>Status Monitor</td>
                            <td>
                                Enabled
                            </td>
                        </tr>
                    </tbody>
                </Table>
                </div>
                </center>
            </div>
        );
    }
}

export default Info;