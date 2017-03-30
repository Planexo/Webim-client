'use strict';
/**
 * MyGL
 * Cet objet gère la scène et les objets qui s'y trouvent.
 * @returns {{}}
 * @constructor
 */
var MyGL = function (canvas) {
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
		 * Gestion de position de la camera
         * @private
         */
         _posCam,
        /**
		 * Gestion de la direction visee par camera
         * @private
         */
         _targetCam,
        /**
		 * Gestion de la scène
         * @private
         */
		_scene,
        /**
		 * Gestion du rendu
         * @private
         */
		_renderer;
    /**
     * Gestion de la souris
     * @private
     */
    var mouseDown = false;
    var mouseX = -1;
    var mouseY = -1;
    var up = new THREE.Vector3(0,0,1);
    /**
     * Liste des éléments ajoutés à la scène
     * @type {Array}
     * @private
     */
    var _entities = [];
    self.objManager = null;
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

        var width = 0, height = 0;

        _scene = new THREE.Scene();

        if (window.innerWidth < 800) {
            width = 90 * window.innerWidth / 100;
        }
        else {
            width = 90 * window.innerWidth / 100 - rightMenuRatio;


            height = 70 * window.innerHeight / 100;
        }

        ////////////////////////////////////////////////////////////////////////////////////
        ////////////                    CAMERA                           /////////////////
        ////////////////////////////////////////////////////////////////////////////////////

        //Initialise la position et direction de la camera
        _posCam = new THREE.Vector3(50, 50, 2);
        _targetCam = new THREE.Vector3(-0.5, -0.5, 0);


        _camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.01, 10000); // Initialisation caméra 

        _camera.position.set(_posCam.x, _posCam.y, _posCam.z); // Set la position de la camera
        _camera.up.set(0, 0, 1); // Set le vecteur du haut de la camera

        var dir = new THREE.Vector3(0,0,0);
        _camera.lookAt(dir.add(_posCam).add(_targetCam)); // Set la direction que la caméra regarde ( regarde vers le point : poosition + direction regardée)

        _camera.updateProjectionMatrix();
        _scene.add(_camera);


        ////////////////////////////////////////////////////////////////////////////////////
        ////////////                    LUMIERES                           /////////////////
        ////////////////////////////////////////////////////////////////////////////////////

        var distancetozero = 10000;

        var light1 = new THREE.PointLight(0xffffff, 0.7, distancetozero);
        var light2 = new THREE.PointLight(0xffffff, 0.7, distancetozero);
        var light3 = new THREE.PointLight(0xffffff, 0.7, distancetozero);
        var light4 = new THREE.PointLight(0xffffff, 0.7, distancetozero);

        var lightdist = 1000;

        light1.position.set(lightdist, lightdist, lightdist);

        light2.position.set(-lightdist, lightdist, lightdist);

        light3.position.set(lightdist, -lightdist, lightdist);

        light4.position.set(-lightdist, -lightdist, lightdist);

        _scene.add(light1);
        _scene.add(light2);
        _scene.add(light3);
        _scene.add(light4);


        ////////////////////////////////////////////////////////////////////////////////////
        ////////////                    ENVIRONNEMENT                      /////////////////
        ////////////////////////////////////////////////////////////////////////////////////

        addAxes();
        //Decors();




        ////////////////////////////////////////////////////////////////////////////////////
        ////////////                    SPOTLIGHT POUR DES OMBRAGES        /////////////////
        ////////////////////////////////////////////////////////////////////////////////////
        
        var spotLight = new THREE.SpotLight(0xffffff, 0.4);
        spotLight.position.set(200, 200, 200);

        spotLight.castShadow = true;

        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;

        spotLight.shadow.camera.near = 500;
        spotLight.shadow.camera.far = 4000;
        spotLight.shadow.camera.fov = 30;


        _scene.add(spotLight);



        ////////////////////////////////////////////////////////////////////////////////////
        ////////////                    INITIALISATION RENDERER            /////////////////
        ////////////////////////////////////////////////////////////////////////////////////

        _renderer = new THREE.WebGLRenderer();//{ antialiasing: true }/*{ alpha: true }*/);  //CanvasRenderer();
        _renderer.setSize(width, height);
        _renderer.setClearColor(clearcolor, 1);

        var container = document.getElementById(divContainer);

        container.appendChild(_renderer.domElement);




        ////////////////////////////////////////////////////////////////////////////////////
        ////////////                    Rajout des callbacks               /////////////////
        ////////////////////////////////////////////////////////////////////////////////////
        window.addEventListener('resize', onWindowResize, false);
        window.addEventListener('keydown', KeyHandler);
        canvas.addEventListener('mousemove', function (e) { onMouseMove(e); }, false);
        canvas.addEventListener('mousedown', function (e) { onMouseDown(e); }, false);
        canvas.addEventListener('mouseup', function (e) { onMouseUp(e); }, false);
    };

    /**
	 * Cette fonction lance l'animation de façon récursive à intervalle régulier
     */
    self.animate = function () {
        requestAnimationFrame(self.animate);
        self.render();
    };

    /**
	 * Cette fonction affiche la scène du point de vue de la camera
     */
    self.render = function () {
        _camera.position.set(_posCam.x, _posCam.y, _posCam.z);
        var dir = new THREE.Vector3(0,0,0);
        _camera.lookAt(dir.add(_posCam).add(_targetCam));
        _camera.updateProjectionMatrix();

        _renderer.render(_scene, _camera);
    };

    /**
	 * Cette fonction repositionne la camera et raffraîchit le rendu quand la dimension de la page est modifiée.
     */
    var onWindowResize = function () {

        if (window.innerWidth < 800) {
            _camera.aspect = (window.innerWidth - 20) / (window.innerHeight);
            _camera.updateProjectionMatrix();

            _renderer.setSize(90 * window.innerWidth / 100, 70 * window.innerHeight / 100);
        }
        else {
            _camera.aspect = (window.innerWidth - rightMenuRatio) / (window.innerHeight - headerSize);
            _camera.updateProjectionMatrix();

            _renderer.setSize(90 * window.innerWidth / 100 - rightMenuRatio, 70 * window.innerHeight / 100 - headerSize);
        }
    };

    /* 
    	Cette fonction gère les appuis sur le clavier
    */
    var KeyHandler = function (event) {
        var key = event.keyCode;

        var _forwardCam = new THREE.Vector3();
        _forwardCam.copy(_targetCam);
               // console.log(_forwardCam);
        var mvtSpeed = 1;

        switch (key) {
            case 90:
                // Z Handler
                _forwardCam.normalize();
                _forwardCam.multiplyScalar(mvtSpeed);
                _posCam.add(_forwardCam);
               // _targetCam.sub(_forwardCam);
                break;
            case 81:
                // Q Handler
                _forwardCam.cross(_camera.up);
                _forwardCam.normalize();
                _forwardCam.multiplyScalar(mvtSpeed);
                _posCam.sub(_forwardCam);
                //_targetCam.add(_forwardCam);
                break;
            case 68:
                // D Handler
                _forwardCam.cross(_camera.up);
                _forwardCam.normalize();
                _forwardCam.multiplyScalar(mvtSpeed);
                _posCam.add(_forwardCam);

              //  _targetCam.sub(_forwardCam);
                break;
            case 83:
                // S Handler
                _forwardCam.normalize();
                _forwardCam.multiplyScalar(mvtSpeed);
                _posCam.sub(_forwardCam);
               // _targetCam.add(_forwardCam);
                break;
            case 65:
            	// A handler - move down
                _forwardCam = new THREE.Vector3(0,0,1);
                _forwardCam.multiplyScalar(mvtSpeed);
                _posCam.sub(_forwardCam);
            	break;
            case 69:
            	// E handler - move up
                _forwardCam = new THREE.Vector3(0,0,1);
                _forwardCam.multiplyScalar(mvtSpeed);
                _posCam.add(_forwardCam);
            	break;
            case 70:
            	// F handler - rotate left
            	up = up.applyAxisAngle(_forwardCam,0.2 );
            	_camera.up.copy(up);
            default:
                //alert("Key pressed was not valid !");
                break;
        }

        if ( self.objManager != null)
       		self.objManager.checkProximity(_posCam.x, _posCam.y, _posCam.z);
    };


    // gère le mouvement de la souris
    function onMouseMove(evt) {

        if (!mouseDown) {
            return;
        }

        evt.preventDefault(); // souris

       
      	var deltaX =  (evt.clientX - mouseX);
     	var deltaY = (evt.clientY - mouseY);
        mouseX = evt.clientX;
        mouseY = evt.clientY;
        rotateCam(-deltaX, -deltaY);
    }

    // Active la rotation quand il y a un clic souris
    function onMouseDown(evt) {
        evt.preventDefault();
        
        mouseDown = true;
        mouseX = evt.clientX;
        mouseY = evt.clientY;
    }

    //Desactive la rotation quand on arrete de cliquer
    function onMouseUp(evt) {
        evt.preventDefault();

        mouseDown = false;
    }


    //Fait la rotation de la camera selon l'axe z et l'axe de tangage de la camera
    function rotateCam(deltaX, deltaZ) {
        var _diffCam = new THREE.Vector3();
        _diffCam.copy(_targetCam).cross(up).normalize(); // calcul de l'axe de tangage de la camera

        _targetCam.applyAxisAngle ( up, deltaX/400 );
        _targetCam.applyAxisAngle ( _diffCam, deltaZ/400 );
    }

    //Génère les axes de l'environnement
    var addAxes = function () {
        var material = new THREE.LineBasicMaterial({
            color: 0xFF0000//rouge
        });

        var geometry = new THREE.Geometry();
        geometry.vertices.push(
			new THREE.Vector3(5, 5, 5),
			new THREE.Vector3(6, 5, 5) // x
		);

        var line = new THREE.Line(geometry, material);
        _scene.add(line);

        var material2 = new THREE.LineBasicMaterial({
            color: 0x0000FF // bleu
        });

        var geometry2 = new THREE.Geometry();
        geometry2.vertices.push(
			new THREE.Vector3(5, 5, 5),
			new THREE.Vector3(5, 6, 5) // y
		);

        var line2 = new THREE.Line(geometry2, material2);
        _scene.add(line2);

        var material3 = new THREE.LineBasicMaterial({
            color: 0x00FF00 // vert
        });

        var geometry3 = new THREE.Geometry();
        geometry3.vertices.push(
			new THREE.Vector3(5, 5, 5),
			new THREE.Vector3(5, 5, 6) //z
		);

        var line3 = new THREE.Line(geometry3, material3);
        _scene.add(line3);
    }


    var Decors = function () {
    	// Génère un décors simple : Un sol vert et le ciel
        // Sol

        var geometry = new THREE.PlaneGeometry(200, 200);
        var material = new THREE.MeshBasicMaterial({ color: 0x009900 }); // Vert
        var material2 = new THREE.MeshBasicMaterial({ color: 0x0000FF }); // Bleu
        var sol = new THREE.Mesh(geometry, material);
        sol.position.set(0, 0, -0.2);

        var ciel1 = new THREE.Mesh(geometry, material2);
        ciel1.position.set(0, 100, 100);
        ciel1.rotation.set(Math.PI / 2, 0, 0);
        var ciel2 = new THREE.Mesh(geometry, material2);
        ciel2.position.set(0, -100, 100);
        ciel2.rotation.set(-Math.PI / 2, 0, 0);
        var ciel3 = new THREE.Mesh(geometry, material2);
        ciel3.position.set(100, 0, 100);
        ciel3.rotation.set(0, -Math.PI / 2, 0);
        var ciel4 = new THREE.Mesh(geometry, material2);
        ciel4.position.set(-100, 0, 100);
        ciel4.rotation.set(0, Math.PI / 2, 0);
        var ciel5 = new THREE.Mesh(geometry, material2);
        ciel5.position.set(0, 0, 200);
        ciel5.rotation.set(Math.PI, 0, 0);
        _scene.add(sol);
        _scene.add(ciel1);
        _scene.add(ciel2);
        _scene.add(ciel3);
        _scene.add(ciel4);
        _scene.add(ciel5);
    }

    /**
	 * Généère un cube unitaire  à la position donnée
     * @param x
     * @param y
     * @param z
     * @returns {Raycaster.params.Mesh|{}|*|Mesh}
     * @constructor
     */
    self.Cube = function (x, y, z) {
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshPhongMaterial({ color: 0xbebead });
        var cube = new THREE.Mesh(geometry, material);
        cube.position.set(x, y, z);

        return cube;
    };

    /**
	 * Ajoute l'élément à la scène
     * @param element {Raycaster.params.Mesh|{}|*|Mesh}
     */
    self.addOnScene = function (element) {
        if (element) {
            _scene.add(element);
            _entities.push(element);
        }
    };

    /**
     * Supprime l'élément de la scène
     * @param element {Raycaster.params.Mesh|{}|*|Mesh}
     */
    self.removeFromScene = function (element) {
        if (element) {
            _scene.remove(element);
            for (var i = 0; i < _entities.length; i++) {
                if (element == _entities[i])
                    _scene.remove(_entities[i]);
            }
        }
    };

    /**
	 * Supprime tous les éléments de la scène
     */
    self.clearScene = function () {
        for (var i = 0; i < _entities.length; i++) {
            _scene.remove(_entities[i]);
        }
    };

    /**
	 * Braque la caméra sur l'objet donné
     * @param element {Raycaster.params.Mesh|{}|*|Mesh}
     */
    self.cameraOn = function (element) {
        if (element.type == 'Mesh') {
            _camera.lookAt(element.position);
        }
    };

    return self;
};


