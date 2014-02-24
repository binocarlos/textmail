textmail
========

Send emails using mailgun and plain text templates

## installation

```
$ npm install textmail
```

## usage

First create a mailer with some configuration:

```js
var TextMail = require('textmail');

var mailer = TextMail({
	// mailgun domain here
	domain:'...',

	// mailgun key here
	key:'...',

	// the folder your templates live
	template_root:'...',

	// some base variables
	vars:{
		num:10
	}
})
```

Now you have a mailer - you can create 'emails' - these are functions that can be run to send the content to a recipient.

```js

// create an email object that will render 'contact.txt' and 
// send it to 3 people with 'Contact Form Submission' as the subject

var contact = mailer.create('/contact.ejs', 'Contact Form Submission', [
	'admin1@domain.com',
	'admin2@domain2.net'
]);

app.use('/contactsubmit', function(req, res){

	var data = {
		'title':'Contact page'
	}

	data.timestamp = new Date().getTime();

	contact(data.email, data);
})

```

The templates are ejs files - this means you can pass data from the vars:

```
This is an email template for <%= title %>

It can also access root vars: <%= num %>
```

## api

### TextMail(options)

Create a new mailer with the following options:

 * domain - your mailgun account domain
 * key - your mailgun account key
 * template_root - the folder to search for templates
 * vars - vars to render for every template

## var email = mailer.create(template, subject, to_emails)

Create a new email that will be sent to each email in the to_emails array.

The template can be a path relative to the 'template_root' or can be a full path.

The template is rendered using ejs.

## email(from_address, vars)

Send the email by running it as a function passing the from address and the extra variables to render into the template

## license

MIT
