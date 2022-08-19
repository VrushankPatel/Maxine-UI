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
            axios.get(`${util.url}/api/logs/recent`)
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            logs: response.data.logs
                        });
                    }
                });
        }
    }

    gatherLogFileNames = () => {
        if (this.props.currentTab === "Logs"){
            axios.get(util.url + "/api/logs/download")
            .then(response => {
                this.setState({
                    logFiles: { ...{ Recents: "Recents" }, ...response.data }
                })
            });
        }
    }

    clearLogs = () => {
        axios.get(util.url + "/api/logs/recent/clear");
        this.setState({ logs: ">" });
    }

    toggleTheme = () => {
        this.setState({ darkMode: !this.state.darkMode });
    }

    componentDidMount = () => {
        this.gatherLogs();
        this.gatherLogFileNames();
        setInterval(this.gatherLogs, 1000);
        setInterval(this.gatherLogFileNames, 10000);
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
        if (fileName !== "Recents"){
            axios.get(`${util.url}/logs/${fileName}`)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        logs: response.data
                    });
                }
            }).catch(_ => {
                this.setState({currentSelectedLog: "Recents", autoReloadLogs: true})
                this.gatherLogFileNames();
            });
        }
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
                            href={util.url + "/api/logs/download/" + this.state.currentSelectedLog}
                            target="_blank"
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