"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var stream = require("stream");
var readline = require("readline");
var googleapis_1 = require("googleapis");
var googleAuth = require("google-auth-library");
var async = require("async");
var SCOPES = [
    'https://www.googleapis.com/auth/script.projects',
    'https://www.googleapis.com/auth/drive',
];
// let TOKEN_DIR: string = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + "/.credentials";
var TOKEN_DIR = "../.credentials";
var TOKEN_PATH = TOKEN_DIR + '/gsheetts-deployment.json';
var SECRETS_PATH = "../client_secrets.json";
var SOURCE_FILE = "../../dist/main.js";
fs.readFile(SECRETS_PATH, function (err, content) {
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
        var scriptOptions = {
            auth: options.auth,
            scriptId: scriptID,
        };
        script.projects.get(scriptOptions, function (err, response) {
            var data = response.data;
            callback(null, data);
        });
    };
    var updateScript = function (result, callback) {
        console.log(result);
        var scriptId = scriptID;
        var source = fs.readFileSync(SOURCE_FILE).toString();
        var file = {
            name: "main.gs",
            type: FileType.SERVER_JS,
            source: source
        };
        var requestBody = {
            scriptId: scriptId,
            files: [
                file
            ]
        };
        script.projects.updateContent(requestBody, function (err, response) {
        });
    };
    var tasks = [
        getScript,
        updateScript
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
function listFiles(callback, drive, options) {
    var listOptions = {
        auth: options.auth,
        pageSize: 10,
        fields: "nextPageToken, files(id, name)"
    };
    drive.files.list(listOptions, function (err, response) {
        if (err)
            throw "Failed to obtain list of files: " + err;
        console.log(response.data);
        callback(null, response.data);
    });
}
function createFile(drive, options) {
    var fileText = "Hey Dude!";
    var readableStream = new stream.Readable();
    readableStream._read = function noop() { };
    readableStream.push(fileText);
    readableStream.push(null);
    var fileMetaData = {
        name: "gsheetsts-test",
        mimeType: "application/vnd.google-apps.script"
    };
    var media = {
        mimeType: "text/plain",
        body: fs.createReadStream("../../dist/main.js")
    };
    options.resource = fileMetaData;
    options.media = media;
    options.fields = 'id';
    drive.files.create(options, function (err, response) {
        if (err)
            "Failed to create a script file: " + err;
        console.log(response.data);
    });
}
function readFile(drive, options) {
    options.fileId = "";
    options.fields = "webContentLink";
    drive.files.get(options, function (err, response) {
        if (err)
            throw "Couldn't read file: " + err;
        console.log(response.data);
    });
}
function deleteFile(drive, options) {
    options.fileId = "1emMfkP2P3mqnx_6rHeAZoG0SXqJpbVMtMveA5EGu36Y";
    drive.files.delete(options, function (err, response) {
        if (err)
            "Failed to delete text file: " + err;
        console.log(response.data);
    });
}
function createProject(callback, script, options) {
    var fileMetaData = {
        title: options.projectName
    };
    var createOptions = {
        auth: options.auth,
        resource: fileMetaData
    };
    script.projects.create(createOptions, {}, function (err, result) {
        if (err)
            throw "Failed to create a project: " + err;
        callback(null, result);
    });
}
function uploadScripts(callback, script, options) {
    script.projects.updateContent(options, {}, function (err, response) {
    });
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
