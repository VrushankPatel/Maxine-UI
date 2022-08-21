import axios from 'axios';
import React, { Component } from 'react';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import util from '../util/util';
import Card from 'react-bootstrap/Card';

class Servers extends Component {
    state = {
        servers: {}
    }

    componentDidMount = () => {
        setInterval(this.getservers, 2000);
    }

    getservers = () => {
        if (this.props.currentTab === "Servers") {
            const config = {
                method: 'get',
                url: `${util.url}/api/maxine/serviceops/servers`,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            };
            axios(config)
                .then(response => {
                    if (response.status === 200) {
                        const servers = response.data;
                        this.setState({ servers: servers });
                    }
                }).catch(ex => {
                    if (ex.response.status === 401 || ex.response.status === 403) {
                        this.props.logOut();
                    }
                });
        }
    }

    render() {
        return (
            <div style={{ height: "100vh", fontFamily: "Jetbrains Mono" }} className="p-1">
                <center>
                    <Form.Label className="display-4">Registered Servers</Form.Label>
                </center>
                <div className="p-4">
                    <Row className="p-4">
                        {
                            Object.keys(this.state.servers).length === 0 ? <Col className="pt-4" md="12">
                                <Card>
                                    <Card.Body>
                                        <center>
                                            <Card.Title>No Services Registered. 😊</Card.Title>
                                        </center>
                                    </Card.Body>
                                </Card>
                            </Col> :
                                Object.keys(this.state.servers).map(server =>
                                    <Col className="pt-4" md="6">
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>Service Id: {server}</Card.Title>
                                                <Dropdown className="pt-2 pb-2">
                                                    <Card.Subtitle className="mb-2 text-muted">
                                                        <Dropdown.Toggle size="sm" variant="outline-primary" id="dropdown-basic">
                                                            Nodes [{Object.keys(this.state.servers[server].nodes).length}]
                                                        </Dropdown.Toggle>
                                                    </Card.Subtitle>

                                                    <Dropdown.Menu>
                                                        {
                                                            Object.keys(this.state.servers[server].nodes).map(node => <Dropdown.Item>{node}</Dropdown.Item>)
                                                        }
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                                <Card.Text>
                                                    Root node : {this.state.servers[server].nodes[Object.keys(this.state.servers[server].nodes)[0]].parentNode}
                                                </Card.Text>
                                                <Card.Text>
                                                    address : {this.state.servers[server].nodes[Object.keys(this.state.servers[server].nodes)[0]].address}
                                                </Card.Text>
                                                <Card.Text>
                                                    Timeout : {this.state.servers[server].nodes[Object.keys(this.state.servers[server].nodes)[0]].timeOut} second(s)
                                                </Card.Text>
                                                <Card.Text>
                                                    Registered At : {new Date(parseInt(this.state.servers[server].nodes[Object.keys(this.state.servers[server].nodes)[0]].registeredAt)).toString()}
                                                </Card.Text>
                                                <Card.Text>
                                                    Expires In : {
                                                        Math.round((parseInt(this.state.servers[server].nodes[Object.keys(this.state.servers[server].nodes)[0]].registeredAt) + (this.state.servers[server].nodes[Object.keys(this.state.servers[server].nodes)[0]].timeOut * 1000) - Date.now()) / 1000)
                                                    } Second(s)
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                )
                        }

                    </Row>
                </div>
            </div>
        );
    }
}

export default Servers;