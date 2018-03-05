class SheetObjectDictionary<T extends SheetObjectConstructor>{
	constructor(extendedSheetObject: T) {
		let temporaryObject = new extendedSheetObject();

	}
	[property: string]: any;

	// translate(sheet: Sheet): SheetObjectInstance[] {
	// 	sheet.values.forEach((rowData: any[], rowIndex: number) => {
	// 		if(rowIndex == 0) return;
	//
	// 	});
	// }
}
