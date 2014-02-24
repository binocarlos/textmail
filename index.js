var Mailer = require('./mailer');
var fs = require('fs');

module.exports = function(options){

	options = options || {};

	var apikey = options.key;
	var domain = options.domain;
	var template_root = options.template_root;
	var vars = options.vars || {};

	if(!apikey){
		throw new Error('textmail key required');
		process.exit(1);
	}

	if(!domain){
		throw new Error('textmail domain required');
		process.exit(1);
	}

	if(template_root && !fs.existsSync(template_root)){
		throw new Error(template_root + ' does not exist');
		process.exit(1);
	}

	return new Mailer(options);
}