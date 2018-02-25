function testValdiation(x: number, y: number): number {
	return x+y;
}

function testTest(tap: GasTap): void {

	tap.test('Test Validation', (t: test): void => {
		let a: number = 4;
		let b: number = 5;
		let expected: number = a+b;
		let observed: number = testValdiation(a, b);
		t.equal(observed, expected, 'test validation passed');
	});

}
