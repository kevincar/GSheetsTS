interface SheetObjectInterface {
	[property: string]: any;
}
interface SheetObjectInstance {

}

interface SheetObjectConstructor<T extends SheetObject> {
	new (data: SheetObjectInterface | null): T;
}

abstract class SheetObject implements SheetObjectInstance {
	gDateConversion: number = 2209143600000;
	getData(): SheetObjectInterface {
		return new Array();
	}

	validate(data: SheetObjectInterface): boolean {
		let allValuesBad: boolean = Object.keys(data).reduce((result: boolean, curKey:string): boolean => {
			let value: any = data[curKey];
			let isValueBad: boolean = (value == undefined) || (value == null);
			return result && isValueBad;
		}, true);
		
		return !allValuesBad;
	}

	convertFromGDate(dateValue: string | number | null): Date | null {
		if(dateValue == null) return dateValue;

		if(typeof(dateValue) == 'string') {
			dateValue = parseInt(dateValue);
		}

		if(typeof(dateValue) != 'number' || isNaN(dateValue))
			throw `dateValue: ${dateValue} is not a string nor a number!`;

		let gTime: number = dateValue * 24 * 3600 * 1000;
		let gDate: Date = new Date(gTime);
		let convertedTime: number = gDate.getTime() - this.gDateConversion;
		return new Date(convertedTime);
	}

	convertToGDate(date: Date | null): number | null {
		if(date == null) return date;
		let convertedTime: number = date.getTime();
		let gTime: number = convertedTime + this.gDateConversion;
		let dateValue: number = gTime / (24 * 3600 * 1000);
		return dateValue;
	}
}
