import { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Logs from '../components/Logs';
import Configuration from '../components/Configuration';
import Servers from '../components/Servers';
import axios from 'axios';
import util from '../util/util';
import Status from '../components/Status';

class SignIn extends Component {
    state = {
        heartBeatTimeout: 1,
        config: {},
        logFormat: "",
        logAsync: true,
        logJsonPrettify: false,
        sss: "RR",
        statusMonitor: false,
        saveTimeout: null,
        currentTab: "info"
    };

    waitAndSave = () => {
        if (this.state.saveTimeout !== null){
            clearTimeout(this.state.saveTimeout);
        }
        this.setState({saveTimeout: setTimeout(this.saveConfig, 2000)});
    }
    decreaseBeat = () => {
        if (this.state.heartBeatTimeout > 1) {
            this.setState({heartBeatTimeout: this.state.heartBeatTimeout - 1}, this.waitAndSave);
        }
    }

    increaseBeat = () => {
        this.setState({heartBeatTimeout: this.state.heartBeatTimeout + 1}, this.waitAndSave);
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

    saveConfig = () => {
        const data = {
            "logAsync": this.state.logAsync,
            "heartBeatTimeout": this.state.heartBeatTimeout,
            "logJsonPrettify": this.state.logJsonPrettify,
            "serverSelectionStrategy": this.state.sss,
            "logFormat": this.state.logFormat
        }
        axios.put(`${util.url}/api/maxine/control/config`, data)
            .then(response => {
                if (response.status === 200) {
                    // saved success
                }
            }).catch(_ => {
                //unable to save
            });
        this.setState({saveTimeout: null})
    }

    toggleAsync = () => this.setState({ logAsync: !this.state.logAsync }, this.waitAndSave);

    toggleLogJSONPrettify = () => this.setState({ logJsonPrettify: !this.state.logJsonPrettify }, this.waitAndSave);

    toggleLogFormat = () => this.setState({logFormat: this.state.logFormat === "JSON" ? "PLAIN" : "JSON"}, this.waitAndSave);

    changeSSS = (sss) => this.setState({ sss: sss }, this.waitAndSave)

    componentDidMount = () => {
        // localStorage.getItem('');
        // check token TO-DO
        this.gatherConfig();
    }
    centerStyle = { display: 'flex', justifyContent: 'center' };
    render() {
        return (
            <div>
                <Navbar bg="light" style={this.centerStyle} expand="lg">
                    <Navbar.Brand href="/">
                        <div>
                            <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <img src={require("../assets/imgs/maxine.png")} alt="maxine" height="130" />
                                <div className="p-3">
                                    <p className="display-3">Maxine</p>
                                    <p className="p">Service registry and discovery</p>
                                </div>
                            </Col>
                        </div>
                    </Navbar.Brand>
                </Navbar>
                <div>
                    <Tabs
                    onSelect={(tab) => this.setState({currentTab: tab})}
                        defaultActiveKey="info"
                        id="uncontrolled-tab-example"
                        className="mb-3"
                    >
                        <Tab eventKey="Info" title="Info">
                            vrushank
                        </Tab>
                        <Tab eventKey="Servers" title="Servers">
                            <Servers currentTab={this.state.currentTab} />
                        </Tab>
                        <Tab eventKey="Logs" title="Logs">
                            <Logs
                                currentTab={this.state.currentTab} 
                                logFormat={this.state.logFormat}
                                toggleLogFormat={this.toggleLogFormat}
                                logJsonPrettify={this.state.logJsonPrettify}
                                toggleLogJSONPrettify={this.toggleLogJSONPrettify}
                                logAsync={this.state.logAsync}
                                toggleAsync={this.toggleAsync}
                            />
                        </Tab>
                        <Tab eventKey="Configuration" title="Configuration">
                            <Configuration
                                currentTab={this.state.currentTab} 
                                config={this.state.config}
                                heartBeatTimeout={this.state.heartBeatTimeout}
                                logFormat={this.state.logFormat}
                                logJsonPrettify={this.state.logJsonPrettify}
                                sss={this.state.sss}
                                statusMonitor={this.state.statusMonitor}
                                toggleLogJSONPrettify={this.toggleLogJSONPrettify}
                                toggleLogFormat={this.toggleLogFormat}
                                changeSSS={this.changeSSS}
                                gatherConfig={this.gatherConfig}
                                increaseBeat={this.increaseBeat}
                                decreaseBeat={this.decreaseBeat}
                                saveConfig={this.saveConfig}
                                />
                        </Tab>
                        <Tab eventKey="Status" title="Status">
                            <Status currentTab={this.state.currentTab} />
                        </Tab>
                    </Tabs>
                </div>
            </div>
        );
    }
}

export default SignIn;