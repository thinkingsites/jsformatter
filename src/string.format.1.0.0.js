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

This package replicates the .Net formatting functionality.  
For full usage documentation refer here:
http://msdn.microsoft.com/en-us/library/26etazsy
*/
(function(){
	"use strict";
	if(typeof String.prototype.format === "undefined")
	{
		var utility = {
			padLeft : function(value,padWith,toLength){
				value = value.toString();
				while(value.length < toLength) {
					value = padWith + value;
				}
				return value;
			},
			padRight : function(value,padWith,toLength){
				value = value.toString();
				while(value.length < toLength) {
					value = value + padWith;
				}
				return value;
			},
			extend : function() {
				var args = arguments, result = args[0], i, n;
				for(i = 1; i < args.length; i+=1){
					for(n in args[i]){
						if(args[i].hasOwnProperty(n)) {
							result[n] = args[i][n];
						}
					}
				}
				return result;
			},
			count : function (stringOfItemsToLookFor,whatToCount,useEscapeCharacters){
				useEscapeCharacters = useEscapeCharacters === undefined ? true : useEscapeCharacters;
				var result = 0,i;
				for(i = 0; i < whatToCount.length; i+=1){
					if(useEscapeCharacters && whatToCount[i] === "\\") {
						i+=2;
					}						
					if(stringOfItemsToLookFor.indexOf(whatToCount[i]) > -1) {
						result+=1;		
					}
				}
				return result;
			},
			regexLoop : function(regex,value,callback) {
				var r;
				for(r = regex.exec(value);
					r !== null;
					r = regex.exec(value)){
					callback(r);							
				}
			},
			getProperties : function(obj,sort){
				var result = [], sortFunction, n;
				for(n in obj) {
					if(obj.hasOwnProperty(n)){
						result.push(n);
					}	
				}
				if(sort) {
					if(typeof sort === "function"){
						sortFunction = sort;
					} else if(sort === "length asc") {
						sortFunction = function(a,b){
							return a.length - b.length;
						};
					} else if(sort === "length desc") {
						sortFunction = function(a,b){
							return b.length - a.length;
						};
					}
					result = result.sort(sortFunction);
				}
				return result;
			}
		},
		Formatter = function(){};
		Formatter.prototype = {
			format : function(format,value){
				var result,i,j,pushed,d,shortcut;
				if(value instanceof Date) {
					// for the sake of speed, I'll check the length of the shortcut first, then check to see if the shortcut exists
					format = format.length === 1 && this.dateShorts.hasOwnProperty(format) ? this.dateShorts[format] : format;
					result = [];
					// loop through and replace all instances
					for(i = 0; i < format.length; i+=1){
	
						// do escape
						if(format[i] === "\\"){
							result.push(format[i+1]);
							i+=1;	
							continue;
						}
						
						// do format
						pushed = false;
						for(j = 0; j < this.dateNames.length; j+=1){
							d = this.dateNames[j];
							if(format.substring(i,i+d.length) === d){
								result.push(this.date[d].apply(this,[value]));
								i+=d.length-1;
								pushed = true;
								break;
							}
						}
						if(pushed) {
							continue;
						}
						
						result.push(format[i]);
					}	
					result = result.join('');
				} else if (!isNaN(value)){
					
					// the number can come in as a Number or a string.  Cast it accordingly
					if(value instanceof Number) {
						value = value.valueOf();	
					} else if(typeof value === "string") {
						value = parseFloat(value);
					}
						
					shortcut = format.match(this.numberShortRegex);
					if(shortcut){
						// since we have a shortcut, invoke it and pass in the length
						result = this.numberShorts[shortcut[1].toLowerCase()].call(this,format,value,shortcut[2] !== undefined ? parseInt(shortcut[2],10) : undefined);
					} else {
						result = this.customNumberFormat(value,format);
					}
				}	
				return result;
			},
			customNumberFormat : function(value,format){
				
				// declare variables, jsLint style
				var 
					rResult = [], 
					lResult = [],
					numberDecimalSeperatorAt,
					formatDecimalSeperatorAt = format.indexOf("."),
					rightFormat = format.substring(formatDecimalSeperatorAt+1),
					leftFormat = formatDecimalSeperatorAt > -1 ? format.substring(0,formatDecimalSeperatorAt) : format,
					roundingLength = utility.count("0#",rightFormat),
					numberScalingRegex = /(,+)$/g,
					regexMatch = leftFormat !== undefined && leftFormat.replace(/,+$/).match(/\\?,/g),
					useSeperator = leftFormat !== undefined && regexMatch && regexMatch.indexOf(",") > -1,
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
				
				
				// percentages change the raw value of the number being formatted, do them first
				if(format.indexOf("%") > -1){
					value = value * Math.pow(100,utility.count("%",format));
				}
				
				if(format.indexOf("�") > -1){
					value = value * Math.pow(1000,utility.count("�",format));
				}
				
				// do number scaling, for every comma to the immediately to the left of the period, divide by 1000
				if(leftFormat.match(numberScalingRegex)) {
					scale = utility.count(",",(/(\\|,)*$/g).exec(leftFormat)[0],true);
					value = value / Math.pow(1000,scale);
				}
				
				// init values
				value = value.toString();
				numberDecimalSeperatorAt = value.indexOf(".");
				rightNumber = numberDecimalSeperatorAt > -1 ? value.substring(numberDecimalSeperatorAt+1) : undefined;
				leftNumber = numberDecimalSeperatorAt > -1 ? value.substring(0,numberDecimalSeperatorAt) : value;
				
				// format the right part of the number first
				if(formatDecimalSeperatorAt > -1){
					// add decimal
					rResult.push(".");
					
					// do placeholders
					for(formatIndex = 0; formatIndex < rightFormat.length; formatIndex+=1){
						if(rightFormat[formatIndex] === "\\"){ 
							// handle escape
							rResult.push(rightFormat[formatIndex+1]);
							formatIndex+=1;
						} else if(rightFormat[formatIndex] == ","){
							// skip by all commas unless escaped
							continue;
						} else if(rightNumber !== undefined && "0#".indexOf(rightFormat[formatIndex]) > -1){
							// handle number placeholder
							if(valueIndex >= roundingLength-1){
								// handle rounding
								toPush = parseInt(rightNumber[valueIndex],10);
								if(!isNaN(toPush)) {
									next = parseInt(rightNumber.substring(valueIndex+1,valueIndex+2),10);
									if(!isNaN(next) && next > 4) {
										toPush+=1;
									}
									rResult.push(toPush);
									valueIndex = rightNumber.length;
								}
							}else if(rightNumber.length > valueIndex) {
								rResult.push(rightNumber[valueIndex]);
							}
							valueIndex+=1;	
						} else {
							// add literal
							rResult.push(rightFormat[formatIndex]);
						}
					}
					
					// do right padding, compensate for the initial period and the index vs length
					regexMatch = rightFormat.match(/0|#/g);
					rPaddingIndex = regexMatch.lastIndexOf("0") + 2;
					rPaddingIndex = Math.max(rPaddingIndex,0);
					if(rResult.length < rPaddingIndex) {
						rPaddingIndex = rPaddingIndex - rResult.length;
						rResult.push(new Array(rPaddingIndex+1).join("0"))
					}
				} else if (rightNumber !== undefined){
					// if there is no seperator but there is a right number, let's round the whole value;
					leftNumber = Math.round(value).toString();
				}
				
				
				
				
				// work backwards (right to left) up the number
				// unlike the right side, include all the numbers
				// but only if the left side is greater than zero
				if(parseInt(leftNumber,10) > 0) {		
					formatIndex = leftFormat.length-1;
					conditions = function(formatIndex,leftFormat){
						var result = {
							formatComplete : formatIndex <= -1,
							valueComplete : valueIndex <= -1,
							isEscaped : leftFormat[formatIndex-1] == "\\",
							isComma : leftFormat[formatIndex] == ",",
							isLiteral : "0#,.".indexOf(leftFormat[formatIndex]) === -1,
						};
						return result;
					};
						
					for(valueIndex = leftNumber.length-1; valueIndex > -1; valueIndex-=1){
						
						// while these conditions are true, don't add the value yet
						for(
							c = conditions(formatIndex,leftFormat);
							!c.formatComplete && (c.isEscaped || c.isLiteral || c.isComma);
							c = conditions(formatIndex,leftFormat)) {
								
							if (c.isEscaped)	{
								// if the character in the format index is escaped, add it literally
								lResult.unshift(leftFormat[formatIndex]);
								formatIndex-=2;
							} else if (!c.isLiteral || c.isComma) {
								// if the character is not a literal, skip it
								formatIndex-=1;
							} else {
								// if the character in the format is not a digit placeholder or seperator, add it literally
								lResult.unshift(leftFormat[formatIndex]);
								formatIndex-=1;
							}
						}
						
						// add the value
						lResult.unshift(leftNumber[valueIndex]);
						formatIndex-=1;
						
						// add seperator
						if(useSeperator && valueIndex > 0 && (leftNumber.length - valueIndex) % 3 == 0) {
							lResult.unshift(",");
						}	
					}
				}
				
				// add literals one by one to make sure they are not a digit place holder
				if(formatIndex > -1) {
					while(formatIndex > -1){
						if ("#,".indexOf(leftFormat[formatIndex]) == -1) {
							lResult.unshift(leftFormat[formatIndex]); 
						}
						formatIndex-=1;
					}
				}
				
				// do right padding
				lPaddingIndex = leftFormat.indexOf("0");
				lPaddingIndex = lPaddingIndex === -1 ? 1 : leftFormat.length - lPaddingIndex;
				while(lResult.length < lPaddingIndex) {
					lResult.unshift("0");
				}
				
				return lResult.join('') + rResult.join('');
				
			},
			standardNumberFormat : function(value,p){
				p = utility.extend({
					prefix : "",
					seperator : "",
					seperateAt : 0,
					places : undefined, // undefined leaves it up to the system to figure out how many decimal places to use
					suffix : undefined,
					pad : undefined
				},p);
				var 
					result = [(value > 0 ? "" : "-"), p.prefix],
					location,
					mod,
					i;
				
				// turn this into an absolute value, we're adding the negative manually to the result already
				value = Math.abs(value);
				
				// fixed decimal places
				value = p.places!==undefined?parseFloat(value).toFixed(p.places):value.toString();
				
				// add padding
				value = p.pad ? utility.padLeft(value,"0",p.pad) : value;
				
				// add seperator
				if(p.seperateAt > 0) {
					location = value.lastIndexOf(".");
					location = location === -1 ? value.length : location;
					mod = location % p.seperateAt;
					for(i = 0; i < location; i+=1){
						if(i !== 0 && i % p.seperateAt === mod) {
							result.push(p.seperator);
						}
						result.push(value[i]);
					}
					for(i = location; i < value.length; i+=1) {
						result.push(value[i]);
					}
				} else {
					result.push(value);
				}
				
				// add the suffix
				if(p.suffix) {
					result.push(p.suffix);
				}
				
				return result.join('');
			},
			numberShorts : {
				c : function(format,value,length){
					return this.standardNumberFormat(value,{
						prefix : "$",
						seperator : ",",
						seperateAt : 3,
						places : isNaN(length) ? 2 : length
					});
				},
				d : function(format,value,length){
					return this.standardNumberFormat(value,{
						places : 0,
						pad : length
					});
				},
				e : function(format,value,length){
					return value.toExponential( isNaN(length) ? 6 : length).toString().toUpperCase();
				},
				f : function(format,value,length){
					return this.standardNumberFormat(value,{
						places :  isNaN(length) ? 2 : length
					});
				},
				g : function(format,value,precision){
					var 
						result,
						pIsNan = isNaN(precision),
						exponent = value.toExponential(precision).toString(),
						expMatch = exponent.match(/[\-+]\d+$/);
					exponent = parseInt(expMatch[0],10);
					if(exponent > -5 && (pIsNan ||exponent < precision)) {
						result = pIsNan ? value.toString() : value.toPrecision(precision);
					} else {
						result = value.toExponential(pIsNan ? undefined : Math.max(precision-1,0));
					}
					return result.toString().toUpperCase();
				},
				n : function(format,value,length){
					return this.standardNumberFormat(value,{
						seperator : ",",
						seperateAt : 3,
						places : isNaN(length) ? 2 : length
					});
				},
				r : function(format,value,length){
					return value.toString();
				},
				x : function(format,value,length){
					var sign = value > 0 ? "" : "-",result;
					value = Math.abs(value.toString(16));
					// although javascript is capable of showing a decimal hex, the Math.abs returns NaN for doubles just like the c# implementation so we'll allow it through
					if(isNaN(value)) {
						result = value;
					} else {
						result = sign + utility.padLeft(value,"0",length || 0);
					}
					return result;
				}
			},
			date : {
				dd : function(value){
					return value.getDate();
				},
				ddd : function(value){
					return this.daysShort[value.getDay()];
				},
				dddd : function(value){
					return this.days[value.getDay()];
				},
				hh : function(value){ 
					var hours = value.getHours();
					if(hours > 12) {
						hours -=12;
					}
					return hours;
				},
				HH : function(value){
					return value.getHours();
				},
				mm : function(value){
					return value.getMinutes();
				},
				MM : function(value){
					return value.getMonth() +1;
				},
				MMM : function(value){
					return this.monthsShort[value.getMonth()];
				},
				MMMM : function(value){
					return this.months[value.getMonth()];
				},
				ss : function(value) {
					return value.getSeconds();
				},
				tt : function(value){
					return (value.getHours() > 11 ? "PM" : "AM");
				},
				yy : function(value){
					return value.getFullYear().toString().substring(2);
				},
				yyyy : function(value){
					return value.getFullYear();
				},
				zz: function(value){
					var mins = value.getTimezoneOffset(),
						result = 
							(mins > 0 ? "-" : "") + // if the offset is positive, the time zone is negative
							utility.padLeft(Math.abs(Math.floor(mins/60)),"0",2).toString();
					return result;
				},
				zzz :  function(value){
					var 
						mins = value.getTimezoneOffset(),
						result = 
							(mins > 0 ? "-" : "") + // if the offset is positive, the time zone is negative
							utility.padLeft(Math.abs(Math.floor(mins/60)),"0",2).toString() + ":" + 
							utility.padLeft(mins % 60,"0",2);
					return result;
				}
			},
			dateShorts : {
				d : "dd/MM/yyyy",
				D : "MMMM dd, yyyy",
				t : "hh:mm tt",
				T : "hh:mm:ss tt",
				f : "MMMM dd, yyyy hh:mm tt",
				F : "MMMM dd, yyyy hh:mm:ss tt",
				g : "dd/MM/yyyy hh:mm tt",
				G : "dd/MM/yyyy hh:mm:ss tt",
				M : "MMMM dd",
				r : "ddd, dd MMM yyyy hh:mm:ss GMT",
				s : "yyyy-MM-ddThh:mm:ss",
				u : "yyyy-MM-dd hh:mm:ssZ",
				U : "MMMM dd,yyyy hh:mm:ss tt",
				Y : "MMMM, yyyy"
			},
			days : ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
			daysShort : ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
			months : ["January","February","March","April","May","June","July","August","September","October","November","December"],
			monthsShort : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
		};
		Formatter.prototype.dateNames = (function(){
			return utility.getProperties(Formatter.prototype.date,"length desc");
		}());
		Formatter.prototype.numberShortRegex = (function(){
			var names = utility.getProperties(Formatter.prototype.numberShorts,"length desc");
			return new RegExp("^([" + names.join('') + "])(\\d+)?$","i");
		}());
		
		String.prototype.format = function(){
			var 	
				self = this,
				result = [],
				params = [],
				position = 0,
				parameterFormat,
				param,
				start,
				end,
				i,
				p,
				pad = function(padding,value,condition,result){
					if(condition) {
						var i;
						for(i = 0; i < Math.abs(padding)-value.length; i+=1) {
							result.push(" ");
						}
					}
				};
			
			// compile the paramaters, and escape double brackets if there are any
			// if there are no double brackets, use the regex to find parameters, 
			// this should be slightly faster in native code, and less error prone (if there are any bugs)
			// if there are double brackets, use the looping code to compensate for escaping values
			if(self.indexOf("{{") === -1 && self.indexOf("}}") -1){	
				// use the format with brackets
				parameterFormat = /\{(\d+)(,-?\d+)?(:.*?)?\}/gi;
				for (param = parameterFormat.exec(self);
					param !== null;
					param = parameterFormat.exec(self))
				{
					params.push({
						length : param[0].length,
						index : param[1],
						padding : param[2] !== undefined ? parseInt(param[2].substring(1),10) : 0,
						format : param[3] !== undefined ? param[3].substring(1) : undefined,
						value : arguments[param[1]],
						paramAt : param.index
					});
				}
			} else {
				// use the format without brackets
				parameterFormat = /^(\d+)(,-?\d+)?(:.*?)?$/gi;
				i = 0;
				while(i > -1){
					start = self.indexOf("{",i);
					while (start !== -1 && self.substring(start,start+2) === "{{") {
						start = self.indexOf("{",start+2);
					}
						
					end = self.indexOf("}",i);
					while (end !== -1 && self.substring(end,end+2) === "}}") {
						end = self.indexOf("}",end+2);
					}
					
					if(start !== -1 && end !== -1){
						param = self.substring(start+1,end);
						param = parameterFormat.exec(param);
						params.push({
							match : param[0].length + 2,
							index : param[1],
							padding : param[2] !== undefined ? parseInt(param[2].substring(1),10) : 0,
							format : param[3] !== undefined ? param[3].substring(1) : undefined,
							value : arguments[param[1]],
							paramAt : start
						});
					}
					i = self.indexOf("{",end);
				}
			}
			
			for(i = 0; i < params.length;i+=1) {
				p = params[i];
				
				// grab text in front of param
				if(p.paramAt > position){
					result.push(self.substring(position,p.paramAt));
					position = p.paramAt;
				}
				
				// do format
				if(p.format) {
					p.value = new Formatter().format(p.format,p.value);
				}
					
				// do left padding
				pad(p.padding,p.value,p.padding < 0,result);
				
				// add value to result
				result.push(p.value);
				position += p.length;
				
				// do right padding
				pad(p.padding,p.value,p.padding > 0,result);
			}
			// grab everything after the last value
			if(position < self.length) {
				result.push(self.substring(position,self.length));
			}
			
			result = result.join('');
			
			return result;
		};
		Number.prototype.format = function(format){		
			return new Formatter().format(format,this);
		};
		Date.prototype.format = function(format){
			return new Formatter().format(format,this);		
		};
		String.format = function(format) {
			var args = [],i;
			for(i = 1; i < arguments.length; i++) {
				args.push(arguments[i]);
			}
			return String.prototype.format.apply(format,args);
		};
	}
}());	