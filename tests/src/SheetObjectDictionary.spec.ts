function sheetObjectDictionaryTap(tap: GasTap): void {

	let ss: Spreadsheet = new Spreadsheet();
	let sheet: Sheet = new Sheet(ss, "Students");
	let sod = new SheetObjectDictionary(StudentObject, sheet);

	tap.test("Translation testing", (t: test) => {
		let objs: StudentObject[] = sod.translate();

		t.notEqual(objs.length, 0, "Object.length is non-zero");
		Logger.log(`Object Length: {objs.length}`);
		t.equal(objs[0].id, 9, "First student object should equal 9");
	});

	tap.test("Write testing", (t: test): void => {
		let writeSheet: Sheet = new Sheet(ss, "WriteTest");
		Logger.log(writeSheet.values[0].length);
		Logger.log(writeSheet.headers.length);
		let writeStudentDict: SheetObjectDictionary<StudentObject> = new SheetObjectDictionary(StudentObject, writeSheet);
		let objs: StudentObject[] = writeStudentDict.translate();
		let originalSize: number = 7;

		// Duplicate last row. But if length is > 10, set back to original size
		let nStudent: number = objs.length;
		if(nStudent < 10) {
			let lastStudent: StudentObject = objs[nStudent-1];
			objs.push(lastStudent);
		}
		else {
			objs.splice(originalSize, objs.length-originalSize);
		}
		t.notThrow((): void => {
			writeStudentDict.write(objs);
		}, "writing");
	});

	tap.test("dataObjectToValues", (t: test): void => {
		let sheet: Sheet = new Sheet(ss, "ColShiftTest");
		let sod: SheetObjectDictionary<StudentObject> = new SheetObjectDictionary(StudentObject, sheet);
		let data = {
			name: "James",
			id: 2,
			birthday: new Date("9/30/1997"),
			gender: "M",
			grade: 2,
			teacher: "Mrs. Morning",
			GPA: 2.0
		};
		let values: any[] = sod.dataObjectToValues(data);
		t.equal(values[0], "2", "id sorted to first value");
		t.equal(values[1], "James", "name sorted to second value");
	});

	tap.test("instanceToValueArray", (t: test): void => {
		let peopleSheet: Sheet = new Sheet(ss, "People");
		let peopleSOD: SheetObjectDictionary<Person> = new SheetObjectDictionary(Person, peopleSheet);
		let people: Person[] = peopleSOD.translate();
		let initial: Person = people[0];
		let observed: any[] | null = peopleSOD.instanceToValueArray(initial);
		let expected: any[] = [
			"Billy", 1, 12, 35537.958333333336
		];

		if(observed == null) Logger.log("");
		else Logger.log(observed);
		Logger.log(expected);
		t.deepEqual(observed, expected, "proper instance translation");

		let students: StudentObject[] = sod.translate();
		let firstStudent: StudentObject = students[0];
		firstStudent.id = null;
		observed = sod.instanceToValueArray(firstStudent);
		t.equal(observed, null, "an instance that fails to validate should return null for a value array");
	});

	tap.test("Column Shift Test", (t: test): void => {
		let columnShiftSheet: Sheet = new Sheet(ss, "ColShiftTest");
		let studentSOD: SheetObjectDictionary<StudentObject> = new SheetObjectDictionary(StudentObject, columnShiftSheet);
		let students: StudentObject[] = studentSOD.translate();
		let initial: StudentObject = students[0];
		let observed: number | null = initial.id;
		let expected: number = 9;
		t.equal(observed, expected, "IDs did match when columns shifted");

		// Duplicate the row
	});
	return;
}

