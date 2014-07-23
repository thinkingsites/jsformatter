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
				formatValue(item.format,value);
			}

			value = pad(value, " ", item.padding, item.padding);

			result.push(value);
		}
	});

	// concatenate the results and return
	return result.join('');
}