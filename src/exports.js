var result = formatString; // your javascript module
result.byValue = formatValue;
if(typeof define !== undefined && typeof define.amd !== undefined ){
    define(function(){
        return result;
    });
} else if(typeof module !== undefined && typeof module.exports !== undefined ){
    module.exports = result;
} else {
    window.format = result;
    return result;
}