"use strict";
///// <reference path="../node_modules/googleapis/build/src/apis/sheets/v4" />
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
        if (parent.sheetNames.indexOf(name) == -1)
            throw "Cannot find sheet with the name " + name;
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
            this._GASSheet = this.parentSpreadsheet.requestGASSheet(this.name);
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
    Object.defineProperty(Sheet.prototype, "APIvalues", {
        get: function () {
            var _this = this;
            if (this._values != null)
                return this._values;
            var values = Array();
            this.APISheet.data.forEach(function (dataSegment) {
                dataSegment.rowData.forEach(function (rowData, rowN) {
                    var curRow = dataSegment.startRow ? dataSegment.startRow + rowN : rowN;
                    if (rowData.values === undefined) {
                        values[curRow] = new Array();
                        return;
                    }
                    rowData.values.forEach(function (cellData, columnN) {
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
    Object.defineProperty(Sheet.prototype, "values", {
        get: function () {
            if (this._values != null)
                return this._values;
            var values = Array();
            this._values = this.GASSheet.getDataRange().getValues();
            return this._values;
        },
        set: function (val) {
            if (!this._values)
                this.values;
            if (!this._values)
                throw "Sheet Object is attempting to set values and values failed to set";
            this._values = val;
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
            var headers = this.values[0];
            var nHeaders = headers.length;
            var i = nHeaders - 1;
            var lastHeader = headers[i];
            while ((i >= 0) && (lastHeader == undefined) || (lastHeader == null)) {
                lastHeader = headers[--i];
            }
            i++;
            headers.splice(i, nHeaders - i);
            return headers;
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
        else if (value.boolValue != undefined)
            return value.boolValue;
        else if (value.errorValue != undefined)
            return value.errorValue;
        else if (value.formulaValue != undefined)
            return value.formulaValue;
        else if (value.numberValue != undefined)
            return value.numberValue;
        else if (value.stringValue != undefined)
            return value.stringValue;
    };
    Sheet.prototype.write = function () {
        var nRows = this.values.length;
        var nColumns = this.values[0].length;
        this.clear();
        this.GASSheet.getRange(1, 1, nRows, nColumns).setValues(this.values);
        return true;
    };
    Sheet.prototype.clear = function () {
        this.GASSheet.getRange(1, 1, this.nRows, this.nColumns).clearContent();
        return true;
    };
    Sheet.prototype.sort = function (column, ascending) {
        if (ascending === void 0) { ascending = false; }
        /*
         * Sort
         *
         * Parameters
         * column - the column to sort first column is column 1 not 0
         * ascending - whether to sort in ascending fashion
         */
        this.GASSheet.sort(column, ascending);
    };
    return Sheet;
}());
var SheetObject = /** @class */ (function () {
    function SheetObject() {
    }
    SheetObject.prototype.getData = function () {
        var _this = this;
        return Object.keys(this).reduce(function (result, key) {
            result[key] = _this[key];
            return result;
        }, {});
    };
    SheetObject.prototype.validate = function (data) {
        var allValuesBad = Object.keys(data).reduce(function (result, curKey) {
            var value = data[curKey];
            var isValueBad = (value == undefined) || (value == null);
            return result && isValueBad;
        }, true);
        return !allValuesBad;
    };
    SheetObject.convertFromGDate = function (dateValue) {
        if (dateValue == null)
            return dateValue;
        if (dateValue instanceof Date)
            return dateValue;
        if (typeof (dateValue) == 'string') {
            if (dateValue == "")
                return null;
            dateValue = parseInt(dateValue);
        }
        if (typeof (dateValue) != 'number' || isNaN(dateValue))
            throw "dateValue: " + dateValue + " is not a string nor a number!";
        var gTime = dateValue * 24 * 3600 * 1000;
        var gDate = new Date(gTime);
        var convertedTime = gDate.getTime() + SheetObject.getConversionNumber(gDate);
        return new Date(convertedTime);
    };
    SheetObject.convertToGDate = function (date) {
        if (date == null)
            return date;
        var convertedTime = date.getTime();
        var gTime = convertedTime - SheetObject.getConversionNumber(date);
        var dateValue = gTime / (24 * 3600 * 1000);
        return dateValue;
    };
    SheetObject.getConversionNumber = function (date) {
        var UTCConversionNumber = SheetObject.gDateConversion;
        var STDoffset = date.getTimezoneOffset() * 60 * 1000;
        var oneHour = 1 * 60 * 60 * 1000;
        var STDConversionNumber = UTCConversionNumber + STDoffset;
        return STDConversionNumber;
    };
    SheetObject.isDaylightSavings = function (date) {
        return date.getTimezoneOffset() < SheetObject.getSTDTimezoneOffset(date);
    };
    SheetObject.getSTDTimezoneOffset = function (date) {
        var jan = new Date(date.getFullYear(), 0, 1);
        var jul = new Date(date.getFullYear(), 6, 1);
        return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    };
    SheetObject.gDateConversion = -2209161600000;
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
            if (!instance.validate(data))
                return;
            instances.push(instance);
        });
        return instances;
    };
    SheetObjectDictionary.prototype.write = function (instances) {
        var _this = this;
        if (!this.sheet)
            throw "cannot write to empty sheet";
        var values = [];
        values[0] = this.sheet.headers;
        instances.forEach(function (obj) {
            var dataValues = _this.instanceToValueArray(obj);
            if (dataValues == null)
                return;
            values.push(dataValues);
        });
        this.sheet.values = values;
        this.sheet.write();
        return true;
    };
    SheetObjectDictionary.prototype.dataObjectToValues = function (data) {
        if (!this.sheet)
            throw "SheetObjectDictionary needs a sheet";
        var propertyNames = this.sheet.headers;
        return propertyNames.reduce(function (result, curProperty) {
            var curValue = data[curProperty];
            if (curValue == null || curValue == undefined)
                curValue = "";
            result.push(curValue);
            return result;
        }, []);
    };
    SheetObjectDictionary.prototype.instanceToValueArray = function (instance) {
        var data = instance.getData();
        if (!instance.validate(data) || data == {})
            return null;
        return this.dataObjectToValues(data);
    };
    return SheetObjectDictionary;
}());
///// <reference path="../node_modules/googleapis/build/src/apis/sheets/v4" />
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
            this._sheetNames = this.GASSpreadsheet.getSheets().map(function (sheet) {
                return sheet.getSheetName();
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
        this._sheetNames = null;
        return true;
    };
    return Spreadsheet;
}());
