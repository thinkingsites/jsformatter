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