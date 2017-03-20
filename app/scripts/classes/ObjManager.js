'use strict';
/**
 * MyGL
 * Cet objet gère la scène et les objets qui s'y trouvent.
 * @returns {{}}
 * @constructor
 */
var ObjManager = function (_myGL) {
	var self = {};
	
	var myGL = _myGL;
	var api = new Api(Config);
	var tailleBoite;
	var seuilChargement;
	var parts = new Array();
	var mtl;
	
	self.setValuesSpace = function ( part ) {
		tailleBoite = max( part.maxX - part.minX, part.maxY - part.minY, part.maxZ - part.minZ);
	};
	
	/*self.parsemtl = function(mtl) {
		var objects = mtl.split("\nnewmtl ");
	};*/
	
	self.parseBoxes = function( obj ) {
		for ( var i =0; i < obj.parts.length / 7; i++ ) {
			var part = new Part();
			part.setName( obj.parts[i].filename );
			part.setBounds (obj.parts[i].bounds.x[0],obj.parts[i].bounds.y[0],obj.parts[i].bounds.z[0],obj.parts[i].bounds.x[1],obj.parts[i].bounds.y[1],obj.parts[i].bounds.z[1];
			parts.push(part);
		}
	};
	
	self.ClearParts = function () {
		parts.splice(0,parts.length);
	};
	

	self.loadInformations = function( ifc_name ) {
		api.ifc.mtl(
		   ifc_name,
           function (serverResponse) {
					self.parseBoxes(serverResponse.objets);
					mtl = serverResponse.mtl;
                }
            );

	};
	
	self.checkProximity = function( x, y, z) { // Vérifie la distance avec chacunes des parties des non chargées, et si elle est trop proche on les charges et relance l'affichage
		var ok = false;
		parts.forEach( function(element) {
			if ( element.getCharged() == false ) {
				if ( element.distance(x,y,z) <= seuilChargement ) {
					loadObj( part );
					ok = true;
				}
			}			
		});
		
		if ( ok ) {
			ReloadScene();
		}
	};
	
	var loadObj = function( part ) { // charge le string OBJ et le charge dans la partie associée
		api.ifc.parts(
		   part.getName(),
           function (serverResponse) {
					part.setObj(serverResponse.obj);
                    var loaderB = new THREE.OBJLoader();
                    loaderB.setMaterials(material);
                    var obj = loaderB.parse(serverResponse.obj);
                }
            );
	};
	
	var ReloadScene = function() {
		
        mygl.clearScene();
		parts.forEach( function(element) {
			if ( element.getCharged() == true ) {
                var mtlLoader = new THREE.MTLLoader()
                var material = mtlLoader.parse(mtl);
                material.preload();

                //récupération de l'objet serverResponse.obj
                var loaderB = new THREE.OBJLoader();
                loaderB.setMaterials(material);
                var obj = loaderB.parse(part.getObj);
				mygl.addOnScene(obj);
			}			
		});
	};
	
};