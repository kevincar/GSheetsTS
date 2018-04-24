function sheetTap(tap: GasTap):void {

	let spreadsheet: Spreadsheet = new Spreadsheet();
	let testSheet: Sheet = new Sheet(spreadsheet, "Mice");

	tap.test("Sheet constructor should set the name", (t: test): void => {
		let observed: string = testSheet.name;
		let expected: string = "Mice";
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
		let sheet: Sheet = new Sheet(spreadsheet, "People");
		t.notThrow(() => {
			let values: any[][] = sheet.values;
		}, "blank rows processed without error");
	});

	tap.test("Cell Data with 0 number values should be 0 not undefined/null", (t: test): void => {
		let peopleSheet: Sheet = new Sheet(spreadsheet, "People");
		let sheetValues: any[][] = peopleSheet.values;
		let calRow: any[] = sheetValues[4];
		let calAge: number = calRow[2];

		t.deepEqual(calAge, 0, "number values should not be undefined or null");
	});
}
