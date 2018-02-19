"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var SCOPES = ['https://www.googleapis.com/auth/drive.scripts'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + "/.credentials";
var TOKEN_PATH = TOKEN_DIR + '/drive-nodejs-gsheetts-deployment.json';
fs.readFile('client_secret.json', function (err, content) {
    if (err) {
        console.log("Error loading client secret file: " + err);
        return;
    }
    console.log(content.toString());
});
function authorize(credentials, callback) {
}
function getNewToken(oauth2Client, callback) {
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ');
}
