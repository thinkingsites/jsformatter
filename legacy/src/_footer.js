	var result = formatString,_undefined = "undefined"; // your javascript module
	result.byValue = formatValue;
	if(typeof define !== _undefined && typeof define.amd !== _undefined){
	    define(function(){
	        return result;
	    });
	} else if(typeof module !== _undefined && typeof module.exports !== _undefined){
	    module.exports = result;
	} else {
	    window.format = result;
	}
})();