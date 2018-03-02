class sheetObjectTranslator {
	private sheet: Sheet | undefined;
	private dictionary: Dictionary | undefined;

	get objectPropertyNames(): string[] {
		if(!this.dictionary) throw 'Sheet is undefined!';

		return Object.keys(this.dictionary);
	}

	constructor(dictionary: Dictionary, sheet: Sheet) {
		this.dictionary = dictionary;
		this.sheet = sheet;
	}

	// private createObject(ctor: objectConstructor, values: objectInterface): objectInterface {
	// 	return new ctor(values);
	// }

	// TODO: figure this out!
	// translate<T>(): objectInterface[] {
	// 	if(!this.sheet) throw 'Sheet is undefined!';
	//
	// 	this.sheet.values.forEach((rowData: any[], index: number): void => {
	// 		if(index == 0) return;
	//
	// 		let curObject: objectInterface = this.createObject()
	// 		this.objectPropertyNames.forEach((propertyName: string): void => {
	// 			if(!this.dictionary) throw 'Dictionary is undfined!';
	// 			if(!this.sheet) throw 'Sheet is undefined!';
	// 			let sheetHeader: string = this.dictionary[propertyName];
	//
	// 			let columnNumber: number = this.sheet.headers.indexOf(sheetHeader);
	// 			let propertyValue: any = rowData[columnNumber];
	// 		});
	// 	});
	// }
}

interface Dictionary {
	// Dictionary[ObjectValue] = SheetHeader;
	[value: string]: string;
}

// TODO: Perhaps some interface for user-defined objects
// interface objectConstructor {
// 	new (values: objectInterface): objectInterface;
// }
//
// interface objectInterface {
// 	[property: string]: any;
// }
