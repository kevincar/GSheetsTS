function sheetObjectDictionaryTap(tap: GasTap): void {

	let ss: Spreadsheet = new Spreadsheet();
	let sheet: Sheet = new Sheet(ss, "Mice");
	let sod = new SheetObjectDictionary(MouseObject, sheet);

	tap.test("Translation testing", (t: test) => {
		let objs: MouseObject[] = sod.translate();

		t.notEqual(objs.length, 0, "Object.length is non-zero");

		t.equal(objs[0].id, "H2738", "First mouse object should equal H2738");
	});

	tap.test("Write testing", (t: test): void => {
		let writeSheet: Sheet = new Sheet(ss, "WriteTest");
		Logger.log(writeSheet.values[0].length);
		Logger.log(writeSheet.headers.length);
		let writeMiceDict: SheetObjectDictionary<MouseObject> = new SheetObjectDictionary(MouseObject, writeSheet);
		let objs: MouseObject[] = writeMiceDict.translate();
		let originalSize: number = 7;

		// Duplicate last row. But if length is > 10, set back to original size
		let nMice: number = objs.length;
		if(nMice < 10) {
			let lastMouse: MouseObject = objs[nMice-1];
			objs.push(lastMouse);
		}
		else {
			objs.splice(originalSize, objs.length-originalSize);
		}
		t.notThrow((): void => {
			writeMiceDict.write(objs);
		}, "writing");
	});

	tap.test("dataObjectToValues", (t: test): void => {
		let data = {
			a: "1",
			b: "2",
			d: "4",
			e: null,
			f: "6"
		};

		let values: any[] = SheetObjectDictionary.dataObjectToValues(data);
		t.equal(values[0], "1", "values test 1");
		t.equal(values[3], "", "values test 3");
	});

	tap.test("instanceToValueArray", (t: test): void => {
		Logger.log("Need to implement");
	});

	return;
}

