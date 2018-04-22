[![Build Status](https://travis-ci.org/kevincar/GSheetsTS.svg?branch=master)](https://travis-ci.org/kevincar/GSheetsTS)

# GSheetsTS

Google Apps Scripts provides two methods for working with and manipulating
data from google spreadsheets:

- SpreadsheetApp
- SheetsAPI

This project merges functionality from both of these interfaces. It also adds
the option to work with data in a spreadsheet as an array of objects rather
than as a two-dimensional array. 

# Usage

```typescript
if(typeof(SheetObject) == 'undefined') {
	eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/kevincar/GSheetsTS/master/index.js').getContentText());
}
```

# Quickstart
 
 Name | Age | Gender
 --- | --- | ---
 Yan | 30 | M 
 Jordan | 25 | F
 Akos | 31 | M
 Natalia | 35 | F
 
1. Each spreadsheet should act as a list of objects Student Table
1. Create your class to model a record in the table
1. Load an array of class objects using the SheetObjectDictionary
1. Do what you want with the data
1. Write it back

```typescript
class Student extends SheetObject {

	name: string;
	age: number;
	gender: number;

	/* 
	 * The constructor is responsible for loading the data
	 * from the spreadsheet into the class. The data parameter
	 * will be an object of a row of data from the spreadsheet.
	 * the key values will match exactly the header values from
	 * the spreadsheet.
	 */
	constructor(data: SheetObjectInstance) {
		super();
		if(!data) return;

		this.name = data["Name"];
		this.age = data["Age"];
		this.gender: data["Gender"];

	}

	/*
	 * the getData method is required for writing data back to the
	 * spreadsheet after modifying data in the class object. The 
	 * key values of the returned object must match the column headers
	 * of the spreadsheet.
	 */
	getData(): SheetObjectInterface {
		return {
			"Name": this.name,
			"Age": this.age,
			"Gender": this.gender
		};
	}

	/*
	 * You can also add a validate function that determiens if the given
	 * row data should be supplied as an object. By Default, empty rows 
	 * are defined as invalid souch that you will not receive an array
	 * of empty objects if all you have is a row header.
	 */
	 validate(data: SheetObjectInstance): boolean {
	 	return true;
	 }
	
}
```

The SheetObjectDictionary class is responsible for taking your sheet and
object and giving back an array of class objects.

```TypeScript
// Get an instance of our google spreadsheet.
// This encapsulates GAS SpreadsheetApp.Spreadsheet
// as well ass SheetAPIv4.Spreadsheets
let spreadsheet: Spreadsheet = new Spreadsheet();

// We give the sheet constructor the name of the sheet
// we are refering to and the spreadsheet that owns it
let sheet: Sheet = new Sheet(spreadsheet, "Students");

// we create our dictionary by telling it what type of
// class objects it should associate with which sheet
let dict = new SheetObjectDictionary(Student, sheet);

let students: Student[] = dict.translate();

// Write them back to the spreadsheet
dict.write(students);
```
