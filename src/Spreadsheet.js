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
        this._sheetNames = null;
        this._spreadsheetId = spreadsheetId;
    }
    Object.defineProperty(Spreadsheet.prototype, "GASSpreadsheet", {
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
    Object.defineProperty(Spreadsheet.prototype, "sheetNames", {
        get: function () {
            if (this._sheetNames != null)
                return this._sheetNames;
            this._sheetNames = this.APISpreadsheet.sheets.map(function (sheet) {
                return sheet.properties.title;
            });
            return this._sheetNames;
        },
        enumerable: true,
        configurable: true
    });
    Spreadsheet.prototype.requestGASSheet = function (sheetName) {
        return this.GASSpreadsheet.getSheetByName(sheetName);
    };
    Spreadsheet.prototype.isSheetExist = function (sheetName) {
        return this.sheetNames.filter(function (e) { return e == sheetName; }).length > 0;
    };
    Spreadsheet.prototype.createSheet = function (sheetName) {
        this.GASSpreadsheet.insertSheet(sheetName);
        this._sheetNames = null;
        return true;
    };
    Spreadsheet.prototype.deleteSheet = function (sheetName) {
        var s = this.GASSpreadsheet.getSheetByName(sheetName);
        if (s == null) {
            return false;
        }
        this.GASSpreadsheet.deleteSheet(s);
        return true;
    };
    return Spreadsheet;
}());
