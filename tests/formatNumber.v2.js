module("number formats - private functions");

test("format left",function(){
	equal(_formatNumberLeft("#,#",-12400.99),"-12,401");
	equal(_formatNumberLeft("$",-12400.99),"-$");
	equal(_formatNumberLeft("$#",-12400.99),"-$12401");
	equal(_formatNumberLeft("$#\\,#",-12400.99),"-$1240,1");
	equal(_formatNumberLeft("$0000#\\,##",-12400.99),"-$00124,01");
});