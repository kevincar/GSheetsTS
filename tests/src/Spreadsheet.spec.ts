function spreadsheetTest(tap: GasTap):void {

	tap.test("Spreadsheet constructor should give us the active spreadsheet", (t: test): void => {
		let expected: string = "GSheetsTS Test Sheet";
		let observed: string = (new Spreadsheet()).name;
		t.equal(observed, expected, "names are equal");
	});

	tap.test("Spreadsheet should give GASSheet object", (t: test): void => {
		let ss: Spreadsheet = new Spreadsheet();
		let sheetName: string = "testSheet";
		let GASSheet: GoogleAppsScript.Spreadsheet.Sheet | null = ss.requestGASSheet(sheetName);
		t.notEqual(GASSheet, null, "Should not be null");
	});

	tap.test("Spreadsheet should be able to create and delete a sheet", (t: test): void => {
		let sheetName: string = "testSheet";
		let ss: Spreadsheet = new Spreadsheet();
		ss.createSheet(sheetName);
		
		let sheetFound: boolean = ss.sheetNames.filter((e) => {return e == sheetName;}).length > 0;
		t.equal(sheetFound, true, "sheet created");

		ss.deleteSheet(sheetName);
		sheetFound = ss.sheetNames.filter((e) => {return e == sheetName;}).length > 0;
		t.equal(sheetFound, false, "sheet deleted");
	});

	tap.test("isSheetExist", (t: test): void => {
		let sheetName: string = "testSheet";
		let ss: Spreadsheet = new Spreadsheet();

		ss.deleteSheet(sheetName);

		t.equal(ss.isSheetExist(sheetName), false, "should not exist now");

		ss.createSheet(sheetName);
		t.equal(ss.isSheetExist(sheetName), true, "should exist now");

		ss.deleteSheet(sheetName);
	});

}
