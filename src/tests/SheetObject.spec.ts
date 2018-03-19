function sheetObjectTap(tap: GasTap): void {

	let data = {
		cageId: "KD1",
		id: 1,
		earId: 1,
		background: null,
		animalAcct: 3,
		DOB: new Date("3/6/18"),
		source: "KD #1",
		sex: "M",
		strains: "HF LC Td",
		location: "ML 457",
		studyNames: null,
		notes: null,
		DOD: null,
		breedingData: null,
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
	genotypes: Genotype | null = null;

	constructor(data: SheetObjectInterface) {
		super();
		if(!data) return;

		this.cageId = data.cageId;
		this.id = data.id;
		this.earId = data.earId;
		this.background = data.background;
		this.animalAcct = data.animalAcct;
		this.DOB = data.DOB;
		this.source = data.source;
		this.sex = data.sex;
		this.strains = this.processStrains(data.strains);
		this.location = data.location;
		this.studyNames = data.studyNames;
		this.notes = data.notes;
		this.DOD = data.DOD;
		this.breedingDate = data.breedingDate;
		
		this.genotypes = this.strains.reduce((curGenotype: Genotype, curStrain: string) => {
			let ogStrain: string = curStrain;
			if(curStrain.match(/C$/gi) != null) curStrain = "Cre1";
			curGenotype[ogStrain] = data[curStrain];
			return curGenotype;
		}, {});
	}

	private processStrains(strainsData: string): string[] {
		let strains: string[] = strainsData.split(" ");
		strains = strains.map((strain: string): string => {
			//Remove anything between parenthesis; e.g., EOx(L1)
			strain = strain.replace(/\(.*\)/gi, "");

			// Remove trailing parenthesis if they exist
			strain = strain.replace(/[\(|\)]/gi, "");

			return strain;
		});

		return strains;
	}
}

interface Genotype {
	[strain: string]: string;
}
