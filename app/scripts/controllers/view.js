'use strict';

/**
 * @ngdoc function
 * @name webimClientApp.controller:ViewCtrl
 * @description
 * # ViewCtrl
 * Controller of the webimClientApp
 */
angular.module('webimClientApp')
  .controller('ViewCtrl', function ($scope) {
    this.awesomeThings = [
      'HTML5 Boilerplate', 
      'AngularJS',
      'Karma'
    ];

    var mygl = null;  
	var api = null;


	$scope.init = function () {  
		mygl = (new MyGL());
		api = new Api(Config); 

		mygl.initGL("GLDiv"); 
		mygl.animate();

		//récupération du fichier MTL
		api.getIfcMtl(
			'1.ifc.mtl',
			function(serverResponse){ // succès 

				var mtlLoader = new THREE.MTLLoader()
				var material = mtlLoader.parse(serverResponse.data);
				material.preload(); 

				//récupération du fichier OBJ
				api.getIfcObj(
					'1.ifc.obj',
					function (serverResponse2) { // succès 

						var loaderB = new THREE.OBJLoader();
						loaderB.setMaterials(material);
						var obj = loaderB.parse(serverResponse2.data);

						//ajout de l'objet sur la scène
						mygl.clearScene();
						mygl.addOnScene(obj);

						//on fait pointer la camera sur l'objet
						mygl.cameraOn(obj); 
					},
					function (serverResponse2) { // echec
						// body...
					}
				); 

					
			},
			function(serverResponse){ //echec
				console.log("echec");

			} 
		);

		
 
						 
	}

	// Fonctions à implémenter en fonctions des boutons qu'on rajoute à l'interface
	$scope.ObjOnClick = function () {
		// TODO
	}

  });
