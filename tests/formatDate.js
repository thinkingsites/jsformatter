module("formatDate");
var mytestdate = new Date(2010,11,25,22,30,29,55);
test("format with US date format",function(){
    equal("12/25/2010",formatDate("MM/dd/yyyy",mytestdate));
});
test("all date shortcuts",function(){
    equal(formatDate("d",mytestdate),"25/12/2010");
    equal(formatDate("D",mytestdate),"December 25, 2010");
    equal(formatDate("t",mytestdate),"10:30 PM");
    equal(formatDate("T",mytestdate),"10:30:29 PM");
    equal(formatDate("f",mytestdate),"December 25, 2010 10:30 PM");
    equal(formatDate("F",mytestdate),"December 25, 2010 10:30:29 PM");
    equal(formatDate("g",mytestdate),"25/12/2010 10:30 PM");
    equal(formatDate("G",mytestdate),"25/12/2010 10:30:29 PM");
    equal(formatDate("M",mytestdate),"December 25");
    equal(formatDate("r",mytestdate),"Sat, 25 Dec 2010 10:30:29 GMT");
    equal(formatDate("s",mytestdate),"2010-12-25T10:30:29");
    equal(formatDate("u",mytestdate),"2010-12-25 10:30:29Z");
    equal(formatDate("U",mytestdate),"December 25,2010 10:30:29 PM");
    equal(formatDate("Y",mytestdate),"December, 2010");
});

test("all custom date formats",function(){
    equal(formatDate("dd",mytestdate),"25");
    equal(formatDate("ddd",mytestdate),"Sat");
    equal(formatDate("dddd",mytestdate),"Saturday");
    equal(formatDate("hh",mytestdate),"10");
    equal(formatDate("HH",mytestdate),"22");
    equal(formatDate("mm",mytestdate),"30");
    equal(formatDate("MM",mytestdate),"12");
    equal(formatDate("MMM",mytestdate),"Dec");
    equal(formatDate("MMMM",mytestdate),"December");
    equal(formatDate("ss",mytestdate),"29");
    equal(formatDate("tt",mytestdate),"PM");
    equal(formatDate("yy",mytestdate),"10");
    equal(formatDate("yyyy",mytestdate),"2010");

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

    equal(formatDate("zz",mytestdate), sign + offsethours);
    equal(formatDate("zzz",mytestdate), sign + offsethours +":" + offsetmins);
});

test("formatDate intregration into formatString ",function(){
    equal(
        formatString("{0:MM/dd/yyyy} {1:MM/dd/yyyy} {2:U} {3:U}!",mytestdate,mytestdate,mytestdate,mytestdate),
        "12/25/2010 12/25/2010 December 25,2010 10:30:29 PM December 25,2010 10:30:29 PM!");
});
test("(LEGACY BUG) date formatting bug when using formatter",function(){
    var date = new Date("Tue Feb 07 2012 05:05:03 GMT-0500 (Eastern Standard Time)");
    equal(formatString('{0:MM/dd/yyyy hh:mm:ss tt}', date),"2/7/2012 05:05:03 AM");
});