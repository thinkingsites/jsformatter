function formatValue(format,value) {
    if(isDate(value)){
        value = formatDate(format,value);
    } else if(isNumber(value)) {
        value = formatNumber(format,value);
    }
    return value;
};