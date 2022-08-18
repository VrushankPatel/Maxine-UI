import { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Logs from '../components/Logs';
import Configuration from '../components/Configuration';
import Servers from '../components/Servers';

class SignIn extends Component {
    state = {};

    componentDidMount = () => {
        // localStorage.getItem('');
        // check token TO-DO
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
                        defaultActiveKey="info"
                        id="uncontrolled-tab-example"
                        className="mb-3"
                    >
                        <Tab eventKey="info" title="Info">
                            vrushank
                        </Tab>
                        <Tab eventKey="Servers" title="Servers">
                            <Servers />
                        </Tab>
                        <Tab eventKey="Logs" title="Logs">
                            <Logs />
                        </Tab>
                        <Tab eventKey="Configuration" title="Configuration">
                            <Configuration />
                        </Tab>
                    </Tabs>
                </div>
            </div>
        );
    }
}

export default SignIn;