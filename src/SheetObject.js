var SheetObject = /** @class */ (function () {
    function SheetObject() {
    }
    SheetObject.prototype.getData = function () {
        var _this = this;
        return Object.keys(this).reduce(function (result, key) {
            result[key] = _this[key];
            return result;
        }, {});
    };
    SheetObject.prototype.validate = function (data) {
        var allValuesBad = Object.keys(data).reduce(function (result, curKey) {
            var value = data[curKey];
            var isValueBad = (value == undefined) || (value == null);
            return result && isValueBad;
        }, true);
        return !allValuesBad;
    };
    SheetObject.convertFromGDate = function (dateValue) {
        if (dateValue == null)
            return dateValue;
        if (dateValue instanceof Date)
            return dateValue;
        if (typeof (dateValue) == 'string') {
            if (dateValue == "")
                return null;
            dateValue = parseInt(dateValue);
        }
        if (typeof (dateValue) != 'number' || isNaN(dateValue))
            throw "dateValue: " + dateValue + " is not a string nor a number!";
        var gTime = dateValue * 24 * 3600 * 1000;
        var gDate = new Date(gTime);
        var convertedTime = gDate.getTime() + SheetObject.getConversionNumber(gDate);
        return new Date(convertedTime);
    };
    SheetObject.convertToGDate = function (date) {
        if (date == null)
            return date;
        var convertedTime = date.getTime();
        var gTime = convertedTime - SheetObject.getConversionNumber(date);
        var dateValue = gTime / (24 * 3600 * 1000);
        return dateValue;
    };
    SheetObject.getConversionNumber = function (date) {
        var UTCConversionNumber = SheetObject.gDateConversion;
        var STDoffset = date.getTimezoneOffset() * 60 * 1000;
        var oneHour = 1 * 60 * 60 * 1000;
        var STDConversionNumber = UTCConversionNumber + STDoffset;
        return STDConversionNumber;
    };
    SheetObject.isDaylightSavings = function (date) {
        return date.getTimezoneOffset() < SheetObject.getSTDTimezoneOffset(date);
    };
    SheetObject.getSTDTimezoneOffset = function (date) {
        var jan = new Date(date.getFullYear(), 0, 1);
        var jul = new Date(date.getFullYear(), 6, 1);
        return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    };
    SheetObject.gDateConversion = -2209161600000;
    return SheetObject;
}());
