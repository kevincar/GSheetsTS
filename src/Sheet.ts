/// <reference path="../node_modules/googleapis/build/src/apis/sheets/v4" />

class Sheet {
	/*
	 * Properties
	 */

	private _parentSpreadsheet: Spreadsheet | null = null;
	private _GASSheet: GoogleAppsScript.Spreadsheet.Sheet | null = null;
	private _APISheet: Sheets.Sheet | null = null;
	private _sheetId: number | null = null;
	private _name: string | null = null;
	private _values: any[][] | null = null;
	private _formulas: string[][] | null = null;
	private _formats: Sheets.CellFormat[][] | null = null;
	private _conditionalFormats: Sheets.ConditionalFormatRule[] | null = null;
	private _dataValidations: Sheets.DataValidationRule[][] | null = null;

	/*
	 * Accessors
	 */

	private get parentSpreadsheet(): Spreadsheet {
		if(this._parentSpreadsheet != null) return this._parentSpreadsheet;
		throw "Sheet: Parent Spreadsheet not set!"
	}

	private get GASSheet(): GoogleAppsScript.Spreadsheet.Sheet {
		if(this._GASSheet != null) return this._GASSheet;

		let ss: GoogleAppsScript.Spreadsheet.Spreadsheet = this.parentSpreadsheet.requestGASSpreadsheet(this.parentSpreadsheet.spreadsheetId);
		this._GASSheet = ss.getSheetByName(this.name);

		return this._GASSheet;
	}

	private get APISheet(): Sheets.Sheet {
		if(this._APISheet != null) return this._APISheet;

		let options = {
			ranges: [
				`${this.name}`
			],
			includeGridData: true
		};

		let ssResponse: Sheets.Spreadsheet = Sheets.Spreadsheets.get(this.parentSpreadsheet.spreadsheetId, options);

		if(ssResponse.sheets.length < 1) throw "APISheet no data found";

		this._APISheet = ssResponse.sheets[0];

		return this._APISheet;
	}

	get sheetId(): number {
		if(this._sheetId != null) return this._sheetId;

		this._sheetId = this.APISheet.properties.sheetId;

		return this._sheetId;
	}

	get name(): string {
		if(this._name != null) return this._name;
		throw "Sheet: Name was never set in constructor!";
	}

	get values(): any[][] {
		if(this._values != null) return this._values;

		let values: any[][] = Array();

		this.APISheet.data.forEach((dataSegment: Sheets.GridData): void => {
			dataSegment.rowData.forEach((rowData: Sheets.RowData, rowN: number): void => {
				let curRow: number = dataSegment.startRow?dataSegment.startRow + rowN:rowN;
				if(rowData.values === undefined) {
					values[curRow] = new Array();
					return;
				}
				rowData.values.forEach((cellData: Sheets.CellData, columnN: number): void => {
					let curColumn: number = dataSegment.startColumn?dataSegment.startColumn + columnN:columnN;
					if(values[curRow] == undefined) values[curRow] = new Array();
					values[curRow][curColumn] = this.extractValue(cellData.effectiveValue);
				});
			});
		});

		this._values = values;

		return this._values;
	}

	set values(val: any[][]) {
		if(!this._values) this.values;
		if(!this._values) throw "Sheet Object is attempting to set values and values failed to set";
		this._values = val;
	}

	get formulas(): string[][] {
		if(this._formulas != null) return this._formulas;

		let formulas: string[][] = Array();

		this.APISheet.data.forEach((dataSegment: Sheets.GridData): void => {
			dataSegment.rowData.forEach((rowData: Sheets.RowData, rowN: number): void => {
				rowData.values.forEach((cellData: Sheets.CellData, columnN: number): void => {
					let curRow: number = dataSegment.startRow?dataSegment.startRow + rowN:rowN;
					let curColumn: number = dataSegment.startColumn?dataSegment.startColumn + columnN:columnN;
					if(formulas[curRow] == undefined) formulas[curRow] = new Array();
					formulas[curRow][curColumn] = this.extractValue(cellData.userEnteredValue);
				});
			});
		});

		this._formulas = formulas;

		return this._formulas;
	}

