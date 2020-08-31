/*
 * Filename: testObjects.ts
 * Author: Kevin Davis
 *
 * Description
 * file that dfines various objects for testing
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MouseObject = /** @class */ (function (_super) {
    __extends(MouseObject, _super);
    function MouseObject(data) {
        var _this = _super.call(this) || this;
        /*
        * Properties
        */
        _this.cageId = null;
        _this.id = null;
        _this.earId = null;
        _this.background = null;
        _this.animalAcct = null;
        _this.DOB = null;
        _this.source = null;
        _this.sex = null;
        _this.age = null;
        _this.strains = null;
        _this.originalStrains = null;
        _this.location = null;
        _this.studyNames = null;
        _this.notes = null;
        _this.DOD = null;
        _this.breedingDate = null;
        _this.request = null;
        _this.files = null;
        _this.genotypes = null;
        if (!data)
            return _this;
        if (!_this.validate(data))
            return _this;
        _this.cageId = data["cage"];
        _this.id = data.ID;
        _this.earId = data.Ear;
        _this.background = data.BackGround;
        _this.animalAcct = data.AP;
        _this.DOB = SheetObject.convertFromGDate(data.DOB);
        _this.source = data.Source;
        _this.sex = data.Sex;
        _this.age = data.Age;
        _this.strains = _this.processStrains(data["Project ID"]);
        _this.originalStrains = data["Project ID"];
        _this.location = data.Location;
        _this.studyNames = data["Study Name"];
        _this.notes = data.Note;
        _this.DOD = SheetObject.convertFromGDate(data.Sac);
        _this.breedingDate = data.Breeding;
        _this.request = data.Request;
        _this.files = data["Genotyping Files"];
        _this.genotypes = _this.strains.reduce(function (curGenotype, curStrain) {
            var ogStrain = curStrain;
            if (curStrain.match(/C$/gi) != null)
                curStrain = "Cre1";
            curGenotype[ogStrain] = data[curStrain];
            return curGenotype;
        }, {});
        return _this;
    }
    MouseObject.prototype.validate = function (data) {
        if (data["cage"] == undefined || data["cage"] == null)
            return false;
        return true;
    };
    MouseObject.prototype.getData = function () {
        // TODO: Objects are responsible for taking in data, then they need to be responsible for spitting it back out for writtin
        if (!this.genotypes)
            throw "Genotypes was not set appropriately";
        var data = {
            cage: this.cageId,
            ID: this.id,
            Ear: this.earId,
            BackGround: this.background,
            AP: this.animalAcct,
            DOB: SheetObject.convertToGDate(this.DOB),
            Source: this.source,
            Sex: this.sex,
            Age: this.age,
            "Project ID": this.originalStrains,
            Location: this.location,
            "Study Name": this.studyNames,
            Note: this.notes,
            Sac: SheetObject.convertToGDate(this.DOD),
            Breeding: this.breedingDate,
            Request: this.request,
            "Genotyping Files": this.files,
            Cre1: this.genotypes["LC"] == undefined ? null : this.genotypes["LC"],
            Cre2: this.genotypes["Cre2"] == undefined ? null : this.genotypes["Cre2"],
            LF: this.genotypes["LF"] == undefined ? null : this.genotypes["LF"],
            MT: this.genotypes["MT"] == undefined ? null : this.genotypes["MT"],
            Td: this.genotypes["Td"] == undefined ? null : this.genotypes["Td"],
            HF: this.genotypes["HF"] == undefined ? null : this.genotypes["HF"],
            LT: this.genotypes["LT"] == undefined ? null : this.genotypes["LT"],
            MG: this.genotypes["MG"] == undefined ? null : this.genotypes["MG"],
            HKi: this.genotypes["HKi"] == undefined ? null : this.genotypes["HKi"],
            EKo: this.genotypes["EKo"] == undefined ? null : this.genotypes["EKo"],
            EF: this.genotypes["EF"] == undefined ? null : this.genotypes["EF"],
            S4Ki: this.genotypes["S4Ki"] == undefined ? null : this.genotypes["S4Ki"],
            EraT: this.genotypes["EraT"] == undefined ? null : this.genotypes["EraT"],
            EOx: this.genotypes["EOx"] == undefined ? null : this.genotypes["EOx"],
            AtCe: this.genotypes["AtCe"] == undefined ? null : this.genotypes["AtCe"]
        };
        return data;
    };
    MouseObject.prototype.processStrains = function (strainsData) {
        if ((strainsData == null) || (strainsData == undefined))
            throw "Attempting to process a null string from mouse: " + this.id;
        var strains = strainsData.split(" ");
        strains = strains.map(function (strain) {
            //Remove anything between parenthesis; e.g., EOx(L1)
            strain = strain.replace(/\(.*\)/gi, "");
            // Remove trailing parenthesis if they exist
            strain = strain.replace(/[\(|\)]/gi, "");
            return strain;
        });
        return strains;
    };
    return MouseObject;
}(SheetObject));
var Person = /** @class */ (function (_super) {
    __extends(Person, _super);
    function Person(data) {
        var _this = _super.call(this) || this;
        _this.name = null;
        _this.year = null;
        _this.age = null;
        _this.date = null;
        if (data == null)
            return _this;
        if (!_this.validate(data))
            return _this;
        _this.name = data["Name"];
        _this.year = data["Year"];
        _this.age = data["Age"];
        _this.date = SheetObject.convertFromGDate(data["Date"]);
        return _this;
    }
    Person.prototype.validate = function (data) {
        if ((data["Name"] == undefined) ||
            (data["Year"] == undefined) ||
            (data["Age"] == undefined) ||
            (data["Date"] == undefined))
            return false;
        return true;
    };
    Person.prototype.getData = function () {
        return {
            "Name": this.name,
            "Year": this.year,
            "Age": this.age,
            "Date": SheetObject.convertToGDate(this.date)
        };
    };
    return Person;
}(SheetObject));
