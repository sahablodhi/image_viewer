import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Card, CardContent, Typography } from '@material-ui/core';
import './Login.css';
import Header from '../../common/Header';
import { Redirect } from 'react-router-dom';
import { properties } from '../../Config';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            username: "",
            password: "",
            usernameRequiredLabel: "hide",
            passwordRequiredLabel: "hide",
            invalidLoginLabel: "hide",
            loggedIn: sessionStorage.getItem("access-token") == null ? false : true
        }
    }

    // For changing username state value and setting Helper Text flag accordingly.
    usernameChangedHandler = (e) => {
        this.setState({invalidLoginLabel:"hide"});
        this.setState({username: e.target.value});
    }

    // For password username state value and setting Helper Text flag accordingly.
    passwordChangedHandler = (e) => {
        this.setState({invalidLoginLabel:"hide"});
        this.setState({password: e.target.value});
    }

    // Validating username and password entered and setting the access token.
    loginClickedHandler = () => {
        let mockUsername = "upgrad";
        let mockPassword = "upgrad";
        let accessToken = properties.accessToken;

        this.state.username === "" ? this.setState({usernameRequiredLabel:"red"}) : this.setState({usernameRequiredLabel:"hide"});
        this.state.password === "" ? this.setState({passwordRequiredLabel:"red"}) : this.setState({passwordRequiredLabel:"hide"});

        if (this.state.username === mockUsername && this.state.password === mockPassword) {
            window.sessionStorage.setItem("access-token", accessToken);
            this.setState({invalidLoginLabel:"hide"});
            this.props.history.push("/home");
        } else {
            if(this.state.username !== "" && this.state.password !== "")
                this.setState({invalidLoginLabel:"red"});
        }

    }

    render() {
        if(this.state.loggedIn===true) return <Redirect to="/home" />
        else
        return (
            <div>
                <Header {...this.props} loggedIn={false}/>
            <div className="loginFormContainer">
                <Card className="card">
                    <CardContent className="card-content">
                        <Typography variant="h5">LOGIN</Typography>
                        <br />
                        <FormControl className="form-control" required>
                            <InputLabel htmlFor="username">Username</InputLabel>
                            <Input id="username" type="text" onChange={this.usernameChangedHandler} />
                            {/* Helper Text is shown or hidden based on the flag. */}
                            <FormHelperText>
                                <span className={this.state.usernameRequiredLabel}>required</span>
                            </FormHelperText>
                        </FormControl>
                        <br /><br />
                        <FormControl className="form-control" required>
                            <InputLabel htmlFor="loginPassword">Password</InputLabel>
                            <Input id="loginPassword" type="password" onChange={this.passwordChangedHandler}  />
                            {/* Helper Text is shown or hidden based on the flag. */}
                            <FormHelperText>
                                <span className={this.state.passwordRequiredLabel}>required</span>
                            </FormHelperText>
                        </FormControl>
                        <br /><br />
                        {/* Helper Text is shown or hidden based on the flag. */}
                        <FormHelperText>
                             <span className={this.state.invalidLoginLabel}>Incorrect username and/or password</span>
                        </FormHelperText>
                        <br />
                        <Button variant="contained" color="primary" onClick={this.loginClickedHandler}>LOGIN</Button>
                    </CardContent>
                </Card>
            </div>
            </div>
        );
    }
}

export default Login;