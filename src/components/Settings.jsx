import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import util from '../util/util';
import Stack from 'react-bootstrap/Stack';


class Settings extends Component {
    state = {};

    componentDidMount = () => {
        this.props.gatherConfig();
    }

    centerStyle = { display: 'flex', justifyContent: 'center' };
    render() {
        return (
            <div style={{ height: "100vh", fontFamily: "Jetbrains Mono" }} className={`p-1 ${this.props.theme}`}>
                <center>
                    <Form.Label
                        style={{ borderRadius: "10px" }}
                        className="display-4 p-3">Settings</Form.Label>
                </center>
                <Container className="pt-4 pb-4">
                    <Row>
                        <Col>
                            <center>
                                {'Default HeartBeat '}
                                <Button variant="primary" onClick={this.props.decreaseBeat} size="sm">-</Button>
                                {` ${this.props.heartBeatTimeout} `}
                                <Button variant="primary" onClick={this.props.increaseBeat} size="sm">+</Button>
                            </center>
                        </Col>
                        <Col>
                            <center>
                                <Dropdown>
                                    <Dropdown.Toggle size="sm" variant="primary" id="dropdown-basic">
                                        {util.SSS[this.props.sss]}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item disabled>Server Selection Strategies</Dropdown.Item>
                                        {
                                            Object.keys(util.SSS).map(element =>
                                                <Dropdown.Item
                                                    onClick={() => this.props.changeSSS(element)}>
                                                    {util.SSS[element]}
                                                </Dropdown.Item>)
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                            </center>
                        </Col>
                        <Col style={this.centerStyle}>
                            <Form.Check
                                type="switch"
                                className="pt-1"
                                checked={this.props.statusMonitor}
                                id="custom-switch"
                                label="Status Monitor"
                                disabled />
                        </Col>
                    </Row>
                </Container>
                <Stack gap={2} className="col-md-3 mx-auto pt-4">
                    <Button size="sm" variant="danger" onClick={this.props.gatherConfig}>Reset</Button>
                </Stack>
            </div>
        );
    }
}

export default Settings;