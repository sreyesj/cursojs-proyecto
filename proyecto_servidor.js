var express=require('express');
var logfmt = require('logfmt');
var fs=require('fs');

var app = express();
var listaPacientes = [];
var listaCitas = [];

leePacientes();
leeCitas();

app.use(logfmt.requestLogger());


app.get('/', function (req, res) {
        res.send('Servicio para el mantenimiento de pacientes');
        });

/*******************/
/**** Pacientes ****/
/*******************/

app.put('/paciente/:nombre/:nif/:edad', function( req,res ) {
        var id,nombre,nif,edad;
        var miPaciente;
        
        // 1: Recupero las variables de la llamada
        nombre=req.param('nombre');
        nif=req.param('nif');
        edad=req.param('edad');
        
        // 2: Calculo el id del nuevo paciente
        id=calculaNuevoIDPaciente();
        
        // 3: Creo el paciente nuevo
        miPaciente={
            IDPaciente: id,
            Nombre: nombre,
            NIF: nif,
            Edad: edad
        };
        
        // 4: Inserto el paciente en la lista
        listaPacientes.push(miPaciente);
        grabaPacientes();
        
        // 5: Devuelvo el nuevo paciente
        res.json(200,miPaciente);
});

app.get('/paciente/:id', function (req, res) {
        var id;
        
        id=req.param('id');
        
        miPaciente=buscaPaciente(id);
        if (miPaciente==null) {
            res.send(200,'No se encontró el paciente con id: \'' + id + '\'');
        }
        else {
            res.json(200,miPaciente);
        }
});

app.post('/paciente/:id/:nombre/:nif/:edad', function (req, res) {
         var id,nombre,nif,edad;
         var miPaciente;
         
         // 1: Recupero las variables de la llamada
         id=req.param('id');
         nombre=req.param('nombre');
         nif=req.param('nif');
         edad=req.param('edad');
         
         // 2: Busco el paciente solicitado
         miPaciente=buscaPaciente(id);
         if (miPaciente==null) {
            res.send(200,'No se encontró el paciente a modificar con id: \'' + id + '\'');
         }
         else {
            // 3: Modifico los datos del paciente
            miPaciente.Nombre=nombre;
            miPaciente.NIF=nif;
            miPaciente.Edad=edad;
            grabaPacientes();
         
            res.json(200,miPaciente);
         }
});

app.delete('/paciente/:id', function (req, res) {
         var id,resultado;
         
         // 1: Recupero las variables de la llamada
         id=req.param('id');
         
         // 2: Busco el paciente solicitado
         resultado=eliminaPaciente(id);
         grabaPacientes();
         if (resultado==null) {
           res.send(200,'No se encontró el paciente a eliminar con id: \'' + id + '\'');
         }
           else {
         res.send(200,'OK');
           }
});

app.get('/paciente', function (req, res) {
        res.json(200,listaPacientes);
});


function buscaPaciente(idPaciente) {
    var i,elemento;
    
    for (i=0;i<listaPacientes.length;i++) {
        if (listaPacientes[i].IDPaciente==idPaciente) {
            return (listaPacientes[i]);
        }
    }
    
    return(null);
}

function calculaNuevoIDPaciente() {
    var i,id;
    
    id=0;
    for (i=0;i<listaPacientes.length;i++) {
        if (listaPacientes[i].IDPaciente>id) {
            id=listaPacientes[i].IDPaciente;
        }
    }
    
    return(++id);
}

function eliminaPaciente(idPaciente) {
    var i,elemento;
    
    for (i=0;i<listaPacientes.length;i++) {
        if (listaPacientes[i].IDPaciente==idPaciente) {
            listaPacientes.splice(i, 1);
            return('');
        }
    }
    
    return(null);
}

function grabaPacientes() {
    var i,cadena;
    
    cadena='';
    for (i=0;i<listaPacientes.length;i++) {
        if (cadena!='') {
            cadena+='@';
        }
        cadena+=listaPacientes[i].IDPaciente + ';';
        cadena+=listaPacientes[i].Nombre + ';';
        cadena+=listaPacientes[i].NIF + ';';
        cadena+=listaPacientes[i].Edad;
    }
    
    console.log(cadena);
    
    fs.writeFile('pacientes.dat',cadena,null,function(datos) {
                 console.log('Pacientes grabados: ' + datos);
    });
}

