module("basic formatString");
test("no arguments, just string",function(){
	var thing = "mary had a little lamb";
	equal(formatString(thing) , thing);
});
test("testing numeric arguments",function(){
	var format = "mary {0} a {1} lamb";
	var expected = "mary had a little lamb";
	equal(formatString(format,'had','little'), expected);
	equal(formatString(format,['had','little']) , expected);
});
test("testing named arguments",function(){
	var format = "mary {verb} a {adjective} lamb";
	var expected = "mary had a little lamb";
	equal(formatString(format,{ verb : 'had', adjective : 'little' }) , expected);
});
test("testing functions as values",function(){
	var format = "mary {verb} a {adjective} lamb";
	var expected = "mary had a little lamb";
	var values = function(){
		return {
			verb : function() { return 'had' },
			adjective : function() { return 'little' }
		};
	}
	equal(formatString(format,values) , expected);
});
test("format with string with right padding",function(){
	equal(formatString("hello {0,10}!","world"), "hello world     !");
});
test("format with string with left padding",function(){
	equal(formatString("hello {0,-10}!","world"), "hello      world!");
});