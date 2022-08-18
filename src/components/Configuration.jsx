import axios from 'axios';
import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import util from '../util/util';
import Stack from 'react-bootstrap/Stack';


class Configuration extends Component {
    state = {
        heartBeatTimeout: 1,
        config: {},
        logFormat: "",
        logAsync: true,
        logJsonPrettify: false,
        sss: "RR",
        statusMonitor: false,
        saveMessage: "Save Changes"
    };

    componentDidMount = () => {
        this.gatherConfig();
    }

    gatherConfig = () => {
        axios.get(`${util.url}/api/maxine/control/config`)
            .then(response => {
                if (response.status === 200) {
                    const config = response.data;
                    this.setState({
                        heartBeatTimeout: config.heartBeatTimeout,
                        logFormat: config.logFormat.name,
                        logAsync: config.logAsync,
                        config: config,
                        logJsonPrettify: config.logJsonPrettify,
                        sss: config.serverSelectionStrategy.name,
                        statusMonitor: config.statusMonitorEnabled
                    });
                }
            });
    }

    decreaseBeat = () => {
        if (this.state.heartBeatTimeout > 1) {
            this.setState({
                heartBeatTimeout: this.state.heartBeatTimeout - 1
            });
        }
    }

    increaseBeat = () => {
        if (this.state.heartBeatTimeout < 20) {
            this.setState({
                heartBeatTimeout: this.state.heartBeatTimeout + 1
            });
        }
    }

    saveConfig = () => {
        const data = {
            "logAsync" : this.state.logAsync,
            "heartBeatTimeout" : this.state.heartBeatTimeout,
            "logJsonPrettify" : this.state.logJsonPrettify,
            "serverSelectionStrategy" : this.state.sss,
            "logFormat" : this.state.logFormat
        }
        axios.put(`${util.url}/api/maxine/control/config`, data)
            .then(response => {
                if (response.status === 200){
                    this.setState({saveMessage: "Saved successfully"});
                    setTimeout(() => {
                        this.setState({saveMessage: "Save Changes"});
                    }, 3000)
                }
            }).catch(ex => {
                this.setState({saveMessage: "Couldn't Save, try again later"});
                setTimeout(() => {
                    this.setState({saveMessage: "Save Changes"});
                }, 3000)
            });
    }
    centerStyle = { display: 'flex', justifyContent: 'center' };
    render() {
        return (
            <div style={{ height: "100vh", fontFamily: "Jetbrains Mono" }} className="p-1">
                <center>
                    <Form.Label
                        style={{ borderRadius: "10px" }}
                        className="display-4 p-3">Configuration</Form.Label>
                </center>
                <Container className="pt-4 pb-4">
                    <Row>
                        <Col style={this.centerStyle}>
                            <Form.Check
                                type="switch"
                                className="pt-1"
                                checked={this.state.logAsync}
                                onChange={() => this.setState({ logAsync: !this.state.logAsync })}
                                id="custom-switch"
                                label="Async Logging" />
                        </Col>
                        <Col>
                            <center>
                                {'Heartbeat timeOut '}
                                <Button variant="primary" onClick={this.decreaseBeat} size="sm">-</Button>
                                {` ${this.state.heartBeatTimeout} `}
                                <Button variant="primary" onClick={this.increaseBeat} size="sm">+</Button>
                            </center>
                        </Col>
                        <Col>
                            <Form.Check
                                type="switch"
                                className="pt-1"
                                checked={this.state.logFormat === "JSON"}
                                onChange={() => this.setState({
                                    logFormat: this.state.logFormat === "JSON" ? "PLAIN" : "JSON"
                                })}
                                id="custom-switch"
                                label="JSONified Logging" />
                        </Col>
                    </Row>
                    <Row className="pt-4">
                        <Col style={this.centerStyle}>
                            <Form.Check
                                type="switch"
                                className="pt-1"
                                checked={this.state.statusMonitor}
                                onChange={() => this.setState({ statusMonitor: !this.state.statusMonitor })}
                                id="custom-switch"
                                label="Status Monitor"
                                disabled />
                        </Col>
                        <Col>
                            <center>
                                <Dropdown>
                                    <Dropdown.Toggle size="sm" variant="primary" id="dropdown-basic">
                                        {util.SSS[this.state.sss]}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item disabled>Server Selection Strategies</Dropdown.Item>
                                        {
                                            Object.keys(util.SSS).map(element =>
                                                <Dropdown.Item
                                                    onClick={() => this.setState({ sss: element })}>
                                                    {util.SSS[element]}
                                                </Dropdown.Item>)
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                            </center>
                        </Col>
                        <Col>
                            <Form.Check
                                type="switch"
                                className="pt-1"
                                checked={this.state.logJsonPrettify}
                                onChange={() => this.setState({ logJsonPrettify: !this.state.logJsonPrettify })}
                                id="custom-switch"
                                label="Prettify Logs"
                                disabled={this.state.logFormat === "JSON" ? false : true} />
                        </Col>
                    </Row>
                </Container>
                <Stack gap={2} className="col-md-3 mx-auto pt-4">
                    <Button size="sm" variant="success" onClick={this.saveConfig}>{this.state.saveMessage}</Button>
                    <Button size="sm" variant="danger" onClick={this.gatherConfig}>Reset</Button>
                </Stack>
            </div>
        );
    }
}

export default Configuration;