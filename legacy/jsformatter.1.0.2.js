/*
JSFormatter - created by Miguel Ludert
https://github.com/thinkingsites/jsformatter

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

This package replicates and extends the .Net formatting functionality.
For full usage documentation refer here:
http://msdn.microsoft.com/en-us/library/26etazsy
*/
(function () {
    "use strict";
    var
		config,
		constructor,
		formatUtil,
		utility = {
		    isNullOrUndefined: function (value) {
		        return typeof value === "undefined" || value === null;
		    },
		    numberToString: function (value) {
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
		    },
		    extend: function () {
		        var args = arguments, result = args[0], i, n;
		        for (i = 1; i < args.length; i += 1) {
		            for (n in args[i]) {
		                if (args[i].hasOwnProperty(n)) {
		                    result[n] = args[i][n];
		                }
		            }
		        }
		        return result;
		    },
		    /**
		    * pads a string or an array with the specified character, returing the same type as was passed in
		    */
		    pad: function (toPad, padWith, totalLength, direction) {
		        var
					isArray = utility.isArray(toPad), // check to see if this is an array
					result = isArray ? toPad.slice(0) : [toPad],
					currentLength = result.join('').length; // get the current length;
		        totalLength = Math.abs(totalLength);
		        if (currentLength < totalLength) {
		            // assume padWith is a single character
		            result[direction > 0 ? "push" : "unshift"](new Array(totalLength - currentLength + 1).join(padWith))
		        }
		        return isArray ? result : result.join(''); // return as the same type as came in.
		    },
		    /**
		    * count the number of characters in a string
		    */
		    count: function (lookInside, lookFor, useEscapeCharacters) {
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
		    },
		    regexLoop: function (regex, value, callback) {
		        var r;
		        for (r = regex.exec(value);
					r !== null;
					r = regex.exec(value)) {
		            callback(r);
		        }
		    },
		    getProperties: function (obj, sort) {
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
		    },
		    indexOf: function (searchIn, searchFor) {
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
		    },
		    lastIndexOf: function (searchIn, searchFor) {
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
		    },
		    isNumber: function (obj) {
		        return Object.prototype.toString.call(obj) == '[object Number]';
		    },
		    isFunction: function (obj) {
		        return typeof obj === "function";
		    },
		    isDate: function (obj) {
		        return Object.prototype.toString.call(obj) == '[object Date]';
		    },
		    isString: function (obj) {
		        return Object.prototype.toString.call(obj) == '[object String]';
		    },
		    isObject: function (obj) {
		        var objectTypes = {
		            'boolean': false,
		            'function': true,
		            'object': true,
		            'number': false,
		            'string': false,
		            'undefined': false
		        };
		        return !!(obj && objectTypes[typeof obj]);
		    },
		    isArray: function (arr) {
		        return arr instanceof Array;
		    },
		    makeArray: function (arrayLike) {
		        var i, result = [];
		        try {
		            // this will throw errors in IE
		            result = Array.prototype.slice.call(arrayLike);
		        }
		        catch (err) {
		            // catch the IE error and do the slow way
		            if (arrayLike && arrayLike.length) {
		                for (i = 0; i < arrayLike.length; i += 1) {
		                    result.push(arrayLike[i]);
		                }
		            }
		        }
		        return result;
		    }
		};

    // stolen from underscore.js
    // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
    //  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    //      _['is' + name] = function(obj) {
    //      return toString.call(obj) == '[object ' + name + ']';
    //    };
    //  });

    constructor = function () {
        var Formatter, formatString, result;

        Formatter = function () { };
        Formatter.prototype = {
            format: function (format, value) {
                var result, i, j, pushed, d, shortcut;

                if (utility.isFunction(value)) {
                    value = value();
                }

                if (utility.isDate(value)) {
                    // for the sake of speed, I'll check the length of the shortcut first, then check to see if the shortcut exists
                    format = format.length === 1 && this.dateShorts.hasOwnProperty(format) ? this.dateShorts[format] : format;
                    result = [];
                    // loop through and replace all instances
                    for (i = 0; i < format.length; i += 1) {

                        // do escape
                        if (format.charAt(i) === "\\") {
                            result.push(format.charAt(i + 1));
                            i += 1;
                            continue;
                        }

                        // do format
                        pushed = false;
                        for (j = 0; j < this.dateNames.length; j += 1) {
                            d = this.dateNames[j];
                            if (format.substring(i, i + d.length) === d) {
                                result.push((this.date[d].apply(this, [value]) || "").toString());
                                i += d.length - 1;
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
                } else if (!isNaN(value)) {

                    // the number can come in as a Number or a string.  Cast it accordingly
                    if (utility.isNumber(value)) {
                        value = value.valueOf();
                    } else if (utility.isString(value)) {
                        value = parseFloat(value);
                    }

                    shortcut = format.match(this.numberShortRegex);
                    if (shortcut) {
                        // since we have a shortcut, invoke it and pass in the length
                        result = this.numberShorts[shortcut[1].toLowerCase()].call(this, format, value, shortcut[2] !== undefined ? parseInt(shortcut[2], 10) : undefined);
                    } else {
                        result = this.customNumberFormat(value, format);
                    }
                }
                return result;
            },
            customNumberFormat: function (format,value) {
                // declare variables, jsLint style
                var
					rawValue = value,
					rResult = [],
					lResult = [],
					numberDecimalSeperatorAt,
					formatDecimalSeperatorAt = format.indexOf("."),
					rightFormat = formatDecimalSeperatorAt > -1 ? format.substring(formatDecimalSeperatorAt + 1) : undefined,
					leftFormat = formatDecimalSeperatorAt > -1 ? format.substring(0, formatDecimalSeperatorAt) : format,
					roundingLength = utility.count(rightFormat, "0#"),
					regexMatch = leftFormat !== undefined && leftFormat.replace(/,+$/).match(/\\?,/g),
					useSeperator = leftFormat === undefined || regexMatch === null ? false : utility.indexOf(regexMatch, ",") > -1,
					lastIndexOfZeroRight = rightFormat ? utility.lastIndexOf(rightFormat, "0") : 0,
					firstIndexOfPoundRight = rightFormat ? utility.indexOf(rightFormat, "#") : 0,
					lastIndexOfZeroLeft = leftFormat ? utility.indexOf(leftFormat, "0") : 0, // right to left
					firstIndexOfPoundLeft = leftFormat ? utility.lastIndexOf(leftFormat, "#") : 0, // right to left
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
                    value = value * Math.pow(100, utility.count(format, "%"));
                }

                if (format.indexOf("‰") > -1) {
                    value = value * Math.pow(1000, utility.count(format, "‰"));
                }

                // do number scaling, for every comma to the immediately to the left of the period, divide by 1000
                regexMatch = leftFormat.match(/(\\?,)+$/);
                if (regexMatch && regexMatch !== null) {
                    scale = utility.count(regexMatch[0], ",", true);
                    value = value / Math.pow(1000, scale);
                }

                // round raw value
                value = new Number(value.toFixed(roundingLength));

                // convert value to string
                value = utility.numberToString(value);

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
                                if (rightFormat.charAt(formatIndex) == 0) {
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
                        rPaddingIndex = utility.lastIndexOf(regexMatch, "0") + 2;
                        rPaddingIndex = Math.max(rPaddingIndex, 0);
                        rResult = utility.pad(rResult, "0", rPaddingIndex, 1);
                    }
                } else if (rightNumber !== undefined) {
                    // if there is no seperator but there is a right number, let's round the whole value;
                    leftNumber = Math.round(value).toString();
                }

                // work backwards (right to left) up the number
                // unlike the right side, include all the numbers
                // but only if the left side is not zero
                formatIndex = leftFormat.length - 1; // set the start of the formatting at the furthest right character
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
                        lResult.unshift(leftNumber.charAt(valueIndex));
                        formatIndex -= 1;
                    }

                    // add seperator
                    if (useSeperator && valueIndex > 0 && (leftNumber.length - valueIndex) % 3 == 0) {
                        lResult.unshift(",");
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
                lResult = utility.pad(lResult, "0", lPaddingIndex, -1);
                return lResult.join('') + rResult.join('');

            },
            standardNumberFormat: function (value, p) {
                p = utility.extend({
                    prefix: "",
                    seperator: "",
                    seperateAt: 0,
                    places: undefined, // undefined leaves it up to the system to figure out how many decimal places to use
                    suffix: undefined,
                    pad: undefined
                }, p);
                var
					result = [(value >= 0 ? "" : "-"), p.prefix],
					location,
					mod,
					i;

                // turn this into an absolute value, we're adding the negative manually to the result already
                value = Math.abs(value);

                // fixed decimal places
                value = p.places !== undefined ? parseFloat(value).toFixed(p.places) : value.toString();

                // add padding
                value = p.pad ? utility.pad(value, "0", p.pad, -1) : value;


                // add seperator
                if (p.seperateAt > 0) {
                    location = value.lastIndexOf(".");
                    location = location === -1 ? value.length : location;
                    mod = location % p.seperateAt;
                    for (i = 0; i < location; i += 1) {
                        if (i !== 0 && i % p.seperateAt === mod) {
                            result.push(p.seperator);
                        }
                        result.push(value.charAt(i));
                    }
                    for (i = location; i < value.length; i += 1) {
                        result.push(value.charAt(i));
                    }
                } else {
                    result.push(value);
                }

                // add the suffix
                if (p.suffix) {
                    result.push(p.suffix);
                }

                return result.join('');
            },
            numberShorts: {
                c: function (format, value, length) {
                    return this.standardNumberFormat(value, {
                        prefix: "$",
                        seperator: ",",
                        seperateAt: 3,
                        places: isNaN(length) ? 2 : length
                    });
                },
                d: function (format, value, length) {
                    return this.standardNumberFormat(value, {
                        places: 0,
                        pad: length
                    });
                },
                e: function (format, value, length) {
                    return value.toExponential(isNaN(length) ? 6 : length).toString().toUpperCase();
                },
                f: function (format, value, length) {
                    return this.standardNumberFormat(value, {
                        places: isNaN(length) ? 2 : length
                    });
                },
                g: function (format, value, precision) {
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
                n: function (format, value, length) {
                    return this.standardNumberFormat(value, {
                        seperator: ",",
                        seperateAt: 3,
                        places: isNaN(length) ? 2 : length
                    });
                },
                r: function (format, value, length) {
                    return value.toString();
                },
                x: function (format, value, length) {
                    var sign = value > 0 ? "" : "-", result;
                    value = Math.abs(value.toString(16));
                    // although javascript is capable of showing a decimal hex, the Math.abs returns NaN for doubles just like the c# implementation so we'll allow it through
                    if (isNaN(value)) {
                        result = value;
                    } else {
                        result = sign + utility.pad(value, "0", length || 0, -1);
                    }
                    return result;
                }
            },
            date: {
                dd: function (value) {
                    return value.getDate();
                },
                ddd: function (value) {
                    return this.daysShort[value.getDay()];
                },
                dddd: function (value) {
                    return this.days[value.getDay()];
                },
                hh: function (value) {
                    var hours = value.getHours();
                    if (hours > 12) {
                        hours -= 12;
                    }
                    return utility.pad(hours,"0",2,-1);
                },
                HH: function (value) {
                    return utility.pad(value.getHours(),"0",2,-1);
                },
                mm: function (value) {
                    return utility.pad(value.getMinutes(),"0",2,-1);
                },
                MM: function (value) {
                    return value.getMonth() + 1;
                },
                MMM: function (value) {
                    return this.monthsShort[value.getMonth()];
                },
                MMMM: function (value) {
                    return this.months[value.getMonth()];
                },
                ss: function (value) {
                    return utility.pad(value.getSeconds(),"0",2,-1);
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
							utility.pad(Math.abs(Math.floor(mins / 60)), "0", 2, -1).toString();
                    return result;
                },
                zzz: function (value) {
                    var
						mins = value.getTimezoneOffset(),
						result =
							(mins > 0 ? "-" : "") + // if the offset is positive, the time zone is negative
							utility.pad(Math.abs(Math.floor(mins / 60)), "0", 2, -1).toString() + ":" +
							utility.pad(mins % 60, "0", 2, -1);
                    return result;
                }
            },
            dateShorts: {
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
            },
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        };
        Formatter.prototype.dateNames = (function () {
            return utility.getProperties(Formatter.prototype.date, "length desc");
        } ());
        Formatter.prototype.numberShortRegex = (function () {
            var names = utility.getProperties(Formatter.prototype.numberShorts, "length desc");
            return new RegExp("^([" + names.join('') + "])(\\d+)?$", "i");
        } ());

        formatString = function (format, args) {
            var
				self = format,
				result = [],
				params = [],
				position = 0,
				parameterFormat,
				param,
				start,
				end,
				i,
				p,
				calcValue = function (value) {
				    return (utility.isFunction(value) ? value() : value);
				};

			// if the first arg is a function, resolve it.  It could resolve into an array or object that we need
			if(utility.isFunction(args)){
					args = args();
			}

            if (utility.isDate(args) || (!utility.isObject(args) && !utility.isArray(args))) {
                // If first argument is not an array or an object, take all the arguments after the first and turn that into the args variable
                args = utility.makeArray(arguments).slice(1);
            }

            // compile the paramaters, and escape double brackets if there are any
            // if there are no double brackets, use the regex to find parameters,
            // this should be slightly faster in native code, and less error prone (if there are any bugs)
            // if there are double brackets, use the looping code to compensate for escaping values
            if (self.indexOf("{{") === -1 && self.indexOf("}}") === -1) {
                // use the format with brackets




                parameterFormat = /\{(\w+)(,-?\d+)?(:.*?)?\}/gi;



                for (param = parameterFormat.exec(self);
					param !== null;
					param = parameterFormat.exec(self)) {
                    params.push({
                        length: param[0].length,
                        index: param[1],
                        padding: param[2] !== undefined ? parseInt(param[2].substring(1), 10) : 0,
                        format: param[3] !== undefined ? param[3].substring(1) : undefined,
                        value: calcValue(args[param[1]]),
                        paramAt: param.index
                    });
                }
            } else {
                // use the format without brackets
                parameterFormat = /^(\d+)(,-?\d+)?(:.*?)?$/gi;
                i = 0;
                while (i > -1) {
                    start = self.indexOf("{", i);
                    while (start !== -1 && self.substring(start, start + 2) === "{{") {
                        start = self.indexOf("{", start + 2);
                    }

                    end = self.indexOf("}", i);
                    while (end !== -1 && self.substring(end, end + 2) === "}}") {
                        end = self.indexOf("}", end + 2);
                    }

                    if (start !== -1 && end !== -1) {
                        param = self.substring(start + 1, end);
                        param = parameterFormat.exec(param);
                        params.push({
                            match: param[0].length + 2,
                            index: param[1],
                            padding: param[2] !== undefined ? parseInt(param[2].substring(1), 10) : 0,
                            format: param[3] !== undefined ? param[3].substring(1) : undefined,
                            value: calcValue(args[param[1]]),
                            paramAt: start
                        });
                    }
                    i = self.indexOf("{", end);
                }
            }

            for (i = 0; i < params.length; i += 1) {
                p = params[i];

                // grab text in front of param
                if (p.paramAt > position) {
                    result.push(self.substring(position, p.paramAt));
                    position = p.paramAt;
                }

                // do format only if the value is a date or a number
                if (p.format && (utility.isDate(p.value) || utility.isNumber(p.value))) {
                    p.value = new Formatter().format(p.format, p.value);
                }

                // do padding
                p.value = utility.pad(p.value, " ", p.padding, p.padding);

                // add value to result
                result.push(p.value);
                position += p.length;
            }
            // grab everything after the last value
            if (position < self.length) {
                result.push(self.substring(position, self.length));
            }

            result = result.join('');

            return result;
        };

        result = {
            format: formatString,
            formatValue: function (format, value) {
                return new Formatter().format(format, value);
            }
        };
        return result;
    };

    formatUtil = constructor();

    config = {
        asPrototype: true,
        asGlobal: "formatter"
    };

    if (typeof formatConfig !== "undefined" && formatConfig.hasOwnProperty) {
        utility.extend(config, formatConfig);
    }

    if (config.asPrototype) {
        String.prototype.format = function () {
            var args = utility.makeArray(arguments);
            return formatUtil.format(this, args);
        };
        Number.prototype.format = function (format) {
            return formatUtil.formatValue(format, this);
        };
        Date.prototype.format = function (format) {
            return formatUtil.formatValue(format, this);
        };
    }

    if (typeof config.asGlobal === "string") {
        window[config.asGlobal] = formatUtil;
    }

    if (typeof define === "function" && define.amd) {
        // auto detect and bind to requirejs
        define('jsformatter', function () {
            return formatUtil;
        });
    } else if (typeof module !== "undefined") {
        // auto detect and bind to nodejs
        module.exports = formatUtil;
        this._ = formatUtil;
    }
} ());