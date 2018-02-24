/// <reference path="../../node_modules/tsgast/index" />

import * as fs from 'fs';
import * as stream from 'stream';
import * as readline from 'readline';
import { google } from 'googleapis';
import * as googleAuth from 'google-auth-library';
import { Credentials } from '../../node_modules/google-auth-library/build/src/auth/credentials';
import * as async from 'async';

let SCOPES: string[] = [
    "https://www.googleapis.com/auth/script.projects",
    "https://www.googleapis.com/auth/script.deployments",
    "https://www.googleapis.com/auth/script.external_request",
    "https://www.googleapis.com/auth/spreadsheets"
];
// let TOKEN_DIR: string = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + "/.credentials";
let TOKEN_DIR: string = "../";
let TOKEN_PATH: string = TOKEN_DIR + '/token.json';
let SECRETS_PATH: string = "../client_secrets.json";
let SOURCE_FILE: string = "../../dist/main.js"
let TEST_FUNCTION: string = "runGasTests";

console.log("reading secret file");
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
    console.log("Authorizing Service Account... ");
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
    console.log("Authorizing Client Account...");
    let clientSecret: string = credentials.installed.client_secret;
    let clientId: string = credentials.installed.client_id;
    let redirectUrl: string = credentials.installed.redirect_uris[0];
    let authClient: googleAuth.OAuth2Client = new googleAuth.OAuth2Client(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    console.log("Reading Token file..");
    fs.readFile(TOKEN_PATH, function(err: Error, token: Buffer) {
        if (err) {
            console.log("No token found...");
            getNewToken(authClient, callback);
        } else {
            authClient.credentials = JSON.parse(token.toString());
            callback(authClient);
        }
    });
}

function getNewToken(client: googleAuth.OAuth2Client, callback: Function): void {
    console.log("Getting a new token");
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

function main(authClient: googleAuth.OAuth2Client): void {
    console.log("Running program...");

    const script: any = google.script('v1');

    const scriptID: string = "1cy-5dm0TaeU5Ct8mCJvQEMurrSba6mwUl3pTAPUL67yDf6tv2NOF2_P9";
    const APIID: string = "M-MCi4MaYxiATiBKlHWorqIUwAkX7_p7l";


    let options: any = {
        auth: authClient,
    };

    let createScript: taskFunc = (result: any, callback: callbackFunc): void => {

        let requestBody = {
            title: "Test Script"
        };

        let request = {
            auth: authClient,
            resource: requestBody
        };

        script.projects.create(request, (err: Error, response: any): void => {
            if(err) throw `Failed to create project: ${err}`;

            console.log(response.data);
        });
    };

    let getScript: taskFunc = (result: any, callback: callbackFunc): void => {
        console.log("getting script");

        if(!callback) callback = result;
        let scriptOptions = {
            auth: options.auth,
            scriptId: scriptID,
        };

        console.log("calling getContent from API");
        script.projects.getContent(scriptOptions, (err: Error, response?: any): void => {
            if(err) {
                err.message = `Failed to get script content: ${err}`;
                return callback(err);
            }
            if(response) {
                return callback(null, response.data);
            }
        });
    };

    let updateScript: taskFunc = (result: any, callback: callbackFunc): void => {
        console.log("updating scripts");
        let scriptId: string = scriptID;
        let source: string = fs.readFileSync(SOURCE_FILE).toString();

        let files: ScriptFile[] = result.files;
        let potentialManifest: ScriptFile[] = files.filter((file: ScriptFile)=>{return file.name == 'appsscript';});
        if(potentialManifest.length < 1) callback(new Error(`Failed to obtain the project manifest`));
        let manifest: ScriptFile = potentialManifest[0];

        let file: ScriptFile = {
            name: "main",
            type: FileType.SERVER_JS,
            source: source
        };

        let requestBody: any = {
            files: [
                file,
                manifest
            ]
        };

        let request = {
            auth: authClient,
            scriptId: scriptId,
            resource: requestBody
        };

        console.log("Calling update content API");
        script.projects.updateContent(request, (err: Error, response?: any): void => {
            if(err) {
                err.message = `Failed to update content: ${err}`;
                return callback(err);
            }

            if(response)
                callback(null, manifest);
        });
    }

    let getDeployments: taskFunc = (result: any, callback: callbackFunc): void => {
        if(typeof(result) == "function") callback = result;
        console.log("Getting deployments");

        let request = {
            auth: authClient,
            scriptId: scriptID
        };

        console.log("calling API for deployments");
        script.projects.deployments.list(request, (err: Error, response?: any): void => {
            if(err) {
                err.message = `Failed to obtain a list of deployments: ${err.message}`;
                callback(err);
            }

            response.data.manifest = result;
            callback(null, response.data);
        });
    };

    let deployScript: taskFunc = (result: any, callback: callbackFunc): void => {
        if(typeof(result) == "function") callback = result;

        console.log("Running depolyment");

        let manifestFile: ScriptFile = result.manifest;
        const n: number = 2;

        let deploymentConfig = {
            scriptId: scriptID,
            versionNumber: result.deployments[n].versionNumber,
            manifestFileName: manifestFile.name,
            description: result.deployments[n].description
        }

        let requestBody = {
            deploymentConfig
        };

        let request = {
            auth: authClient,
            deploymentId: result.deployments[n].deploymentId,
            scriptId: scriptID,
            resource: requestBody
        };

        console.log(result.deployments);
        script.projects.deployments.update(request, (err: Error, response?: any): void => {
            if(err) {
                err.message = `Failed to deploy: ${err.message}`;
                callback(err);
            }

            callback(null, response.data);
        });
    };

    let runTest: taskFunc = (result: any, callback: callbackFunc): void => {
        if(typeof(result) == "function") callback = result;
        console.log("Running test");
        let requestBody = {
            function: TEST_FUNCTION,
            devMode: true
        };

        let request = {
            auth: authClient,
            scriptId: APIID,
            resource: requestBody
        };

        console.log("Calling run API");
        script.scripts.run(request, (err: Error, response: any): void =>{
            if(err) {
                err.message = `Failed to run script: ${err.message}`;
                return callback(err);
            }

            return callback(null, response);
        });
    };

    let tasks: taskFunc[] = [
        getScript,
        updateScript,
        // getDeployments,
        // deployScript,
        runTest
        // createScript
    ];

    console.log("Running tasks...");
    async.waterfall<any, Error | null>(tasks, (err?: Error | null, result?: any): void => {
        if(err) {
            // console.log(err);
            console.log(err.message);
            return process.exit(1);
        }
        let data = result.data;

        let done: boolean = data.done;
        if(!done) {
            console.error("Failed to finish: Done is false");
            return process.exit(1);
        }

        let summary = data.response.result;
        let log: string = summary.log;
        console.log(log);

        let results: tapResults = summary.results;
        let nFailures: number = results.nFailed;

        if(nFailures != 0) {
            console.error(`${nFailures} failures occured`);
            return process.exit(1);
        }

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

enum FileType {
    ENUM_TYPE_UNSPECIFIED,
    SERVER_JS,
    HTML,
    JSON,
}

interface User {
  "domain": string,
  "email": string,
  "name": string,
  "photoUrl": string
}

interface FunctionSet {
  "values": Function[]
}

interface ScriptFile {
  "name": string,
  "type": FileType,
  "source": string,
  "lastModifyUser"?: User
  "createTime"?: string,
  "updateTime"?: string,
  "functionSet"?: FunctionSet
}

type callbackFunc = (err?: Error | null | undefined, result?: any) => void;
type taskFunc = (result: any, callback: callbackFunc)=> void;
