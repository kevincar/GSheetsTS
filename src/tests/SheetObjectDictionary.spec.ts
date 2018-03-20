function SheetObjectDictionaryTap(tap: GasTap): void {

	let ss: Spreadsheet = new Spreadsheet();
	let sheet: Sheet = new Sheet(ss, "Sheet1");
	let sod = new SheetObjectDictionary(MouseObject, sheet);

	tap.test("Translation testing", (t: test) => {
		
	});

	return;
}
