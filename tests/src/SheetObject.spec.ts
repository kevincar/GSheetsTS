function sheetObjectTap(tap: GasTap): void {

	let data = {
		cage: "KD1",
		ID: 1,
		Ear: 1,
		BackGround: null,
		AP: 3,
		DOB: new Date("3/6/18"),
		Source: "KD #1",
		Sex: "M",
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

	tap.test("Destructor should work", (t: test): void => {
		let destructed = mouse.destruct();

		t.deepEqual(destructed, data, "Desructed mouse data for write");
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
	private originalStrains: string[] | null = null;
	location: string | null = null;
	studyNames: string[] | null = null;
	notes: string | null = null;
	DOD: Date |  null = null;
	breedingDate: Date | null = null;
	request: string | null = null;
	files: string | null = null;
	genotypes: Genotype | null = null;

	constructor(data: SheetObjectInterface | null) {
		super();
		if(!data) return;

		this.cageId = data["cage"];
		this.id = data.ID;
		this.earId = data.Ear;
		this.background = data.BackGround;
		this.animalAcct = data.AP;
		this.DOB = data.DOB;
		this.source = data.Source;
		this.sex = data.Sex;
		this.strains = this.processStrains(data["Project ID"]);
		this.originalStrains = data["Project ID"];
		this.location = data.Location;
		this.studyNames = data["Study Name"];
		this.notes = data.Note;
		this.DOD = data.Sac;
		this.breedingDate = data.Breeding;
		this.request = data.Request;
		this.files = data["Genotyping Files"];
		
		this.genotypes = this.strains.reduce((curGenotype: Genotype, curStrain: string) => {
			let ogStrain: string = curStrain;
			if(curStrain.match(/C$/gi) != null) curStrain = "Cre1";
			curGenotype[ogStrain] = data[curStrain];
			return curGenotype;
		}, {});
	}

	destruct(): SheetObjectInterface {
		// TODO: Objects are responsible for taking in data, then they need to be responsible for spitting it back out for writtin

		if(!this.genotypes) throw "Genotypes was not set appropriately";

		Logger.log(this.genotypes);

		let data: SheetObjectInterface = {
			cage: this.cageId,
			ID: this.id,
			Ear: this.earId,
			BackGround: this.background,
			AP: this.animalAcct,
			DOB: this.DOB,
			Source: this.source,
			Sex: this.sex,
			"Project ID": this.originalStrains,
			Location: this.location,
			"Study Name": this.studyNames,
			Note: this.notes,
			Sac: this.DOD,
			Breeding: this.breedingDate,
			Request: this.request,
			"Genotyping Files": this.files,
			Cre1: this.genotypes["LC"] == undefined ? null : this.genotypes["LC"],
			Cre2: this.genotypes["Cre2"] == undefined ? null : this.genotypes["Cre2"],
			LF: this.genotypes["LF"] == undefined ? null : this.genotypes["LF"],
			MT: this.genotypes["MT"] == undefined ? null : this.genotypes["MT"],
			Td: this.genotypes["Td"] == undefined ? null : this.genotypes["Td"],
			HF: this.genotypes["HF"] == undefined ? null : this.genotypes["HF"],
			LT: this.genotypes["LT"] == undefined ? null : this.genotypes["LT"],
			MG: this.genotypes["MG"] == undefined ? null : this.genotypes["MG"],
			HKi: this.genotypes["HKi"] == undefined ? null : this.genotypes["HKi"],
			EKo: this.genotypes["EKo"] == undefined ? null : this.genotypes["EKo"],
			EF: this.genotypes["EF"] == undefined ? null : this.genotypes["EF"],
			S4Ki: this.genotypes["S4Ki"] == undefined ? null : this.genotypes["S4Ki"],
			EraT: this.genotypes["EraT"] == undefined ? null : this.genotypes["EraT"],
			EOx: this.genotypes["EOx"] == undefined ? null : this.genotypes["EOx"],
			AtCe: this.genotypes["AtCe"] == undefined ? null : this.genotypes["AtCe"]
		};

		return data;

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
