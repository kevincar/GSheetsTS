function spreadsheetTest(tap: GasTap):void {

	tap.test("Spreadsheet constructor should give us the active spreadsheet", (t: test): void => {
		let expected: string = "GSheetsTS Test Sheet";
		let observed: string = (new Spreadsheet()).name;
		t.equal(observed, expected, "names are equal");
	});

}
