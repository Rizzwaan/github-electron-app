const electron = require("electron");
const { session } = electron;
const apiRequests = require("superagent");
const BrowserWindow = electron.BrowserWindow;
// const fetch = require('electron-fetch').default
// const isDev = require("electron-is-dev");

const options = {
	client_id: "eb88edfe687e8fd19bb1",
	client_secret: "9290b446f71019afad1a56c5b942995067cce049",
	scopes: ["user:email", "notifications"] // Scopes limit access for OAuth tokens.
};
let authWindow;
function createLoginWindow(main) {
	// Build the OAuth consent page URL
	authWindow = new BrowserWindow({
		width: 800,
		height: 600,
		show: false,
		nodeIntegration: false
	});
	var githubUrl = "https://github.com/login/oauth/authorize?";
	var authUrl = githubUrl + "client_id=" + options.client_id;
	authWindow.loadURL(authUrl);
	authWindow.show();

	// Handle the response from GitHub - See Update from 4/12/2015

	authWindow.webContents.on("will-navigate", function(event, url) {
		handleCallback(url);
	});
	var filter = {
		urls: [options.redirect_uri + "*"]
	};
	session.defaultSession.webRequest.onCompleted(filter, details => {
		handleCallback(details.url);
	});

	// Reset the authWindow on close
	authWindow.on(
		"close",
		function() {
			authWindow = null;
		},
		false
	);
}
function handleCallback(url) {
	var raw_code = /code=([^&]*)/.exec(url) || null;
	var code = raw_code && raw_code.length > 1 ? raw_code[1] : null;
	var error = /\?error=(.+)$/.exec(url);

	if (code || error) {
		// Close the browser if code found or error
		authWindow.destroy();
	}

	// If there is a code, proceed to get token from github
	if (code) {
		requestGithubToken(options, code);
	} else if (error) {
		alert(
			"Oops! Something went wrong and we couldn't" +
				"log you in using Github. Please try again."
		);
	}
}

function requestGithubToken(options, code) {
	apiRequests
		.post("https://github.com/login/oauth/access_token", {
			client_id: options.client_id,
			client_secret: options.client_secret,
			code: code
		})
		.then(function(err, response) {
			console.log(response);
			if (response && response.ok) {
				console.log(response.body.access_token);
				// Success - Received Token.
				// Store it in localStorage maybe?
				window.localStorage.setItem("githubtoken", response.body.access_token);
			} else {
				// Error - Show messages.
				console.log(err.body);
			}
		});

	// fetch('https://github.com/login/oauth/access_token',{ headers: {
	//       'Content-Type': 'application/json'
	//     },
	//     method: "POST",
	//     body: JSON.stringify({client_id: options.client_id,
	//     client_secret: options.client_secret,
	//     code: code})}).then(res=>res.json()).then(res=>{
	//       if(res){
	//         console.log('response',res);
	//         // console.log('token',res.body.access_token);
	//       }
	//     }).catch(err=>console.log(err))

	// apiRequests
	//   .post('', {
	//   client_id: options.client_id,
	//   client_secret: options.client_secret,
	//   code: code,
	// })
	//   .end(function (err, response) {
	//     if (response && response.ok) {
	//       // Success - Received Token.
	//       // Store it in localStorage maybe?
	//       window.localStorage.setItem('githubtoken', response.body.access_token);
	//     } else {
	//       // Error - Show messages.
	//       console.log(err);
	//     }
	//   });
}

module.exports = {
	createLoginWindow
};
