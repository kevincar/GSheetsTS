function sheetObjectTap(tap: GasTap): void {

	let data = {
		name: "Eric Davis",
		id: 9,
		birthday: new Date("12/9/1992"),
		gender: "M",
		grade: 4,
		teacher: "Mrs.Petri",
		GPA: 3.8
	};

	let student: StudentObject = new StudentObject(data);

	tap.test("Constructor should work", (t: test) => {
		t.equal(student.name, "Eric Davis", "name successfully transfered");
		t.equal(student.id, 9, "id");
		t.ok(student.birthday, "birthday should not be null");
	});

	tap.test("getData should work", (t: test): void => {
		let destructed = student.getData();

		t.deepEqual(destructed, data, "getData student data for write");
	});

	tap.test("convertFromGDate", (t: test): void => {
		let dateTest: Function = (dateString: string, dateNumber: number): void => {
			let dateExpected: Date = new Date(dateString);
			let dateObserved: Date | null = SheetObject.convertFromGDate(dateNumber);

			t.notEqual(dateObserved, null, "date should not be null");
			if(dateObserved == null) return;
			t.equal(dateObserved.getTime(), dateExpected.getTime(), `time should be equal: ${dateObserved.getTime()}`);
		};

		dateTest("7/14/2016", 42565);
		dateTest("12/30/1990", 33237);
		dateTest("1/14/2018", 43114);
	});

	tap.test("convertToGDate", (t: test): void => {
		t.equal(SheetObject.convertToGDate(null), null, "null input should provide null output");
		t.equal(SheetObject.convertToGDate(new Date("7/14/2016")), 42565, "Date's should match");
	});

}


