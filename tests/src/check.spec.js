function testValdiation(x, y) {
    return x + y;
}
function testTest(tap) {
    tap.test('Test Validation', function (t) {
        var a = 4;
        var b = 5;
        var expected = a + b;
        var observed = testValdiation(a, b);
        t.equal(observed, expected, 'test validation passed');
    });
}
