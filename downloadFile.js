var http = require('http')
  , fs = require('fs')
  , options

var file="index.html";
options = {
    //host: 'www.google.com'
    host: 'localhost'
  , port: 80
  //, path: '/images/logos/ps_logo2.png'
  , path: '/'+file
}

var request = http.get(options, function(res){
    var imagedata = ''
    res.setEncoding('binary')

    res.on('data', function(chunk){
        imagedata += chunk
    })

    res.on('end', function(){
        fs.writeFile(file, imagedata, 'binary', function(err){
            if (err) throw err
            console.log('File saved.')
        })
    })

})
