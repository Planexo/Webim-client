'use strict';
/**
 * Part
 * Cet objet représente une partie de l'environnement
 * @returns {{}}
 * @constructor
 */
var part = function () {
	var self = {};
	
	var isCharged;
	var obj;
	var minX, minY, minZ, maxX, maxY, maxZ;
	
	self.setBounds( _minX, _minY, _minZ, _maxX, _maxY, _maxZ ) {
		minX = _minX;
		minY = _minY;
		minZ = _minZ;
		maxX = _maxX;
		maxY = _maxY;
		maxZ = _maxZ;
	}
	
	self.isXInside( x ) {
		return x> minX && x<maxX;
	}
	
	self.isYInside( y ) {
		return y> minY && y<maxY;
	}
	
	self.isZInside( z ) {
		return z > minZ && z < maxZ;
	}
	
	self.distance( x, y, z ) { // returns the distance to the closest point of the cube
		if ( ( isXInside(x) && isYInside(y) ) || ( isYInside(y) && isZInside(z) ) || ( isZInside(z) && isXInside(x) ) {
			if ( x < minX ) 
				return minX - x;
			if ( x > maxX ) 
				return x - maxX;
			if ( y < minY ) 
				return minY - y;
			if ( y > maxY ) 
				return y - maxY;
			if ( z < minZ ) 
				return minZ - z;
			if ( z > maxZ ) 
				return z - maxZ;
		} else if ( isXInside(x) || isYInside(y) || isZInside(z) ) {
			if( isXInside(x) ) {
				
			}
		}
	}
	
	self.isInside = function ( x, y, z) {
		return x > minX && x < maxX && y >minY && y < maxY && z > minZ && z < maxZ;
	}
	
	self.parsemtl = function(mtl) {
		var objects = mtl.split("\nnewmtl ");
	};
};