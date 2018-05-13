function sheetObjectTap(tap: GasTap): void {

	let data = {
		cage: "KD1",
		ID: 1,
		Ear: 1,
		BackGround: null,
		AP: 3,
		DOB: 43165.00,
		Source: "KD #1",
		Sex: "M",
		Age: 84,
		"Project ID": "HF LC Td",
		Location: "ML 457",
		"Study Name": null,
		Note: null,
		Sac: null,
		Breeding: null,
		Request: null,
		"Genotyping Files": null,
		Cre1: "POS",
		Cre2: null,
		LF: null,
		MT: null,
		Td: "wt",
		HF: "het",
		LT: null,
		MG: null,
		HKi: null,
		EKo: null,
		EF: null,
		S4Ki: null,
		EraT: null,
		EOx: null,
		AtCe: null
	};
	let mouse: MouseObject = new MouseObject(data);

	tap.test("Constructor should work", (t: test) => {
		t.equal(mouse.cageId, "KD1", "cageID successfully transfered");
		t.equal(mouse.id, 1, "id");
		t.ok(mouse.genotypes, "genotypes should not be null");

		if(!mouse.genotypes) return;
		t.equal(typeof(mouse.genotypes.LF), "undefined", "no LF");
		t.equal(mouse.genotypes.HF, "het", "HF Genotype");
		t.equal(mouse.genotypes.LC, "POS", "LC genotype");
	});

	tap.test("getData should work", (t: test): void => {
		let destructed = mouse.getData();

		t.deepEqual(destructed, data, "getData mouse data for write");
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


