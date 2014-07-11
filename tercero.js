var http=require('http');
var resultado='';

var options = {
hostname: 'maps.googleapis.com',
port: 80,
path: '/maps/api/geocode/json?address=gran+via+60+granada+granada&sensor=false',
method: 'GET'
};

var req = http.request(options, function(res) {
                   res.setEncoding('utf8');

                   res.on('data', function (contenido) {
                          resultado+=replaceAll('\n','',contenido);
                          
                          try {
                            if (resultado[resultado.length-1]=='}') {
                                resultado=JSON.parse(resultado);
                          
                                console.log('Direccion solicitada: ' + resultado.results[0].formatted_address);
                                console.log('Latitud: ' + resultado.results[0].geometry.location.lat);
                                console.log('Longitud: ' + resultado.results[0].geometry.location.lng);
                            }
                          }
                          catch (a) {
                            console.log(a);
                          };
                    });
                       
});



req.on('error', function(e) {
       console.log('Problem with request: ' + e.message);
       });

req.end();


function replaceAll(find, replace, str) {
    return str.replace(new RegExp(find, 'g'), replace);
}