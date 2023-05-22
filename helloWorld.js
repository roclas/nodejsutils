var http = require('http');

var server = http.createServer(function(req, res) {
    console.log("hello \n");
    console.log(req.headers['authorization']);
    // Write response header
    res.writeHead(200, {"Content-Type": "text/html"});

    // Write the body of the response
    res.write("<html><body>");
    res.write("<h1>Hello, World</h1>");
    res.write("</body></html>");

    // Send the response
    res.end();
});

server.listen(3000, function() {
    console.log("Server is listening on port 3000");
});
