declare function main(): any;
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
}
declare function testValdiation(x: number, y: number): number;
declare function testTest(tap: GasTap): void;
declare function runGasTests(): any;
declare function spreadsheetTest(tap: GasTap): void;
