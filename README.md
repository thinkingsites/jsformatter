jsformatter - A .Net style formatter for JavaScript
===========
jsformatter allows you to format strings by passing in a format and values.  It copies the implementation of the Microsoft .Net string formatting.

Documentation
=============
This module creates four new methods formatting strings.  

For a full documentation on formatting strings using this syntax, read this page: http://msdn.microsoft.com/en-us/library/26etazsy

My personal favorite reference for how to use the formatting has been SteveX's blog post: http://blog.stevex.net/string-formatting-in-csharp/

String.prototype.format([,argsN])
---------------------------------

Allows you to create format a string from the format string itself.

	"Today is {0:MM/dd/yyyy}!".format(new Date(2012,12,25,0,0,0,0)); // "Today is 12/25/2012!"
	"Call me at {0:(###) ###-####}!".format(1234567890); // "Call me at (123) 456-7890!"
	"Stocks rose by {0:#%} gaining {1} points on {2:dddd, dd\\t\\h of MMM}".format(0.05,39,new Date(2012,6,4,0,0,0,0)); // "Stocks rose by 5% gaining 39 points on Wednesday, 4th of Jul"

String.format(format,[,argsN])
--------------------------------

Allows you to pass the format into a singleton function

	String.format("{0:000000}",1234); // "001234"
	String.format("{0} {1}","hello world"); // "hello world"

Number.format(format)
---------------------

Allows you to format a number.
A current limitation of this implementation is that the number must be wrapped in a Number object to work.

	new Number(9).format("c"); // "$9.00"
	new Number(12345.6789).format("#.##"); // "12345.68"

Date.format(format)
-------------------

Allows you to format a date

	var date = new Date();
	date.format("MM/dd/yyyy"); // "12/25/2012"

Differences from .Net implementation
------------------------------------

There are several small differences between the .Net formatter and the jsformatter:

* backslashes require **double** backslashes to escape characters
	"{0:#\\##}".format(12); // "1#2"

References
==========

* http://msdn.microsoft.com/en-us/library/26etazsy
* http://blog.stevex.net/string-formatting-in-csharp/
