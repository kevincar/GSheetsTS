function sheetTap(tap: GasTap):void {

	let spreadsheet: Spreadsheet = new Spreadsheet();
	let testSheet: Sheet = new Sheet(spreadsheet, "Sheet1");

	tap.test("Sheet constructor should set the name", (t: test): void => {
		let observed: string = testSheet.name;
		let expected: string = "Sheet1";
		t.equal(observed, expected, "name is set");
	});
}
