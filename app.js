const express = require('express');
const app = express();
var request = require('request');
var querystring = require('querystring');

const port = 8888;

const clientID = 'a15e3712d52f40edb5cd1644f543cef1';

app.get('/', function(req, res) {
	console.log('call');

	var scopes = 'user-read-private user-read-email';
	
	const redirect_uri = 'http://localhost:8888/callback';
	res.redirect('https://accounts.spotify.com/authorize' +
	  '?response_type=code' +
	  '&client_id=' + clientID +
	  (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
	  '&redirect_uri=' + encodeURIComponent(redirect_uri)
	);
});

app.get('/callback' , function(req, res) {
	console.log('token granted');
	const accessToken = req.query.code;
	const clientSecret = '794045e6c48c4cae8fcc7bd3c6384a51';
	const redirect_uri = 'http://localhost:8888/callback';

	var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: accessToken,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(clientID + ':' + clientSecret).toString('base64'))
    },
    json: true
  };

	request.post(authOptions, function(error, response, body) {
    console.log(body);
    res.redirect('http://localhost:4200?' + querystring.stringify({
            access_token: body.access_token,
            refresh_token: body.refresh_token,
            user: body.id
          }));
  });
});


app.listen(port, () => console.log('Listening on ' + port));