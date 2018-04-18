function sheetTap(tap: GasTap):void {

	let spreadsheet: Spreadsheet = new Spreadsheet();
	let testSheet: Sheet = new Sheet(spreadsheet, "Sheet1");

	tap.test("Sheet constructor should set the name", (t: test): void => {
		let observed: string = testSheet.name;
		let expected: string = "Sheet1";
		t.equal(observed, expected, "name is set");
	});

	tap.test("Sheet values should not be blank", (t: test): void => {
		t.notEqual([].length, testSheet.values.length, "values length");
		t.notEqual([].length, testSheet.formulas.length, "formula length");
		t.notEqual([].length, testSheet.formats.length, "format length");
	});

	tap.test("A Non-existing sheet should throw an appropriate error", (t:test): void => {
		t.throws(() => {
			new Sheet(spreadsheet, "NonExistantSheetName");
		},"Non existant sheet throws error");
	});

	tap.test("Obtaining data with blank rows should not throw errors", (t: test): void => {
		let sheet: Sheet = new Sheet(spreadsheet, "Sheet2");
		t.notThrow(() => {
			let values: any[][] = sheet.values;
		}, "blank rows processed without error");
	});
}
