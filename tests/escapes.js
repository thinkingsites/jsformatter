
module("escapes");
test("escape brackets",function(){
	equal(formatString("{{0}} {0}",123456),"{{0}} 123456");
	equal(formatString("{{0}} {0:###{{###}",123456),"{{0}} 123{{456");
	equal(formatString("{{0}} {0:###}}###}",123456),"{{0}} 123}}456");
	equal(formatString("{{0}} {0:###{{0}}###}",123456),"{{0}} 12{{3}}456");
});
test("escape slashes in number",function(){
	equal(formatString("{0:0.##\\###}",0.12345),"0.12#35");
	equal(formatString("{0:0.##\\0##}",0.12345),"0.12035");
	equal(formatString("{0:##\\###}",12345),"123#45");
	equal(formatString("{0:##\\0##}",12345),"123045");
	equal(formatString("{0:#%\\%}",0.5),"50%%");
});
test("escape slashes in dates",function(){
	equal(formatString("{0:\\MMM}",new Date(2009,11,25,0,0,0,0)),"M12");
	equal(formatString("{0:dd\\ddd}",new Date(2009,11,25,0,0,0,0)),"25d25");
});