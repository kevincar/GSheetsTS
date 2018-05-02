class SheetObjectDictionary<T extends SheetObject>{

	ctor: SheetObjectConstructor<T> | null = null;
	sheet: Sheet | null = null;

	constructor(ctor: SheetObjectConstructor<T>, sheet: Sheet) {
		this.ctor = ctor;
		this.sheet = sheet;
	}

	[property: string]: any;

	translate(): T[] {
		if(!this.sheet) throw `Sheet is undefined!`;
		let instances: T[] = Array();
		this.sheet.values.forEach((rowData: any[], rowIndex: number): void => {
			if(this.ctor == null) throw `undefined constructor`;
			if(!this.sheet) throw `Sheet is undefined!`;
			if(rowIndex == 0) return;

			let headers: any[] = this.sheet.headers;
			let data: any = {};

			headers.forEach((header: any, index: number) => {
				data[header] = rowData[index];
			});

			let instance: T = new this.ctor(data);
			if(!instance.validate(data)) return;
			instances.push(instance);
		}); 

		return instances;
	} 

	write(instances: T[]): boolean {

		if(!this.sheet) throw "cannot write to empty sheet";
		let values: any[][] = [];

		values[0] = this.sheet.headers;

		instances.forEach((obj: T): void => {
			let dataValues: any[] | null = this.instanceToValueArray(obj);
			if(dataValues == null) return;
			values.push(dataValues);
		});

		this.sheet.values = values;
		this.sheet.write();

		return true;
	}

	static dataObjectToValues(data: SheetObjectInterface): any[] {
		let propertyNames: string[] = Object.keys(data);

		return propertyNames.reduce((result: any[], curProperty: string): any => {
			let curValue: any = data[curProperty];
			if(curValue == null || curValue == undefined) curValue = "";
			result.push(curValue);
			return result;
		}, []);
	}

	instanceToValueArray(instance: T): any[] | null {
		let data: SheetObjectInterface = instance.getData();

		//if(!instance.validate(data) || data == {}) return null;

		return SheetObjectDictionary.dataObjectToValues(data);
	}
}
