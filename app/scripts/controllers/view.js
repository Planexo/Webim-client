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


        $scope.colors = [];
       	$scope.opacity = []

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

        var generateSidebar = function(mtlobject, table) {
            console.log("Generating Sidebar !");
            if(mtlobject != undefined) {
                console.log("Non empty object !");
                for ( var i=0; i<mtlobject.material.length; i++) {
                    var ligne = table.insertRow(-1);
                    var nom = ligne.insertCell(0);
                    var hideShow = ligne.insertCell(1);
                    var range = ligne.insertCell(2);
                    var color = ligne.insertCell(3);

                    nom.innerHTML = mtlobject.material[i].name;
                    //angular.element(nom).append( $compile(nominnerHTML)($scope) );
                    var hideShowinnerHTML = '<button class="hideShow" ng-click="hideShow('+i+')">Montrer/Cacher</button>';
                    angular.element(hideShow).append( $compile(hideShowinnerHTML)($scope) );
                    var rangeinnerHTML = '<input type="range" ng-model="opacity['+i+']" ng-change="UpdateOpacity('+i+')"  max="100" min="0" value="100"/>';
                    angular.element(range).append( $compile(rangeinnerHTML)($scope) );
                    var colorinnerHTML = '<input type="color" ng-model="colors['+i+']" ng-change="UpdateColor('+i+')" />';
                    angular.element(color).append( $compile(colorinnerHTML)($scope) );

                }
            }
		};

       var generationTable = function (mtlobject) { // Génère le tableau pour modifier le MTL
            generateSidebar(mtlobject, document.getElementById("mtl_table"));
            mygl.objManager = objManager;
       };
        /**
         * Fonction d'initilisation appelée au chargement de la vue 'View'
         */

        $scope.init = function () {
        	var canvas = document.getElementById("GLDiv");
        	var table = document.getElementById("mtl_table");

            mygl = new MyGL(canvas);
			objManager = new ObjManager(mygl, table, generationTable);

            //initialisation de la scène
            mygl.initGL("GLDiv");
            mygl.animate();

			
			objManager.InitialisationIFC( '1.ifc');
			//objManager.InitialisationIFC( 'Paris2010');

			objManager.checkProximity(0,0,0);

        };

       $scope.hideShow = function(id) {
       		objManager.hideShowElement(id);
       };


       $scope.resetMTL = function() {
       		objManager.resetMTL();
       };

        $scope.UpdateOpacity = function(id) {
        	objManager.setMaterialVisibility(id,$scope.opacity[id]/100.0);
        	//console.log($scope.opacity[id]);
       		//alert($scope.opacity[id]);
        };

        $scope.UpdateColor = function(id) {
        	objManager.setMaterialColor(id,$scope.colors[id]);
        	console.log($scope.colors[id]);
        };
		

    });
	

