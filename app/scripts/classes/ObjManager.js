'use strict';
/**
 * MyGL
 * Cet objet gère la scène et les objets qui s'y trouvent.
 * @returns {{}}
 * @constructor
 */
var ObjManager = function () {
	var self = {};
	
	var parts = Array();
	
	self.parsemtl = function(mtl) {
		var objects = mtl.split("\nnewmtl ");
	};
};