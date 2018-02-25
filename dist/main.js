"use strict";
function main() {
    var ss = new Spreadsheet();
    Logger.log(ss);
}
/// <reference path="../node_modules/googleapis/build/src/apis/sheets/v4" />
var Spreadsheet = /** @class */ (function () {
    /*
     * Methods
     */
    function Spreadsheet(spreadsheetId) {
        if (spreadsheetId === void 0) { spreadsheetId = null; }
        /*
         * Properties
         */
        this._GASSpreadsheet = null;
        this._APISpreadsheet = null;
        this._spreadsheetId = null;
        this._name = null;
        this._spreadsheetId = spreadsheetId;
    }
    Object.defineProperty(Spreadsheet.prototype, "GASSpreadsheet", {
        // private _sheets: Sheet[] | null = null;
        /*
         * Accessors
         */
        get: function () {
            if (this._GASSpreadsheet != null)
                return this._GASSpreadsheet;
            if (this._spreadsheetId == null) {
                this._GASSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
            }
            else {
                this._GASSpreadsheet = SpreadsheetApp.openById(this._spreadsheetId);
            }
            if (this._GASSpreadsheet == null) {
                throw "Error: Failed to obtain a spreadsheet";
            }
            return this._GASSpreadsheet;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spreadsheet.prototype, "APISpreadsheet", {
        get: function () {
            if (this._APISpreadsheet != null)
                return this._APISpreadsheet;
            this._APISpreadsheet = Sheets.Spreadsheets.get(this.spreadsheetId);
            return this._APISpreadsheet;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spreadsheet.prototype, "spreadsheetId", {
        get: function () {
            if (this._spreadsheetId != null)
                return this._spreadsheetId;
            this._spreadsheetId = this.GASSpreadsheet.getId();
            return this._spreadsheetId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spreadsheet.prototype, "name", {
        get: function () {
            if (this._name != undefined)
                return this._name;
            this._name = this.GASSpreadsheet.getName();
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    return Spreadsheet;
}());
function testValdiation(x, y) {
    return x + y;
}
function testTest(tap) {
    tap.test('Test Validation', function (t) {
        var a = 4;
        var b = 5;
        var expected = a + b;
        var observed = testValdiation(a, b);
        t.equal(observed, expected, 'test validation passed');
    });
}
/// <reference path="../../node_modules/tsgast/index" />
// Load GasTap
if (typeof (GasTap) === 'undefined') {
    var libraryURL = 'https://raw.githubusercontent.com/kevincar/gast/master/index.js';
    var libraryContent = UrlFetchApp.fetch(libraryURL).getContentText();
    eval(libraryContent);
}
function runGasTests() {
    var tap = new GasTap();
    /*
     * INSERT TEST FUNCTIONS HERE.
     */
    testTest(tap);
    spreadsheetTest(tap);
    var tp = tap.finish();
    return {
        log: Logger.getLog(),
        results: tp
    };
}
function spreadsheetTest(tap) {
    tap.test("Spreadsheet constructor should give us the active spreadsheet", function (t) {
        var expected = "GSheetsTS Test Sheet";
        var observed = (new Spreadsheet()).name;
        t.equal(observed, expected, "names are equal");
    });
}
