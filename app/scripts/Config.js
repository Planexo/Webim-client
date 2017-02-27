'use strict'; 
/**
* @class Config
*	Cette fonction contient les configurations 'development' et 'production'
*	ainsi que les constantes de l'application.
*	Elle s'exécute automatiquement.
*/
var Config = (function () {
	var self = {};

  /**
   * Configuration du serveur
   * @type {{dev: {host: string, port: number}, prod: {}}}
   * @private
   */
	var _server = {
		dev:{ 
			host: 'http://localhost',
			port: 8000
		},
		prod:{
			 
		}
	};

  /**
   * Clés de sécurité
   *  Dans le cadre de ce projet, nous ne gérons pas la stratégie de sécurisation. C'est un modèle qui proposé. Libre
   *  au repreneur d'en faire ce qu'il voudra.
   * @type {{dev: {apikey: string}, prod: {}}}
   * @private
   */
	var _security = {
		dev:{ 
			apikey:""
		},
		prod:{
			 
		}
	};

  /**
   * Environnement actuel
   * @type {string}
   */
	self.environnement = 'dev';

  /**
   * Api Path
   * @type {string}
   */
	self.apiPath = '/b2w_1';

  /**
   * Récupère la configuration server pour un environnement donné
   * @returns {*}
   */
	self.server = function () {
		return _server[self.environnement];
	};

  /**
   * Récupère les clés de sécurité pour un environnement donné
   * @returns {*}
   */
	self.security = function () {
		return _security[self.environnement];
	};

	return self;
})();