
import * as fs from 'fs';
import * as stream from 'stream';
import * as readline from 'readline';
import { google } from 'googleapis';
import * as googleAuth from 'google-auth-library';
import { Credentials } from '../../node_modules/google-auth-library/build/src/auth/credentials';
import * as async from 'async';

let SCOPES: string[] = [
    'https://www.googleapis.com/auth/script.projects',
    'https://www.googleapis.com/auth/drive',
];
// let TOKEN_DIR: string = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + "/.credentials";
let TOKEN_DIR: string = "../.credentials";
let TOKEN_PATH: string = TOKEN_DIR + '/gsheetts-deployment.json';
let SECRETS_PATH: string = "../client_secrets.json";

fs.readFile(SECRETS_PATH, (err: Error, content: any) => {
    if(err) {
        throw `Error loading client secret file: ${err}`;
    }

    let isServiceAccount: boolean = isServiceAccountCredentials(SECRETS_PATH);


    if(isServiceAccount) {
        let serviceAccountCredentials: IServiceCredentials = JSON.parse(content.toString());
        authorizeServiceAccount(serviceAccountCredentials, main);
    }
    else {
        let clientCredentials: ICredentials = JSON.parse(content.toString());
        authorizeClientAccount(clientCredentials, main);
    }
});

function authorizeServiceAccount(credentials: IServiceCredentials, callback?: Function): void {
    let jwtClient: googleAuth.JWT = new google.auth.JWT(credentials.client_email, undefined, credentials.private_key, SCOPES);

    jwtClient.authorize((err: Error | null, result?: Credentials): void => {
        if(err) {
            throw err;
        }

        if(callback) {
            callback(jwtClient);
        }
    });
}

function authorizeClientAccount(credentials: ICredentials, callback: Function): void {
    let clientSecret: string = credentials.installed.client_secret;
    let clientId: string = credentials.installed.client_id;
    let redirectUrl: string = credentials.installed.redirect_uris[0];
    let authClient: googleAuth.OAuth2Client = new googleAuth.OAuth2Client(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function(err: Error, token: Buffer) {
        if (err) {
            getNewToken(authClient, callback);
        } else {
            authClient.credentials = JSON.parse(token.toString());
            callback(authClient);
        }
    });
}

function getNewToken(client: googleAuth.OAuth2Client, callback: Function): void {

    let urlOptions = {
        access_type: 'offline',
        scope: SCOPES
    };

    let authUrl: string = client.generateAuthUrl(urlOptions);

    console.log('Authorize this app by visiting this url: ', authUrl);

    let readLineOptions: readline.ReadLineOptions = {
        input: process.stdin,
        output: process.stdout
    };

    let rl: readline.ReadLine = readline.createInterface(readLineOptions);

    rl.question('Enter the code from that page here: ', function(code: string): void {
        rl.close();

        client.getToken(code, (err, token): void => {
            if (err) throw `Error while trying to retrieve access token: ${err}`;

            if(token) {
                client.credentials = token;
                storeToken(token);
                callback(client);
            }
        });
    });
}

function storeToken(token: Credentials): void {
    try {
        fs.mkdirSync(TOKEN_DIR);
    }
    catch (err) {
        if(err.code != 'EEXIST') throw err;
    }

    fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
}

function main(authClient: googleAuth.JWT): void {
    const drive: any = google.drive('v3');
    const script: any = google.script('v1');

    const scriptID: string = "1cy-5dm0TaeU5Ct8mCJvQEMurrSba6mwUl3pTAPUL67yDf6tv2NOF2_P9";

    let options: any = {
        auth: authClient,
    };

    let getScript: taskFunc = (result: any, callback: callbackFunc): void => {
        let scriptOptions = {
            auth: options.auth,
            scriptId: scriptID,
        };
        script.projects.get(scriptOptions, (err: Error, response: any): void => {
            callback(null, response.data);
        });
    };

    let tasks: taskFunc[] = [
        getScript
    ];

    async.waterfall<any, Error | null>(tasks, (err?: Error | null, result?: any): void => {
        console.log(result);
    });

    // Get files
    // Check if project is already created
    // Create a Script File with our distribution file
    // Update the project with our script file
    // run the script test

    // createFile(drive, options);
    // listFiles(drive, options);
    // readFile(drive, options);
    // deleteFile(drive, options);

    // Run the test function to test functionality within the GAS environment
    // Error or success
}

function listFiles(callback: callbackFunc, drive: any, options: any): void {

    let listOptions: any = {
        auth: options.auth,
        pageSize: 10,
        fields: "nextPageToken, files(id, name)"
    };

    drive.files.list(listOptions, (err: Error, response: any) => {
        if(err) throw `Failed to obtain list of files: ${err}`;

        console.log(response.data);
        callback(null, response.data);
    });
}

function createFile(drive: any, options: any): void {

    let fileText: string = "Hey Dude!";
    let readableStream: stream.Readable = new stream.Readable();
    readableStream._read = function noop() {};
    readableStream.push(fileText);
    readableStream.push(null);

    let fileMetaData = {
        name: "gsheetsts-test",
        mimeType: "application/vnd.google-apps.script"
    };

    let media = {
        mimeType: "text/plain",
        body: fs.createReadStream("../../dist/main.js")
    };

    options.resource = fileMetaData;
    options.media = media;
    options.fields = 'id';

    drive.files.create(options, (err: Error, response: any) => {
        if(err) `Failed to create a script file: ${err}`;

        console.log(response.data);
    });
}

function readFile(drive: any, options: any): void {

    options.fileId = "";
    options.fields = "webContentLink";

    drive.files.get(options, (err: Error, response: any) => {
        if(err) throw `Couldn't read file: ${err}`;

        console.log(response.data);
    });
}

function deleteFile(drive: any, options: any): void {
    options.fileId = "1emMfkP2P3mqnx_6rHeAZoG0SXqJpbVMtMveA5EGu36Y";

    drive.files.delete(options, (err: Error, response: any) => {
        if(err) `Failed to delete text file: ${err}`;

        console.log(response.data);
    });
}

function createProject(callback: callbackFunc, script: any, options: any): void {

    let fileMetaData: any = {
        title: options.projectName
    };

    let createOptions: any = {
        auth: options.auth,
        resource: fileMetaData
    };

    script.projects.create(createOptions, {}, (err: Error, result: any): void => {
        if(err) throw `Failed to create a project: ${err}`;

        callback(null, result);
    });
}

function uploadScripts(callback: callbackFunc, script: any, options: any): void {
    script.projects.updateContent(options, {}, (err: Error, response: any): void => {

    });
}

function isServiceAccountCredentials(fileName: string) {
    let contents: string = fs.readFileSync(fileName).toString();
    let credentials: Object = JSON.parse(contents);
    if(credentials.hasOwnProperty("type"))
        return true;

    return false;
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

interface IServiceCredentials {
    type: string;
    project_id: string;
    private_key_id: string;
    private_key: string;
    client_email: string;
    client_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_x509_cert_url: string;
}

type callbackFunc = (err?: Error | null | undefined, result?: any) => void;
type taskFunc = (result: any, callback: callbackFunc)=> void;
