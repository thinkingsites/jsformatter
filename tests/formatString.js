module("formatString");
test("no arguments, just string",function(){
	var thing = "mary had a little lamb";
	ok(formatString(thing) === thing);
});
test("testing numeric arguments",function(){
	var format = "mary {0} a {1} lamb";
	var expected = "mary had a little lamb";
	ok(formatString(format,'had','little') === expected);
	ok(formatString(format,['had','little']) === expected);
});
test("testing named arguments",function(){
	var format = "mary {verb} a {adjective} lamb";
	var expected = "mary had a little lamb";
	ok(formatString(format,{ verb : 'had', adjective : 'little' }) === expected);
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
	ok(formatString(format,values) === expected);
});