function leePacientes() {
    var cadena,datos,i;
    var miPaciente;
    var opciones;
    
    listaPacientes=[];
    
    opciones={
        encoding: 'utf8'
    }
    
    fs.readFile('pacientes.dat',opciones,function (err, data) {
                if (!err) {
                    datos=data.split('@');
                    for (i=0;i<datos.length;i++) {
                        cadena=datos[i].split(';');
                        miPaciente= {
                            IDPaciente: cadena[0],
                            Nombre: cadena[1],
                            NIF: cadena[2],
                            Edad: cadena[3]
                        };
                        listaPacientes.push(miPaciente);
                    }
                }
    });
}


/***************/
/**** Citas ****/
/***************/

app.put('/cita/:idPaciente/:hora', function( req,res ) {
        var id,idPaciente,hora;
        var miCita;
        
        // 1: Recupero las variables de la llamada
        idPaciente=req.param('idPaciente');
        hora=req.param('hora');
        
        // 2: Calculo el id de la nueva cita
        id=calculaNuevaIDCita();
        
        // 3: Creo el paciente nuevo
        miCita={
            IDCita: id,
            IDPaciente: idPaciente,
            Hora: hora
        };
        console.dir(miCita);
        
        // 4: Inserto la cita en la lista
        listaCitas.push(miCita);
        //console.dir(listaCitas);
        grabaCitas();
        
        // 5: Devuelvo la nueva cita
        res.json(200,miCita);
});

app.get('/cita/:id', function (req, res) {
        var id,miCita;
        
        id=req.param('id');
        
        miCita=buscaCita(id);
        if (miCita==null) {
            res.send(200,'No se encontró la cita con id: \'' + id + '\'');
        }
        else {
            res.json(200,miCita);
        }
});

app.post('/cita/:id/:idPaciente/:hora', function (req, res) {
         var id,idPaciente,hora;
         var miCita;
         
         // 1: Recupero las variables de la llamada
         id=req.param('id');
         idPaciente=req.param('idPaciente');
         hora=req.param('hora');
         
         // 2: Busco la cita solicitada
         miCita=buscaCita(id);
         if (miCita==null) {
            res.send(200,'No se encontró la cita a modificar con id: \'' + id + '\'');
         }
         else {
            // 3: Modifico los datos del paciente
            miCita.IDPaciente=idPaciente;
            miCita.Hora=hora;
            grabaCitas();
         
            res.json(200,miCita);
         }
});

app.delete('/cita/:id', function (req, res) {
           var id,resultado;
           
           // 1: Recupero las variables de la llamada
           id=req.param('id');
           
           // 2: Busco la cita solicitada
           resultado=eliminaCita(id);
           grabaCitas();
           if (resultado==null) {
            res.send(200,'No se encontró la cita a eliminar con id: \'' + id + '\'');
           }
           else {
            res.send(200,'OK');
           }
});

app.get('/cita', function (req, res) {
        res.json(200,listaCitas);
});


function buscaCita(idCita) {
    var i,elemento;
    
    for (i=0;i<listaCitas.length;i++) {
        if (listaCitas[i].IDCita==idCita) {
            return (listaCitas[i]);
        }
    }
    
    return(null);
}

function calculaNuevaIDCita() {
    var i,id;
    
    id=0;
    for (i=0;i<listaCitas.length;i++) {
        if (listaCitas[i].IDCita>id) {
            id=listaCitas[i].IDCita;
        }
    }
    
    return(++id);
}

function eliminaCita(idCita) {
    var i,elemento;
    
    for (i=0;i<listaCitas.length;i++) {
        if (listaCitas[i].IDCita==idCita) {
            listaCitas.splice(i, 1);
            return('');
        }
    }
    
    return(null);
}

function grabaCitas() {
    var i,cadena;
    
    cadena='';
    for (i=0;i<listaCitas.length;i++) {
        if (cadena!='') {
            cadena+='@';
        }
        cadena+=listaCitas[i].IDCita + ';';
        cadena+=listaCitas[i].Hora + ';';
        cadena+=listaCitas[i].IDPaciente;
    }
    
    fs.writeFile('citas.dat',cadena,null,function(datos) {
                 console.log('Citas grabados: ' + datos);
                 });
}

function leeCitas() {
    var cadena,datos,i;
    var miCita;
    var opciones;
    
    listaCitas=[];
    
    opciones={
        encoding: 'utf8'
    };
    
    fs.readFile('citas.dat',opciones,function (err, data) {
                if (!err) {
                datos=data.split('@');
                for (i=0;i<datos.length;i++) {
                cadena=datos[i].split(';');
                miCita= {
                IDCita: cadena[0],
                Hora: cadena[1],
                IDPaciente: cadena[2],
                };
                listaCitas.push(miCita);
                }
                }
                });
}

/******************/
/**** Servicio ****/
/******************/

app.listen(8080);
console.log('Ejecutando servidor en http://localhost:8080/');


