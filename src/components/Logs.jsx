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
        logFiles: {},
        autoReloadLogs: true,
        darkMode: true
    };

    gatherLogs = () => {
        if (this.state.autoReloadLogs) {
            if (Object.keys(this.state.logFiles).length === 1){
                this.setState({logFile: "Maxine-info.log"});
            }
            axios.get(`${util.url}/logs/${this.state.logFile}`)
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            logs: response.data
                        });
                    }
                }).catch(_ => {
                    this.gatherLogFileNames();
                });
        }
    }

    gatherLogFileNames = () => {
        if (this.state.autoReloadLogs) {
            axios.get(util.url + "/api/logs/download")
                .then(response => {
                    this.setState({
                        logFiles: response.data
                    }, this.getLatestFile);
                });
        }
    }

    getLatestFile = () => {
        if (Object.keys(this.state.logFiles).length === 1){
            this.setState({logFile: "Maxine-info.log"});
            return this.state.logFile;
        }
        let maxNum = 0;
        Object.keys(this.state.logFiles).forEach(logFile => {
            let number = parseInt(logFile.replace("Maxine-info","").replace(".log",""));
            if (number){
                maxNum = number > maxNum ? number : maxNum;
            }
        });
        this.setState({logFile: `Maxine-info${maxNum}.log`})
    }

    clearLogs = () => {
        axios.post(util.url + "/api/logs/recent/clear");
        this.setState({ logs: ">" });
    }

    toggleTheme = () => {
        this.setState({ darkMode: !this.state.darkMode });
    }

    componentDidMount = () => {
        this.gatherLogs();
        this.gatherLogFileNames();
        setInterval(this.gatherLogs, 3000);
        setInterval(this.gatherLogFileNames, 9000);
    }
    componentDidUpdate() {
        if (this.state.autoReloadLogs) {
            this.logConsole.current.scrollTop = this.logConsole.current.scrollHeight;
        }
    }
    render() {
        return (
            <div style={{ height: "100vh", fontFamily: "Jetbrains Mono" }} className="p-1">
                <center>
                <Form.Label className="display-4">Logs Console</Form.Label>
                </center>
                <div className="p-2">
                    <Row xs="auto">
                        <Col>
                            <Button variant="warning" onClick={this.clearLogs} size="sm">Clear Console</Button>
                        </Col>
                        <Col>
                            <Dropdown>
                                <Dropdown.Toggle size="sm" variant="primary" id="dropdown-basic">
                                    Download Logs
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {
                                        Object.keys(this.state.logFiles).map(element => <Dropdown.Item href={util.url + this.state.logFiles[element]} target="_blank">{element}</Dropdown.Item>)
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col>
                            <Form.Check
                                type="switch"
                                checked={this.state.autoReloadLogs}
                                onChange={() => this.setState({ autoReloadLogs: !this.state.autoReloadLogs })}
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
                    </Row>
                </div>
                <Form.Group className="mb-3 h-100" style={{borderRadius: "10px"}}>
                    <Form.Control
                        ref={this.logConsole}
                        style={this.state.darkMode ? util.darkTheme : util.lightTheme} value={this.state.logs} as="textarea" className="h-100" disabled />
                </Form.Group>
            </div>
        );
    }
}

export default Logs;