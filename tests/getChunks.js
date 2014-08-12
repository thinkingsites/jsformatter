module("chunking");
test("match named brackets",function(){
	equal("mary had a little lamb",getChunks("mary had a little lamb"));

	var result = getChunks("mary {had} a {little} lamb");
	equal(5,result.length);
	ok(isString(result[0]));
	equal(result[0] , "mary ");
	ok(isString(result[2]));
	equal(result[2] , " a ");
	ok(isString(result[4]));
	equal(result[4], " lamb");

	ok(isObject(result[1]));
	equal(result[1].index, "had");
	ok(isObject(result[3]));
	equal(result[3].index , "little");
});
test("match index brackets",function(){
	var result = getChunks("mary {0} a {1} lamb");
	equal(5,result.length);
	ok(isString(result[0]));
	equal(result[0], "mary ");
	ok(isString(result[2]));
	equal(result[2], " a ");
	ok(isString(result[4]));
	equal(result[4], " lamb");

	ok(isObject(result[1]));
	equal(result[1].index, "0");
	ok(isObject(result[3]));
	equal(result[3].index, "1");
});
test("match brackets with parameters",function(){
	var result = getChunks("mary {0:000-000-000} a {1:c} lamb");
	equal(result[1].index, "0");
	equal(result[1].format, "000-000-000");
	equal(result[3].index, "1");
	equal(result[3].format, "c");
});
test("match escape brackets",function(){
	var result = getChunks("mary {{0:000-000-000}} a {1:c} lamb");
	equal(result.length, 3)
	equal(result[0], "mary {0:000-000-000} a ");
	equal(result[1].index, "1");
	equal(result[1].format, "c");
	equal(result[2], " lamb");
});
test("match one with positive alignment",function(){
	var result = getChunks("{0,10}");
	equal(result[0].padding, 10);
});
test("match one with negative alignment",function(){
	var result = getChunks("{0,-10}");
	equal(result[0].padding, -10);
});
test("match two with alternating alignment",function(){
	var result = getChunks("{0,-10}  {0,10}");
	equal(result[0].padding, -10);
	equal(result[2].padding, 10);
});
test("match two with format and alignment",function(){
	var result = getChunks("{0,10:$##.##} {1,-10:yy/mm/dd}");
	equal(result[0].index, '0');
	equal(result[0].padding, 10);
	equal(result[0].format , '$##.##');

	equal(result[2].index , '1');
	equal(result[2].padding, -10);
	equal(result[2].format , 'yy/mm/dd');
});