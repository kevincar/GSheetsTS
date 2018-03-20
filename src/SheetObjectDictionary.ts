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
		return this.sheet.values.map((rowData: any[], rowIndex: number): T => {
			if(this.ctor == null) throw `undefined constructor`;
			if(!this.sheet) throw `Sheet is undefined!`;
			if(rowIndex == 0) return new this.ctor({});

			let headers: any[] = this.sheet.headers;
			let data: any = {};

			headers.forEach((header: any, index: number) => {
				data[header] = rowData[index];
			});

			let instance: T = new this.ctor(data);
			return instance;

		}); 
	} 
}
