module("number formats");
test("padding",function(){
	equal(formatNumber("00000",123.456),"00123");
	equal(formatNumber("00000.00000",123.456),"00123.45600");
	equal(formatNumber(".00000",123.456),"123.45600");
	equal(formatNumber(".0000000",0.456),".4560000");
	equal(formatNumber("#,##0.##0",216.3),"216.300");
});
test("digit placeholder", function(){
	equal(formatNumber("#",123.456),"123");
	equal(formatNumber("####",123.456),"123");
	equal(formatNumber("#.#",123.456),"123.5");
	equal(formatNumber("#.#####0",123.456),"123.456000");
	equal(formatNumber("#.#00000",123.456),"123.456000");
	equal(formatNumber("#######.#00000",123.456),"123.456000");
	equal(formatNumber("0######.#00000",123.456),"0000123.456000");
	equal(formatNumber("#",5.7),"6");
});
test("literals in digit format",function(){
	equal(formatNumber("(###) ###-####",1234567890),"(123) 456-7890");
	equal(formatNumber("#.###-###-###",0.123456789),".123-456-789");
	equal(formatNumber("0.###-###-###",0.123456789),"0.123-456-789");
	equal(formatNumber("###-###-###",12345),"-12-345");
	equal(formatNumber(".###-###-###",0.12345),".123-45-");
});
test("percent and permil",function(){
	equal(formatNumber("#%",5),"500%");
	equal(formatNumber("###%",5),"500%");
	equal(formatNumber("#####%",5),"500%");
	equal(formatNumber("0%",5),"500%");
	equal(formatNumber("000%",5),"500%");
	equal(formatNumber("00000%",5),"00500%");
	equal(formatNumber("#%%",5),"50000%%");
	equal(formatNumber("#%",0.555),"56%");
	equal(formatNumber("#‰",0.555),"555‰");
});
test("grouping by commas",function(){
	equal(formatNumber("#,###",123),"123");
	equal(formatNumber("#,###",1234),"1,234");
	equal(formatNumber("#\\,###",1234),"1,234");
	equal(formatNumber("#,###",1234567),"1,234,567");
	equal(formatNumber("#\\,###",1234567),"1234,567");
	equal(formatNumber("##,#",28147483647 ),"28,147,483,647");
	equal(formatNumber("#.0,0",28147483647 ),"28147483647.00");
	equal(formatNumber("#.0\\,0",28147483647 ),"28147483647.0,0");
});
test("scaling by commas",function(){
	equal(formatNumber("#,",2147483647 ),"2147484");
	equal(formatNumber("#,,",2147483647 ),"2147");
	equal(formatNumber("#,,.00",2147483647 ),"2147.48");
	equal(formatNumber("#.00,,,,",2147483647 ),"2147483647.00");
	equal(formatNumber("#,,.00,,,,",2147483647 ),"2147.48");
	equal(formatNumber("0\\,",2147483647),"2147483647,");
	equal(formatNumber("0\\,,",2147483647),"2147484,");
	equal(formatNumber("0.00\\,",2147483647 ),"2147483647.00,");
	equal(formatNumber("0.00\\,,",2147483647 ),"2147483647.00,");
});
test("whole number values with decimal formats and thousands comma",function(){
	equal(formatNumber("#,##0.##0",628),"628.000");
	equal(formatNumber("#,##0.##0",1411),"1,411.000");
	equal(formatNumber("#,##0.##0",562),"562.000");
	equal(formatNumber("#,##0.##0",5055),"5,055.000");
	equal(formatNumber("#,##0.##0",4484),"4,484.000");
	equal(formatNumber("#,##0.##0",1484),"1,484.000");
	equal(formatNumber("#,##0.##0",4625),"4,625.000");
	equal(formatNumber("#,##0.##0",4625),"4,625.000");
});
test("ones place when zero",function(){
	equal(formatNumber(".###",0.005),".005");
	equal(formatNumber("#.###",0.005),".005");
	equal(formatNumber(".000",0.005),".005");
	equal(formatNumber("0.000",0.005),"0.005");
	equal(formatNumber("0.000",1.005),"1.005");
	equal(formatNumber("0.000",1.005),"1.005");
});
test("negative exponents",function(){
	equal(formatNumber("#.###",0.0000000000005),"");
	equal(formatNumber("0.000",0.0000000000005),"0.000");
});
test("zeros in format after pounds",function(){
	equal(formatNumber("0.##0",0.1),"0.100");
	equal(formatNumber("0.0##",0.1),"0.1");
});
test("zeros in placeholder",function(){
	equal(formatNumber("#.###",0.012),".012");
	equal(formatNumber("#",0.6),"1");
	equal(formatNumber("#.###",0),"");
	//equal(formatNumber("###.###",0),"");
	//equal(formatNumber("0.000",0),"0.000");
	//equal(formatNumber("000.000",0),"000.000");
});
test("positive exponents",function(){
	for(var i = 0; i < 30 ; i ++)
	{
		var myString = "5" + new Array(i).join("0"),myInt = parseInt(myString);
		equal(formatNumber("0",myInt),myString);
	}
	equal(formatNumber("0",12463452345000000000000),"12463452345000000000000");
	equal(formatNumber("0",34513452573842312456745),"34513452573842310000000");
});
test("format negative",function(){
	equal(formatNumber("0",-1234),"-1234");
	equal(formatNumber("#.000",-1234),"-1234.000");
	equal(formatNumber("#.####",-0.1234),"-.1234");
	equal(formatNumber("#.###",-0.0000005),"");
	equal(formatNumber("#.###",-0),"");
});
test("pass in null",function(){
	equal(formatNumber("#.###",null),"");
	equal(formatNumber("#.###",undefined),"");
});
test("pass in unexpected value",function(){
	equal(formatNumber("#.###","charlie"),"charlie");
	equal(formatNumber("#.###",false),"false");
});

