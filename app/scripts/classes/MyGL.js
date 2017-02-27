'use strict';
/**
 * MyGL
 * Cet objet gère la scène et les objets qui s'y trouvent.
 * @returns {{}}
 * @constructor
 */
var MyGL = function () { 
	var self = {};

	//Constantes : Karma rejette l'utilisation de const
	var headerSize = 70;
	var rightMenuRatio = 245;
	var clearcolor = 0;//0xeeeeee;

    /**
	 * Gestion de la caméra
     * @private
     */
	var _camera,
        /**
		 * Gestion de la scène
         * @private
         */
		_scene,
        /**
		 * Gestion du rendu
         * @private
         */
		_renderer,
        /**
		 * Gestion du trackball
         * @private
         */
		_trackball,
        /**
		 * Liste des éléments ajoutés à la scène
         * @type {Array}
         * @private
         */
		_entities = []; 

	//---------------------------------------------------------------------------------------
	//	WebGL
	//---------------------------------------------------------------------------------------

    /**
	 * Cette fonction semble indiquer si le navigateur supporte la technologie WebGL ou non
     * @returns {boolean}
     */
	var hasWebGL = function () {
	    try {
	      var canvas = document.createElement('canvas');
	      var ret =
	          !!(window.WebGLRenderingContext &&
	              (canvas.getContext('webgl') ||
	              canvas.getContext('experimental-webgl'))
	          );
	      return ret;
	    }
	    catch (e) {
	      return false;
	    };
	};

    /**
	 *
     * @param divContainer: l'id de la balise dans laquelle afficher le viewer
     */
	self.initGL = function (divContainer) {

        //no_scene = no_scene || true;
        var animateWithWebGL = hasWebGL();         

        var width=0, height=0;

        _scene = new THREE.Scene();

        if(window.innerWidth<800){
          width = 90*window.innerWidth/100;
        }
        else{
          width = 90*window.innerWidth/100 - rightMenuRatio;


          height = 70*window.innerHeight/100;
        }

        //objets
        /*let cube = self.Cube(1, 1, 1);
        let cube2 = self.Cube(-1, 1, 2);

        _scene.add(cube);
        _scene.add(cube2);*/

        _camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

		_camera.position.z = 20;
		_camera.position.x = 20;
		_camera.position.y = 20;
		//_camera.lookAt(cube.position); 
        _scene.add(_camera);

        // create lights
        var distancetozero = 5000;

        var light1 = new THREE.PointLight(0xffffff,1,distancetozero);
        var light2 = new THREE.PointLight(0x00ff00,1,distancetozero);
        var light3 = new THREE.PointLight(0xff0000,1,distancetozero);
        var light4 = new THREE.PointLight(0xffffff,1,distancetozero);

        var lightdist = 30;
        
        light1.position.set( lightdist,lightdist,lightdist);

        light2.position.set( -lightdist,lightdist,-lightdist);

        light3.position.set( lightdist,-lightdist,-lightdist);

        light4.position.set( -lightdist,-lightdist,lightdist);

        _scene.add(light1);
        _scene.add(light2);
        _scene.add(light3);
        _scene.add(light4); 

        var spotLight = new THREE.SpotLight( 0xffffff );
		spotLight.position.set( 200,200,200 );

		spotLight.castShadow = true;

		spotLight.shadow.mapSize.width = 1024;
		spotLight.shadow.mapSize.height = 1024;

		spotLight.shadow.camera.near = 500;
		spotLight.shadow.camera.far = 4000;
		spotLight.shadow.camera.fov = 30;

		//spotLight.target = cube;

		_scene.add( spotLight );

		_trackball = new THREE.TrackballControls(_camera);
        _trackball.rotateSpeed = 3.0;
        _trackball.zoomSpeed = 1.2;        
        _trackball.panSpeed = 0.8;

        _trackball.noZoom = false;
        _trackball.noPan = false;
        _trackball.target.set(0, 0, 0);  
        _trackball.dynamicDampingFactor = 0.3;
        _trackball.minDistance = 1;
        _trackball.maxDistance = 300;
        _trackball.keys = [82, 90, 80]; // [r:rotate, z:zoom, p:pan]
        _trackball.addEventListener('change', self.render);
 
        _renderer = new THREE.WebGLRenderer();//{ antialiasing: true }/*{ alpha: true }*/);  //CanvasRenderer();
        _renderer.setSize(width, height);
        _renderer.setClearColor( clearcolor, 1);  
 
		var container = document.getElementById(divContainer); 

        container.appendChild(_renderer.domElement);

        window.addEventListener( 'resize', onWindowResize, false );
	};

    /**
	 * Cette fonction lance l'animation de façon récursive à intervalle régulier
     */
	self.animate = function () {
	    requestAnimationFrame(self.animate);
	    _trackball.update();
	    self.render();
	};

    /**
	 * Cette fonction affiche la scène du point de vue de la camera
     */
	self.render = function () { 
	    _renderer.render(_scene, _camera);
	};

    /**
	 * Cette fonction repositionne la camera et raffraîchit le rendu quand la dimension de la page est modifiée.
     */
	var onWindowResize = function (){

	    if(window.innerWidth<800){
			_camera.aspect = (window.innerWidth  - 20 ) / (window.innerHeight);
			_camera.updateProjectionMatrix();

			_renderer.setSize( 90*window.innerWidth/100  , 70*window.innerHeight/100);
	    }
		else{
			_camera.aspect = (window.innerWidth  -rightMenuRatio ) / (window.innerHeight - headerSize);
			_camera.updateProjectionMatrix();

			_renderer.setSize( 90*window.innerWidth/100  -rightMenuRatio , 70*window.innerHeight/100 - headerSize);
		}
	};

	/*---------------------------------------------------------------------------------------
	 *	Scene
	 * TODO : on pourrait au mieux créer un sous objet 'Scene' qui regroupe toutes les fonctionnalités ci-dessous, permettant
	 * TODO : ainsi de bien mettre en évidence la logique du code
	 * Par exemple :
	 * self.scene = {
	 * 		"add" : function(element){
	 * 			_scene.add(element);
	 * 			_entities.push(element);
	 *		},
	 * 		"remove" : function(element){
	 * 			...
	 *		}
	 * };
	 * Et dans le code, ca donnerait :
	 * 		MyGL.scene.add(obj);
	 * plutôt que
	 * 		MyGL.addOnScene(obj);
	 *---------------------------------------------------------------------------------------*/

    /**
	 * Généère un cube unitaire  à la position donnée
     * @param x
     * @param y
     * @param z
     * @returns {Raycaster.params.Mesh|{}|*|Mesh}
     * @constructor
     */
	self.Cube = function (x,y,z){
		var geometry = new THREE.BoxGeometry( 1,1,1 );
		var material = new THREE.MeshPhongMaterial( { color: 0xbebead } );
		var cube = new THREE.Mesh( geometry, material );
		cube.position.set(x,y,z );
		
		return cube;
	};

    /**
	 * Ajoute l'élément à la scène
     * @param element {Raycaster.params.Mesh|{}|*|Mesh}
     */
	self.addOnScene = function (element) {  
		if( element){  
			_scene.add(element);
			_entities.push(element);
		}		
	};

    /**
     * Supprime l'élément de la scène
     * @param element {Raycaster.params.Mesh|{}|*|Mesh}
     */
	self.removeFromScene = function (element)      {   
		if( element){  
			_scene.remove(element);
			for (var i = 0; i < _entities.length; i++) {
				if(element == _entities[i])
			  		_scene.remove(_entities[i]);
			} 
		}
	};

    /**
	 * Supprime tous les éléments de la scène
     */
	self.clearScene = function ()      { 
		for (var i = 0; i < _entities.length; i++) {
		  	_scene.remove(_entities[i]);
		}  
	};

    /**
	 * Braque la caméra sur l'objet donné
     * @param element {Raycaster.params.Mesh|{}|*|Mesh}
     */
	self.cameraOn = function (element) {  
		if( element.type == 'Mesh'){  
			_camera.lookAt(element.position); 
		}
	};

	return self;
};

/*

//---------------------------------------------------------------------------------------
//	Examples
//---------------------------------------------------------------------------------------

var mygl = (new MyGL);  
mygl.initGL(); 
mygl.animate();


let cube = mygl.Cube(1,1,1); 
mygl.addOnScene(cube);

mygl.addOnScene(mygl.Cube(1,2,2));
mygl.addOnScene(mygl.Cube(2,3,2));

mygl.cameraOn(cube);

mygl.removeFromScene(cube);

setTimeout(function () {
	//mygl.clearScene();
}, 5000);

*/