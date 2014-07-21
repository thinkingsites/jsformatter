 function chunks(format) {
    var regex = (format||"").match(/(\{\{?.*?\}?\})|(.)/gi);
    var result = [];
    regex.forEach(function(item){
    	var parameter = item.match(/^\{(\w+)(,(-?\d+))?(:(.*?))?\}$/i);
    	if(parameter){
    		// if this item is a parameter push a paramerized chunk in
    		result.push({
    			index : parameter[1],
    			padding : parseInt(parameter[3]),
    			format : parameter[5],
    		});
    	} else if(isString(result[result.length-1])){
    		// if the last result is a string, append current item to the last result
    		result[result.length-1] += item;
    	} else {
    		// if the item is a string, but the last result isn't, push the parameter to the array
    		result.push(item);
    	}
    });
    return result;
 };