(function(){
if ( 'function' !== typeof Array.prototype.reduce ) {
  Array.prototype.reduce = function( callback /*, initialValue*/ ) {
    'use strict';
    if ( null === this || 'undefined' === typeof this ) {
      throw new TypeError(
         'Array.prototype.reduce called on null or undefined' );
    }
    if ( 'function' !== typeof callback ) {
      throw new TypeError( callback + ' is not a function' );
    }
    var t = Object( this ), len = t.length >>> 0, k = 0, value;
    if ( arguments.length >= 2 ) {
      value = arguments[1];
    } else {
      while ( k < len && ! k in t ) k++;
      if ( k >= len )
        throw new TypeError('Reduce of empty array with no initial value');
      value = t[ k++ ];
    }
    for ( ; k < len ; k++ ) {
      if ( k in t ) {
         value = callback( value, t[k], k, t );
      }
    }
    return value;
  };
}
var defaults = {
	seperateAt : 3
};
var objectToString = Object.prototype.toString;
function isNumber(obj) {
    return objectToString.call(obj) == '[object Number]';
}
function isDate(obj) {
    return objectToString.call(obj) == '[object Date]';
}
function isString(obj) {
    return objectToString.call(obj) == '[object String]';
}
function isFunction(obj) {
    return typeof obj === "function";
}
function isObject(obj) {
    var objectTypes = {
        'boolean': false,
        'function': true,
        'object': true,
        'number': false,
        'string': false,
        'undefined': false
    };
    return !!(obj && objectTypes[typeof obj]);
}
function isArray(arr) {
    return arr instanceof Array;
}
function resolve(valOrFunc){
    if(isFunction(valOrFunc))
        return valOrFunc();
    else
        return valOrFunc;
}
function getProperties(obj, sort) {
    var result = [], sortFunction, n;
    for (n in obj) {
        if (obj.hasOwnProperty(n)) {
            result.push(n);
        }
    }
    if (sort) {
        if (typeof sort === "function") {
            sortFunction = sort;
        } else if (sort === "length asc") {
            sortFunction = function (a, b) {
                return a.length - b.length;
            };
        } else if (sort === "length desc") {
            sortFunction = function (a, b) {
                return b.length - a.length;
            };
        }
        result = result.sort(sortFunction);
    }
    return result;
}
function pad(toPad, padWith, totalLength, direction) {
    var
        isAnArray = isArray(toPad), // check to see if this is an array
        result = isAnArray ? toPad.slice(0) : [toPad],
        currentLength = result.join('').length; // get the current length;
    totalLength = Math.abs(totalLength);
    if (currentLength < totalLength) {
        // assume padWith is a single character
        result[direction > 0 ? "push" : "unshift"](new Array(totalLength - currentLength + 1).join(padWith));
    }
    return isAnArray ? result : result.join(''); // return as the same type as came in.
}
function count(lookInside, lookFor, useEscapeCharacters) {
    if (!lookInside)
        return 0;

    useEscapeCharacters = useEscapeCharacters === undefined ? true : useEscapeCharacters;
    var result = 0, i;
    for (i = 0; i < lookInside.length; i += 1) {
        if (useEscapeCharacters && lookInside.charAt(i) === "\\") {
            i += 2;
        }
        if (lookInside.charAt(i) &&
            lookInside.charAt(i) !== "" &&
            lookFor.indexOf(lookInside.charAt(i)) > -1) {
            result += 1;
        }
    }
    return result;
}

// TODO merge the 'index of' methods into one with an overload
function indexOfAny(searchIn,searchFor)
{
    if(!isArray(searchFor)){
        searchFor = Array.prototype.slice.call(arguments,1);
    }
    for(var i = 0; i < searchIn.length; i < i++){
        if(searchFor.indexOf(searchIn[i]) > -1){
            return i;
        }
    }
    return -1;
}

function indexOf(searchIn, searchFor) {
    // IE does not support indexOf on regexp matches so we're writing a utlity method to compensate
    var result = -1, i;
    if (typeof searchIn.indexOf === "function") {
        result = searchIn.indexOf(searchFor);
    } else {
        for (i = 0; i < searchIn.length; i += 1) {
            if (searchIn[i] === searchFor) {
                result = i;
                break;
            }
        }
    }
    return result;
}
function lastIndexOf(searchIn, searchFor) {
    // IE does not support lastIndexOf on regexp matches so we're writing a utlity method to compensate
    var result = -1, i;
    if (typeof searchIn !== "undefined") {
        if (typeof searchIn.lastIndexOf === "function") {
            result = searchIn.lastIndexOf(searchFor);
        } else {
            for (i = searchIn.length - 1; i > -1; i -= 1) {
                if (searchIn[i] === searchFor) {
                    result = i;
                    break;
                }
            }
        }
    }
    return result;
}
function numberToString(value) {
    var result, exponent, base, valueAsString = value.toString();
    if (valueAsString.indexOf('e') > -1) {
        exponent = valueAsString.match(/\d+$/);
        if (valueAsString.indexOf('e-') > -1) {
            // handle negative exponents
            result = value.toFixed(Math.min(exponent));
        } else {
            // positive exponents are a bit more complex
            base = valueAsString.match(/^-?\d+(\.\d+)?/)[0].replace(/\./, ''); // don't bother multiplying, just remove the decimal
            result = base + new Array(exponent - base.length + 2).join('0');
        }
    } else {
        result = valueAsString;
    }
    return result;
}
function checkForEscaped(checkIn,checkFor) {
    for(var i = checkIn.indexOf(checkFor,0); i > 0; i = checkIn.indexOf(checkFor,i+1)){
        if(checkIn[i-1] == '\\'){
            continue;
        } else {
            return true;
        }
    }
    return false;
}
// rather than adding a polyfill for foreach, use this function instead that will also act on strings
function forEach(target,callback,thisArg){
    if(isFunction(target.forEach)){
        target.forEach(callback);
    } else {
        for(var i = 0; i < target.length; i++){
            callback.call(thisArg || target,target[i],i,target);
        }
    }
}


// for minification
var openBracket = "{";
var closeBracket = "}";
function appendChunk(target,item){
    var lastIndex = target.length-1;
    if(isObject(item) || !target.length || isObject(target[lastIndex])){
        target.push(item);
    } else {
        // I don't particularly like concatenating strings like this, but it'll stand for now, an optimization for later
        target[lastIndex] += item;
    }
}
function getChunks(format) {
    var result = [],start,end,param,paramString,formatArg;

    // this has to remain a for statement so we can manipulate the index
    for(var i = 0;i < format.length;i++){

        var item = format[i];

        // if character is an opening bracket, begin investigating
        if(format[i] == openBracket){
            start = format.indexOf(openBracket, i);
            if(format[start+1] == openBracket) {
                // if the opening bracket is escaped, add a single bracket
                i++;
                appendChunk(result,openBracket);
                continue;
            } else {

                end = format.indexOf(closeBracket, i);
                while (end !== -1 && format.substring(end, end + 2) === "}}") {
                    end = format.indexOf(closeBracket, end + 2);
                }

                if (start !== -1 && end !== -1) {
                    paramString = format.substring(start + 1, end);
                    param = paramString.match(/^(\w+)(,(-?\d+))?(:(.*?))?$/i);

                    if(isString(param[5])){
                        // escape all brackets to single brackets
                        param[5] = param[5].replace("{{",openBracket).replace("}}",closeBracket);
                    }

                    appendChunk(result,{
                        index: param[1],
                        padding: parseInt(param[3]),
                        format : param[5],
                        paramAt: start
                    });
                    i = end;
                    continue;
                }
            }
        } else if (format[i] == closeBracket && format[i+1] == closeBracket){
            i++;
            appendChunk(result,closeBracket);
            continue;
        }
        appendChunk(result,item);
    }
    return result;
}
function formatString(format,values){

	// if there are only two arguments, we may be dealing with and object, array or function whose result contains the values
	if(arguments.length === 2) {
		if(isFunction(values)) {
			values = values();
		}

		// if it's an array or an object, but not date, use this parameter as the set of values
		if(!((isArray(values) || isObject(values)) && !isDate(values))){
			values = [values];
		}
	} else {
		// if the value hasn't been set, use the remainder of arguments as values
		values = Array.prototype.slice.call(arguments,1);
	}

	if(isFunction(values) && arguments.length === 2) {
		values = values();
	}

	var chunks = getChunks(format);
	var result = [];
	chunks.forEach(function(item){
		if(isString(item)){
			// if the item is a string, it's not parameter, add it straight to the results
			result.push(item);
		} else {
			// if the argument is an object it has formatting instructions
			var value = resolve(values[item.index]);

			// if we're not given a format, we'll do a normal to string on the data
			if(item.format) {
				value = formatValue(item.format,value);
			}

			value = pad(value, " ", item.padding, item.padding);

			result.push(value);
		}
	});

	// concatenate the results and return
	return result.join('');
}
var dateComponents = {
    dd: function (value) {
        return value.getDate();
    },
    ddd: function (value) {
        return dateText.daysAbbr[value.getDay()];
    },
    dddd: function (value) {
        return dateText.days[value.getDay()];
    },
    hh: function (value) {
        var hours = value.getHours();
        if (hours > 12) {
            hours -= 12;
        }
        return pad(hours,"0",2,-1);
    },
    HH: function (value) {
        return pad(value.getHours(),"0",2,-1);
    },
    mm: function (value) {
        return pad(value.getMinutes(),"0",2,-1);
    },
    MM: function (value) {
        return value.getMonth() + 1;
    },
    MMM: function (value) {
        return dateText.monthAbbr[value.getMonth()];
    },
    MMMM: function (value) {
        return dateText.months[value.getMonth()];
    },
    ss: function (value) {
        return pad(value.getSeconds(),"0",2,-1);
    },
    tt: function (value) {
        return (value.getHours() > 11 ? "PM" : "AM");
    },
    yy: function (value) {
        return value.getFullYear().toString().substring(2);
    },
    yyyy: function (value) {
        return value.getFullYear();
    },
    zz: function (value) {
        var mins = value.getTimezoneOffset(),
            result =
                (mins > 0 ? "-" : "") + // if the offset is positive, the time zone is negative
                pad(Math.abs(Math.floor(mins / 60)), "0", 2, -1).toString();
        return result;
    },
    zzz: function (value) {
        var
            mins = value.getTimezoneOffset(),
            result =
                (mins > 0 ? "-" : "") + // if the offset is positive, the time zone is negative
                pad(Math.abs(Math.floor(mins / 60)), "0", 2, -1).toString() + ":" +
                pad(mins % 60, "0", 2, -1);
        return result;
    }
};
var dateShorts = {
    d: "dd/MM/yyyy",
    D: "MMMM dd, yyyy",
    t: "hh:mm tt",
    T: "hh:mm:ss tt",
    f: "MMMM dd, yyyy hh:mm tt",
    F: "MMMM dd, yyyy hh:mm:ss tt",
    g: "dd/MM/yyyy hh:mm tt",
    G: "dd/MM/yyyy hh:mm:ss tt",
    M: "MMMM dd",
    r: "ddd, dd MMM yyyy hh:mm:ss GMT",
    s: "yyyy-MM-ddThh:mm:ss",
    u: "yyyy-MM-dd hh:mm:ssZ",
    U: "MMMM dd,yyyy hh:mm:ss tt",
    Y: "MMMM, yyyy"
};
var dateText = {
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    daysAbbr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthAbbr: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
};
var dateNames = getProperties(dateComponents, "length desc");

function formatDate(format,value) {

    var result = [];

    // if the format is a shortcut, convert the shortcut to the actual format
    if(dateShorts[format]){
        format = dateShorts[format];
    }

    // loop through and replace all instances
    for (i = 0; i < format.length; i += 1) {

        // do escape
        if (format.charAt(i) === "\\") {
            result.push(format.charAt(i + 1));
            i += 1;
            continue;
        }

        // do format
        var pushed = false;

        // loop through every dateComponent and look for the next match in the format
        for (j = 0; j < dateNames.length; j += 1) {
           var dateName = dateNames[j];
            if (format.substring(i, i + dateName.length) === dateName) {
                result.push((dateComponents[dateName].apply(null, [value]) || "").toString());
                i += dateName.length - 1;
                pushed = true;
                break;
            }
        }

        if (pushed) {
            continue;
        }

        result.push(format.charAt(i));
    }
    result = result.join('');
    return result;
}
function zeros(length,def){
    if(!isNumber(length) || isNaN(length)){
        length = def;
    } else {
        length = Math.abs(length);
    }

    return new Array(length+1).join('0');
}


var numberShorts = {
	c :  function(format,value,length){
		return formatNumber("$#,#." + zeros(length,2),value);
	},
	d : function(format,value,length){
		return formatNumber(zeros(length,0),value);
	},
	f : function(format,value,length){
		return formatNumber("0." + zeros(length,2),value);
	},
	n : function(format, value, length) {
		return formatNumber("#,000." +zeros(length,2),value);
	},
    e: function (format, value, length) {
        return value.toExponential(isNaN(length) ? 6 : length).toString().toUpperCase();
    },
    p : function (format, value, length) {
    	return (value * 100).toFixed(length || 2).toString() + " %";
    },
    r : function (format, value, length) {
    	return value.toString();
    },
    g: function (format, value, precision) {
    	// Simplify this
        var
			result,
			pIsNan = isNaN(precision),
			exponent = value.toExponential(precision).toString(),
			expMatch = exponent.match(/[\-+]\d+$/);
        exponent = parseInt(expMatch[0], 10);
        if (exponent > -5 && (pIsNan || exponent < precision)) {
            result = pIsNan ? value.toString() : value.toPrecision(precision);
        } else {
            result = value.toExponential(pIsNan ? 1 : Math.max(precision - 1, 0));
        }
        return result.toString().toUpperCase();
    },
	x: function (format, value, length) {
	    var sign = value > 0 ? "" : "-", result;
	    value = Math.abs(value.toString(16));
	    // although javascript is capable of showing a decimal hex, the Math.abs returns NaN for doubles just like the c# implementation so we'll allow it through
	    if (isNaN(value)) {
	        result = value;
	    } else {
	        result = sign + pad(value, "0", length || 0, -1);
	    }
	    return result;
	}
};

function formatNumber(format,value) {

	// if the format has a shortcut syntax, use it instead
    var shortcut = format.toLowerCase().match(/^(\w)(\d*)$/);
	if(shortcut && isFunction(numberShorts[shortcut[1]])){
		// if the format is a function, execute it
		return numberShorts[shortcut[1]](format,value,parseInt(shortcut[2])).toString();
	}

	var
		rawValue = value,
		rResult = [],
		lResult = [],
		numberDecimalSeperatorAt,
		formatDecimalSeperatorAt = format.indexOf("."),
		rightFormat = formatDecimalSeperatorAt > -1 ? format.substring(formatDecimalSeperatorAt + 1) : undefined,
		leftFormat = formatDecimalSeperatorAt > -1 ? format.substring(0, formatDecimalSeperatorAt) : format,
		roundingLength = count(rightFormat, "0#"),
		regexMatch = leftFormat !== undefined && leftFormat.replace(/,+$/).match(/\\?,/g),
		useSeperator = leftFormat === undefined || regexMatch === null ? false : indexOf(regexMatch, ",") > -1,
		lastIndexOfZeroRight = rightFormat ? lastIndexOf(rightFormat, "0") : 0,
		firstIndexOfPoundRight = rightFormat ? indexOf(rightFormat, "#") : 0,
		lastIndexOfZeroLeft = leftFormat ? indexOf(leftFormat, "0") : 0, // right to left
		firstIndexOfPoundLeft = leftFormat ? lastIndexOf(leftFormat, "#") : 0, // right to left
        isNegative = value < 0,
		valueIndex = 0,
		rightNumber,
		leftNumber,
		formatIndex,
		toPush,
		next,
		rPaddingIndex,
		lPaddingIndex,
		scale,
		conditions,
		c;

	if(value === null || value === undefined) {
		return "";
	} else if (!isNumber(value)) {
		return value.toString();
	}

    // if there is a zero before a pound in the formats, all preceding pounds turn into zeros
    if (rightFormat && lastIndexOfZeroRight > firstIndexOfPoundRight) {
        rightFormat =
			rightFormat.slice(0, lastIndexOfZeroRight).replace(/#/g, "0") +
			rightFormat.slice(lastIndexOfZeroRight, rightFormat.length);
    }

    // don't forget, right to left
    if (leftFormat && firstIndexOfPoundLeft < lastIndexOfZeroLeft) {
        leftFormat =
			leftFormat.slice(0, lastIndexOfZeroLeft) +
			leftFormat.slice(lastIndexOfZeroLeft, leftFormat.length).replace(/#/g, "0");
    }

    // percentages change the raw value of the number being formatted, do them first
    if (format.indexOf("%") > -1) {
        value = value * Math.pow(100, count(format, "%"));
    }

    if (format.indexOf("‰") > -1) {
        value = value * Math.pow(1000, count(format, "‰"));
    }

    // do number scaling, for every comma to the immediately to the left of the period, divide by 1000
    regexMatch = leftFormat.match(/(\\?,)+$/);
    if (regexMatch && regexMatch !== null) {
        scale = count(regexMatch[0], ",", true);
        value = value / Math.pow(1000, scale);
    }

    // round raw value
    value = Math.abs(value.toFixed(roundingLength));

    // convert value to string
    value = numberToString(value);

    // init values
    numberDecimalSeperatorAt = value.indexOf(".");
    rightNumber = numberDecimalSeperatorAt > -1 ? value.substring(numberDecimalSeperatorAt + 1) : undefined;
    leftNumber = numberDecimalSeperatorAt > -1 ? value.substring(0, numberDecimalSeperatorAt) : value;

    // format the right part of the number first
    if (rightFormat) {

        // add decimal only if there are placeholders in the right format
        if ((rightNumber && firstIndexOfPoundRight > -1) || lastIndexOfZeroRight > -1)
            rResult.push(".");

        // do placeholders
        for (formatIndex = 0; formatIndex < rightFormat.length; formatIndex += 1) {

            if (rightFormat.charAt(formatIndex) === "\\") {
                // handle escape
                rResult.push(rightFormat.charAt(formatIndex + 1));
                formatIndex += 1;
            } else if (rightFormat.charAt(formatIndex) == ",") {
                // skip by all commas unless escaped
                continue;
            } else if ("0#".indexOf(rightFormat.charAt(formatIndex)) > -1) {
                // handle number placeholder
                if (typeof rightNumber === "undefined") {
                    if (rightFormat.charAt(formatIndex) === 0) {
                        rResult.push(0);
                    } else {
                        break;
                    }
                } else if (valueIndex >= roundingLength - 1) {
                    // handle rounding
                    toPush = parseInt(rightNumber.charAt(valueIndex), 10);
                    if (!isNaN(toPush)) {
                        next = parseInt(rightNumber.substring(valueIndex + 1, valueIndex + 2), 10);
                        if (!isNaN(next) && next > 4) {
                            toPush += 1;
                        }
                        rResult.push(toPush);
                        valueIndex = rightNumber.length;
                    }
                } else if (rightNumber.length > valueIndex) {
                    rResult.push(rightNumber.charAt(valueIndex));
                }
                valueIndex += 1;
            } else {
                // add literal
                rResult.push(rightFormat.charAt(formatIndex));
            }
        }

        // do right padding, compensate for the initial period and the index vs length
        // only pad if the massaged rightFormat has any zeros
        regexMatch = rightFormat.match(/0/g);
        if (regexMatch) {
            rPaddingIndex = lastIndexOf(regexMatch, "0") + 2;
            rPaddingIndex = Math.max(rPaddingIndex, 0);
            rResult = pad(rResult, "0", rPaddingIndex, 1);
        }
    } else if (rightNumber !== undefined) {
        // if there is no seperator but there is a right number, let's round the whole value;
        leftNumber = Math.round(value).toString();
    }

    // work backwards (right to left) up the number
    // unlike the right side, include all the numbers
    // but only if the left side is not zero
    formatIndex = leftFormat.length - 1; // set the start of the formatting at the furthest right character
    lastPlaceHolderIndex = indexOfAny(format,"0","#");
    conditions = function (valueIndex, formatIndex, leftFormat) {
        var result = {
            formatComplete: formatIndex <= -1,
            valueComplete: valueIndex <= -1,
            isEscaped: leftFormat.charAt(formatIndex - 1) == "\\",
            isComma: leftFormat.charAt(formatIndex) == ",",
            isLiteral: "0#,.".indexOf(leftFormat.charAt(formatIndex)) === -1
        };
        return result;
    };

    function addSeperator(){
        // add seperator
        if (useSeperator &&
            (leftNumber.length - valueIndex) > 2 &&
            (leftNumber.length - valueIndex) % 3 == 1) {
            lResult.unshift(",");
        }
    }

    for (valueIndex = leftNumber.length - 1; valueIndex > -1; valueIndex -= 1) {

        // while these conditions are true, don't add the value yet
        for (
			c = conditions(valueIndex, formatIndex, leftFormat);
			!c.formatComplete && (c.isEscaped || c.isLiteral || c.isComma);
			c = conditions(valueIndex, formatIndex, leftFormat)) {

            if (c.isEscaped) {
                // if the character in the format index is escaped, add it literally
                lResult.unshift(leftFormat.charAt(formatIndex));
                formatIndex -= 2;
            } else if (!c.isLiteral || c.isComma) {
                // if the character is not a literal, skip it
                formatIndex -= 1;
            } else {
                // if the character in the format is not a digit placeholder or seperator, add it literally
                lResult.unshift(leftFormat.charAt(formatIndex));
                formatIndex -= 1;
            }
        }

        // add the value
        if (leftFormat.replace(/#/g, '').length > 0 || parseInt(value) > 0 || parseFloat(value) < 0) {
            // if the formatIndex is of the last placeholder, add all remaining digits
            if(lastPlaceHolderIndex === formatIndex)
            {
                do{
                    addSeperator();
                    lResult.unshift(leftNumber.charAt(valueIndex));
                    valueIndex--;
                } while (valueIndex > -1);
            } else {
                addSeperator();
                lResult.unshift(leftNumber.charAt(valueIndex));
            }
            formatIndex -= 1;
        }
    }


    // add literals one by one to make sure they are not a digit place holder
    if (formatIndex > -1) {
        while (formatIndex > -1) {
            if ("#,".indexOf(leftFormat.charAt(formatIndex)) == -1) {
                lResult.unshift(leftFormat.charAt(formatIndex));
            }
            formatIndex -= 1;
        }
    }

    // do left padding
    lPaddingIndex = leftFormat.indexOf("0");
    lPaddingIndex = lPaddingIndex === -1 ? 0 : leftFormat.length - lPaddingIndex;
    lResult = pad(lResult, "0", lPaddingIndex, -1);


    if(isNegative && (lResult.length || rResult.length)) {
        lResult.unshift("-");
    }

    return lResult.join('') + rResult.join('');

}
function formatValue(format,value) {
    if(isDate(value)){
        value = formatDate(format,value);
    } else if(isNumber(value)) {
        value = formatNumber(format,value);
    }
    return value;
}
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