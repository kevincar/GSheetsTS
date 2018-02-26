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

	private get sheetId(): number {
		if(this._sheetId != null) return this._sheetId;

		this._sheetId = this.APISheet.properties.sheetId;

		return this._sheetId;
	}

	private get name(): string {
		if(this._name != null) return this._name;
		throw "Sheet: Name was never set in constructor!";
	}

	/*
	 * Methods
	 */

	constructor(parent: Spreadsheet, name: string) {
		this._parentSpreadsheet = parent;
		this._name = name;
	}
}