module("number shortcuts");
test("C number shortcut",function(){
	var myInt1 = -12400;
	var myInt2 = 546;
	var myVal = -123456.781;
	equal(formatNumber("c",myInt1), "-$12,400.00");
	equal(formatNumber("C",myInt2), "$546.00");
	equal(formatNumber("c",myVal), "-$123,456.78");
	equal(formatNumber("c4",myInt1), "-$12,400.0000");
	equal(formatNumber("c5",myVal), "-$123,456.78100");
});
test("D number shortcut",function(){
	var myInt1 = -12400;
	var myInt2 = 546;
	var myVal = -123456.781;
	equal(formatNumber("d",myInt1), "-12400");
	equal(formatNumber("D",myInt2), "546");
	equal(formatNumber("d",myVal), "-123457");
	equal(formatNumber("d5",myVal), "-123457");
	equal(formatNumber("d4",myInt1), "-12400");

});
test("E number shortcut",function(){
	var myInt1 = -12400;
	var myInt2 = 546;
	var myVal = -123456.781;
	equal(formatNumber("e",myInt1), "-1.240000E+4");
	equal(formatNumber("E",myInt2), "5.460000E+2");
	equal(formatNumber("e",myVal), "-1.234568E+5");
	equal(formatNumber("e4",myInt1), "-1.2400E+4");
	equal(formatNumber("e5",myVal), "-1.23457E+5");

});
test("F number shortcut",function(){
	var myInt1 = -12400;
	var myInt2 = 546;
	var myVal = -123456.781;
	equal(formatNumber("f",myInt1), "-12400.00");
	equal(formatNumber("F",myInt2), "546.00");
	equal(formatNumber("f",myVal), "-123456.78");
	equal(formatNumber("f4",myInt1), "-12400.0000");
	equal(formatNumber("f5",myVal), "-123456.78100");
});
test("N number shortcut",function(){
	var myInt1 = -12400;
	var myInt2 = 546;
	var myVal = -123456.781;
	equal(formatNumber("n",myInt1), "-12,400.00");
	equal(formatNumber("N",myInt2), "546.00");
	equal(formatNumber("n",myVal), "-123,456.78");
	equal(formatNumber("n4",myInt1), "-12,400.0000");
	equal(formatNumber("n5",myVal), "-123,456.78100");
});
test("R number shortcut",function(){
	var myInt1 = -12400;
	var myInt2 = 546;
	var myVal = -123456.781;
	equal(formatNumber("r",myInt1), "-12400")
	equal(formatNumber("R",myInt2), "546");
	equal(formatNumber("r",myVal), "-123456.781");
	equal(formatNumber("r4",myInt1), "-12400");
	equal(formatNumber("r5",myVal), "-123456.781");
	equal(formatNumber("r",1.623e-21), "1.623e-21");
});
test("X number shortcut",function(){
	var myInt1 = -12400;
	var myInt2 = 546;
	var myVal = -123456.781;
	equal(formatNumber("x",myInt1), "-3070");
	equal(formatNumber("X",myInt2), "222");
	equal(formatNumber("x",myVal), "NaN");
	equal(formatNumber("x4",myInt1), "-3070");
	equal(formatNumber("x5",myVal), "NaN");
});
test("P number shortcut",function(){
	var mv1 = -0.9234642316;
	var mv2 = 3.04322899;
	equal("-92.35 %", formatNumber("p",mv1));
	equal("304.32 %",  formatNumber("P",mv2));
	equal("-92.3464 %", formatNumber("p4",mv1));
	equal("304.32290 %", formatNumber("p5",mv2));
	equal("-92.3 %", formatNumber("p1",mv1));
});
test("G shortcut format",function(){
	equal("12345.6789",formatNumber("g",12345.6789));
	equal("12345.68",formatNumber("g7",12345.6789));
	equal("2.3E-6",formatNumber("g",0.0000023));
	equal("0.0023",formatNumber("g",0.0023));
	equal("1.2E+3", formatNumber("g2",1234));
	equal("3.1416",formatNumber("g5",Math.PI));
});
test("formatting zero values",function(){
	equal("0",formatNumber("0",0));
	equal("0.00",formatNumber("0.00",0));
	equal("$0.00",formatNumber("c",0));
});