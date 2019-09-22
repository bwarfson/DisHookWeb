import React, { Component } from 'react';

class Home extends Component {
    login = () => {
        this.props.auth.login();
    }
    
    logout = () => {
        this.props.auth.logout();
    }

    render() {

        const { isAuthenticated } = this.props.auth;

        return (
            <div>
            {
                isAuthenticated() &&
                <div>
                    <h5>
                        <p>You are logged in!</p>
                        <button onClick={this.logout}>Log Out</button>
                    </h5>
                </div>
            }
            {
                !isAuthenticated() &&
                <div>
                    <h5>
                        <p>You are not logged in!</p> 
                        <button onClick={this.login}>Log In</button>
                    </h5>
                </div>
            }
            </div>
        );
    }
}

export default Home;