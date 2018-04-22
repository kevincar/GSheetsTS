interface SheetObjectInterface {
	[property: string]: any;
}
interface SheetObjectInstance {

}

interface SheetObjectConstructor<T extends SheetObject> {
	new (data: SheetObjectInterface | null): T;
}

abstract class SheetObject implements SheetObjectInstance {
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
}
