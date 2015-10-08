"use strict";
import {default as assert} from "better-assert";
import * as is from "../src/utils/is";
import * as _ from "lodash";

describe("Utility functions",function(){
	describe("'is' method",function(){
		let isFunctions = _.pick(is,
			"isNumber",
			"isDate",
			"isString",
			"isArray",
			"isFunction");

		let values = {
			"isNumber" : 123456,
			"isDate" : new Date(),
			"isString" : "she sells seashells by the seashore",
			"isArray" : [1,2,3,4,5,6],
			"isObject" : { bob : "susan" },
			"isFunction" : _.noop
		};

		// too many tests to do by hand.  automate the test generation
		_.each(_.keys(isFunctions),function (key) {
			it(key + " should return true when given expected values.",function(){
				// match keys from isFunctions to values
				assert(isFunctions[key](values[key]));
			})
		});

		_.each(_.keys(_.omit(isFunctions,"isObject")),function (key) {
			it(key + " should return false when given unexpected values.",function(){

				// if I'm testing function X I want to remove value X and test function X against all remaining values
				let toTest = isFunctions[key];

				let remainingValues = _.omit(values,key);

				_.each(remainingValues,function(v){
					assert(!toTest(v));
				});
			});
		});

		// isObject needs to be tested seperately for success and failure
		it("isObject return true when given expected values.",function(){
			assert(is.isObject(values.isObject));
			assert(is.isObject(values.isFunction));
			assert(is.isObject(values.isDate));
			assert(is.isObject(values.isArray));
		});
		it("isObject should return false when given unexpected values.",function(){
			assert(!is.isObject(values.isString));
			assert(!is.isObject(values.isNumber));
		});
	});
});