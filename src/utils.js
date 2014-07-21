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