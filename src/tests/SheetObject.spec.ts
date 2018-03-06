function sheetObjectTap(tap: GasTap): void {

	let mouse: MouseObject = new MouseObject();

	tap.test("Constructor should work", (t: test) => {

	});		

}

class MouseObject extends SheetObject {
	/*
	 * Properties
	 */
	cageId: string | null = null;
	id: number | null = null;
	earId: number | null = null;
	background: string | null = null;
	animalAcct: number | null = null;
	DOB: Date | null = null;
	source: string | null = null;
	sex: string | null = null;
	strains: string[] | null = null;
	location: string | null = null;
	studyNames: string[] | null = null;
	notes: string | null = null;
	DOD: Date |  null = null;
	breedingDate: Date | null = null;
	genotypes: string | null = null;

	constructor(data?: SheetObjectInterface) {
		super();
		if(!data) return;

		this.cageId = data.genotypes;
		this.id = data.breedingDate;
		this.earId = data.DOD;
		this.background = data.notes;
		this.animalAcct = data.studyNames;
		this.DOB = data.location;
		this.source = data.strains;
		this.sex = data.sex;
		this.strains = data.source;
		this.location = data.DOB;
		this.studyNames = data.animalAcct;
		this.notes = data.background;
		this.DOD = data.earId;
		this.breedingDate = data.id;
		this.genotypes = data.cageId;

	}
}
