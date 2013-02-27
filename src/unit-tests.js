var callback = (function($){
	$(function(){
		var myregex = function(){
			return /\{(\d+)(,-?\d+)?(:.*?)?\}/gi;
		};
		module("testing regex");
		test("match one basic",function(){
			equal("{0}".match(myregex()).length,1);
		});
		test("match two basic",function(){
			equal("{0} {1}".match(myregex()).length,2);
		});
		test("match one with positive alignment",function(){
			equal("{0,10}".match(myregex()).length,1);
		});
		test("match one with negative alignment",function(){
			equal("{0,-10}".match(myregex()).length,1);
		});
		test("match two with alternating alignment",function(){
			equal("{0,-10} {0,10}".match(myregex()).length,2);
		});
		test("match one with format",function(){
			equal("{0:$##.##}".match(myregex()).length,1);
		});
		test("match two with format",function(){
			equal("{0:$##.##} {1:yy/mm/dd}".match(myregex()).length,2);
		});
		test("match two with format and alignment",function(){
			equal("{0,10:$##.##} {1,-10:yy/mm/dd}".match(myregex()).length,2);
		});
		
		test("get index, padding and format",function(){
			var match = myregex().exec("{0,10:$##.##}");
			equal(match[1], "0");
			equal(match[2], ",10"); 
			equal(match[3], ":$##.##");
		});
		
		module("testing string.prototype.format with dates");
		test("isNaN",function(){
			ok(!isNaN(9));
			ok(!isNaN("9"));
			ok(!isNaN(new Number(9)));
			ok(!isNaN(new Number("9")));
			ok(!isNaN(9.99));
			ok(!isNaN("9.99"));
			ok(!isNaN(new Number(9.99)));
			ok(!isNaN(new Number("9.99")));
		});
		
		module("testing string.prototype.format with dates");
		var mytestdate = new Date(2010,11,25,22,30,29,55);
		test("basic format with string",function(){
			equal("hello {0}!".format("world") , "hello world!");
		});
		test("format with string with right padding",function(){
			equal("hello {0,10}!".format("world"), "hello world     !");
		});
		test("format with string with left padding",function(){
			equal("hello {0,-10}!".format("world"), "hello      world!");
		});
		test("format with US date format ",function(){
			equal("{0:MM/dd/yyyy}!".format(mytestdate), "12/25/2010!");
		});
		test("all date shortcuts",function(){
			equal("{0:d}".format(mytestdate),"25/12/2010");
			equal("{0:D}".format(mytestdate),"December 25, 2010");
			equal("{0:t}".format(mytestdate),"10:30 PM");
			equal("{0:T}".format(mytestdate),"10:30:29 PM");
			equal("{0:f}".format(mytestdate),"December 25, 2010 10:30 PM");
			equal("{0:F}".format(mytestdate),"December 25, 2010 10:30:29 PM");
			equal("{0:g}".format(mytestdate),"25/12/2010 10:30 PM");
			equal("{0:G}".format(mytestdate),"25/12/2010 10:30:29 PM");
			equal("{0:M}".format(mytestdate),"December 25");
			equal("{0:r}".format(mytestdate),"Sat, 25 Dec 2010 10:30:29 GMT");
			equal("{0:s}".format(mytestdate),"2010-12-25T10:30:29");
			equal("{0:u}".format(mytestdate),"2010-12-25 10:30:29Z");
			equal("{0:U}".format(mytestdate),"December 25,2010 10:30:29 PM");
			equal("{0:Y}".format(mytestdate),"December, 2010");
		});
		test("all custom date formats",function(){
			equal("{0:dd}".format(mytestdate),"25");
			equal("{0:ddd}".format(mytestdate),"Sat");
			equal("{0:dddd}".format(mytestdate),"Saturday");
			equal("{0:hh}".format(mytestdate),"10");
			equal("{0:HH}".format(mytestdate),"22");
			equal("{0:mm}".format(mytestdate),"30");
			equal("{0:MM}".format(mytestdate),"12");
			equal("{0:MMM}".format(mytestdate),"Dec");
			equal("{0:MMMM}".format(mytestdate),"December");
			equal("{0:ss}".format(mytestdate),"29");
			equal("{0:tt}".format(mytestdate),"PM");
			equal("{0:yy}".format(mytestdate),"10");
			equal("{0:yyyy}".format(mytestdate),"2010");
			
			function pad(number, length) {  
			    var str = '' + number;
			    while (str.length < length) {
			        str = '0' + str;
			    }
			    return str;
			}
			
			var offset = mytestdate.getTimezoneOffset();
			var offsethours = pad(offset/60,2);
			var offsetmins = pad(offset%60,2);
			var sign = offset > 0 ? "-" : "";
			
			equal("{0:zz}".format(mytestdate), sign + offsethours);
			equal("{0:zzz}".format(mytestdate), sign + offsethours +":" + offsetmins);
		});
		test("multiple & repeating dates in one format ",function(){
			equal(
				"{0:MM/dd/yyyy} {1:MM/dd/yyyy} {2:U} {3:U}!".format(mytestdate,mytestdate,mytestdate,mytestdate),
				"12/25/2010 12/25/2010 December 25,2010 10:30:29 PM December 25,2010 10:30:29 PM!");
		});
		module("testing string.prototype.format with standard number formats");
		test("all basic number shortcuts (except for G) with integer input (both-cases)",function(){
			var myInt1 = -12400;
			var myInt2 = 546;
			equal("{0:c} {1:C}".format(myInt1,myInt2), "-$12,400.00 $546.00");
			equal("{0:d} {1:D}".format(myInt1,myInt2), "-12400 546");
			equal("{0:e} {1:E}".format(myInt1,myInt2), "-1.240000E+4 5.460000E+2");
			equal("{0:f} {1:F}".format(myInt1,myInt2), "-12400.00 546.00");
			equal("{0:n} {1:N}".format(myInt1,myInt2), "-12,400.00 546.00");
			equal("{0:r} {1:R}".format(myInt1,myInt2), "-12400 546");
			equal("{0:x} {1:X}".format(myInt1,myInt2), "-3070 222");
		});
		test("all basic number shortcuts (except for G) with double input (both-cases)",function(){
			var myVal = -123456.78;
			equal("{0:c}".format(myVal), "-$123,456.78");
			equal("{0:d}".format(myVal), "-123457");
			equal("{0:e}".format(myVal), "-1.234568E+5");
			equal("{0:f}".format(myVal), "-123456.78");
			equal("{0:n}".format(myVal), "-123,456.78");
			equal("{0:r}".format(myVal), "-123456.78");
			equal("{0:x}".format(myVal), "NaN");
		});
		test("all basic number shortcuts (except for G) with integer input and length (both-cases)",function(){
			var myInt1 = -12400;
			equal("{0:c4}".format(myInt1), "-$12,400.0000");
			equal("{0:d4}".format(myInt1), "-12400");
			equal("{0:e4}".format(myInt1), "-1.2400E+4");
			equal("{0:f4}".format(myInt1), "-12400.0000");
			equal("{0:n4}".format(myInt1), "-12,400.0000");
			equal("{0:r4}".format(myInt1), "-12400");
			equal("{0:x4}".format(myInt1), "-3070");
		});
		test("all basic number shortcuts (except for G) with double input and length (both-cases)",function(){
			var myVal = -123456.781;
			equal("{0:c5}".format(myVal), "-$123,456.78100");
			equal("{0:d5}".format(myVal), "-123457");
			equal("{0:e5}".format(myVal), "-1.23457E+5");
			equal("{0:f5}".format(myVal), "-123456.78100");
			equal("{0:n5}".format(myVal), "-123,456.78100");
			equal("{0:r5}".format(myVal), "-123456.781");
			equal("{0:x5}".format(myVal), "NaN");
		});
		test("G shortcut format (because it's complicated)",function(){	
			equal("{0:g}".format(12345.6789), "12345.6789");
			equal("{0:g7}".format(12345.6789), "12345.68");
			equal("{0:g}".format(0.0000023), "2.3E-6");
			equal("{0:g}".format(0.0023), "0.0023");
			equal("{0:g2}".format(1234), "1.2E+3");
			equal("{0:g5}".format(Math.PI), "3.1416");				
		});
		test("padding",function(){
			equal("{0:00000}".format(123.456),"00123");	
			equal("{0:00000.00000}".format(123.456),"00123.45600");
			equal("{0:.00000}".format(123.456),"123.45600");
			equal("{0:.0000000}".format(0.456),".4560000");
			equal("{0:#,##0.##0}".format(216.3),"216.300");
		});
		module("testing string.prototype.format with custom number formats");
		test("digit placeholder", function(){
			equal("{0:#}".format(123.456),"123");
			equal("{0:####}".format(123.456),"123");
			equal("{0:#.#}".format(123.456),"123.5");
			equal("{0:#.#####0}".format(123.456),"123.456000");
			equal("{0:#.#00000}".format(123.456),"123.456000");
			equal("{0:#######.#00000}".format(123.456),"123.456000");
			equal("{0:0######.#00000}".format(123.456),"0000123.456000");	
			equal("{0:#}".format(5.7),"6");	
		});
		test("literals in digit format",function(){
			equal("{0:(###) ###-####}".format(1234567890),"(123) 456-7890");	
			equal("{0:#.###-###-###}".format(0.123456789),"0.123-456-789");		
			equal("{0:0.###-###-###}".format(0.123456789),"0.123-456-789");		
			equal("{0:###-###-###}".format(12345),"-12-345");		
			equal("{0:.###-###-###}".format(0.12345),".123-45-");	
		});
		test("percent and permil",function(){
			equal("{0:#%}".format(5),"500%");
			equal("{0:###%}".format(5),"500%");
			equal("{0:#####%}".format(5),"500%");
			equal("{0:0%}".format(5),"500%");
			equal("{0:000%}".format(5),"500%");
			equal("{0:00000%}".format(5),"00500%");
			equal("{0:#%%}".format(5),"50000%%");
			equal("{0:#%}".format(0.555),"56%");
			equal("{0:#‰}".format(0.555),"555‰");
		});
		module("escapes");
		test("escape brackets",function(){
			equal("{{0}} {0}".format(123456),"{{0}} 123456");
			equal("{{0}} {0:###{{###}".format(123456),"{{0}} 123{{456");
			equal("{{0}} {0:###}}###}".format(123456),"{{0}} 123}}456");
			equal("{{0}} {0:###{{0}}###}".format(123456),"{{0}} 12{{3}}456");
		});
		test("escape slashes in number",function(){
			equal("{0:0.##\\###}".format(0.12345),"0.12#35");
			equal("{0:0.##\\0##}".format(0.12345),"0.12035");
			equal("{0:##\\###}".format(12345),"123#45");
			equal("{0:##\\0##}".format(12345),"123045");
			equal("{0:#%\\%}".format(0.5),"50%%");
		});
		test("escape slashes in dates",function(){
			equal("{0:\\MMM}".format(new Date(2009,11,25,0,0,0,0)),"M12");
			equal("{0:dd\\ddd}".format(new Date(2009,11,25,0,0,0,0)),"25d25");
		});
		test("date.format",function(){
			equal(new Date(2009,11,25,0,0,0,0).format("MM/dd/yyyy"),"12/25/2009");
		});
		test("number.format",function(){
			equal(new Number(123456789).format("###-###-###"),"123-456-789");
			equal(123456789['format']("###-###-###"),"123-456-789");
		});
		test("grouping by commas",function(){
			equal("{0:#,###}".format(123),"123");
			equal("{0:#,###}".format(1234),"1,234");
			equal("{0:#\\,###}".format(1234),"1,234");
			equal("{0:#,###}".format(1234567),"1,234,567");
			equal("{0:#\\,###}".format(1234567),"1234,567");
			equal("{0:##,#}".format(28147483647 ),"28,147,483,647");
			equal("{0:#.0,0}".format(28147483647 ),"28147483647.00");
			equal("{0:#.0\\,0}".format(28147483647 ),"28147483647.0,0");
		});
		test("scaling by commas",function(){
			equal("{0:#,}".format(2147483647 ),"2147484");
			equal("{0:#,,}".format(2147483647 ),"2147");
			equal("{0:#,,.00}".format(2147483647 ),"2147.48");
			equal("{0:#.00,,,,}".format(2147483647 ),"2147483647.00");
			equal("{0:#,,.00,,,,}".format(2147483647 ),"2147.48");
			equal("{0:0\\,}".format(2147483647),"2147483647,");
			equal("{0:0\\,,}".format(2147483647),"2147484,");
			equal("{0:0.00\\,}".format(2147483647 ),"2147483647.00,");
			equal("{0:0.00\\,,}".format(2147483647 ),"2147483647.00,");
		});
		module("addenda");
		test("whole number values with decimal formats and thousands comma",function(){
			equal("{0:#,##0.##0}".format(628),"628.000");
			equal("{0:#,##0.##0}".format(1411),"1,411.000");
			equal("{0:#,##0.##0}".format(562),"562.000");
			equal("{0:#,##0.##0}".format(5055),"5,055.000");
			equal("{0:#,##0.##0}".format(4484),"4,484.000");
			equal("{0:#,##0.##0}".format(1484),"1,484.000");
			equal("{0:#,##0.##0}".format(4625),"4,625.000");
			equal("{0:#,##0.##0}".format(4625),"4,625.000");
		});
		test("zeros in placeholder",function(){
			equal(formatter.format("{0:#.###}",0.012),"0.012");		
		});
		test("ones place when zero",function(){
			equal(formatter.format("{0:.###}",0.005),".005");
			equal(formatter.format("{0:#.###}",0.005),"0.005");
			equal(formatter.format("{0:.000}",0.005),".005");
			equal(formatter.format("{0:0.000}",0.005),"0.005");
			equal(formatter.format("{0:0.000}",1.005),"1.005");
			equal(formatter.format("{0:0.000}",1.005),"1.005");
		});
		test("negative exponents",function(){
			equal(formatter.format("{0:#.###}",0.0000000000005),"0.000");
		});
		test("positive exponents",function(){
			equal(formatter.format("{0:0}",5000000000000000000000),"5000000000000000000000");
		});
		test("format negative",function(){
			equal(formatter.format("{0}",-1234),"-1234");
			equal(formatter.format("{0:#.000}",-1234),"-1234.000");
			equal(formatter.format("{0:#.###}",-0.0000005),"0.000");
		});
		test("pass in null",function(){
			equal(formatter.format("{0:#.###}",null),"");
			equal(formatter.format("{0:#.###}",undefined),"");		
		});
		test("pass in unexpected value",function(){
			equal(formatter.format("{0:#.###}","charlie"),"charlie");
			equal(formatter.format("{0:#.###}",false),"false");		
		});
		test("pass in object",function(){
			equal(formatter.format("{text}",{
				text : "astral projection",
				number : 1234.5678
			}),"astral projection");
			equal(formatter.format("{number}",{
				text : "astral projection",
				number : 1234.5678
			}),"1234.5678");		
			equal(formatter.format("{text} x {number:0.0000}",{
				text : "astral projection",
				number : 1234.5678
			}),"astral projection x 1234.5678");	
		});
	});
});

if(typeof define === "function" && define.amd) {
	define(["jquery","qunit"],callback);
} else {
	callback($);
}