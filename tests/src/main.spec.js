/// <reference path="../../node_modules/tsgast/index" />
// Load GasTap
if (typeof (GasTap) === 'undefined') {
    var libraryURL = 'https://raw.githubusercontent.com/kevincar/gast/master/index.js';
    var libraryContent = UrlFetchApp.fetch(libraryURL).getContentText();
    eval(libraryContent);
}
function runGasTests() {
    var logs = [];
    var logger = function (msg) {
        logs.push(msg);
    };
    var gasTapOptions = {
        loggerFunc: logger
    };
    var tap = new GasTap(gasTapOptions);
    /*
     * INSERT TEST FUNCTIONS HERE.
     */
    testTest(tap);
    spreadsheetTest(tap);
    sheetTap(tap);
    sheetObjectTap(tap);
    sheetObjectDictionaryTap(tap);
    var tp = tap.finish();
    logs.push(JSON.stringify(tp));
    return logs;
}
