function sheetTap(tap) {
    var spreadsheet = new Spreadsheet();
    var testSheet = new Sheet(spreadsheet, "Mice");
    tap.test("Sheet constructor should set the name", function (t) {
        var observed = testSheet.name;
        var expected = "Mice";
        t.equal(observed, expected, "name is set");
    });
    tap.test("Sheet values should not be blank", function (t) {
        t.notEqual([].length, testSheet.values.length, "values length");
        t.notEqual([].length, testSheet.formulas.length, "formula length");
        t.notEqual([].length, testSheet.formats.length, "format length");
    });
    tap.test("A Non-existing sheet should throw an appropriate error", function (t) {
        t.throws(function () {
            new Sheet(spreadsheet, "NonExistantSheetName");
        }, "Non existant sheet throws error");
    });
    tap.test("Obtaining data with blank rows should not throw errors", function (t) {
        var sheet = new Sheet(spreadsheet, "People");
        t.notThrow(function () {
            var values = sheet.values;
        }, "blank rows processed without error");
    });
    tap.test("Cell Data with 0 number values should be 0 not undefined/null", function (t) {
        var peopleSheet = new Sheet(spreadsheet, "People");
        var sheetValues = peopleSheet.values;
        var calRow = sheetValues[5];
        var calAge = calRow[2];
        t.deepEqual(calAge, 0, "number values should not be undefined or null");
    });
    tap.test("headers", function (t) {
        var peopleSheet = new Sheet(spreadsheet, "People");
        peopleSheet.values = peopleSheet.values.map(function (rowData, index) {
            if (index != 0)
                return rowData;
            rowData[rowData.length] = undefined;
            return rowData;
        });
        var observed = peopleSheet.headers;
        var nHeaders = observed.length;
        var lastHeader = observed[nHeaders - 1];
        t.notEqual(lastHeader, undefined, "The end of the headers should be defined");
        t.notEqual(lastHeader, null, "The end of the headers should not be null");
    });
}
