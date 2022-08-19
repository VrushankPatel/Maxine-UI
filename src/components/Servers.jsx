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
        setInterval(this.getservers, 5000);
    }

    getservers = () => {
        axios.get(`${util.url}/api/maxine/serviceops/servers`)
            .then(response => {
                if (response.status === 200) {
                    const servers = response.data;
                    this.setState({ servers: servers });
                }
            });
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
                                                Registered At : {this.state.servers[server].nodes[Object.keys(this.state.servers[server].nodes)[0]].registeredAt}
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