	get formats(): Sheets.CellFormat[][] {
		if(this._formats != null) return this._formats;

		let formats: Sheets.CellFormat[][] = Array();

		this.APISheet.data.forEach((dataSegment: Sheets.GridData): void => {
			dataSegment.rowData.forEach((rowData: Sheets.RowData, rowN: number): void => {
				rowData.values.forEach((cellData: Sheets.CellData, columnN: number): void => {
					let curRow: number = dataSegment.startRow?dataSegment.startRow + rowN:rowN;
					let curColumn: number = dataSegment.startColumn?dataSegment.startColumn + columnN:columnN;
					if(formats[curRow] == undefined) formats[curRow] = new Array();
					formats[curRow][curColumn] = cellData.userEnteredFormat;
				});
			});
		});

		this._formats = formats;

		return this._formats;
	}

	get conditionalFormatRules(): Sheets.ConditionalFormatRule[] {
		if(this._conditionalFormats != null) return this._conditionalFormats;

		this._conditionalFormats = this.APISheet.conditionalFormats;

		return this._conditionalFormats;
	}

	get dataValidationRules(): Sheets.DataValidationRule[][] {
		if(this._dataValidations != null) return this._dataValidations;

		let dataValidations: Sheets.DataValidationRule[][] = new Array();

		this.APISheet.data.forEach((dataSegment: Sheets.GridData): void => {
			dataSegment.rowData.forEach((rowData: Sheets.RowData, rowN: number): void => {
				rowData.values.forEach((cellData: Sheets.CellData, columnN: number): void => {
					let curRow: number = dataSegment.startRow?dataSegment.startRow + rowN:rowN;
					let curColumn: number = dataSegment.startColumn?dataSegment.startColumn + columnN:columnN;
					if(dataValidations[curRow] == undefined) dataValidations[curRow] = new Array();
					dataValidations[curRow][curColumn] = cellData.dataValidation;
				});
			});
		});

		this._dataValidations = dataValidations;

		return this._dataValidations;
	}

	get headers(): any[] {
		let headers: any[] = this.values[0];
		let nHeaders: number = headers.length;
		let i: number = nHeaders - 1;
		let lastHeader: any = headers[i];

		while((i >= 0) && (lastHeader == undefined) || (lastHeader == null)) {
			lastHeader = headers[--i];
		}
		i++;

		headers.splice(i, nHeaders - i);
		return headers;
	}

	get nRows(): number {
		return this.APISheet.properties.gridProperties.rowCount;
	}

	get nColumns(): number {
		return this.APISheet.properties.gridProperties.columnCount;
	}

	/*
	 * Methods
	 */

	constructor(parent: Spreadsheet, name: string) {
		this._parentSpreadsheet = parent;
		this._name = name;
		if(parent.sheetNames.indexOf(name) == -1) throw `Cannot find sheet with the name ${name}`;
	}

	private extractValue(value: Sheets.ExtendedValue): any {
		if(value == undefined) return undefined;
		else if(value.boolValue != undefined) return value.boolValue;
		else if(value.errorValue != undefined) return value.errorValue;
		else if(value.formulaValue != undefined) return value.formulaValue;
		else if(value.numberValue != undefined) return value.numberValue;
		else if(value.stringValue != undefined) return value.stringValue;

	}

	write(): boolean {
		let nRows: number = this.values.length;
		let nColumns: number = this.values[0].length;

		this.clear();
		this.GASSheet.getRange(1, 1, nRows, nColumns).setValues(this.values);

		return true;
	}

	private clear(): boolean {

		this.GASSheet.getRange(1, 1, this.nRows, this.nColumns).clearContent();
		
		return true;
	}

	sort(column: number, ascending: boolean = false): void {
		/*
		 * Sort
		 *
		 * Parameters
		 * column - the column to sort first column is column 1 not 0
		 * ascending - whether to sort in ascending fashion
		 */
		this.GASSheet.sort(column, ascending);
	}
}
