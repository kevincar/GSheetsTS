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
    values: any[][];
    readonly formulas: string[][];
    readonly formats: Sheets.CellFormat[][];
    readonly conditionalFormatRules: Sheets.ConditionalFormatRule[];
    readonly dataValidationRules: Sheets.DataValidationRule[][];
    readonly headers: any[];
    readonly nRows: number;
    readonly nColumns: number;
    constructor(parent: Spreadsheet, name: string);
    private extractValue(value);
    write(): boolean;
    private clear();
    sort(column: number, ascending?: boolean): void;
}
interface SheetObjectInterface {
    [property: string]: any;
}
interface SheetObjectInstance {
}
interface SheetObjectConstructor<T extends SheetObject> {
    new (data: SheetObjectInterface | null): T;
}
declare abstract class SheetObject implements SheetObjectInstance {
    gDateConversion: number;
    getData(): SheetObjectInterface;
    validate(data: SheetObjectInterface): boolean;
    convertFromGDate(dateValue: string | number | null): Date | null;
    convertToGDate(date: Date | null): number | null;
}
declare class SheetObjectDictionary<T extends SheetObject> {
    ctor: SheetObjectConstructor<T> | null;
    sheet: Sheet | null;
    constructor(ctor: SheetObjectConstructor<T>, sheet: Sheet);
    [property: string]: any;
    translate(): T[];
    write(instances: T[]): boolean;
}
declare class Spreadsheet {
    private _GASSpreadsheet;
    private _APISpreadsheet;
    private _spreadsheetId;
    private _name;
    private _sheetNames;
    private readonly GASSpreadsheet;
    private readonly APISpreadsheet;
    readonly spreadsheetId: string;
    readonly name: string;
    readonly sheetNames: string[];
    constructor(spreadsheetId?: string | null);
    requestGASSpreadsheet(spreadsheetId: string): GoogleAppsScript.Spreadsheet.Spreadsheet;
}
