/// <reference path="../../node_modules/tsgast/types/gas-tap-lib.d.ts" />

function loadGasTap() {
	if(typeof(GasTap) === 'undefined') {
		let libraryURL: string = 'https://raw.githubusercontent.com/kevincar/gast/master/dist/gas-tap-lib.js';
		let libraryContent: string = UrlFetchApp.fetch(libraryURL).getContentText();
		eval(libraryContent);
	}
}

function testValdiation(x: number, y: number): number {
	return x+y;
}

function runGasTests(): string {
	loadGasTap();
	let tap: GasTap = new GasTap();

	tap.test('Test Validation', (t: test): void => {
		let a: number = 4;
		let b: number = 5;
		let expected: number = a+b;
		let observed: number = testValdiation(a, b);
		t.equal(observed, expected, 'test validation passed');
	});

	tap.finish();

	return Logger.getLog();
}
