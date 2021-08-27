var tport=80, proxyport=9090, express = require('express'), bodyParser = require('body-parser');
var queryString = require('querystring');

const buildQueryString=a=>Object.keys(a).reduce((acc,e)=>acc+e+"="+a[e]+"&","?").replace(/&$/,"");
const http = require('http');

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))


app.all('/*', (oreq, ores) => {
  const options = {
    // host to forward to
    host: 'a.host',
    // port to forward to
    port: 8080,
    // path to forward to
    path: oreq.path+buildQueryString(oreq.query),
    // request method
    method: oreq.method,
    // headers to send
    headers: oreq.headers,
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
      // we got an error
      console.log(e.message);
      try {
        // attempt to set error message and http status
        ores.writeHead(500);
        ores.write(e.message);
      } catch (e) {
        // ignore
      }
      ores.end();
    });
  if(oreq.body){
    creq.write(queryString.stringify(oreq.body));
  }
  creq.end();
});

app.listen(proxyport);
