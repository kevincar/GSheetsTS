import * as fs from 'fs';
import * as readline from 'readline';
import { google } from 'googleapis';
import * as googleAuth from 'google-auth-library';

let SCOPES: string[] = ['https://www.googleapis.com/auth/drive.scripts'];
let TOKEN_DIR: string = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + "/.credentials";
let TOKEN_PATH: string = TOKEN_DIR + '/drive-nodejs-gsheetts-deployment.json';

fs.readFile('client_secret.json', (err: Error, content: any) => {
    if(err) {
        console.log(`Error loading client secret file: ${err}`);
        return;
    }

    // authorize(JSON.parse(content), deploy);
});

function authorize(credentials: ICredentials, callback: Function): void {
    let clientSecret: string = credentials.installed.client_secret;
    let clientId: string = credentials.installed.client_id;
    let redirectUrl: string = credentials.installed.redirect_uris[0];
    let auth: googleAuth = new googleAuth();
    let oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    fs.readFile(TOKEN_PATH, (err: Error, token: any) => {
        if(err) {
            getNewToken(oauth2Client, callback);
        }
        else {
            oauth2Client.credentials = JSON.parse(token);
            callback(oauth2Client);
        }
    });
}

function getNewToken(oauth2Client: any, callback: Function): void {
    let authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });

    console.log('Authorize this app by visiting this url: ')
}

interface ICredentials {
    installed: IInstalled;
}

interface IInstalled {
    client_id: string;
    project_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider: string;
    client_secret: string;
    redirect_uris: string[];
}
