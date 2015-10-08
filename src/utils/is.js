"use strict";
var objectToString = Object.prototype.toString;

export function isNumber(obj) {
    return objectToString.call(obj) == '[object Number]';
}
export function isDate(obj) {
    return objectToString.call(obj) == '[object Date]';
}
export function isString(obj) {
    return objectToString.call(obj) == '[object String]';
}
export function isFunction(obj) {
    return typeof obj === "function";
}
export function isObject(obj) {
    let objectTypes = {
        'boolean': false,
        'function': true,
        'object': true,
        'number': false,
        'string': false,
        'undefined': false
    };
    return !!(obj && objectTypes[typeof obj]);
}
export function isArray(arr) {
    return arr instanceof Array;
}