'use strict';
/**
 * Part
 * Cet objet représente une partie de l'environnement
 * @returns {{}}
 * @constructor
 */
var part = function () {
	var self = {};
	
	var isCharged = false;
	var obj = null;
	var minX, minY, minZ, maxX, maxY, maxZ;
	var name;
	
	self.getCharged = function () {
		return isCharged;
	}
	
	self.setCharged = function (value) {
		obj = value;
	}
	
	self.getObj = function () {
		return obj;
	}
	
	self.setObj = function (value) {
		obj = value;
	}
	
	self.getName = function () {
		return name;
	}
	
	self.setName = function (value) {
		name = value;
	}
	
	self.setBounds = function ( _minX, _minY, _minZ, _maxX, _maxY, _maxZ ) {
		minX = _minX;
		minY = _minY;
		minZ = _minZ;
		maxX = _maxX;
		maxY = _maxY;
		maxZ = _maxZ;
	};
	
	self.setCharged
	
	self.setObj = function ( _obj ) {
		obj = _obj;
	};
	
	self.isXInside= function ( x ) {
		return x> minX && x<maxX;
	};
	
	self.isYInside= function ( y ) {
		return y> minY && y<maxY;
	};
	
	self.isZInside= function ( z ) {
		return z > minZ && z < maxZ;
	};
	
	self.distance= function ( x, y, z ) { // returns the distance to the closest point of the cube
		var dx = Math.max( minX - x, 0, x - maxX);
		var dy = Math.max( minY - y, 0, y - maxY);
		var dz = Math.max( minZ - z, 0, z - maxZ);
		return Math.sqrt(dx*dx+dy*dy+dz*dz);
	};
	
	self.isInside = function ( x, y, z) {
		return self.distance(x,y,z) === 0;
	};
	
	self.parsemtl = function(mtl) {
		var objects = mtl.split("\nnewmtl ");
	};
};