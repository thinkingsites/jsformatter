jsformatter - A .Net style formatter for JavaScript
===========
jsformatter allows you to format strings by passing in a format and values.  It copies the implementation of the Microsoft .Net string formatting.

Documentation
=============
This module creates four new methods formatting strings.  

For a full documentation on formatting strings using this syntax, read this page: http://msdn.microsoft.com/en-us/library/26etazsy

My personal favorite reference for how to use the formatting has been SteveX's blog post: http://blog.stevex.net/string-formatting-in-csharp/

Configuration
=============

**jsformatter** allows you to configure how it's invoked. Configuration is achieved by creating a variable named *formatConfig* before the script tag:
```
	<script type="text/javascript">
		var formatConfig = {
			asPrototype = "true",
			asGlobal = "formatter"
		};
	</script>
	<script type="text/javascript" src="jsformatter.js"></script>
```

*asPrototype* adds the formatter to the prototype allowing directly from the value itself:
	
```	
	"{0:MM/dd/yyy}".format(christmas); // return "12/25/2012"
	123456["format"]("#,#.00"); // return "123,456.00"
	christmas.format("MM/dd/yyy"); // return "12/25/2012"
```	
	
*asGlobal* is a string create that a global variable by the same name giving access to the formatter.  
It is set to "formatter" by default, but can be set to *undefined* if global access is not desired.
``` 	
 	formatter.format("{0:MM/dd/yyy}",christmas); // return "12/25/2012"
``` 	
 	 	
**jsformatter** also supports require.js and can be invoked as follows:

```
 	require(["jsformatter"],function(formatter){
 		formatter.format("{0:MM/dd/yyy}",christmas);  // return "12/25/2012"
 	});
 ```
 
Global Variable Methods
=======================
When configured as a global variable or when used with require, these methods are exposed.

formatter.format(format[,argsN])
--------------------------------

 * **format** - The format of the string.  The format is indexed so as to reference the argumets by index
 * **argsN** - multiple arguments, seperarated by commas, to be passed into the format

```
	formatter.format("Today is {0:MM/dd/yyyy}!",new Date(2012,12,25,0,0,0,0)); // "Today is 12/25/2012!"
	formatter.format("Call me at {0:(###) ###-####}!",1234567890); // "Call me at (123) 456-7890!"
	formatter.format("Stocks rose by {0:#%} gaining {1} points on {2:dddd, dd\\t\\h of MMM}",0.05,39,new Date(2012,6,4,0,0,0,0)); // "Stocks rose by 5% gaining 39 points on Wednesday, 4th of Jul"
```

formatter.format(format,args)
--------------------------------

 * **format** - The format of the string.  The format is indexed so as to reference the argumets by index
 * **args** - an array of arguments, to be passed into the format

```
	formatter.format("Today is {0:MM/dd/yyyy}!",new Date(2012,12,25,0,0,0,0)); // "Today is 12/25/2012!"
	formatter.format("Call me at {0:(###) ###-####}!",1234567890); // "Call me at (123) 456-7890!"
	formatter.format("Stocks rose by {0:#%} gaining {1} points on {2:dddd, dd\\t\\h of MMM}",0.05,39,new Date(2012,6,4,0,0,0,0)); // "Stocks rose by 5% gaining 39 points on Wednesday, 4th of Jul"
```

formatter.formatValue(format,value)
-----------------------------------

 * **format** - The format of the value.  Unlike the *formatter.format* function, it is not indexed, and applies the format directly to the value.
 * **value** - The value to be formatted.  Only supports *Number* and *Date* values.

```
	formatter.formatValue("MM/dd/yyyy",christmas);  // returns "12/25/2012"
	formatter.formatValue("#,#.000",123456);  // returns "123,456.00"
```

Prototype Methods
=================

When added to the prototype, these methods are exposed.

String.prototype.format([,argsN])
---------------------------------

Formats a string.  Assumes that the string is the format, passing in the arguments. The format is indexed so as to reference the argumets by index

 * **argsN** - multiple arguments, seperarated by commas, to be passed into the format

```
	"Today is {0:MM/dd/yyyy}!".format(new Date(2012,12,25,0,0,0,0)); // returns "Today is 12/25/2012!"
	"Call me at {0:(###) ###-####}!".format(1234567890); // returns "Call me at (123) 456-7890!"
	"Stocks rose by {0:#%} gaining {1} points on {2:dddd, dd\\t\\h of MMM}".format(0.05,39,new Date(2012,6,4,0,0,0,0)); // returns "Stocks rose by 5% gaining 39 points on Wednesday, 4th of Jul"
```

Number.prototype.format(format)
---------------------

Allows you to format a number.  Invoking the format method must be done either by accessing the method through the indexer, or creating a new *Number* object
A current limitation of this implementation is that the number must be wrapped in a Number object to work.

 * **format** - The format applied to the *Number*.  This format is not indexed.

```
	123456['format']("#,#.00"); // returns "123,456.00"
	new Number(9).format("c"); // returns "$9.00"
```

Date.prototype.format(format)
-------------------

Allows you to format a date.

 * **format** - The format applied to the *Number*.  This format is not indexed.

```
	var date = new Date();
	date.format("MM/dd/yyyy"); // returns "12/25/2012"
```

Differences from .Net implementation
------------------------------------

There are several small differences between the .Net formatter and the jsformatter:

* backslashes require **double** backslashes to escape characters

	"{0:#\\##}".format(12); // returns "1#2"

References
==========

* http://msdn.microsoft.com/en-us/library/26etazsy
* http://blog.stevex.net/string-formatting-in-csharp/
