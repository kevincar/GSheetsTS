///// <reference path="../node_modules/googleapis/build/src/apis/sheets/v4" />

class Spreadsheet {
	/*
	 * Properties
	 */

	private _GASSpreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet | null = null;
	private _APISpreadsheet: Sheets.Spreadsheet | null = null;
	private _spreadsheetId: string | null = null;
	private _name: string | null = null;
	private _sheetNames: string[] | null = null;

	/*
	 * Accessors
	 */

	private get GASSpreadsheet(): GoogleAppsScript.Spreadsheet.Spreadsheet {
		if(this._GASSpreadsheet != null) return this._GASSpreadsheet;

		if(this._spreadsheetId == null) {
			this._GASSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
		}
		else {
			this._GASSpreadsheet = SpreadsheetApp.openById(this._spreadsheetId);
		}

		if(this._GASSpreadsheet == null) {
			throw "Error: Failed to obtain a spreadsheet";
		}

		return this._GASSpreadsheet;
	}

	private get APISpreadsheet(): Sheets.Spreadsheet {
		if(this._APISpreadsheet != null) return this._APISpreadsheet;

		this._APISpreadsheet = Sheets.Spreadsheets.get(this.spreadsheetId);

		return this._APISpreadsheet;
	}

	get spreadsheetId(): string {
		if(this._spreadsheetId != null) return this._spreadsheetId;

		this._spreadsheetId = this.GASSpreadsheet.getId();

		return this._spreadsheetId;
	}

	get name(): string {
		if(this._name != undefined) return this._name;

		this._name = this.GASSpreadsheet.getName();

		return this._name;
	}

	get sheetNames(): string[] {
		if(this._sheetNames != null) return this._sheetNames;

		this._sheetNames = this.APISpreadsheet.sheets.map((sheet: Sheets.Sheet): string => {
			return sheet.properties.title;
		});

		return this._sheetNames;
	}

	/*
	 * Methods
	 */

	constructor(spreadsheetId: string | null = null) {
		this._spreadsheetId = spreadsheetId;
	}

	requestGASSheet(sheetName: string): GoogleAppsScript.Spreadsheet.Sheet {
		return this.GASSpreadsheet.getSheetByName(sheetName);
	}

	isSheetExist(sheetName: string): boolean {
		return this.sheetNames.filter(e => e == sheetName).length > 0;
	}
	
	createSheet(sheetName: string): boolean {

		this.GASSpreadsheet.insertSheet(sheetName);
		this._sheetNames = null;

		return true;
	}

	deleteSheet(sheetName: string): boolean {
		
		let s: GoogleAppsScript.Spreadsheet.Sheet | null = this.GASSpreadsheet.getSheetByName(sheetName);
		if(s == null) {
			return false;
		}
		this.GASSpreadsheet.deleteSheet(s);
		return true;
	}
}
