"use strict";
function main() {
    SpreadsheetApp.getActive();
    Logger.log("Hello, World!");
    return Logger.getLog();
}
/// <reference path="../../node_modules/tsgast/types/gas-tap-lib.d.ts" />
function loadGasTap() {
    if (typeof (GasTap) === 'undefined') {
        var libraryURL = 'https://raw.githubusercontent.com/kevincar/gast/master/dist/gas-tap-lib.js';
        var libraryContent = UrlFetchApp.fetch(libraryURL).getContentText();
        eval(libraryContent);
    }
}
function testValdiation(x, y) {
    return x + y;
}
function runGasTests() {
    loadGasTap();
    var tap = new GasTap();
    tap.test('Test Validation', function (t) {
        var a = 4;
        var b = 5;
        var expected = a + b;
        var observed = testValdiation(a, b);
        t.equal(observed, expected, 'test validation passed');
    });
    tap.finish();
    return Logger.getLog();
}
