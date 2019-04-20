function spreadsheetTest(tap: GasTap):void {

	tap.test("Spreadsheet constructor should give us the active spreadsheet", (t: test): void => {
		let expected: string = "GSheetsTS Test Sheet";
		let observed: string = (new Spreadsheet()).name;
		t.equal(observed, expected, "names are equal");
	});

	tap.test("Spreadsheet should be able to create and delete a sheet", (t: test): void => {
		let sheetName: string = "testSheet";
		let ss: Spreadsheet = new Spreadsheet();
		ss.createSheet(sheetName);
		
		let sheetFound: boolean = ss.sheetNames.filter((e) => {return e == sheetName;}).length > 0;
		t.equal(sheetFound, true, "sheet created");

		ss.deleteSheet(sheetName);
		sheetFound = ss.sheetNames.filter((e) => {return e == sheetName;}).length > 0;
		t.notEqual(sheetFound, false, "sheet deleted");
	});

}
