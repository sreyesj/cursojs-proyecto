var express=require('express');


var app = express();


app.get('/', function (req, res) {
        res.send('Servicio funcionando');
        });

app.listen(8081);
console.log('Ejecutando servidor en http://localhost:8081/');



