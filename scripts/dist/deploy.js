"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var readline = require("readline");
var googleapis_1 = require("googleapis");
var googleAuth = require("google-auth-library");
var async = require("async");
var SCOPES = [
    "https://www.googleapis.com/auth/script.projects",
    "https://www.googleapis.com/auth/script.external_request"
];
// let TOKEN_DIR: string = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + "/.credentials";
var TOKEN_DIR = "../";
var TOKEN_PATH = TOKEN_DIR + '/token.json';
var SECRETS_PATH = "../client_secrets.json";
var SOURCE_FILE = "../../dist/main.js";
var TEST_FUNCTION = "runGasTests";
fs.readFile(SECRETS_PATH, function (err, content) {
    console.log("reading secret file");
    if (err) {
        throw "Error loading client secret file: " + err;
    }
    var isServiceAccount = isServiceAccountCredentials(SECRETS_PATH);
    if (isServiceAccount) {
        var serviceAccountCredentials = JSON.parse(content.toString());
        authorizeServiceAccount(serviceAccountCredentials, main);
    }
    else {
        var clientCredentials = JSON.parse(content.toString());
        authorizeClientAccount(clientCredentials, main);
    }
});
function authorizeServiceAccount(credentials, callback) {
    console.log("Authorizing Service Account... ");
    var jwtClient = new googleapis_1.google.auth.JWT(credentials.client_email, undefined, credentials.private_key, SCOPES);
    jwtClient.authorize(function (err, result) {
        if (err) {
            throw err;
        }
        if (callback) {
            callback(jwtClient);
        }
    });
}
function authorizeClientAccount(credentials, callback) {
    console.log("Authorizing Client Account...");
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var authClient = new googleAuth.OAuth2Client(clientId, clientSecret, redirectUrl);
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function (err, token) {
        if (err) {
            getNewToken(authClient, callback);
        }
        else {
            authClient.credentials = JSON.parse(token.toString());
            callback(authClient);
        }
    });
}
function getNewToken(client, callback) {
    var urlOptions = {
        access_type: 'offline',
        scope: SCOPES
    };
    var authUrl = client.generateAuthUrl(urlOptions);
    console.log('Authorize this app by visiting this url: ', authUrl);
    var readLineOptions = {
        input: process.stdin,
        output: process.stdout
    };
    var rl = readline.createInterface(readLineOptions);
    rl.question('Enter the code from that page here: ', function (code) {
        rl.close();
        client.getToken(code, function (err, token) {
            if (err)
                throw "Error while trying to retrieve access token: " + err;
            if (token) {
                client.credentials = token;
                storeToken(token);
                callback(client);
            }
        });
    });
}
function storeToken(token) {
    try {
        fs.mkdirSync(TOKEN_DIR);
    }
    catch (err) {
        if (err.code != 'EEXIST')
            throw err;
    }
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
}
function main(authClient) {
    var drive = googleapis_1.google.drive('v3');
    var script = googleapis_1.google.script('v1');
    var scriptID = "1cy-5dm0TaeU5Ct8mCJvQEMurrSba6mwUl3pTAPUL67yDf6tv2NOF2_P9";
    var options = {
        auth: authClient,
    };
    var getScript = function (result, callback) {
        if (!callback)
            callback = result;
        var scriptOptions = {
            auth: options.auth,
            scriptId: scriptID,
        };
        script.projects.getContent(scriptOptions, function (err, response) {
            if (err)
                throw "Failed to get project: " + err;
            if (response) {
                callback(null, response.data);
            }
        });
    };
    var updateScript = function (result, callback) {
        var scriptId = scriptID;
        var source = fs.readFileSync(SOURCE_FILE).toString();
        var files = result.files;
        var potentialManifest = files.filter(function (file) { return file.name == 'appsscript'; });
        if (potentialManifest.length < 1)
            throw "Failed to obtain the project manifest";
        var manifest = potentialManifest[0];
        var file = {
            name: "main",
            type: FileType.SERVER_JS,
            source: source
        };
        var requestBody = {
            files: [
                file,
                manifest
            ]
        };
        var request = {
            auth: authClient,
            scriptId: scriptId,
            resource: requestBody
        };
        script.projects.updateContent(request, function (err, response) {
            if (err)
                throw "Failed to update content: " + err;
            if (response)
                callback(null, "cool");
        });
    };
    var runTest = function (result, callback) {
        var requestBody = {
            function: TEST_FUNCTION,
            parameters: [],
            devMode: false
        };
        var request = {
            auth: authClient,
            scriptId: scriptID,
            resource: requestBody
        };
        script.scripts.run(request, function (err, response) {
            if (err)
                throw "Failed to run script: " + err;
            console.log(response.data);
        });
    };
    var tasks = [
        getScript,
        updateScript,
        runTest
    ];
    async.waterfall(tasks, function (err, result) {
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
function isServiceAccountCredentials(fileName) {
    var contents = fs.readFileSync(fileName).toString();
    var credentials = JSON.parse(contents);
    if (credentials.hasOwnProperty("type"))
        return true;
    return false;
}
var FileType;
(function (FileType) {
    FileType[FileType["ENUM_TYPE_UNSPECIFIED"] = 0] = "ENUM_TYPE_UNSPECIFIED";
    FileType[FileType["SERVER_JS"] = 1] = "SERVER_JS";
    FileType[FileType["HTML"] = 2] = "HTML";
    FileType[FileType["JSON"] = 3] = "JSON";
})(FileType || (FileType = {}));
