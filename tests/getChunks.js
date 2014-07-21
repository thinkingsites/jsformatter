module("chunking");
test("match basic brackets",function(){
	equal("mary had a little lamb",getChunks("mary had a little lamb"));

	var result = getChunks("mary {had} a {little} lamb");
	equal(5,result.length);
	ok(isString(result[0]));
	ok(result[0] == "mary ");
	ok(isString(result[2]));
	ok(result[2] == " a ");
	ok(isString(result[4]));
	ok(result[4] == " lamb");

	ok(isObject(result[1]));
	ok(result[1].index == "had");
	ok(isObject(result[3]));
	ok(result[3].index == "little");

	var result = getChunks("mary {0} a {1} lamb");
	equal(5,result.length);
	ok(isString(result[0]));
	ok(result[0] == "mary ");
	ok(isString(result[2]));
	ok(result[2] == " a ");
	ok(isString(result[4]));
	ok(result[4] == " lamb");

	ok(isObject(result[1]));
	ok(result[1].index == "0");
	ok(isObject(result[3]));
	ok(result[3].index == "1");
});
test("match brackets with parameters",function(){
	var result = getChunks("mary {0:000-000-000} a {1:c} lamb");
	ok(result[1].index == "0");
	ok(result[1].format == "000-000-000");
	ok(result[3].index == "1");
	ok(result[3].format == "c");
});
test("match escape brackets",function(){
	var result = getChunks("mary {{0:000-000-000}} a {1:c} lamb");
	ok(result.length == 3)
	ok(result[0] == "mary {{0:000-000-000}} a ");
	ok(result[1].index == "1");
	ok(result[1].format == "c");
	ok(result[2] == " lamb");
});
test("match one with positive alignment",function(){
	var result = getChunks("{0,10}");
	ok(result[0].padding === 10);
});
test("match one with negative alignment",function(){
	var result = getChunks("{0,-10}");
	ok(result[0].padding === -10);
});
test("match two with alternating alignment",function(){
	var result = getChunks("{0,-10}  {0,10}");
	ok(result[0].padding === -10);
	ok(result[2].padding === 10);
});
test("match two with format and alignment",function(){
	var result = getChunks("{0,10:$##.##} {1,-10:yy/mm/dd}");
	ok(result[0].index === '0');
	ok(result[0].padding === 10);
	ok(result[0].format === '$##.##');

	ok(result[2].index === '1');
	ok(result[2].padding === -10);
	ok(result[2].format === 'yy/mm/dd');
});