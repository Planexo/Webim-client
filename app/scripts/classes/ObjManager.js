'use strict';
/**
 * MyGL
 * Cet objet gère les obj de la scène. C'est à dire qu'elle va savoir si l'ifc a été divisé, si oui elle contient les informations relatives à chaques parties, et les charges si nécessaires. 
 * Si l'objet n'a pas été divisé e
 * @returns {{}}
 * @constructor
 */
var ObjManager = function (_myGL, table, generationTable) {
	var self = {};
	
	//var tableau = table; // pointeur vers le tableau dans la page
	var myGL = _myGL; // pointeur vers le gestionnaire webGL
	var nomFichier= ""; // nom du ficher ifc
	var api = new Api(Config); // Instance du gestionnaire de requettes ajax
	var tailleBoiteMoyenne; // taille moyenne des boites
	var seuilChargement; // Distance en dessous de laquelle on charge l'obj vers lequel on marche
	var parts = new Array(); // Array qui contient la liste des parties composant l'obj
	var mtlManager = new MtlManager(generationTable);
	var isDivised = false; // Variable qui va indiquer si l'obj est fournis en tant que pièces détachées ou complet
	var obj; // Variable qui va stocker l'obj si celui n'a pas été divisé au chargement
	var numberToLoad = 1; // Nombre de parties adjacentes à afficher
	var chemin_fichier;
	
	self.setNumberToLoad = function ( number ) { 
		numberToLoad = number;
	};

	self.mtlManager = mtlManager;

	var parseBoxes = function( obj ) { // Crée les parties asosciées aux informations reçues et les stockes en mémoire
		console.log(obj);
		for ( var i =0; i < obj.parts.length; i++ ) {
			var part = new Part();
			part.setName( obj.parts[i].filename );
			part.setBounds (obj.parts[i].bounds.x[0],obj.parts[i].bounds.y[0],obj.parts[i].bounds.z[0],obj.parts[i].bounds.x[1],obj.parts[i].bounds.y[1],obj.parts[i].bounds.z[1]);
			//console.log(part);
			parts.push(part);

		}
		defineProximity();
	};
	
	var ClearParts = function () {
		parts.splice(0,parts.length);
	};

	
	var loadInformations = function( fail ) { // Charge les informations relative au partitionnage de l'obj
		api.ifc.infos(
		   nomFichier,
           function (serverResponse) { // Si on trouve les informations, on les parse et les mets en mémoire
           		console.log(serverResponse);
					setMtl(serverResponse.mtl);
           			if ( serverResponse.infos != null) { // Si l'obj a été divisé
           				isDivised = true;
           				var infos = JSON.parse(serverResponse.infos);
           				chemin_fichier = infos.repertoire;
						parseBoxes(infos);
						console.log(parts);
					}else {
						loadObjTotal();
					}

           },
           fail() // Version debug en attendant que les routes sont MAJ par le back-end, chargement l'obj selon les anciennes routes ( au 22/03/2017 )
         );
	};

	var setMtl = function(mtl_resp) {
		mtlManager.setString(mtl_resp);
		//alert('charged');
		//mtlManager.generateSidebar(table);
	};


	var defineProximity = function () { // Définis ce qu'est la proximité dans la scène, ie la distance en dessous de laquelle on se considère proche d'une boite ( seuilChargement )
		var moy= 0;
		parts.forEach( function (element) {
			moy += element.moyenneTaille();
		});
		tailleBoiteMoyenne = moy / parts.length;
		seuilChargement = tailleBoiteMoyenne / 100.0; // Définie comme étant proche une distance égale au cinquieme de la taille moyenne des boites
		//alert(tailleBoiteMoyenne);
		//alert(seuilChargement);
	};
	
	self.checkProximity = function( x, y, z) { // Vérifie la distance avec chacunes des parties des non chargées, et si elle est trop proche on les charges et relance l'affichage

		//alert('hello');
		if ( isDivised ) {
			var ok = false;
			parts.forEach( function(element, index) {
				//alert('hello');
				if ( element.getCharged() == false ) { // Si l'obj n'a pas déjà été chargé, on vérifie si il faut le charger ou non
					//alert('plop');
					if ( element.distance(x,y,z) <= ( seuilChargement + (numberToLoad-1) * tailleBoiteMoyenne  ) ) { // Charge les parties les plus proches, mais aussi celles qui sont adjacentes si on veut en afficher plus d'un coup
						loadObjPart( index );
					}
				}
				if ( element.getCharged() == true && element.getDisplay() == false ) {
					element.setDisplay(true);
					ReloadScene();
				}			
			});
			
		}
		
	};
	
	var loadObjPart = function( part_id ) { // charge l'OBJ demandé et le charge dans la partie associée
		api.ifc.parts(
		   '/obj/' + nomFichier + '.obj/part/' +  part_id,
           function (serverResponse) {
					parts[part_id].Obj(serverResponse.content);
           }
        );
	};
///obj/Paris2010.obj/part/0
	var loadObjTotal = function () { // Charge l'obj total, ie sans division
		api.ifc.parts(
		   '/ifc/parts/' + nomFichier,
           function (serverResponse) {
					obj = serverResponse.obj;
					ReloadScene(); // Obligé de le mettre là comme les requette sont asynchrone, il y a un risque qu'il soit appelé avant la fin du chargement si il est mis ailleurs dans le code
           }
        );
	};

	function hexToRgb(hex) {
	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	    } : null;
	}

	self.setMaterialVisibility = function (id, value) {
		mtlManager.setMaterialVisibility(id, value);
		ReloadScene();
	};
	self.setMaterialColor = function (id, value) {
		var colorh = hexToRgb(value);
		var color = [];
		color[0] = colorh['r']/255.0;
		color[1] = colorh['g']/255.0;
		color[2] = colorh['b']/255.0;

		mtlManager.setMaterialColor(id, color);
		ReloadScene();
	};

	self.resetMTL = function () {
		mtlManager.resetMTL();
		ReloadScene();
	};
	
	self.hideShowElement= function (id) {
		if ( mtlManager.mtlobject.material[id].dissolve == null ) {
			mtlManager.setMaterialVisibility(id, 1);
		}
		if ( mtlManager.mtlobject.material[id].dissolve.factor == 0) {
			self.setMaterialVisibility( id, 1);
		}else {
			self.setMaterialVisibility( id, 0);
		}
	}

	var ReloadScene = function() { // Fonction à appeler à chaque modification de la scène ( obj(s) ou mtl )
		
        myGL.clearScene(); // Efface la scène courante
    //    alert('reloadScene');
        if ( isDivised == true ) { // Si l'ifc a été divisé

		   var mtlLoader = new THREE.MTLLoader();
		   var material = mtlLoader.parse(mtlManager.generate());
		    material.preload();
        	parts.forEach( function(element) { // On affiche un à un toutes les parties chargées ( ie dont l'obj est en mémoire )

				if ( element.getCharged() == true ) {
					//alert('plop');
	                //récupération de l'objet serverResponse.obj
	                var loaderB = new THREE.OBJLoader();
	                loaderB.setMaterials(material);
	                var obj_partie = loaderB.parse(element.getObj());	
	                //obj_partie.rotation.x =- Math.PI / 2;
					//obj_partie.rotation.y = Math.PI/2;
					obj_partie.rotation.z=Math.PI/2;
					myGL.addOnScene(obj_partie);
				}			
			});

        }else { // Si l'ifc n'a pas été divisé, on charge l'obj total avec le mtl
					//alert('plop');
        	var mtlLoader = new THREE.MTLLoader();
	        var material = mtlLoader.parse(mtlManager.generate());
	        material.preload();
	        var loaderB = new THREE.OBJLoader();
	        loaderB.setMaterials(material);
	        var obj_partie = loaderB.parse(obj);
			myGL.addOnScene(obj_partie);
        }
		
	};
	
	self.InitialisationIFC = function ( _nomIFC) { // Fonction à appeler à l'initialisation de la page. Va regarder si l'ifc est divisé ou non, charger le mtl et les informations des partie, ou l'obj total le cas échéant
		nomFichier = _nomIFC;

		var fail = function () { // Fonction pour que cela marche même tant que les routes ne sont pas mis à jour par la partie back-end ( 22/03/2017) ==> routes MAJ
		//	alert('hello');
		//	alert(nomFichier);
			/*api.ifc.parts(
                nomFichier,
                function (serverResponse) {

                    //récupération du matériel dans serverResponse.mtl
                    setMtl(serverResponse.mtl);

                    //console.log(mtlManager.parse());
                    //alert(mtl);

                    //récupération de l'objet serverResponse.obj
                    obj = serverResponse.obj;

                    ReloadScene();
                }
            );*/
		};

		loadInformations( fail ); // On va chercher les informations relatives à cet ifc.



	};
	return self;
};