'use strict';

/**
 * @ngdoc function
 * @name webimClientApp.controller:ViewCtrl
 * @description
 * Ce controller gère l'intéraction avec la scène.
 * # ViewCtrl
 * Controller of the webimClientApp
 */
angular.module('webimClientApp')
    .controller('ViewCtrl', function ($scope, $compile) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma',
        ];

        /**
         * L'objet qui permet d'intéragir avec la scène
         * @type {MyGL}
         */
        var mygl = null;

        /**
         * L'objet qui permet d'effectuer des requêtes sur l'API
         * @type {Api}
         */
        var objManager = null;

        /**
         * Fonction d'initilisation appelée au chargement de la vue 'View'
         */
         var generateSidebar = function(mtlManager, table) {

			for ( var i=0; i<mtlManager.mtlobject.material.length; i++) {
				var ligne = table.insertRow(-1);
				var nom = ligne.insertCell(0);
				var hideShow = ligne.insertCell(1);
				var range = ligne.insertCell(2);
				var color = ligne.insertCell(3);

				var nominnerHTML = mtlManager.mtlobject.material[i].name;
				var hideShowinnerHTML = '<button class="hideShow" ng-click="hideShow('+i+')">Montrer/Cacher</button>';
				angular.element(hideShow).append( $compile(hideShowinnerHTML)($scope) )
				var rangeinnerHTML = '<input type="range" ng-change="UpdateOpacity('+i+',this.value)" value="100" max="100" min="0"/>';
				var colorinnerHTML = '<input type="color" ng-change="UpdateColor('+i+',this.value)" />';

			};
		};

        $scope.init = function () {
        	var table = document.getElementById("mtl_table");

            mygl = new MyGL();
			objManager = new ObjManager(mygl, table);

            //initialisation de la scène
            mygl.initGL("GLDiv");
            mygl.animate();

            mygl.objManager = objManager;
			
			objManager.InitialisationIFC( '1.ifc');

			objManager.checkProximity(0,0,0);
			console.log(objManager.mtlManager);
			generateSidebar(objManager.mtlManager, table);
			//alert('end');
            //Exemple d'utilisation 1  : charger un fichier et afficher la reponse du serveur dans la console

           /* api.ifc.load(
                '1.ifc',
                function (serverResponse) {
                    console.log(serverResponse);
                }
            );

            // Exemple d'utilisation 2  : qui permet d'afficher la partie 'obj' du fichier 1.ifc

            api.ifc.parts(
                '1.ifc',
                function (serverResponse) {
                    // Pour connaitre le contenu de 'serverResponse', consulter PostMan (Lien dans Api.js) ou le controlleur adéquat coté serveur
					alert(serverResponse.responseText);
					console.log(serverResponse);
                    //récupération du matériel dans serverResponse.mtl
                    var mtlLoader = new THREE.MTLLoader()
                    var material = mtlLoader.parse(serverResponse.mtl);
                    material.preload();

                    //récupération de l'objet serverResponse.obj
                    var loaderB = new THREE.OBJLoader();
                    loaderB.setMaterials(material);
                    var obj = loaderB.parse(serverResponse.obj);
                    //ajout de l'objet sur la scène
					//obj.rotation.x =- Math.PI / 2;
					//obj.rotation.y = 90;
					//obj.rotation.z=Math.PI/2;
                    mygl.clearScene();
                    mygl.addOnScene(obj);
					
                    //on fait pointer la camera sur l'objet
                    mygl.cameraOn(obj);
                }
            );*/

        };

        // Fonctions à implémenter en fonction des boutons qu'on rajoute à l'interface

        /**
         * Exemple
         * @constructor
         */
       $scope.hideShow = function(id) {
       		alert('plop');
       };

        $scope.ObjOnClick = function () {
            // TODO
        };

        /**
         * Exemple :
         * clic sur un item de la liste des parties du fichier ifc
         * @constructor
         */
        $scope.PartsItemOnClick = function () {
            // TODO
        };
		
		/*$scope.handleKeyDown = function(event) {
				alert('plop');
		};*/
		

    });
	

