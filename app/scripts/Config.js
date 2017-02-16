'use strict'; 
var Config = (function () {
	var self = {};

	var _server = {
		dev:{ 
			host: 'http://localhost',
			port: 8000, 
		},
		prod:{
			 
		}
	};

	var _security = {
		dev:{ 
			apikey:""
		},
		prod:{
			 
		}
	};

	var _db = {
		dev:{ 
			host:"",
			name:""
		},
		prod:{
			 
		}
	};

	// Environnement actuel
	self.environnement = 'dev';

	// Api Path
	self.apiPath = '/b2w_1';

	/**
	*	Récupère la configuration server pour un environnement donné
	*/
	self.server = function () {
		return _server[self.environnement];
	};

	/**
	*	Récupère les clés de sécurité pour un environnement donné
	*/
	self.security = function () {
		return _security[self.environnement];
	};

	/**
	*	Récupère les identifiants de la base de données pour un environnement donné
	*/
	self.db = function () {
		return _db[self.environnement];
	};

	return self;
})();