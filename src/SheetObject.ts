interface SheetObjectInterface {
	[property: string]: any;
}
interface SheetObjectInstance {

}

interface SheetObjectConstructor<T extends SheetObject> {
	new (data: SheetObjectInterface | null): T;
}

abstract class SheetObject implements SheetObjectInstance {
	private static gDateConversion: number[] = [-2209143600000, -2209140000000];
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
		let convertedTime: number = gDate.getTime() + this.getConvNum(gDate);
		return new Date(convertedTime);
	}

	static convertToGDate(date: Date | null): number | null {
		if(date == null) return date;
		let convertedTime: number = date.getTime();
		let gTime: number = convertedTime - this.getConvNum(date);
		let dateValue: number = gTime / (24 * 3600 * 1000);
		return dateValue;
	}

	private static getStdTimezoneOffset(date: Date): number {
		let jan = new Date(date.getFullYear(), 0, 1);
		let jul = new Date(date.getFullYear(), 6, 1);
		return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
	}

	private static isDst(date: Date): boolean {
		return date.getTimezoneOffset() < SheetObject.getStdTimezoneOffset(date);
	}

	private static getConvNum(date: Date): number {
		let convIndex: number = SheetObject.isDst(date) ? 0 : 1;
		return SheetObject.gDateConversion[convIndex];
	}
}
