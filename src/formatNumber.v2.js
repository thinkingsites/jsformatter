function _formatNumberLeft(format,value) {
    var
        result = [],
        isNegative = value < 0,
        value = Math.round(Math.abs(value)),
        useSeperator = checkForEscaped(format,','),
        lastPlaceHolderIndex = format.length-1-Math.max(Math.min(format.indexOf('0'),format.indexOf('#')),0),
        valueArray = value.toString().split(''),
        formatArray = format.split(''),
        valueLength = valueArray.length;

    while(formatArray.length || valueArray.length) {
        var formatCharacter = formatArray.pop();
        var isPlaceHolder = "0#,".indexOf(formatCharacter) > -1;

        if(formatArray[formatArray.length-1] == '\\') {
            // if this is escaped, add the literal and pop off the escape character
            result.unshift(formatCharacter);
            formatArray.pop();
        } else if(formatCharacter && !isPlaceHolder) {
            // if this is not a placeholder add the literal
            result.unshift(formatCharacter);
        } else if(valueArray.length && isPlaceHolder) {

            // TODO need a better way to find the last index
            var isLastPlaceHolder = Math.min(indexOf(formatArray,"#"),indexOf(formatArray,"0"));

            // if this is a value, add the digits
            do{
                var val = valueArray.pop();

                if(useSeperator && (valueLength - 1 - valueArray.length) % 3 == 0  && result.length > 1) {
                    // if we're using a seperator, and the value index+1 is mod 3, add the seperator
                    result.unshift(',');
                }

                if(val) {
                    result.unshift(val);
                } else {
                    break;
                }

                // if this we're reached the last placeholder, loop through the remaining digits and add them all
            } while(valueArray.length && isLastPlaceHolder);
        } else {
            break;
        }
    }

    if(isNegative) {
        result.unshift('-');
    }

    return result.join('');
}