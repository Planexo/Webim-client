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
		 * Gestion de position de la camera
         * @private
         */
         _posCam,
        /**
		 * Gestion de la position visee par camera
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
    var mouseX = 0;
    var mouseY = 0;
    /**
     * Liste des éléments ajoutés à la scène
     * @type {Array}
     * @private
     */
    var _entities = [];

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

        //objets
        /*let cube = self.Cube(1, 1, 1);
        let cube2 = self.Cube(-1, 1, 2);

        _scene.add(cube);
        _scene.add(cube2);*/

        _posCam = new THREE.Vector3(10, 10, 2);
        _targetCam = new THREE.Vector3(0.0, 0.0, 0.0);

        _camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

        _camera.position.set(_posCam.x, _posCam.y, _posCam.z);
        _camera.up.set(0, 0, 1);
        _camera.lookAt(_targetCam);
        _camera.updateProjectionMatrix();
        _scene.add(_camera);
        //alert(_camera.up.z);
        // create lights
        var distancetozero = 5000;

        var light1 = new THREE.PointLight(0xffffff, 0.5, distancetozero);
        var light2 = new THREE.PointLight(0x00ff00, 0.5, distancetozero);
        var light3 = new THREE.PointLight(0xff0000, 0.5, distancetozero);
        var light4 = new THREE.PointLight(0xffffff, 0.5, distancetozero);

        var lightdist = 30;

        light1.position.set(lightdist, lightdist, lightdist);

        light2.position.set(-lightdist, lightdist, -lightdist);

        light3.position.set(lightdist, -lightdist, -lightdist);

        light4.position.set(-lightdist, -lightdist, lightdist);

        _scene.add(light1);
        _scene.add(light2);
        _scene.add(light3);
        _scene.add(light4);

        addAxes();
        Decord();

        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(200, 200, 200);

        spotLight.castShadow = true;

        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;

        spotLight.shadow.camera.near = 500;
        spotLight.shadow.camera.far = 4000;
        spotLight.shadow.camera.fov = 30;

        //spotLight.target = cube;

        _scene.add(spotLight);

        _renderer = new THREE.WebGLRenderer();//{ antialiasing: true }/*{ alpha: true }*/);  //CanvasRenderer();
        _renderer.setSize(width, height);
        _renderer.setClearColor(clearcolor, 1);

        var container = document.getElementById(divContainer);

        container.appendChild(_renderer.domElement);

        window.addEventListener('resize', onWindowResize, false);
        window.addEventListener('keydown', KeyHandler);
        window.addEventListener('mousemove', function (e) { onMouseMove(e); }, false);
        window.addEventListener('mousedown', function (e) { onMouseDown(e); }, false);
        window.addEventListener('mouseup', function (e) { onMouseUp(e); }, false);
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
        _camera.lookAt(_targetCam);
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

    /* Cette fonction gère les appuis sur le clavier
    */
    var KeyHandler = function (event) {
        var key = event.keyCode;

        var _forwardCam = new THREE.Vector3();
        _forwardCam.subVectors(_posCam, _targetCam);
        var mvtSpeed = 0.2;

        switch (key) {
            case 90:
                // Z Handler
                _forwardCam.normalize();
                _forwardCam.multiplyScalar(mvtSpeed);
                _posCam.sub(_forwardCam);
                _targetCam.sub(_forwardCam);
                break;
            case 81:
                // Q Handler
                _forwardCam.cross(_camera.up);
                _forwardCam.normalize();
                _forwardCam.multiplyScalar(mvtSpeed);
                _posCam.add(_forwardCam);
                _targetCam.add(_forwardCam);
                break;
            case 68:
                // D Handler
                _forwardCam.cross(_camera.up);
                _forwardCam.normalize();
                _forwardCam.multiplyScalar(mvtSpeed);
                _posCam.sub(_forwardCam);
                _targetCam.sub(_forwardCam);
                break;
            case 83:
                // S Handler
                _forwardCam.normalize();
                _forwardCam.multiplyScalar(mvtSpeed);
                _posCam.add(_forwardCam);
                _targetCam.add(_forwardCam);
                break;
            case 73:
                // I Handler
                _posCam.lerp(_targetCam, 0.2);
                break;
            case 79:
                // O Handler
                _forwardCam.divideScalar(_forwardCam.length());
                _posCam.add(_forwardCam);
                break;
            default:
                alert("Key pressed was not valid !");
                break;
        }
    };

    function onMouseMove(evt) {

        if (!mouseDown) {
            return;
        }

        evt.preventDefault();

        var deltaX = evt.clientX - mouseX,
            deltaY = evt.clientY - mouseY;
        mouseX = evt.clientX;
        mouseY = evt.clientY;
        rotateScene(deltaX, deltaY);
    }

    function onMouseDown(evt) {
        evt.preventDefault();

        mouseDown = true;
        mouseX = evt.clientX;
        mouseY = evt.clientY;
    }

    function onMouseUp(evt) {
        evt.preventDefault();

        mouseDown = false;
    }

    function rotateScene(deltaX, deltaZ) {
        var _diffCam = new THREE.Vector3();

        _diffCam.subVectors(_posCam, _targetCam);

        var deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(deltaZ/200, 0, deltaX/200, 'XYZ'));
        _diffCam.applyQuaternion(deltaRotationQuaternion);

        _targetCam.addVectors(_posCam, _diffCam);
    }

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

    var Decord = function () {
        // Sol
        var geometry = new THREE.PlaneGeometry(200, 200);
        var material = new THREE.MeshBasicMaterial({ color: 0x009900 });
        var material2 = new THREE.MeshBasicMaterial({ color: 0x0000FF });
        var sol = new THREE.Mesh(geometry, material);

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



//---------------------------------------------------------------------------------------
//	Examples
//---------------------------------------------------------------------------------------
/*
var mygl = (new MyGL);  
mygl.initGL("GLDiv");
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
