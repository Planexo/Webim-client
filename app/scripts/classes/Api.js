'use strict';

/**
* @Param Config : un objet contenant la configuration. Par défaut, utiliser Constantes.Config
*/
var Api = function(Config){
	var self = {}; 

	var URL = Config.server().host+':'+Config.server().port+Config.apiPath;   

	let baseurl = '/';

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

	var initFunction = function (func) {
		return function(){};
	};
 


	/*
	Méthodes correspondant aux routes de l'api : à définir au fir et à mesure
	------------------------------------------------------------------------
	*/

	self.getIfc = function (filename, success, failure, final) {
		baseurl = '/ifc/';  

		get(baseurl+filename,{},success || initFunction, failure || initFunction, final || initFunction); 
	};

	self.getIfcMtl = function (filename, success, failure, final) {
		baseurl = '/ifc/mtl/';  

		get(baseurl+filename,{},success || initFunction, failure || initFunction, final || initFunction);  
	};

	self.getIfcObj = function (filename, success, failure, final) {
		baseurl = '/ifc/obj/';

		get(baseurl+filename,{},success || initFunction, failure || initFunction, final || initFunction); 
	};


	return self;
};