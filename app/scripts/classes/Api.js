'use strict';

/**
* @Param Config : un objet contenant la configuration. Par défaut, utiliser Constantes.Config
*/
var Api = function(Config){
	var self = {}; 

	var URL = Config.server().host+':'+Config.server().port+Config.apiPath;   

	/*
	Méthodes génériques à réutiliser dans les fonctions personnalisées 
	------------------------------------------------------------------------
	*/
	var get = function (url, parameters, success, failure, final) { 
		var jqxhr = $.ajax({method:'GET',url:URL+url,data:parameters})
			.done(success)
			.fail(failure)
			.always(final); 
	};

	var post = function (url, parameters, success, failure, final) {
		var jqxhr = $.ajax({method:'POST',url:URL+url,data:parameters,async:true})
			.done(success)
			.fail(failure)
			.always(final);
	};

	/**
	*	Initialise une fonction. Peut-etre utilisé comme alternative pour remplacer une fonction callback
	*	Ex : 
	*	var maFonction = callbackFunction || initFunction
	*	Si callback n'est pas défini, initFunction sera utilsiée.
	*/
	var initFunction = function (func) {
		return function(){};
	};

	/*
	Méthodes correspondant aux routes de l'api : à définir au fir et à mesure
	------------------------------------------------------------------------
	*/ 

	/*------------------------------------------------------------------------
		Collection ifc/
	/------------------------------------------------------------------------*/

	self.ifc = (function () {
		var ifc = {};
		var baseurl = '/ifc/';

		/**
		*	Charge un fichier ifc
		*/
		ifc.load = function (filename, success, failure, final) { 
			get(baseurl+filename,{},success || initFunction, failure || initFunction, final || initFunction); 
		};

		/**
		*	Charge les parties obj et mtl d'un fichier ifc
		*/
		ifc.parts = function (filename, success, failure, final) {
			var localbaseurl = baseurl+'parts/';  

			get(localbaseurl+filename,{},success || initFunction, failure || initFunction, final || initFunction); 
		};

		/**
		*	Charge la partie mtl d'un fichier ifc
		*/
		ifc.mtl = function (filename, success, failure, final) {
			var localbaseurl = baseurl+'mtl/';  

			get(localbaseurl+filename,{},success || initFunction, failure || initFunction, final || initFunction); 
		};

		/**
		*	Charge la partie obj d'un fichier ifc
		*/
		ifc.obj = function (filename, success, failure, final) {
			var localbaseurl = baseurl+'obj/';  

			get(localbaseurl+filename,{},success || initFunction, failure || initFunction, final || initFunction); 
		};

		return ifc;
	})();

	/*------------------------------------------------------------------------
		Collection mtl/
	/------------------------------------------------------------------------*/

	self.mtl = (function () {
		var mtl = {};

		return mtl;
	})();

	/*------------------------------------------------------------------------
		Collection obj/
	/------------------------------------------------------------------------*/

	self.obj = (function () {
		var obj = {};

		return obj;
	})();

	return self;
};