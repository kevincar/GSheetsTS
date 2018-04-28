interface SheetObjectInterface {
	[property: string]: any;
}
interface SheetObjectInstance {

}

interface SheetObjectConstructor<T extends SheetObject> {
	new (data: SheetObjectInterface | null): T;
}

abstract class SheetObject implements SheetObjectInstance {
	private static gDateConversion: number = -2209161600000;
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

	static convertFromGDate(dateValue: string | number | null): Date | null {
		if(dateValue == null) return dateValue;

		if(typeof(dateValue) == 'string') {
			dateValue = parseInt(dateValue);
		}

		if(typeof(dateValue) != 'number' || isNaN(dateValue))
			throw `dateValue: ${dateValue} is not a string nor a number!`;

		let gTime: number = dateValue * 24 * 3600 * 1000;
		let gDate: Date = new Date(gTime);
		let convertedTime: number = gDate.getTime() + SheetObject.getConversionNumber(gDate);
		return new Date(convertedTime);
	}

	static convertToGDate(date: Date | null): number | null {
		if(date == null) return date;
		let convertedTime: number = date.getTime();
		let gTime: number = convertedTime - SheetObject.getConversionNumber(date);
		let dateValue: number = gTime / (24 * 3600 * 1000);
		return dateValue;
	}

	private static getConversionNumber(date: Date): number {
		// +0 - 13/12 hour difference
		// -4 - 8 hour difference
		// -6 - 
		let UTCConversionNumber: number = SheetObject.gDateConversion;
		let STDoffset: number = date.getTimezoneOffset() * 60 * 1000;
		let oneHour: number = 1 * 60 * 60 * 1000;
		let STDConversionNumber: number = UTCConversionNumber + STDoffset;
		return STDConversionNumber;
	}

	static isDaylightSavings(date: Date): boolean {
		return date.getTimezoneOffset() < SheetObject.getSTDTimezoneOffset(date);
	}

	private static getSTDTimezoneOffset(date: Date): number {
		let jan: Date = new Date(date.getFullYear(), 0, 1);
		let jul: Date = new Date(date.getFullYear(), 6, 1);
		return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
	}

}
