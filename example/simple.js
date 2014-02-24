var Mailer = require('../');
var argv = require('optimist').argv;

if(!process.env.MAILGUN_DOMAIN){
	console.error('MAILGUN_DOMAIN env required');
	process.exit(1);
}

if(!process.env.MAILGUN_KEY){
	console.error('MAILGUN_KEY env required');
	process.exit(1);
}

if(!argv.to){
	console.error('--to argument required');
	process.exit(1);
}

var mailer = Mailer({
	template_root:__dirname + '/templates',
	domain:process.env.MAILGUN_DOMAIN,
	key:process.env.MAILGUN_KEY
})

var email = mailer.create('/simple.ejs', 'A test email', [
	argv.to
])

mailer.on('email', function(data){
	console.log('-------------------------------------------');
	console.log('email data:');
	console.dir(data);
})

email('test@test.com', {
	data:23
}, function(error){
	if(error){
		console.error(error);
		process.exit(1);
	}
	console.log('emails sent!');
})