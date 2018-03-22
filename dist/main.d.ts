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
    readonly conditionalFormatRules: Sheets.ConditionalFormatRule[];
    readonly dataValidationRules: Sheets.DataValidationRule[][];
    readonly headers: any[];
    readonly nRows: number;
    readonly nColumns: number;
    constructor(parent: Spreadsheet, name: string);
    private extractValue(value);
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
}
declare class SheetObjectDictionary<T extends SheetObject> {
    ctor: SheetObjectConstructor<T> | null;
    sheet: Sheet | null;
    constructor(ctor: SheetObjectConstructor<T>, sheet: Sheet);
    [property: string]: any;
    translate(): T[];
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
declare function sheetObjectTap(tap: GasTap): void;
declare class MouseObject extends SheetObject {
    cageId: string | null;
    id: number | null;
    earId: number | null;
    background: string | null;
    animalAcct: number | null;
    DOB: Date | null;
    source: string | null;
    sex: string | null;
    strains: string[] | null;
    location: string | null;
    studyNames: string[] | null;
    notes: string | null;
    DOD: Date | null;
    breedingDate: Date | null;
    genotypes: Genotype | null;
    constructor(data: SheetObjectInterface | null);
    private processStrains(strainsData);
}
interface Genotype {
    [strain: string]: string;
}
declare function sheetObjectDictionaryTap(tap: GasTap): void;
declare function spreadsheetTest(tap: GasTap): void;
