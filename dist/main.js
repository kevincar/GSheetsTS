"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
function main() {
    var ss = new Spreadsheet();
    var sheet = new Sheet(ss, "Sheet1");
    Logger.log(sheet.values);
}
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
    sheetTap(tap);
    sheetObjectTap(tap);
    sheetObjectDictionaryTap(tap);
    var tp = tap.finish();
    return {
        log: Logger.getLog(),
        results: tp
    };
}
function sheetTap(tap) {
    var spreadsheet = new Spreadsheet();
    var testSheet = new Sheet(spreadsheet, "Sheet1");
    tap.test("Sheet constructor should set the name", function (t) {
        var observed = testSheet.name;
        var expected = "Sheet1";
        t.equal(observed, expected, "name is set");
    });
    tap.test("Sheet values should not be blank", function (t) {
        t.notEqual([].length, testSheet.values.length, "values length");
        t.notEqual([].length, testSheet.formulas.length, "formula length");
        t.notEqual([].length, testSheet.formats.length, "format length");
    });
}
function sheetObjectTap(tap) {
    var data = {
        cage: "KD1",
        ID: 1,
        Ear: 1,
        BackGround: null,
        AP: 3,
        DOB: new Date("3/6/18"),
        Source: "KD #1",
        Sex: "M",
        "Project ID": "HF LC Td",
        Location: "ML 457",
        "Study Name": null,
        Note: null,
        DOD: null,
        Breeding: null,
        Cre1: "POS",
        Cre2: null,
        LF: null,
        MT: null,
        Td: "wt",
        HF: "het",
        LT: null,
        MG: null,
        HKi: null,
        EKo: null,
        EF: null,
        S4Ki: null,
        EraT: null,
        EOx: null,
        AtCe: null
    };
    var mouse = new MouseObject(data);
    tap.test("Constructor should work", function (t) {
        t.equal(mouse.cageId, "KD1", "cageID successfully transfered");
        t.equal(mouse.id, 1, "id");
        t.ok(mouse.genotypes, "genotypes should not be null");
        if (!mouse.genotypes)
            return;
        t.equal(typeof (mouse.genotypes.LF), "undefined", "no LF");
        t.equal(mouse.genotypes.HF, "het", "HF Genotype");
        t.equal(mouse.genotypes.LC, "POS", "LC genotype");
    });
}
var MouseObject = /** @class */ (function (_super) {
    __extends(MouseObject, _super);
    function MouseObject(data) {
        var _this = _super.call(this) || this;
        /*
        * Properties
        */
        _this.cageId = null;
        _this.id = null;
        _this.earId = null;
        _this.background = null;
        _this.animalAcct = null;
        _this.DOB = null;
        _this.source = null;
        _this.sex = null;
        _this.strains = null;
        _this.location = null;
        _this.studyNames = null;
        _this.notes = null;
        _this.DOD = null;
        _this.breedingDate = null;
        _this.genotypes = null;
        if (!data)
            return _this;
        _this.cageId = data["cage"];
        _this.id = data.ID;
        _this.earId = data.Ear;
        _this.background = data.BackGround;
        _this.animalAcct = data.AP;
        _this.DOB = data.DOB;
        _this.source = data.Source;
        _this.sex = data.Sex;
        _this.strains = _this.processStrains(data["Project ID"]);
        _this.location = data.Location;
        _this.studyNames = data["Study Name"];
        _this.notes = data.Note;
        _this.DOD = data.Sac;
        _this.breedingDate = data.Breeding;
        _this.genotypes = _this.strains.reduce(function (curGenotype, curStrain) {
            var ogStrain = curStrain;
            if (curStrain.match(/C$/gi) != null)
                curStrain = "Cre1";
            curGenotype[ogStrain] = data[curStrain];
            return curGenotype;
        }, {});
        return _this;
    }
    MouseObject.prototype.processStrains = function (strainsData) {
        var strains = strainsData.split(" ");
        strains = strains.map(function (strain) {
            //Remove anything between parenthesis; e.g., EOx(L1)
            strain = strain.replace(/\(.*\)/gi, "");
            // Remove trailing parenthesis if they exist
            strain = strain.replace(/[\(|\)]/gi, "");
            return strain;
        });
        return strains;
    };
    return MouseObject;
}(SheetObject));
function sheetObjectDictionaryTap(tap) {
    var ss = new Spreadsheet();
    var sheet = new Sheet(ss, "Sheet1");
    var sod = new SheetObjectDictionary(MouseObject, sheet);
    tap.test("Translation testing", function (t) {
        var objs = sod.translate();
        //Logger.log(objs[0]);
        t.notEqual(objs.length, 0, "Object.length is non-zero");
        t.equal(objs[0].id, "H2738", "First mouse object should equal H2738");
    });
    return;
}
function spreadsheetTest(tap) {
    tap.test("Spreadsheet constructor should give us the active spreadsheet", function (t) {
        var expected = "GSheetsTS Test Sheet";
        var observed = (new Spreadsheet()).name;
        t.equal(observed, expected, "names are equal");
    });
}
