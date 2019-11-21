"use strict";
let express = require('express');
let activeDirectory = require('activedirectory');
let app = express();
let handlebars = require('express-handlebars');
let adConfig = {
	url: 'ldap://SRV-DC01-DCB:389',
	baseDN: 'DC=Dixy,DC=local',
	username: 'sqlhypsvc@Dixy.local',
	password: 'hypAdmin8ex'
};
let ad = new activeDirectory(adConfig);

ad.authenticate('SAPotapchik@Dixy.local','T,fnmndj.yfktdj44',function (err,isAuthenticated){
	if (err) throw err;
	if (isAuthenticated) {
		console.log('Authenticated...');
	}
	else {
		console.log('Failed to authenticate...');
	}
});

// let appPort = 3000;
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('env','production');
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {    
	res.render('logon'); 
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