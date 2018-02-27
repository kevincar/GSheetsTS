function main(): any {

	let ss: Spreadsheet = new Spreadsheet();
	let sheet: Sheet = new Sheet(ss, "Sheet1");

	Logger.log(sheet.values);
}
