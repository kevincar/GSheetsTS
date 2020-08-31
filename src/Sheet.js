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
