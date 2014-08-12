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
        result[direction > 0 ? "push" : "unshift"](new Array(totalLength - currentLength + 1).join(padWith))
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

