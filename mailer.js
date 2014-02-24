var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Mailgun = require('mailgun-js');
var ejs = require('ejs');
var fs = require('fs');
var path = require('path');
var async = require('async');

function Mailer(options){
	EventEmitter.call(this);
	this.options = options || {};
	this.mailgun = Mailgun(this.options.key, this.options.domain);
}

module.exports = Mailer;

util.inherits(Mailer, EventEmitter);

Mailer.prototype.send = function(email, done){
	this.mailgun.messages.send({
		from:email.from,
		to:email.to,
		subject:email.subject,
		text:email.body
	}, function(error, response, body){
		done && done(error);
	})
}

Mailer.prototype.create = function(template, subject, emails){
	var self = this;

	template = path.normalize(this.options.template_root + template);

	emails = emails || [];

	return function(from, to, data, done){

		if(arguments.length<=3){
			done = data;
			data = to;
			to = null;
		}

		data = data || {};

		fs.readFile(template, 'utf8', function(error, template){
			if(error){
				return done(error);
			}

			Object.keys(self.options.vars || {}).forEach(function(field){
				if(!data[field]){
					data[field] = self.options.vars[field];
				}
			})

			var body = ejs.render(template, data);

			var sendemails = [].concat(emails);

			if(to){
				if(typeof(to)!='array'){
					to = [to];
				}
				sendemails = sendemails.concat(to);
			}

			async.forEach(sendemails, function(to, next){

				var email = {
					from:from,
					to:to,
					subject:subject,
					body:body
				}

				self.emit('email', email, data);

				if(!email._cancel){
					self.send(email, next);
				}
			}, done)

		})

	}
}