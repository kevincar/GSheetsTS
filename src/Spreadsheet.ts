/// <reference path="../node_modules/googleapis/build/src/apis/sheets/v4" />

class Spreadsheet {
	/*
	 * Properties
	 */

	private _GASSpreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet | null = null;
	private _APISpreadsheet: Sheets.Spreadsheet | null = null;
	private _spreadsheetId: string | null = null;
	private _name: string | null = null;
	// private _sheets: Sheet[] | null = null;

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

	/*
	 * Methods
	 */

	constructor(spreadsheetId: string | null = null) {
		this._spreadsheetId = spreadsheetId;
	}

	requestGASSpreadsheet(spreadsheetId: string): GoogleAppsScript.Spreadsheet.Spreadsheet {
		if(spreadsheetId == this.spreadsheetId) return this.GASSpreadsheet;
		throw "Invalid spreadsheet ID";
	}

}
