'use strict';
/**
 * MtlManager
 * Cet objet gère les fichiers mtl.
 * @returns {{}}
 * @constructor
 */
var MtlManager = function () {

	var self = {};
	var mtlstring;
	var mtlobject;
	var mtlobject_original;
	/**
	*
	* @param _mtlstring: fichier mtl sous forme de string
	*/
	self.setString = function(_mtlstring) {
		mtlstring = _mtlstring;
		self.parse();
	};

	/*self.generateSidebar = function(table) {

		for ( var i=0; i<mtlobject.material.length; i++) {
			var ligne = table.insertRow(-1);
			var nom = ligne.insertCell(0);
			var hideShow = ligne.insertCell(1);
			var range = ligne.insertCell(2);
			var color = ligne.insertCell(3);

			var nominnerHTML = mtlobject.material[i].name;
			var hideShowinnerHTML = '<button class="hideShow" ng-click="hideShow('+i+')">Montrer/Cacher</button>';
			//angular.element(hideShow).append( $compile(hideShowinnerHTML)($scope) )
			var rangeinnerHTML = '<input type="range" ng-change="UpdateOpacity('+i+',this.value)" value="100" max="100" min="0"/>';
			var colorinnerHTML = '<input type="color" ng-change="UpdateColor('+i+',this.value)" />';

		};
		return content;*
	};*/

	self.parse = function(){
		console.log("Parse Started...");
		var err = null;
		var num_lines = 0;
		var lines = [];

		if(mtlstring && typeof mtlstring == "string"){

			if(mtlstring.indexOf('\r\n') > -1){
				lines = mtlstring.split('\r\n');
			}
			else if(mtlstring.indexOf('\n') > -1){
				lines = mtlstring.split('\n');
			}

			num_lines = lines.length;
			
			if(num_lines > 0){
				mtlobject = {};
				var obj = null;
				var line = null;
				var c_type = null; // current type
				var isHeader = true;
				var last_line = num_lines - 1;

				for(var i = 0; i <= last_line; i++){
					line = lines[i];

					if(line == undefined || line == '' || line == null){
						if(i == last_line && obj != null){
							if(!mtlobject.material){ mtlobject.material = []; }
							mtlobject.material.push(obj);
						}

						continue;
					}

					if(line.charAt(0) == "#"){
						if(isHeader){
							if(!mtlobject.header){mtlobject.header = [];}

							mtlobject.header.push(line);
						}
						else if(opts.parseComments == true){
							if(obj == null){obj = {};}
							if(!obj.comments){
								obj.comments = [];
							}

							obj.comments.push(line);
						}

						continue;
					}

					line = line.split(' ');

					c_type = line[0];
					if(c_type) c_type = c_type.toLowerCase();

					switch(c_type){
						case 'newmtl': // Material name
							// newmtl are the start of a new material object
							if(obj != null){
								if(!mtlobject.material){ mtlobject.material = []; }
								mtlobject.material.push(obj);
								obj = {};
							}
							else{
								obj = {};
							}

							console.log("Parsing Materal name (newmtl): " + line[1]);
							obj.name = line[1];
							isHeader = false;
							break;
						case 'ka': // Ambient reflectivity
						case 'kd': // Diffuse reflectivity
						case 'ks': // Specular reflectivity
						case 'ke': // Emission 
						case 'tf': // Transmission filter
							var which = "unknown"; // which reflectivity
							if(c_type == "ka") which = "ambient";
							else if(c_type == "kd") which = "diffuse";
							else if(c_type == "ks") which = "specular";
							else if(c_type == "ke") which = "emission";
							else if(c_type == "tf") which = "transmission";
							var s_type = line[1]; // statement type
							
							console.log("Parsing " + which + " " + (c_type == "tf" ? "Transmission filter" : "reflectivity") + " (" + c_type + ")...");
							
							if(obj == null) obj = {};
							
							var refObj = {type: s_type}; // reflectivity or transmission filter object;
							
							if(s_type == "spectral"){
								refObj.file = line[2];
								if(line.length > 3){
									refObj.factor = parseFloat(line[3]);
								}
							}
							else if(s_type == "xyz"){
								refObj.vals = [
									parseFloat(line[2]), // x
									parseFloat(line[3]), // y
									parseFloat(line[4])  // z
								];
							}
							else{
								refObj.type = "rbg";
								refObj.vals = [
								  parseFloat(s_type),  // r = red
								  parseFloat(line[2]), // b = blue
								  parseFloat(line[3])  // g = green
								];
							}

							obj[which] = refObj;
							
							break;
						case 'illum': // Illumination model
							console.log("Parsing Illumination model (illum)...");
							if(obj == null) obj = {};
							obj.illumination = parseInt(line[1]);
							break;
						case 'd': // Dissolve
							console.log("Parsing Dissolve (d)...");
							if(obj == null) obj = {};
							obj.dissolve = {};
							if(line[1] == "-halo"){
								obj.dissolve.type = "halo";
								obj.dissolve.factor = parseFloat(line[2]);
							}
							else{
								obj.dissolve.type = "background";
								obj.dissolve.factor = parseFloat(line[1]);
							}
							break;
						case 'ns': // Specular Exponent
							console.log("Parsing Specular exponent (Ns)...");
							if(obj == null) obj = {};
							obj.specular_exp = parseInt(line[1]);
							break;
						case 'ni': // Optical density
							console.log("Parsing Optical density (Ni)...");
							if(obj == null) obj = {};
							obj.optical_density = parseFloat(line[1]);
							break;
						case 'sharpness': // Reflection Sharpness
							console.log("Parsing Sharpness (sharpness)...");
							if(obj == null) obj = {};
							obj.sharpness = parseInt(line[1]);
							break;
						//Texture Maps...
						case 'map_ka': // Ambient Color texture file
						case 'map_kd': // Diffuse color texture file
						case 'map_ks': // Specular color texture file
						case 'map_ns': // Specular exponent texture file
						case 'map_d':  // Dissolve texture file
						case 'decal':  
						case 'disp':
						case 'bump':
							var which = "unknown_map";
							switch(c_type){
								case 'map_ka': which = "ambient"; break;
								case 'map_kd': which = "diffuse"; break;
								case 'map_ks': which = "specular"; break;
								case 'map_ns': which = 'specular_exp'; break;
								case 'map_d': which = 'dissolve'; break;
								default:
									which = c_type;
							}
							console.log("Parsing Texutre Map " + which + " (" + c_type + ")...");
							if(!obj.texture_map) obj.texture_map = {};
							obj.texture_map[which] = parseMap(line);
							break;
						case 'map_aat':
							console.log("Parsing Anti-aliasing (map_aat)...");
							if(obj == null) obj = {};
							if(!obj.map) obj.map = {};
							obj.map.anti_alias = line[1];
							break;
						//Reflection Map...
						case 'refl':
							console.log("Parsing Reflection Map (refl)...");
							obj.reflection_map = parseMap(line);
							break;
						default:
							console.log("Unprocessed Line: (#" + i + ") " + lines[i]);
					}
				}
				if(obj != null){
					if(!mtlobject.material){ mtlobject.material = []; }
					mtlobject.material.push(obj);
					obj = {};
				}
			}
			else{
				err = "Error: Can not split file data into lines.";
				console.log(err);
			}

			console.log("Parse Completed...");
			console.log("Number of Lines: " + num_lines);
		}
		else{
			err = "Error: No string passed to be parsed.";
			console.log(err);
		}


		self.mtlobject_original = mtlobject;
		return {err: err, data: mtlobject};
	};

	self.generate = function () {
		var text = "";
		mtlobject.header.forEach(function(element) {
			text += element;
			text += "\r\n";
		});
		//text += "\r\n";
		mtlobject.material.forEach(function(element) {
			text += "newmtl ";
			text += element.name;
			//text += "\r\n";
			Object.keys(element).forEach(function(key, index) {
				switch(key) {
					case "diffuse":
						text += "Kd ";
						text += element.diffuse.vals[0];
						text += " ";
						text += element.diffuse.vals[1];
						text += " ";
						text += element.diffuse.vals[2];
						break;
					case "ambient":
						text += "Ka ";
						text += element.ambient.vals[0];
						text += " ";
						text += element.ambient.vals[1];
						text += " ";
						text += element.ambient.vals[2];
						break;
					case "specular":
						text += "Ks ";
						text += element.specular.vals[0];
						text += " ";
						text += element.specular.vals[1];
						text += " ";
						text += element.specular.vals[2];
						break;
					case "specular_exp":
						text += "Ns ";
						text += element.specular_exp;
						break;
					case "dissolve":
						text += "Tr ";
						text += element.dissolve.factor;
						text += "\r\nd ";
						text += element.dissolve.factor;
						text += "\r\nD ";
						text += element.dissolve.factor;
						break;
				}
				text += "\r\n";
			});

		});
		return text;
	};

	/**
	*
	* @param id: id du matériau
	* @param visible: transparence (0<=visibility<=1)
	*/
	self.setMaterialVisibility =  function(id, visibility) {
		if(mtlobject.material[id] != null && visibility >= 0 && visibility <= 1) {
			if(mtlobject.material[id].dissolve == undefined) {
				mtlobject.material[id].dissolve = { type: "background", factor: visibility };
			} else {
				mtlobject.material[id].dissolve.factor = visibility;
			}
		} else {
			console.log("Invalid parameters");
		}
	};

	/**
	*
	* @param id: id du matériau
	* @param visible: transparence (0<=visibility<=1)
	*/
	self.setMaterialColor =  function(id, color) {
		if(mtlobject.material[id] != null && color.length == 3) {
			if(color[0] >= 0 && color[0] <= 1 && color[1] >= 0 && color[1] <= 1 && color[2] >= 0 && color[2] <= 1) {
				if(mtlobject.material[id].diffuse == undefined) {
					mtlobject.material[id].diffuse = { type: "rgb", vals: color};
				} else {
					mtlobject.material[id].diffuse.vals = color;
				}
			} else {
				console.log("Invalid colors");
			}
		} else {
			console.log("Invalid parameters");
		}
	};

	/**
	*
	* @param id: id du matériau
	* @param visible: transparence (0<=visibility<=1)
	*/
	self.reset =  function() {
		mtlobject = mtlobject_original;
	};
	var parseMap = function(line){
		var obj = {file:null, options:[]};
		for(var m = 1; m < line.length; m++){
			if(line[m].indexOf('.') > -1){
				obj.file = line[m];
			}
			else if(line[m] == "-type"){
				obj.type = line[m++];
			}
			else{
				var o = {};
				o[line[m]] = null;
				switch(line[m]){
					case '-o':
					case '-s':
					case '-t':
						o[line[m]] = [
							parseFloat(line[m++]), // u
							parseFloat(line[m++]), // v
							parseFloat(line[m++])  // w
						];
						break;
					case '-mm':
						o[line[m]] = [
							parseFloat(line[m++]), // base
							parseFloat(line[m++])  // gain
						];
						break;
					case '-texres':
					case '-bm':
					case '-boost':
						o[line[m]] = parseFloat(line[m++]);
						break;
					default:
						o[line[m]] = line[m++];
				}

				obj.options.push(o);
			}
		}

		return obj;
	};

	return self;
};