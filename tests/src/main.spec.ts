/// <reference path="../../node_modules/tsgast/index" />

// Load GasTap
if(typeof(GasTap) === 'undefined') {
	let libraryURL: string = 'https://raw.githubusercontent.com/kevincar/gast/master/index.js';
	let libraryContent: string = UrlFetchApp.fetch(libraryURL).getContentText();
	eval(libraryContent);
}

function runGasTests(): any {
	let logs: string[] = [];

	let logger: (msg: string) => void = (msg: string): void => {
		logs.push(msg);
	};
	let gasTapOptions: IOptions = {
		loggerFunc: logger
	};
	let tap: GasTap = new GasTap(gasTapOptions);

	/*
	 * INSERT TEST FUNCTIONS HERE.
	 */
	testTest(tap);
	spreadsheetTest(tap);
	sheetTap(tap);
	sheetObjectTap(tap);
	sheetObjectDictionaryTap(tap);

	let tp: tapResults = tap.finish();

	logs.push(JSON.stringify(tp));

	return logs;
}
