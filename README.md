jsformatter - A .Net style formatter for JavaScript
===========
jsformatter allows you to format strings by passing in a format and values.  It copies the implementation of the Microsoft .Net string formatting.


Installation
============
Supports Node, AMD loading, and inclusion in the head tag.

Documentation
=============
This module creates four new methods formatting strings.

For a full documentation on formatting strings using this syntax, read this page: http://msdn.microsoft.com/en-us/library/26etazsy

My personal favorite reference for how to use the formatting has been SteveX's blog post: http://blog.stevex.net/string-formatting-in-csharp/

Usage
=====

format(format[,argsN])
--------------------------------

 * **format** - The format of the string.  The format is indexed so as to reference the argumets by index
 * **argsN** - multiple arguments, seperarated by commas, to be passed into the format

```
	format("Today is {0:MM/dd/yyyy}!",new Date(2012,12,25,0,0,0,0)); // "Today is 12/25/2012!"
	format("Call me at {0:(###) ###-####}!",1234567890); // "Call me at (123) 456-7890!"
	format("Stocks rose by {0:#%} gaining {1} points on {2:dddd, dd\\t\\h of MMM}",0.05,39,new Date(2012,6,4,0,0,0,0)); // "Stocks rose by 5% gaining 39 points on Wednesday, 4th of Jul"
```

format(format,args)
--------------------------------

 * **format** - The format of the string.  The format is indexed so as to reference the argumets by index
 * **args** - an array of arguments, or an object to be passed into the format

```
	format("Today is {0:MM/dd/yyyy}!",new Date(2012,12,25,0,0,0,0)); // "Today is 12/25/2012!"
	format("Call me at {0:(###) ###-####}!",1234567890); // "Call me at (123) 456-7890!"
	format("Stocks rose by {0:#%} gaining {1} points on {2:dddd, dd\\t\\h of MMM}",0.05,39,new Date(2012,6,4,0,0,0,0)); // "Stocks rose by 5% gaining 39 points on Wednesday, 4th of Jul"
	format("{yolo} and {swag} are never acceptable words to say in public.", {
		yolo : "YOLO",
		swag : "SWAG"
	}); // "YOLO and SWAG are never acceptable words to say in public."
```

format.byValue(format,value)
-----------------------------------

 * **format** - The format of the value.  Unlike the *format(format,args)* function, it is not indexed, and applies the format directly to the value.
 * **value** - The value to be formatted.  Only supports *Number* and *Date* values or functions that return *Number* and *Date* values.

```
	format.byValue("MM/dd/yyyy",christmas);  // returns "12/25/2012"
	format.byValue("#,#.000",123456);  // returns "123,456.00"
```


Differences from .Net implementation
------------------------------------

There are several small differences between the .Net formatter and the jsformatter:

* backslashes require **double** backslashes to escape characters

```
	format("{0:#\\##}",12); // returns "1#2"
```

* an object can be passed into the argument, the formatter will format use the object's keys

```
	format("mary {verb} a {adjective} lamb", { verb : "had", adjective : "little "}); // returns "mary had a little lamb"
```

* the formatter will resolve all functions into their values

```
	format("mary {verb} a {adjective} lamb", {
		verb : function(){ return "had" },
		adjective : function(){ return "little" }
	}); // returns "mary had a little lamb"
```

References
==========

* http://msdn.microsoft.com/en-us/library/26etazsy
* http://blog.stevex.net/string-formatting-in-csharp/
