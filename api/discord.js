const express = require('express');
const fetch = require('node-fetch');
const btoa = require('btoa');

const { catchAsync } = require('../utils');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const redirect = encodeURIComponent('http://localhost:3000/callback');

router.post('/me', catchAsync(async (req, res) => {
    
    const response = await fetch('http://discordapp.com/api/users/@me', 
    {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${req.body.token}`,
        },
    });

    const json = await response.json();
    //TODO Error handling
    res.send(json);
}));

router.get('/callback', catchAsync(async (req, res) => {
    if (!req.query.code) throw new Error('NoCodeProvided');
    const code = req.query.code;
    const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${creds}`,
        },
      });

    const json = await response.json();
    
    //TODO look up handling errors in express
    if(json.error) {
        res.send({ error: json.error });
    } else {
        res.send(json);
    }
}));

module.exports = router;