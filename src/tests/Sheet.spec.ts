function sheetTap(tap: GasTap):void {

	let spreadsheet: Spreadsheet = new Spreadsheet();
	let testSheet: Sheet = new Sheet(spreadsheet, "Sheet1");

	tap.test("Sheet constructor should set the name", (t: test): void => {
		let observed: string = testSheet.name;
		let expected: string = "Sheet1";
		t.equal(observed, expected, "name is set");
	});

	tap.test("Sheet values should not be blank", (t: test): void => {
		let expectedJSON: string = '[["cage","ID","Ear","BackGround","AP","DOB","Source","Sex","Age","Project ID","Location","Study Name","Note","Sac","Breeding","Request","Genotyping Files","Cre1","Cre2","LF","MT","Td","HF","LT","MG","HKi","EKo","EF","S4Ki","EraT","EOx","AtCe"],["HC819","H2738",1,null,null,42565,"KD #23","M",84.57142857142857,"HF LC Td","ML 415",null,null,42719,null,null,null,"POS",null,null,null,"wt","het",null,null,null,null,null,null,null,null,null],["HC819","H2739",2,null,null,42565,"KD #23","M",84.57142857142857,"HF LC Td","ML 415",null,null,42719,null,null,null,"POS",null,null,null,"wt","homo",null,null,null,null,null,null,null,null,null],["HC819","H2740",3,null,null,42565,"KD #23","M",84.57142857142857,"HF LC Td","ML 415",null,null,42719,null,null,null,"WT",null,null,null,"wt","homo",null,null,null,null,null,null,null,null,null],["HC819","H2741",4,null,null,42565,"KD #23","M",84.57142857142857,"HF LC Td","ML 457","For Breeding",null,42818,42654,null,null,"POS",null,null,null,"het","homo",null,null,null,null,null,null,null,null,null],["HC819","H2742",5,null,null,42565,"KD #23","M",84.57142857142857,"HF LC Td","ML 415",null,null,42719,null,null,null,"POS",null,null,null,"wt","homo",null,null,null,null,null,null,null,null,null],["HC820A","H2743",1,null,null,42565,"KD #23","F",84.57142857142857,"HF LC Td","ML 457","LHA Gq-mCherry-DREADD_Feeding, drinking SNA, BP","Not Found (8/11/2017)",42958,null,null,null,"POS",null,null,null,"het","homo",null,null,null,null,null,null,null,null,null],["HC820","H2744",2,null,null,42565,"KD #23","F",84.57142857142857,"HF LC Td","ML 457","For Breeding",null,42818,42654,null,null,"WT",null,null,null,"het","homo",null,null,null,null,null,null,null,null,null]]';

		let expected: any[][] = JSON.parse(expectedJSON);
		t.deepEqual(JSON.stringify(testSheet.values), expectedJSON, "values are equal");
		t.notEqual([].length, testSheet.values.length, "values length");
	});
}
