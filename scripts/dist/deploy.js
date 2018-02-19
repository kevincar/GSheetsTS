"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var stream = require("stream");
var googleapis_1 = require("googleapis");
var async = require("async");
var SCOPES = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.readonly'
];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + "/.credentials";
var TOKEN_PATH = TOKEN_DIR + '/drive-nodejs-gsheetts-deployment.json';
fs.readFile('../client_secrets.json', function (err, content) {
    if (err) {
        throw "Error loading client secret file: " + err;
    }
    var credentials = JSON.parse(content.toString());
    authorize(credentials, main);
});
function authorize(credentials, callback) {
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
function main(authClient) {
    var drive = googleapis_1.google.drive('v3');
    var script = googleapis_1.google.script('v1');
    var projectName = "gsheetsts-deployment";
    var options = {
        auth: authClient,
    };
    var getFilesTask = function (callback) { listFiles(callback, drive, options); };
    var tasks = [
        getFilesTask
    ];
    async.series(tasks, function (err, results) {
        console.log(results);
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
    options.pageSize = 10;
    options.fields = "nextPageToken, files(id, name)";
    drive.files.list(options, function (err, response) {
        if (err)
            throw "Failed to obtain list of files: " + err;
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
