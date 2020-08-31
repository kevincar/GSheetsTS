var SheetObjectDictionary = /** @class */ (function () {
    function SheetObjectDictionary(ctor, sheet) {
        this.ctor = null;
        this.sheet = null;
        this.ctor = ctor;
        this.sheet = sheet;
    }
    SheetObjectDictionary.prototype.translate = function () {
        var _this = this;
        if (!this.sheet)
            throw "Sheet is undefined!";
        var instances = Array();
        this.sheet.values.forEach(function (rowData, rowIndex) {
            if (_this.ctor == null)
                throw "undefined constructor";
            if (!_this.sheet)
                throw "Sheet is undefined!";
            if (rowIndex == 0)
                return;
            var headers = _this.sheet.headers;
            var data = {};
            headers.forEach(function (header, index) {
                data[header] = rowData[index];
            });
            var instance = new _this.ctor(data);
            if (!instance.validate(data))
                return;
            instances.push(instance);
        });
        return instances;
    };
    SheetObjectDictionary.prototype.write = function (instances) {
        var _this = this;
        if (!this.sheet)
            throw "cannot write to empty sheet";
        var values = [];
        values[0] = this.sheet.headers;
        instances.forEach(function (obj) {
            var dataValues = _this.instanceToValueArray(obj);
            if (dataValues == null)
                return;
            values.push(dataValues);
        });
        this.sheet.values = values;
        this.sheet.write();
        return true;
    };
    SheetObjectDictionary.dataObjectToValues = function (data) {
        var propertyNames = Object.keys(data);
        return propertyNames.reduce(function (result, curProperty) {
            var curValue = data[curProperty];
            if (curValue == null || curValue == undefined)
                curValue = "";
            result.push(curValue);
            return result;
        }, []);
    };
    SheetObjectDictionary.prototype.instanceToValueArray = function (instance) {
        var data = instance.getData();
        if (!instance.validate(data) || data == {})
            return null;
        return SheetObjectDictionary.dataObjectToValues(data);
    };
    return SheetObjectDictionary;
}());
