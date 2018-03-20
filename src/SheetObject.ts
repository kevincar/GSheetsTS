interface SheetObjectInterface {
	[property: string]: any;
}
interface SheetObjectInstance {

}

interface SheetObjectConstructor<T extends SheetObject> {
	new (data: SheetObjectInterface): T;
}

abstract class SheetObject implements SheetObjectInstance{}
