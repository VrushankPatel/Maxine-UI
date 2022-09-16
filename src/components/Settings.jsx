import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import util from '../util/util';
import Stack from 'react-bootstrap/Stack';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';

class Settings extends Component {
    constructor(props) {
        super(props);
        this.password = React.createRef();
        this.newpassword = React.createRef();
        this.confirmpassword = React.createRef();
        this.formsubmitter = React.createRef();
    }
    state = {
        showChangePwd: false,
        showAlert: false,
        alertMsg: "New password and confirmed password doesn't match",
        alertVariant: "danger"
    };

    componentDidMount = () => {
        this.props.gatherConfig();
    }

    handleClose = () => this.setState({ showChangePwd: false });

    changePwdRequest = (evt) => {
        evt.preventDefault();
        const password = this.password.current.value;
        const newpassword = this.newpassword.current.value;
        const confirmpassword = this.confirmpassword.current.value;
        if (newpassword !== confirmpassword){
            this.setState({
                errMsg: "New password and confirmed password doesn't match",
                showAlert: true
            });
            return;
        }
        const data = {
            "password": password,
            "newPassword": newpassword
        }
        const config = {
            method: 'put',
            url: `${util.url}/api/maxine/change-password`,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            data: data
        };
        axios(config)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        alertMsg: "Successfully changed password, you'll be logged out in few seconds, please relogin with new password.",
                        alertVariant: "success",
                        showAlert: true
                    });
                    setTimeout(this.props.logOut(), 5000);
                }
            }).catch(ex => {
                if (ex.response.status === 400) {
                    this.setState({
                        alertMsg: "Unauthorized, please enter correct current password.",
                        alertVariant: "danger",
                        showAlert: true
                    });
                    return;
                }
                if (ex.response.status === 403 || ex.response.status === 401){
                    this.setState({
                        alertMsg: "Can't change password right now, please relogin and continue to change your password, you'll be logged out in few seconds.",
                        alertVariant: "danger",
                        showAlert: true
                    });
                    setTimeout(this.props.logOut(), 5000);
                    return;
                }
                this.setState({
                    alertMsg: "Unknown error occured, please try again later.",
                    alertVariant: "danger",
                    showAlert: true
                });
            });
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
                    <Row className="pt-2">
                        <Col>
                            <center>
                                <Button size="sm" variant="primary" onClick={() => this.setState({ showChangePwd: true })}>
                                    Change Password
                                </Button>
                            </center>
                            <Modal
                                style={{ fontFamily: "Jetbrains Mono" }}
                                show={this.state.showChangePwd} onHide={this.handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Change Password</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="p-4">
                                        <Form onSubmit={this.changePwdRequest}>
                                            <Form.Group className="mb-3" controlId="currentpwd">
                                                <Form.Label>Current Password</Form.Label>
                                                <Form.Control
                                                    ref={this.password}
                                                    type="password" placeholder="Current Password" required />
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="newpwd">
                                                <Form.Label>New Password</Form.Label>
                                                <Form.Control ref={this.newpassword} type="password" placeholder="New Password" required />
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="confirmpwd">
                                                <Form.Label>Confirm Password</Form.Label>
                                                <Form.Control ref={this.confirmpassword} type="password" placeholder="New Password" required />
                                            </Form.Group>

                                            {this.state.showAlert && <Alert variant={this.state.alertVariant}>{this.state.alertMsg}</Alert>}
                                            <div style={this.centerStyle} className="pt-4">
                                                <Button style={{ display: "none" }} ref={this.formsubmitter} variant="primary" type="submit"></Button>
                                            </div>
                                        </Form>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button size="sm" variant="secondary" onClick={this.handleClose}>
                                        Close
                                    </Button>
                                    <Button size="sm" variant="primary" type="submit" onClick={() => this.formsubmitter.current.click()}>
                                        Save Changes
                                    </Button>
                                </Modal.Footer>
                            </Modal>
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