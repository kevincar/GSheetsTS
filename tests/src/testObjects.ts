/*
 * Filename: testObjects.ts
 * Author: Kevin Davis
 *
 * Description
 * file that dfines various objects for testing
 */

class StudentObject extends SheetObject {
	/*
	* Properties
	*/
	name: string | null = null;
	id: number | null = null;
	birthday: Date | null = null;
	gender: string | null = null;
	grade: number | null = null;
	teacher: string | null = null;
	GPA: number | null = null;

	constructor(data: SheetObjectInterface | null) {
		super();
		if(!data) return;

		if(!this.validate(data)) return;

		this.name = data.name;
		this.id = data.id;
		this.birthday = data.birthday;
		this.gender = data.gender;
		this.grade = data.grade;
		this.teacher = data.teacher;
		this.GPA = data.GPA
	}

	validate(data: SheetObjectInterface): boolean {
		const is_undefined: boolean = data.id == undefined;
		const is_null: boolean = data.id == null;
		const is_not_valid: boolean = is_undefined || is_null;
		return !is_not_valid;
	}

	getData(): SheetObjectInterface {
		const data: SheetObjectInterface = {
			name: this.name,
			id: this.id,
			birthday: this.birthday,
			gender: this.gender,
			grade: this.grade,
			teacher: this.teacher,
			GPA: this.GPA
		};

		return data;

	}
}

class Person extends SheetObject {
	name: string | null = null;
	year: number | null = null;
	age: number | null = null;
	date: Date | null = null;

	constructor(data: SheetObjectInterface | null) {
		super();
		if(data == null) return;

		if(!this.validate(data)) return;

		this.name = data["Name"];
		this.year = data["Year"];
		this.age = data["Age"];
		this.date = SheetObject.convertFromGDate(data["Date"]);
	}

	validate(data: SheetObjectInterface): boolean {
		if(
			(data["Name"] == undefined) ||
			(data["Year"] == undefined) ||
			(data["Age"] == undefined) ||
			(data["Date"] == undefined)
		) return false;

		return true;
	}

	getData(): SheetObjectInterface {
		return {
			"Name": this.name,
			"Year": this.year,
			"Age": this.age,
			"Date": SheetObject.convertToGDate(this.date)
		};
	}
}
