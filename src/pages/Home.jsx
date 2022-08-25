import { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Logs from '../components/Logs';
import Settings from '../components/Settings';
import Servers from '../components/Servers';
import axios from 'axios';
import util from '../util/util';
import Status from '../components/Status';
import Login from '../components/Login';
import Info from '../components/Info';
import _ from 'lodash';
import { Button } from 'react-bootstrap';

class Home extends Component {
    state = {
        heartBeatTimeout: 1,
        config: {},
        logFormat: "",
        logAsync: true,
        logJsonPrettify: false,
        sss: "RR",
        statusMonitor: false,
        saveTimeout: null,
        currentTab: "Info",
        loggedIn: false,
        port: 0,
        darkTheme: "bg-dark text-light",
        lightTheme: "bg-light text-dark",
        currentTheme: localStorage.getItem('theme') || "bg-light text-dark",
        sunOrMoon: "🌙"
    };

    waitAndSave = () => {
        if (this.state.saveTimeout !== null) {
            clearTimeout(this.state.saveTimeout);
        }
        this.setState({ saveTimeout: setTimeout(this.saveConfig, 1000) });
    }

    decreaseBeat = () => {
        if (this.state.heartBeatTimeout > 1) {
            this.setState({ heartBeatTimeout: this.state.heartBeatTimeout - 1 }, this.waitAndSave);
        }
    }

    increaseBeat = () => {
        this.setState({ heartBeatTimeout: this.state.heartBeatTimeout + 1 }, this.waitAndSave);
    }

    gatherConfig = () => {
        if (this.state.loggedIn) {
            const config = {
                method: 'get',
                url: `${util.url}/api/maxine/control/config`,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            };

            axios(config)
                .then(response => {
                    if (response.status === 200) {
                        const conf = response.data;
                        this.setState({
                            heartBeatTimeout: conf.heartBeatTimeout,
                            logFormat: conf.logFormat.name,
                            logAsync: conf.logAsync,
                            config: conf,
                            logJsonPrettify: conf.logJsonPrettify,
                            sss: conf.serverSelectionStrategy.name,
                            statusMonitor: conf.statusMonitorEnabled,
                            port: conf.port
                        });
                    }
                }).catch(ex => {
                    if (ex.response.status === 401 || ex.response.status === 403) {
                        this.logOut();
                    }
                });
        }
    }

    saveConfig = () => {
        const data = {
            "logAsync": this.state.logAsync,
            "heartBeatTimeout": this.state.heartBeatTimeout,
            "logJsonPrettify": this.state.logJsonPrettify,
            "serverSelectionStrategy": this.state.sss,
            "logFormat": this.state.logFormat
        }
        const config = {
            method: 'put',
            url: `${util.url}/api/maxine/control/config`,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            data: data
        };
        axios(config)
            .then(response => {
                if (response.status === 200) {
                    // saved success
                }
            }).catch(ex => {
                if (ex.response.status === 401 || ex.response.status === 403) {
                    this.logOut();
                }
                //unable to save
            });
        this.setState({ saveTimeout: null })
    }

    toggleAsync = () => this.setState({ logAsync: !this.state.logAsync }, this.waitAndSave);

    toggleLogJSONPrettify = () => this.setState({ logJsonPrettify: !this.state.logJsonPrettify }, this.waitAndSave);

    toggleLogFormat = () => this.setState({ logFormat: this.state.logFormat === "JSON" ? "PLAIN" : "JSON" }, this.waitAndSave);

    changeSSS = (sss) => this.setState({ sss: sss }, this.waitAndSave)

    selectTab = (tab) => {
        this.setState({ currentTab: tab });
        localStorage.setItem("currentTab", tab);
    }

    checkToken = () => {
        if (this.state.loggedIn) {
            const token = localStorage.getItem('token');
            if (_.isNull(token) || _.isUndefined(token) || _.isEmpty(token)) {
                this.logOut();
            }
        }
    }

    setTheme = () => {
        const theme = localStorage.getItem('theme');
        if (_.isUndefined(theme) || _.isNull(theme)){
            localStorage.setItem('theme', this.state.lightTheme);
            return;
        }
        if (theme === this.state.darkTheme){
            localStorage.setItem('theme', this.state.darkTheme);
            this.setState({currentTheme: this.state.darkTheme, sunOrMoon: "🌞"});
            return
        }
        this.setState({currentTheme: this.state.lightTheme, sunOrMoon: "🌙"});
    }

    componentDidMount = () => {
        this.setTheme();
        setInterval(this.checkToken, 5000);
        const currentTab = localStorage.getItem('currentTab') || "Info";
        this.setState({ currentTab: currentTab });
        this.gatherConfig();
    }

    logOut = () => {
        localStorage.removeItem('token');
        window.location.reload();
    }

    toggleTheme = () => {
        const newTheme = this.state.currentTheme === this.state.darkTheme ? this.state.lightTheme : this.state.darkTheme;
        const sunOrMoon = this.state.currentTheme === this.state.darkTheme ? "🌙" : "🌞";
        this.setState({currentTheme: newTheme, sunOrMoon: sunOrMoon});
        localStorage.setItem('theme', newTheme);
    }

    logIn = () => this.setState({ loggedIn: true });

    centerStyle = { display: 'flex', justifyContent: 'center' };

    render() {
        return (
            <div>
                <Navbar style={this.centerStyle} expand="lg" className={this.state.currentTheme}>
                    <Navbar.Brand className={this.state.currentTheme}>
                        <div>
                            <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <img src={require("../assets/imgs/maxine.png")} alt="maxine" height="130" />
                                <div className="p-3">
                                    <p className="display-3">
                                        Maxine
                                        <Button
                                        className={`${this.state.currentTheme} border-0`}
                                        onClick={this.toggleTheme}>
                                        {this.state.sunOrMoon}
                                        </Button>
                                    </p>
                                    <p className="p">Service registry and discovery</p>
                                </div>
                            </Col>
                        </div>
                    </Navbar.Brand>
                </Navbar>
                <div className={this.state.currentTheme}>
                    {!this.state.loggedIn ? <Login checkToken={this.checkToken} logIn={this.logIn} logOut={this.logOut} /> :
                        <Tabs
                            className={this.state.currentTheme}
                            onSelect={(tab) => this.selectTab(tab)}
                            defaultActiveKey={this.state.currentTab}
                            id="uncontrolled-tab-example"
                        >
                            <Tab eventKey="Info" title="Info">
                                <Info
                                    port={this.state.port}
                                    logFormat={this.state.logFormat}
                                    heartBeatTimeout={this.state.heartBeatTimeout}
                                    logJsonPrettify={this.state.logJsonPrettify}
                                    logAsync={this.state.logAsync}
                                    sss={this.state.sss}
                                    theme={this.state.currentTheme}
                                />
                            </Tab>
                            <Tab eventKey="Servers" title="Servers">
                                <Servers 
                                    currentTab={this.state.currentTab} 
                                    logOut={this.logOut} 
                                    theme={this.state.currentTheme}
                                    />
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
                                    logOut={this.logOut}
                                    loggedIn={this.state.loggedIn}
                                    theme={this.state.currentTheme}
                                />
                            </Tab>
                            <Tab eventKey="Settings" title="Settings">
                                <Settings
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
                                    logOut={this.logOut}
                                    theme={this.state.currentTheme}
                                />
                            </Tab>
                            <Tab eventKey="Status" title="Status">
                                <Status currentTab={this.state.currentTab} theme={this.state.currentTheme} />
                            </Tab>
                        </Tabs>
                    }
                </div>
            </div>
        );
    }
}

export default Home;