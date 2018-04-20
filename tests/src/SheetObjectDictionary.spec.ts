function sheetObjectDictionaryTap(tap: GasTap): void {

	let ss: Spreadsheet = new Spreadsheet();
	let sheet: Sheet = new Sheet(ss, "Mice");
	let sod = new SheetObjectDictionary(MouseObject, sheet);

	tap.test("Translation testing", (t: test) => {
		let objs: MouseObject[] = sod.translate();
		//Logger.log(objs[0]);

		t.notEqual(objs.length, 0, "Object.length is non-zero");

		t.equal(objs[0].id, "H2738", "First mouse object should equal H2738");
	});

	return;
}

