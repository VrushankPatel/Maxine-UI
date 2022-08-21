import { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import _ from 'lodash';
import util from '../util/util';

class Login extends Component {
    state = {
        userId: "",
        password: "",
        showAlert: false,
        alertMessage: "",
        alertVariant: "",
        loading: false
    };
    centerStyle = { display: 'flex', justifyContent: 'center' };
    signin = (event) => {
        event.preventDefault();
        const userId = this.state.userId;
        const password = this.state.password;
        if (_.isEmpty(userId) || _.isEmpty(password)) {
            this.setState({
                alertMessage: "Please enter valid Id and Password",
                alertVariant: "warning",
                showAlert: true
            });
            return;
        }
        this.setState({ showAlert: false, loading: true });
        axios.post(util.url + "/api/maxine/signin", {
            userName: userId,
            password: password
        }).then(response => {
            const code = response.status;
            if (code === 200) {
                const token = response.data.accessToken;
                localStorage.setItem("token", token);
                this.setState({loading: false});
                this.props.logIn();
            }
        }).catch(ex => {
            const code = ex.response.status;
            if (code === 401) {
                this.setState({
                    alertMessage: "Incorrect userId or Password",
                    alertVariant: "danger",
                    showAlert: true,
                    loading: false
                });
                // this.props.logOut();
                return;
            }
            this.setState({
                showAlert: false,
                loading: false
            });
            localStorage.clear();
        });
    }
    componentDidMount(){
        const token = localStorage.getItem('token');
        if (!_.isNull(token) && !_.isUndefined(token) && !_.isEmpty(token)){
            this.props.logIn();
            return;
        }
    }
    render() {
        return (
            <div style={{ display: 'flex', justifyContent: 'center'}} className="pt-4">
                <div className="pb-5 pt-3 w-50">
                    <div style={this.centerStyle}>
                        <p className="display-3">Login</p>
                    </div>
                    <div style={this.centerStyle}>
                        <div className="w-75">
                            <Form onSubmit={this.signin}>
                                <Form.Group className="mb-3" controlId="formBasicId">
                                    <Form.Label>UserId</Form.Label>
                                    <Form.Control value={this.state.userId} onChange={(event) => this.setState({ userId: event.target.value })} type="text" placeholder="Enter UserId" />
                                    <Form.Text className="text-muted">
                                        We'll never share your UserId with anyone else.
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control value={this.state.password} onChange={(event) => this.setState({ password: event.target.value })} type="password" placeholder="Password" />
                                </Form.Group>
                                {this.state.showAlert && <Alert variant={this.state.alertVariant}>{this.state.alertMessage}</Alert>}
                                <div style={this.centerStyle} className="pt-4">
                                <Button variant="primary"  type="submit" disabled={this.state.loading}>
                                    {
                                        (this.state.loading && 
                                        <div>
                                            <span>
                                                <Spinner
                                                    as="span"
                                                    animation="border"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                />{' '}Logging you in...</span>
                                        </div>) ||
                                        <span> Submit</span>
                                    }
                                </Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;