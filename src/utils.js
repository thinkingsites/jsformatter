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