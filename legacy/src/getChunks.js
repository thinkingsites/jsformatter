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