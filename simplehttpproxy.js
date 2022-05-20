var tport=8080, proxyport=9090, express = require('express'), bodyParser = require('body-parser');
var queryString = require('querystring');

const buildQueryString=a=>Object.keys(a).reduce((acc,e)=>acc+e+"="+a[e]+"&","?").replace(/&$/,"");
const http = require('http');

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))


app.all('/*', (oreq, ores) => {
  const options = {
    host: 'a.host', // host to forward to
    port: tport, // port to forward to
    path: oreq.path+buildQueryString(oreq.query), // path to forward to
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
