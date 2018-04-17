"use strict";
/// <reference path="../node_modules/googleapis/build/src/apis/sheets/v4" />
var Sheet = /** @class */ (function () {
    /*
     * Methods
     */
    function Sheet(parent, name) {
        /*
         * Properties
         */
        this._parentSpreadsheet = null;
        this._GASSheet = null;
        this._APISheet = null;
        this._sheetId = null;
        this._name = null;
        this._values = null;
        this._formulas = null;
        this._formats = null;
        this._conditionalFormats = null;
        this._dataValidations = null;
        this._parentSpreadsheet = parent;
        this._name = name;
    }
    Object.defineProperty(Sheet.prototype, "parentSpreadsheet", {
        /*
         * Accessors
         */
        get: function () {
            if (this._parentSpreadsheet != null)
                return this._parentSpreadsheet;
            throw "Sheet: Parent Spreadsheet not set!";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sheet.prototype, "GASSheet", {
        get: function () {
            if (this._GASSheet != null)
                return this._GASSheet;
            var ss = this.parentSpreadsheet.requestGASSpreadsheet(this.parentSpreadsheet.spreadsheetId);
            this._GASSheet = ss.getSheetByName(this.name);
            return this._GASSheet;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sheet.prototype, "APISheet", {
        get: function () {
            if (this._APISheet != null)
                return this._APISheet;
            var options = {
                ranges: [
                    "" + this.name
                ],
                includeGridData: true
            };
            var ssResponse = Sheets.Spreadsheets.get(this.parentSpreadsheet.spreadsheetId, options);
            if (ssResponse.sheets.length < 1)
                throw "APISheet no data found";
            this._APISheet = ssResponse.sheets[0];
            return this._APISheet;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sheet.prototype, "sheetId", {
        get: function () {
            if (this._sheetId != null)
                return this._sheetId;
            this._sheetId = this.APISheet.properties.sheetId;
            return this._sheetId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sheet.prototype, "name", {
        get: function () {
            if (this._name != null)
                return this._name;
            throw "Sheet: Name was never set in constructor!";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sheet.prototype, "values", {
        get: function () {
            var _this = this;
            if (this._values != null)
                return this._values;
            var values = Array();
            this.APISheet.data.forEach(function (dataSegment) {
                dataSegment.rowData.forEach(function (rowData, rowN) {
                    rowData.values.forEach(function (cellData, columnN) {
                        var curRow = dataSegment.startRow ? dataSegment.startRow + rowN : rowN;
                        var curColumn = dataSegment.startColumn ? dataSegment.startColumn + columnN : columnN;
                        if (values[curRow] == undefined)
                            values[curRow] = new Array();
                        values[curRow][curColumn] = _this.extractValue(cellData.effectiveValue);
                    });
                });
            });
            this._values = values;
            return this._values;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sheet.prototype, "formulas", {
        get: function () {
            var _this = this;
            if (this._formulas != null)
                return this._formulas;
            var formulas = Array();
            this.APISheet.data.forEach(function (dataSegment) {
                dataSegment.rowData.forEach(function (rowData, rowN) {
                    rowData.values.forEach(function (cellData, columnN) {
                        var curRow = dataSegment.startRow ? dataSegment.startRow + rowN : rowN;
                        var curColumn = dataSegment.startColumn ? dataSegment.startColumn + columnN : columnN;
                        if (formulas[curRow] == undefined)
                            formulas[curRow] = new Array();
                        formulas[curRow][curColumn] = _this.extractValue(cellData.userEnteredValue);
                    });
                });
            });
            this._formulas = formulas;
            return this._formulas;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sheet.prototype, "formats", {
        get: function () {
            if (this._formats != null)
                return this._formats;
            var formats = Array();
            this.APISheet.data.forEach(function (dataSegment) {
                dataSegment.rowData.forEach(function (rowData, rowN) {
                    rowData.values.forEach(function (cellData, columnN) {
                        var curRow = dataSegment.startRow ? dataSegment.startRow + rowN : rowN;
                        var curColumn = dataSegment.startColumn ? dataSegment.startColumn + columnN : columnN;
                        if (formats[curRow] == undefined)
                            formats[curRow] = new Array();
                        formats[curRow][curColumn] = cellData.userEnteredFormat;
                    });
                });
            });
            this._formats = formats;
            return this._formats;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sheet.prototype, "conditionalFormatRules", {
        get: function () {
            if (this._conditionalFormats != null)
                return this._conditionalFormats;
            this._conditionalFormats = this.APISheet.conditionalFormats;
            return this._conditionalFormats;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sheet.prototype, "dataValidationRules", {
        get: function () {
            if (this._dataValidations != null)
                return this._dataValidations;
            var dataValidations = new Array();
            this.APISheet.data.forEach(function (dataSegment) {
                dataSegment.rowData.forEach(function (rowData, rowN) {
                    rowData.values.forEach(function (cellData, columnN) {
                        var curRow = dataSegment.startRow ? dataSegment.startRow + rowN : rowN;
                        var curColumn = dataSegment.startColumn ? dataSegment.startColumn + columnN : columnN;
                        if (dataValidations[curRow] == undefined)
                            dataValidations[curRow] = new Array();
                        dataValidations[curRow][curColumn] = cellData.dataValidation;
                    });
                });
            });
            this._dataValidations = dataValidations;
            return this._dataValidations;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sheet.prototype, "headers", {
        get: function () {
            return this.values[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sheet.prototype, "nRows", {
        get: function () {
            return this.APISheet.properties.gridProperties.rowCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sheet.prototype, "nColumns", {
        get: function () {
            return this.APISheet.properties.gridProperties.columnCount;
        },
        enumerable: true,
        configurable: true
    });
    Sheet.prototype.extractValue = function (value) {
        if (value == undefined)
            return undefined;
        else if (value.boolValue)
            return value.boolValue;
        else if (value.errorValue)
            return value.errorValue;
        else if (value.formulaValue)
            return value.formulaValue;
        else if (value.numberValue)
            return value.numberValue;
        else if (value.stringValue)
            return value.stringValue;
    };
    return Sheet;
}());
var SheetObject = /** @class */ (function () {
    function SheetObject() {
    }
    return SheetObject;
}());
var SheetObjectDictionary = /** @class */ (function () {
    function SheetObjectDictionary(ctor, sheet) {
        this.ctor = null;
        this.sheet = null;
        this.ctor = ctor;
        this.sheet = sheet;
    }
    SheetObjectDictionary.prototype.translate = function () {
        var _this = this;
        if (!this.sheet)
            throw "Sheet is undefined!";
        var instances = Array();
        this.sheet.values.forEach(function (rowData, rowIndex) {
            if (_this.ctor == null)
                throw "undefined constructor";
            if (!_this.sheet)
                throw "Sheet is undefined!";
            if (rowIndex == 0)
                return;
            var headers = _this.sheet.headers;
            var data = {};
            headers.forEach(function (header, index) {
                data[header] = rowData[index];
            });
            var instance = new _this.ctor(data);
            instances.push(instance);
        });
        return instances;
    };
    return SheetObjectDictionary;
}());
/// <reference path="./SheetObject" />
//function f(): void {
//let ss: Spreadsheet = new Spreadsheet();
//let mouseSheet: Sheet = new Sheet(ss, "mouse");
//let mouseObjectDictionary = new SheetObjectDictionary(Mouse);
//let mouseTranslator = new SheetObjectTranslator(mouseObjectDictionary, mouseSheet, Mouse);
//return;
//}
//class Mouse extends SheetObject {
//cageId: string = "";
//id: number = 0;
//}
//class SheetObjectTranslator<T extends SheetObjectConstructor> {
//private sheet: Sheet | undefined;
//private objectCtor: T | undefined;
//private dictionary: SheetObjectDictionary<T> | undefined;
//get objectPropertyNames(): string[] {
//if(!this.dictionary) throw 'Sheet is undefined!';
//return Object.keys(this.dictionary);
//}
//constructor(dictionary: SheetObjectDictionary<T>, sheet: Sheet, objectCtor: T) {
//this.dictionary = dictionary;
//this.sheet = sheet;
//this.objectCtor = objectCtor;
//}
//translate(): SheetObjectInstance[] {
//if(!this.sheet) throw 'Sheet is undefined!';
//this.sheet.values.forEach((rowData: any[], index: number): void => {
//if(index == 0) return;
//if(!this.objectCtor) throw 'ctor is undefined!';
//let curObject: SheetObjectInstance = new this.objectCtor();
//this.objectPropertyNames.forEach((propertyName: string): void => {
//if(!this.dictionary) throw 'Dictionary is undfined!';
//if(!this.sheet) throw 'Sheet is undefined!';
//let sheetHeader: string = this.dictionary[propertyName];
//let columnNumber: number = this.sheet.headers.indexOf(sheetHeader);
//let propertyValue: any = rowData[columnNumber];
//curObject.
//});
//});
//}
//}
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
    Spreadsheet.prototype.requestGASSpreadsheet = function (spreadsheetId) {
        if (spreadsheetId == this.spreadsheetId)
            return this.GASSpreadsheet;
        throw "Invalid spreadsheet ID";
    };
    return Spreadsheet;
}());
