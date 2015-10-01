import * as assert from "better-assert";
import * as utils from "../src/utils";
import * as _ from "lodash";


describe("Utility functions",function(){
	describe("'is' methods",function(){
		let isFunctions = _.pick(utils,
			"isNumber",
			"isDate",
			"isString",
			"isArray",
			"isObject",
			"isFunction");

		let values = {
			"isNumber" : 123456,
			"isDate" new Date(),
			"isString" : "she sells seashells by the seashore",
			"isArray" : [1,2,3,4,5,6],
			"isObject" : { bob : "susan" },
			"isFunction" : _.noop
		};

		it("should pass when given expected values",function(){
			_.each(_.keys(isFunctions),function (key) {
				// match keys from isFunctions to values
				assert(isFunctions[key](values[key]));
			})
		});

		it("should fail when given unexpected values",function(){
			_.each(_.keys(isFunctions),function (key) {
				// if I'm testing function X I want to remove value X and test function X against all remaining values
				let toTest = isFunctions[key];
				let remainingValues = _.omit(values,key);
				_.each(remainingValues,function(v){
					assert(!toTest(v));
				});
			})
		});
	});
});