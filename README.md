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
	eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/kevincar/GSheetsTS/master/dist/main.js').getContentText());
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

```typescript
class Student {
	
}
```
