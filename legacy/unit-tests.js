var callback = (function($){
	$(function(){


		module("bugs");
	});
});

if(typeof define === "function" && define.amd) {
	define(["jquery","qunit"],callback);
} else {
	callback($);
}