
import * as fs from 'fs';
import * as stream from 'stream';
import { google } from 'googleapis';
import * as googleAuth from 'google-auth-library';
import { Credentials } from '../../node_modules/google-auth-library/build/src/auth/credentials';
import * as async from 'async';

let SCOPES: string[] = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.readonly'
];
let TOKEN_DIR: string = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + "/.credentials";
let TOKEN_PATH: string = TOKEN_DIR + '/drive-nodejs-gsheetts-deployment.json';

fs.readFile('../client_secrets.json', (err: Error, content: any) => {
    if(err) {
        throw `Error loading client secret file: ${err}`;
    }

    let credentials: IServiceCredentials = JSON.parse(content.toString());
    authorize(credentials, main);
});

function authorize(credentials: IServiceCredentials, callback?: Function): void {
    let jwtClient: googleAuth.JWT = new google.auth.JWT(credentials.client_email, undefined, credentials.private_key, SCOPES);

    jwtClient.authorize((err: Error | null, result: Credentials) => {
        if(err) {
            throw err;
        }

        if(callback) {
            callback(jwtClient);
        }
    });
}

function main(authClient: googleAuth.JWT): void {
    const drive: any = google.drive('v3');
    const script: any = google.script('v1');

    const projectName: string = "gsheetsts-deployment";

    let options: any = {
        auth: authClient,
    };

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

function listFiles(drive: any, options: any): void {

    options.pageSize = 10;
    options.fields = "nextPageToken, files(id, name)";

    drive.files.list(options, (err: Error, response: any) => {
        if(err) throw `Failed to obtain list of files: ${err}`;

        console.log(response.data);
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
