# Concept

Ideally to work with objects rather than constant manipulation of
two-dimensional arrays dings.

Sheet -> Dictionary -> Translation -> Data Object -> SheetObject

## Sheet
The sheet contains the raw data. The data within each column of each row is
described by a row header

## Dictionary
The Dictionary takes the sheet data and translates the two-dimensional array
into a data object where each row is represented as an object. The object's
properties correspond to the sheet row headers.

## SheetObject
The SheetObject is fed the data object. The data object can simply be either an
interface representation of the SheetObject, or if the SheetObject needs to
further parse the data given from the sheet then then the DataObject will simply
act as an intermediate between the two-dimensional sheet array and the final
SheetObject. SheetObject's must take a DataObject as their first parameter in
their constructors.
