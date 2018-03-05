interface SheetObjectInterface {
	[property: string]: any;
}
interface SheetObjectInstance {

}

interface SheetObjectConstructor {
	new (data?: SheetObjectInterface): SheetObjectInstance;
}

abstract class SheetObject implements SheetObjectInstance{}
