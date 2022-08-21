import axios from 'axios';
import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import util from '../util/util';

class Logs extends Component {
    constructor(props) {
        super(props);
        this.logConsole = React.createRef();
    }
    state = {
        logs: ">",
        logFile: "Maxine-info.log",
        logFiles: { "Recents": "Recents" },
        autoReloadLogs: true,
        darkMode: true,
        currentSelectedLog: "Recents"
    };

    gatherLogs = () => {
        if (this.state.autoReloadLogs && this.props.currentTab === "Logs") {
            const config = {
                method: 'get',
                url: `${util.url}/api/logs/recent`,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            };
            axios(config)
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            logs: response.data.logs
                        });
                    }
                }).catch(ex => {
                    if (ex.response.status === 401 || ex.response.status === 403) {
                        this.props.logOut();
                    }
                });
        }
    }

    gatherLogFileNames = () => {
        const config = {
            method: 'get',
            url: `${util.url}/api/logs/download`,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        };
        if (this.props.currentTab === "Logs") {
            axios(config)
                .then(response => {
                    this.setState({
                        logFiles: { ...{ Recents: "Recents" }, ...response.data }
                    })
                }).catch(ex => {
                    if (ex.response.status === 401 || ex.response.status === 403) {
                        this.props.logOut();
                    }
                });
        }
    }

    clearLogs = () => {
        const config = {
            method: 'get',
            url: `${util.url}/api/logs/recent/clear`,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        };
        axios(config).catch(ex => {
            if (ex.response.status === 401 || ex.response.status === 403) {
                this.props.logOut();
            }
        });
        this.setState({ logs: ">" });
    }

    toggleTheme = () => {
        this.setState({ darkMode: !this.state.darkMode });
    }

    componentDidMount = () => {
        this.gatherLogs();
        this.gatherLogFileNames();
        setInterval(this.gatherLogs, 1000);
        setInterval(this.gatherLogFileNames, 5000);
    }
    componentDidUpdate() {
        if (this.state.autoReloadLogs) {
            this.logConsole.current.scrollTop = this.logConsole.current.scrollHeight;
        }
    }
    selectLog = (logElement) => {
        this.setState({
            currentSelectedLog: logElement,
            autoReloadLogs: logElement === "Recents" ? "true" : false
        }, () => {
            this.loadLogFile(logElement);
        });
    }

    loadLogFile = (fileName) => {
        if (fileName !== "Recents") {
            const config = {
                method: 'get',
                url: `${util.url}/logs/${fileName}`,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            };
            axios(config)
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            logs: response.data
                        });
                    }
                }).catch(ex => {
                    if (ex.response.status === 401 || ex.response.status === 403) {
                        this.props.logOut();
                    }
                    this.setState({ currentSelectedLog: "Recents", autoReloadLogs: true })
                    this.gatherLogFileNames();
                });
        }
    }
    downloadFile = () => {
        const element = document.createElement("a");
        const file = new Blob([this.state.logs], {
            type: "text/plain"
        });
        element.href = URL.createObjectURL(file);
        element.download = this.state.currentSelectedLog;
        document.body.appendChild(element);
        element.click();
    }

    render() {
        return (
            <div style={{ height: "100vh", fontFamily: "Lucida Console" }} className="p-1">
                <center>
                    <Form.Label className="display-4">Logs Console</Form.Label>
                </center>
                <div className="p-2">
                    <Row xs="auto">
                        <Col>
                            <Dropdown>
                                <Dropdown.Toggle size="sm" variant="primary" id="dropdown-basic">
                                    {this.state.currentSelectedLog}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {
                                        Object.keys(this.state.logFiles).map(element => <Dropdown.Item onClick={() => this.selectLog(element)}>{element}</Dropdown.Item>)
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col>
                            <Button variant="warning" onClick={this.clearLogs} size="sm">Clear Console</Button>
                        </Col>
                        {
                            this.state.currentSelectedLog === "Recents" ? "" : <Col><Button
                                variant="outline-primary"
                                onClick={this.downloadFile}
                                size="sm">Download File</Button></Col>
                        }
                        <Col>
                            <Form.Check
                                type="switch"
                                checked={this.state.autoReloadLogs}
                                onChange={() => this.setState({ autoReloadLogs: !this.state.autoReloadLogs, currentSelectedLog: "Recents" })}
                                id="custom-switch"
                                label="Auto Reload Logs" />
                        </Col>
                        <Col>
                            <Form.Check
                                type="switch"
                                checked={this.state.darkMode}
                                onChange={this.toggleTheme}
                                label="Dark Mode" />
                        </Col>
                        <Col>
                            <Form.Check
                                type="switch"
                                checked={this.props.logAsync}
                                onChange={this.props.toggleAsync}
                                id="custom-switch"
                                label="Async Logging" />
                        </Col>
                        <Col>
                            <Form.Check
                                type="switch"
                                checked={this.props.logFormat === "JSON"}
                                onChange={this.props.toggleLogFormat}
                                id="custom-switch"
                                label="JSONified Logging" />
                        </Col>
                        <Col>
                            <Form.Check
                                type="switch"
                                checked={this.props.logJsonPrettify}
                                onChange={this.props.toggleLogJSONPrettify}
                                id="custom-switch"
                                label="Prettify Logs"
                                disabled={this.props.logFormat === "JSON" ? false : true} />
                        </Col>
                    </Row>
                </div>
                <Form.Group className="mb-3 h-100" controlId="exampleForm.ControlTextarea1">
                    <Form.Control
                        ref={this.logConsole}
                        style={this.state.darkMode ? util.darkTheme : util.lightTheme} value={this.state.logs} as="textarea" className="h-100" disabled />
                </Form.Group>
            </div>
        );
    }
}

export default Logs;