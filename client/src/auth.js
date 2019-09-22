import history from './history';

export default class Auth {
    login = () => {
        window.location = `https://discordapp.com/api/oauth2/authorize?client_id=624613919260147742&scope=identify%20email&response_type=code&redirect_uri=${encodeURIComponent('http://localhost:3000/callback')}`;
    }

    logout = () => {
        // Clear access token and ID token from local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('id');
        localStorage.removeItem('email');
        localStorage.removeItem('username');
        localStorage.removeItem('expires_at');
        // navigate to the home route
        history.replace('/home');
    }

    handleAuthentication = (code) => {
        this.callDiscord(code)
            .then(authResult => { 
                if (authResult && authResult.access_token) {
                    //TODO this prob should not be nested
                    this.getMe(authResult.access_token)
                        .then(res => this.setSession(authResult, res))
                  } else 
                  {
                    history.replace('/home');
                    console.log('crap');
                  }
            })
            .catch(err => console.log(err));
    }

    isAuthenticated = () => {
        // Check whether the current time is past the
        // access token's expiry time
        //TODO this is not working
        let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }

    setSession = (authResult, user) => {
        // Set the time that the access token will expire at
        //TODO i'm pretty sure this is wrong. Token lasts forever
        let expiresAt = JSON.stringify((authResult.expires_in * 1000) + new Date().getTime());
        //TODO research localStorage.  SHould we be putting this token here?  
        localStorage.setItem('access_token', authResult.access_token);
        localStorage.setItem('refresh_token', authResult.refresh_token);
        localStorage.setItem('id', user.id);
        localStorage.setItem('email', user.email);
        localStorage.setItem('username', user.username);
        localStorage.setItem('expires_at', expiresAt);
        // navigate to the home route
        history.replace('/home');
      }

    callDiscord = async (code) => {
        const response = await fetch(`/api/discord/callback/?code=${code}`);
        const body = await response.json();
        return body;
    }

    getMe = async (token) => {
        let body;
        const request = new Request('/api/discord/me', {
            method: 'POST',
            headers: new Headers({
                'Content-type': `application/x-www-form-urlencoded; charset=UTF-8`,
            }),
            body: `token=${token}`
        });
        const response = await fetch(request);
        if (!response.ok) {
            console.log(response);
        } else {
            body = await response.json();
        }
        return body;
    }
}