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

		//Exemples d'utilisation

		api.ifc.load(
			'1.ifc',
			function (serverResponse) {
				console.log(serverResponse);
			}
		);

		// Exemple qui permet d'afficher l'obj
		api.ifc.parts(
			'1.ifc',
			function (serverResponse) { 

				var mtlLoader = new THREE.MTLLoader()
				var material = mtlLoader.parse(serverResponse.mtl);
				material.preload(); 

				var loaderB = new THREE.OBJLoader();
				loaderB.setMaterials(material);
				var obj = loaderB.parse(serverResponse.obj);

				//ajout de l'objet sur la scène
				mygl.clearScene();
				mygl.addOnScene(obj);

				//on fait pointer la camera sur l'objet
				mygl.cameraOn(obj); 
			}
		); 
		 			 
	}

	// Fonctions à implémenter en fonctions des boutons qu'on rajoute à l'interface
	$scope.ObjOnClick = function () {
		// TODO
	}

  });
