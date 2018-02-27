/// <reference path="../../node_modules/tsgast/index" />

// Load GasTap
if(typeof(GasTap) === 'undefined') {
	let libraryURL: string = 'https://raw.githubusercontent.com/kevincar/gast/master/index.js';
	let libraryContent: string = UrlFetchApp.fetch(libraryURL).getContentText();
	eval(libraryContent);
}

function runGasTests(): any {
	let tap: GasTap = new GasTap();

	/*
	 * INSERT TEST FUNCTIONS HERE.
	 */
	testTest(tap);
	spreadsheetTest(tap);
	sheetTap(tap);

	let tp: tapResults = tap.finish();

	return {
		log: Logger.getLog(),
		results: tp
	};
}
