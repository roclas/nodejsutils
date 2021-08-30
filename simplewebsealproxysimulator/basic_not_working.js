#!/usr/bin/env node

var httpProxy = require('http-proxy') , tport=8080, proxyport=9090, express = require('express'),
	session = require('express-session'), bodyParser = require('body-parser')

var passwd={"carlos":"test","test":"test"};

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use(session({
	"secret":"asd473592734ih"
	,resave: true
	,saveUninitialized: true
}));


var ivuser="admin";
var options={ target: { host: 'localhost', port: tport } };
var proxy = httpProxy.createProxyServer(options);
app.post('/check_credentials', function(req, res) {
	const name = req.body.username;
	const password= req.body.password;
	if(passwd[name]===password){
		req.session.username=name;
		req.session.password=password;
		res.redirect('/');
	}else res.send('<p>invalid credentials</p>');
});
app.get('/*', function(req, res) {
    req.headers['iv-user']=ivuser;
    if(req.session.username)try{
	let url=req.protocol + '://' + req.get('host') + req.originalUrl;
	console.log(`redirecting ${url} to ${options.target.host}:${options.target.port}`);
	proxy.proxyRequest(req, res, { host: options.target.host, port: options.target.port});
	return;
    }catch(e){return;}
    else res.render('login',{name:req.session.username});
});
app.listen(proxyport);

