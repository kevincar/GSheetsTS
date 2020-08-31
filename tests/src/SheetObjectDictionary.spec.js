function sheetObjectDictionaryTap(tap) {
    var ss = new Spreadsheet();
    var sheet = new Sheet(ss, "Mice");
    var sod = new SheetObjectDictionary(MouseObject, sheet);
    tap.test("Translation testing", function (t) {
        var objs = sod.translate();
        t.notEqual(objs.length, 0, "Object.length is non-zero");
        t.equal(objs[0].id, "H2738", "First mouse object should equal H2738");
    });
    tap.test("Write testing", function (t) {
        var writeSheet = new Sheet(ss, "WriteTest");
        Logger.log(writeSheet.values[0].length);
        Logger.log(writeSheet.headers.length);
        var writeMiceDict = new SheetObjectDictionary(MouseObject, writeSheet);
        var objs = writeMiceDict.translate();
        var originalSize = 7;
        // Duplicate last row. But if length is > 10, set back to original size
        var nMice = objs.length;
        if (nMice < 10) {
            var lastMouse = objs[nMice - 1];
            objs.push(lastMouse);
        }
        else {
            objs.splice(originalSize, objs.length - originalSize);
        }
        t.notThrow(function () {
            writeMiceDict.write(objs);
        }, "writing");
    });
    tap.test("dataObjectToValues", function (t) {
        var data = {
            a: "1",
            b: "2",
            d: "4",
            e: null,
            f: "6"
        };
        var values = SheetObjectDictionary.dataObjectToValues(data);
        t.equal(values[0], "1", "values test 1");
        t.equal(values[3], "", "values test 3");
    });
    tap.test("instanceToValueArray", function (t) {
        var peopleSheet = new Sheet(ss, "People");
        var peopleSOD = new SheetObjectDictionary(Person, peopleSheet);
        var people = peopleSOD.translate();
        var initial = people[0];
        var observed = peopleSOD.instanceToValueArray(initial);
        var expected = [
            "Eric", 5, 25, 33947
        ];
        if (observed == null)
            Logger.log("");
        else
            Logger.log(observed);
        Logger.log(expected);
        t.deepEqual(observed, expected, "proper instance translation");
        var mice = sod.translate();
        var firstMouse = mice[0];
        firstMouse.cageId = null;
        observed = sod.instanceToValueArray(firstMouse);
        t.equal(observed, null, "an instance that fails to validate should return null for a value array");
    });
    return;
}
