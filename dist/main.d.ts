declare function main(): any;
declare class Sheet {
    private _parentSpreadsheet;
    private _GASSheet;
    private _APISheet;
    private _sheetId;
    private _name;
    private _values;
    private _formulas;
    private _formats;
    private _conditionalFormats;
    private _dataValidations;
    private readonly parentSpreadsheet;
    private readonly GASSheet;
    private readonly APISheet;
    readonly sheetId: number;
    readonly name: string;
    readonly values: any[][];
    readonly formulas: string[][];
    readonly formats: Sheets.CellFormat[][];
    readonly nRows: number;
    readonly nColumns: number;
    constructor(parent: Spreadsheet, name: string);
    private extractValue(value);
}
declare class Spreadsheet {
    private _GASSpreadsheet;
    private _APISpreadsheet;
    private _spreadsheetId;
    private _name;
    private readonly GASSpreadsheet;
    private readonly APISpreadsheet;
    readonly spreadsheetId: string;
    readonly name: string;
    constructor(spreadsheetId?: string | null);
    requestGASSpreadsheet(spreadsheetId: string): GoogleAppsScript.Spreadsheet.Spreadsheet;
}
declare function testValdiation(x: number, y: number): number;
declare function testTest(tap: GasTap): void;
declare function runGasTests(): any;
declare function sheetTap(tap: GasTap): void;
declare function spreadsheetTest(tap: GasTap): void;
