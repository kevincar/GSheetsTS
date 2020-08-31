function spreadsheetTest(tap) {
    tap.test("Spreadsheet constructor should give us the active spreadsheet", function (t) {
        var expected = "GSheetsTS Test Sheet";
        var observed = (new Spreadsheet()).name;
        t.equal(observed, expected, "names are equal");
    });
    tap.test("Spreadsheet should give GASSheet object", function (t) {
        var ss = new Spreadsheet();
        var sheetName = "testSheet";
        var GASSheet = ss.requestGASSheet(sheetName);
        t.notEqual(GASSheet, null, "Should not be null");
    });
    tap.test("Spreadsheet should be able to create and delete a sheet", function (t) {
        var sheetName = "testSheet";
        var ss = new Spreadsheet();
        ss.createSheet(sheetName);
        var sheetFound = ss.sheetNames.filter(function (e) { return e == sheetName; }).length > 0;
        t.equal(sheetFound, true, "sheet created");
        ss.deleteSheet(sheetName);
        sheetFound = ss.sheetNames.filter(function (e) { return e == sheetName; }).length > 0;
        t.notEqual(sheetFound, false, "sheet deleted");
    });
    tap.test("isSheetExist", function (t) {
        var sheetName = "testSheet";
        var ss = new Spreadsheet();
        ss.deleteSheet(sheetName);
        t.equal(ss.isSheetExist(sheetName), false, "should not exist now");
        ss.createSheet(sheetName);
        t.equal(ss.isSheetExist(sheetName), false, "should exist now");
        ss.deleteSheet(sheetName);
    });
}
