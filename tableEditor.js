"use strict";
let express = require('express');
let activeDirectory = require('activedirectory');
let handlebars = require('express-handlebars');
let session = require('express-session');
let bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
let config = require('config');


console.log(process.env.NODE_ENV);

/* express */
let app = express();
let appPort = config.get('APP.port');
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('port', appPort || 3000);
app.set('view engine', 'handlebars');

/* AD */
let adConfig = config.get('AD');
let ad = new activeDirectory(adConfig);
let domain = config.get('APP.domain');

/* Body parser */
let urlencodedParser = bodyParser.urlencoded({extended: false});

/* Check AD settings */
if (process.NODE_ENV = 'PROD') {
	ad.findUser(adConfig.username, function(err, user) {
		if (err) {
		  console.log('ERROR: ' +JSON.stringify(err));
		  return;
		}
	   
		if (! user) console.log('User: ' + sAMAccountName + ' not found.');
		else console.log(JSON.stringify(user));
	  });
}



app.use(express.static(__dirname + '/public'));

app.use(session({
	resave: false,
	saveUninitialized: false,
	secret: 'жопа',
}));

app.get('/', function(req, res) {    
	res.render('logon'); 
	console.log(req.session.number);
}); 

app.post("/logon-process", urlencodedParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);
	
	console.log(req.body.username + '@' + domain);
	
	ad.findUser(req.body.username + '@' + domain, function(err, user) {
		if (err) {
			console.log('ERROR: ' +JSON.stringify(err));
			return;
		}
		if (! user) console.log('User: ' + req.body.username + '@' + domain + ' not found.');
		else console.log(JSON.stringify(user));
	});
	
	ad.authenticate(req.body.username + '@' + domain,req.body.password,function (err,isAuthenticated){
		if (err) {
			console.log('ERROR: '+JSON.stringify(err));
			/* res.redirect(303, '/' );*/
		}
		if (isAuthenticated) {
			console.log('Authenticated...');
			res.redirect(303, '/editor' );
		}
		else {
			console.log('Failed to authenticate...');
			res.redirect(303, '/' );
		}
	});
		
    console.log(req.body);
    
});

app.get('/editor', function(req, res) {    
	res.render('editor'); 
});

app.get('/about', function(req, res) {    
	res.render('about'); 
});

// пользовательская страница 400
app.use(function(req, res){
	res.type('text/plain');
	res.status(404);
	res.send('404 — Не найдено'); 
	});
	
// пользовательская страница 500
app.use(function(err, req, res, next){        
	console.error(err.stack);        
	res.type('text/plain');        
	res.status(500);        
	res.send('500 — Ошибка сервера'); 
	}); 
	
app.listen(app.get('port'), function(){
    console.log( 'Express запущен на http://localhost:' +      app.get('port') + '; нажмите Ctrl+C для завершения.' ); 
	});