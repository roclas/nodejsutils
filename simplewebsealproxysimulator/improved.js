#!/usr/bin/env node

const tport=8080, proxyport=9090, address2proxy="172.17.0.1", contextpath="/"; 
const buildQueryString=a=>Object.keys(a).reduce((acc,e)=>acc+e+"="+a[e]+"&","?").replace(/&$/,"");

const queryString = require('querystring'),express = require('express'), bodyParser = require('body-parser'),
  session = require('express-session'), http = require('http');

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

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.post('/check_credentials', function(req, res) {
	const name = req.body.username;
	const password= req.body.password;
	if(passwd[name]===password){
		req.session.username=name;
		req.session.password=password;
		res.redirect(contextpath);
	}else res.send('<p>invalid credentials</p>');
});

app.all(`${contextpath}*`, (oreq, ores) => {
  oreq.headers['iv-user']=ivuser;
  if(!oreq.session.username){
    ores.render('login',{name:oreq.session.username});
    return;
  }
  const options = {
    host:address2proxy, // host to forward to
    port: tport, // port to forward to
    path:oreq.originalUrl,
    method: oreq.method, // request method
    headers: oreq.headers, // headers to send
  };
  let creq = http.request(options, pres => {
      // set encoding
      pres.setEncoding('utf8');
      ores.writeHead(pres.statusCode,pres.headers);
      // wait for data
      pres.on('data', chunk => ores.write(chunk));
      pres.on('close', () => ores.end()); // closed, let's end client request as well
      pres.on('end', () =>{
        ores.end();
      }); // finished, let's finish client request as well
    }).on('error', e => {
      console.error(e.message);
      try {
        ores.writeHead(500);
        ores.write(e.message);
      } catch (e) { }
      ores.end();
    });
  if(oreq.body){
    creq.write(queryString.stringify(oreq.body));
  }
  creq.end();
});

app.listen(proxyport);
