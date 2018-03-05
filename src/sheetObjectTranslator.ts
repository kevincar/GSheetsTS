/// <reference path="./SheetObject" />

function f(): void {
	let ss: Spreadsheet = new Spreadsheet();
	let mouseSheet: Sheet = new Sheet(ss, "mouse");
	let mouseObjectDictionary = new SheetObjectDictionary(Mouse);
	let mouseTranslator = new SheetObjectTranslator(mouseObjectDictionary, mouseSheet, Mouse);
	return;
}

class Mouse extends SheetObject {
	cageId: string = "";
	id: number = 0;
}

class SheetObjectTranslator<T extends SheetObjectConstructor> {
	private sheet: Sheet | undefined;
	private objectCtor: T | undefined;
	private dictionary: SheetObjectDictionary<T> | undefined;

	get objectPropertyNames(): string[] {
		if(!this.dictionary) throw 'Sheet is undefined!';

		return Object.keys(this.dictionary);
	}

	constructor(dictionary: SheetObjectDictionary<T>, sheet: Sheet, objectCtor: T) {
		this.dictionary = dictionary;
		this.sheet = sheet;
		this.objectCtor = objectCtor;
	}

	// translate(): SheetObjectInstance[] {
	// 	if(!this.sheet) throw 'Sheet is undefined!';
	//
	// 	this.sheet.values.forEach((rowData: any[], index: number): void => {
	// 		if(index == 0) return;
	// 		if(!this.objectCtor) throw 'ctor is undefined!';
	//
	// 		let curObject: SheetObjectInstance = new this.objectCtor();
	// 		this.objectPropertyNames.forEach((propertyName: string): void => {
	// 			if(!this.dictionary) throw 'Dictionary is undfined!';
	// 			if(!this.sheet) throw 'Sheet is undefined!';
	// 			let sheetHeader: string = this.dictionary[propertyName];
	//
	// 			let columnNumber: number = this.sheet.headers.indexOf(sheetHeader);
	// 			let propertyValue: any = rowData[columnNumber];
	//
	// 			curObject.
	// 		});
	// 	});
	// }
}
