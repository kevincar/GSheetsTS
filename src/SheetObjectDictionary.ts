class SheetObjectDictionary<T extends SheetObjectConstructor, U extends SheetObjectInstance>{

	sheet: Sheet | null = null;

	constructor(extendedSheetObject: T, sheet: Sheet) {
		let temporaryObject = new extendedSheetObject();
		this.sheet = sheet;
	}

	[property: string]: any;

	//translate(): U[] {
		//sheet.values.forEach((rowData: any[], rowIndex: number) => {
			//if(rowIndex == 0) return;

			//let data: any = {};
	
		//}); 
	//} 
}
