abstract class sheetObjectTranslator {
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

	// TODO: figure this out!
	// translate<sheetObject<T>>(): sheetObject<T>[] {
	// 	if(!this.sheet) throw 'Sheet is undefined!';
	//
	// 	this.sheet.values.forEach((rowData: any[], index: number): void => {
	// 		if(index == 0) return;
	//
	//
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
interface sheetObject<T> {
	(properties: T): sheetObject<T>
}
