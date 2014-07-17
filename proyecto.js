/*var pacientes = '1;Santiago Reyes;44294340C;38@2;Pepito Perez;12345678A;25@3;Fulanito Sanchez;87654321Z;41@4;Manuela Dominguez;13579246H;31';
var citas = '1;20140623081200;2@2;20140623082400;1@3;20140623094200;4@4;20140624081800;3@5;20140624093600;1';
var fechas = '20140623@20140624@20140625@20140626';
var horas = '080000@080600@081200@081800@082400@093000@093600@094200@094800';*/
var listaPacientes, listaCitas, listaFechas, listaHoras;
var urlRaiz='http://localhost:3738/';

$(document).ready(function () {
    cargaPacientes();
    cargaCitas();
    cargaFechas();
    cargaHoras();

    alert('Ahi estamos');
});



















//var listaPacientes, listaCitas, listaFechas, listaHoras;

function cargaTodo() {
    cargaPacientes();
    cargaCitas();
    cargaFechas();
    cargaHoras();

    muestraCitas();
}

/* Cargo la lista de pacientes */
function cargaPacientes() {
    var url;
    
    listaPacientes=null;
    
    url=urlRaiz + 'paciente';
    $.ajax( {
           url: url,
           method: 'GET',
           cache: false,
           success: function(resultado) {
            listaPacientes=resultado;
			
			muestraPacientes();
           },
           error: function(a,b,c) {
            listaPacientes=[];
            alert('No se pudieron recuperar los pacientes:\n' + a);
           }
    });
}

/* Cargo la lista de citas */
function cargaCitas() {
    var url;
    
    listaCitas=null;
    
    url=urlRaiz + 'cita';
    $.ajax( {
           url: url,
           method: 'GET',
           cache: false,
           success: function(resultado) {
            listaCitas=resultado;
			
			muestraCitas();
           },
           error: function(a,b,c) {
            listaCitas=[];
            alert('No se pudieron recuperar las citas:\n' + a);
           }
    });
}

/* Cargo la lista de fechas */
function cargaFechas() {
    var url;

    listaFechas = null;

    url = urlRaiz + 'fecha';
    $.ajax({
        url: url,
        method: 'GET',
        cache: false,
        success: function (resultado) {
            listaFechas = resultado;
        },
        error: function (a, b, c) {
            listaFechas = [];
            alert('No se pudieron recuperar las fechas:\n' + a);
        }
    });
}

/* Cargo la lista de horas */
function cargaHoras() {
    var url;

    listaHoras = null;

    url = urlRaiz + 'hora';
    $.ajax({
        url: url,
        method: 'GET',
        cache: false,
        success: function (resultado) {
            listaHoras = resultado;
        },
        error: function (a, b, c) {
            listaHoras = [];
            alert('No se pudieron recuperar las horas:\n' + a);
        }
    });
}

/* Muestra las lista de citas en la tabla */
function muestraCitas() {
    var i, cadena;
    var miTabla, campoTexto;
    var miPaciente;

    // 1: Muestro el mensaje de carga y vacio la tabla de citas
    $("#CargandoCitas").show();
    $("#MisCitas").hide();

    // 2: Creo la tabla con las citas
    cadena = '<tr><th>Día</th><th>Hora</th><th>Paciente</th><th></th><th></th></tr>';
    for (i = 0; i < listaCitas.length; i++) {
        miPaciente = devuelvePaciente(listaCitas[i].CodigoPaciente);

        cadena += '<tr id="Cita_' + listaCitas[i].CodigoCita + '" codigoCita="' + listaCitas[i].CodigoCita + '">';
        cadena += '<td>' + traduceFecha(listaCitas[i].Hora) + '</td>';
        cadena += '<td>' + traduceHora(listaCitas[i].Hora) + '</td>';
        if (miPaciente != null) {
            cadena += '<td>' + miPaciente.Nombre + '</td>';
        }
        else {
            cadena += '<td>Paciente erróneo</td>';
        }
        cadena += '<td><button class="boton" codigoCita="' + listaCitas[i].CodigoCita + '">Modificar</button></td>';
        cadena += '<td><button class="boton2" codigoCita="' + listaCitas[i].CodigoCita + '">Eliminar</button></td>';
        cadena += '</tr>';

    }
    $("#MisCitas").html(cadena);

    // 3: Creo un retardo de 2 segundos en la carga de citas para ver el efecto jQuery sobre el panel
    setTimeout(function () {
        $("#CargandoCitas").hide('slow', function () {
            $("#MisCitas").show('fast');
            $("#CitaNueva").fadeIn();

            creaEventosTablaCitas();
        });
    }, 500);
}

/* Muestra las lista de pacientes en la tabla */
function muestraPacientes() {
    var i, cadena;
    var miTabla, campoTexto;
    var miPaciente;

    // 1: Muestro el mensaje de carga y vacio la tabla de citas
    $("#CargandoPacientes").show();
    $("#MisPacientes").hide();

    // 2: Creo la tabla con las citas
    cadena = '<tr><th>Nombre</th><th>NIF</th><th>Edad</th><th></th><th></th></tr>';
    for (i = 0; i < listaPacientes.length; i++) {
        cadena += '<tr id="Paciente_' + listaPacientes[i].CodigoPaciente + '" codigoPaciente="' + listaPacientes[i].CodigoPaciente + '">';
        cadena += '<td>' + listaPacientes[i].Nombre + '</td>';
        cadena += '<td>' + listaPacientes[i].NIF + '</td>';
        cadena += '<td>' + listaPacientes[i].Edad + '</td>';
        cadena += '<td><button class="boton" codigoCita="' + listaPacientes[i].CodigoPaciente + '">Modificar</button></td>';
        cadena += '<td><button class="boton2" codigoCita="' + listaPacientes[i].CodigoPaciente + '">Eliminar</button></td>';
        cadena += '</tr>';

    }
    $("#MisPacientes").html(cadena);

    // 3: Creo un retardo de 2 segundos en la carga de citas para ver el efecto jQuery sobre el panel
    setTimeout(function () {
        $("#CargandoPacientes").hide('slow', function () {
            $("#MisPacientes").show('fast');
            $("#PacienteNuevo").fadeIn();

            creaEventosTablaPacientes();
        });
    }, 500);
}

function creaEventosTablaCitas() {
    var i, cadena;

    for (i = 0; i < listaCitas.length; i++) {
        // 1: Por cada fila de la tabla creo el evento 'hover' para cambiar el color de fondo
        cadena = 'Cita_' + listaCitas[i].CodigoCita;
        $("#" + cadena).hover(function () {
            $(this).addClass('celdaSeleccionada');
        },
        function () {
            $(this).removeClass('celdaSeleccionada');
        });

        // 2: Por cada boton de fecha u hora creo el evento 'click' para modificar la cita
        $("#" + cadena + " td:nth-child(4) button").click(function () {
            var codigoCita;

            codigoCita = $(this).attr('codigoCita');
            modificaCita(codigoCita);
        });

        // 3: Por cada boton de fecha u hora creo el evento 'click' para cambiar la hora de la cita
        $("#" + cadena + " td:nth-child(5) button").click(function () {
            var codigoCita;

            if (confirm('¿Está seguro de que desea eliminar la cita?')) {
                codigoCita = $(this).attr('codigocita');
                eliminaCita(codigoCita);
            }
        });
    }
}

function creaEventosTablaPacientes() {
    var i, cadena;

    for (i = 0; i < listaPacientes.length; i++) {
        // 1: Por cada fila de la tabla creo el evento 'hover' para cambiar el color de fondo
        cadena = 'Paciente_' + listaPacientes[i].CodigoPaciente;
        $("#" + cadena).hover(function () {
            $(this).addClass('celdaSeleccionada');
        },
        function () {
            $(this).removeClass('celdaSeleccionada');
        });

        // 2: Por cada boton de fecha u hora creo el evento 'click' para modificar la cita
        $("#" + cadena + " td:nth-child(4) button").click(function () {
            var codigoPaciente;

            codigoCita = $(this).attr('codigoPaciente');
            modificaPaciente(codigoPaciente);
        });

        // 3: Por cada boton de fecha u hora creo el evento 'click' para cambiar la hora de la cita
        $("#" + cadena + " td:nth-child(5) button").click(function () {
            var codigoPaciente;

            if (confirm('¿Está seguro de que desea eliminar el paciente?')) {
                codigoPaciente = $(this).attr('codigoPaciente');
                eliminaPaciente(codigoPaciente);
            }
        });
    }
}

/* Convierte la hora del formato '20140603082451' a '08:24:51' */
function traduceHora(valor) {
    var cadena;

    cadena = valor.substr(8, 2) + ':' + valor.substr(10, 2) + ':' + valor.substr(12, 2);
    return (cadena);
}

/* Convierte la hora del formato '082451' a '08:24:51' */
function traduceHora2(valor) {
    var cadena;

    cadena = valor.substr(0, 2) + ':' + valor.substr(2, 2) + ':' + valor.substr(4, 2);
    return (cadena);
}

/* Convierte la fecha del formato '20140603082451' a '03/06/2014' */
function traduceFecha(valor) {
    var cadena;

    cadena = valor.substr(6, 2) + '/' + valor.substr(4, 2) + '/' + valor.substr(0, 4);
    return (cadena);
}

/* Busca una cita de la lista de citas mediante su codigo */
function devuelveCita(codigoCita) {
    var i;

    i = 0;
    while ((i < listaCitas.length)
        && (listaCitas[i].CodigoCita != codigoCita)) {
        i++;
    }

    if (i < listaCitas.length) {
        return (listaCitas[i]);
    }
    else {
        return (null);
    }
}

/* Busca un paciente de la lista de pacientes mediante su codigo */
function devuelvePaciente(codigoPaciente) {
    var i;

    i = 0;
    while ((i < listaPacientes.length)
        && (listaPacientes[i].CodigoPaciente != codigoPaciente)) {
        i++;
    }

    if (i < listaPacientes.length) {
        return (listaPacientes[i]);
    }
    else {
        return (null);
    }
}

function cargaComboPacientes(miCita) {
    var i, cadena;

    cadena = '';
    for (i = 0; i < listaPacientes.length; i++) {
        if ((miCita != null) && (listaPacientes[i].CodigoPaciente == miCita.CodigoPaciente)) {
            cadena += '<option codigoPaciente="' + listaPacientes[i].CodigoPaciente + '" selected>' + listaPacientes[i].Nombre + '</option>';
        }
        else {
            cadena += '<option codigoPaciente="' + listaPacientes[i].CodigoPaciente + '">' + listaPacientes[i].Nombre + '</option>';
        }
    }
    $("#MiCitaPacientes").html(cadena);
}

function cargaComboFechas(miCita) {
    var i, cadena;

    cadena = '';
    for (i = 0; i < listaFechas.length; i++) {
        if ((miCita != null) && (listaFechas[i] == miCita.Hora.substr(0, 8))) {
            cadena += '<option fecha="' + listaFechas[i] + '" selected>' + traduceFecha(listaFechas[i]) + '</option>';
        }
        else {
            cadena += '<option fecha="' + listaFechas[i] + '">' + traduceFecha(listaFechas[i]) + '</option>';
        }
    }
    $("#MiCitaFecha").html(cadena);
}

function cargaComboHoras(miCita) {
    cadena = '';
    for (i = 0; i < listaHoras.length; i++) {
        if ((miCita != null) && (listaHoras[i] == miCita.Hora.substr(8, 6))) {
            cadena += '<option hora="' + listaHoras[i] + '" selected>' + traduceHora2(listaHoras[i]) + '</option>';
        }
        else {
            cadena += '<option hora="' + listaHoras[i] + '">' + traduceHora2(listaHoras[i]) + '</option>';
        }
    }
    $("#MiCitaHora").html(cadena);
}

/* Localiza una cita y muestra el div para cambiarla */
function modificaCita(codigoCita) {
    var miCita;

    // 1: Asigno el titulo del panel
    $("#MiCitaTitulo").html('Modificar cita');

    // 2: Recupero la cita
    miCita = devuelveCita(codigoCita);

    // 3: Cargo el combo con los pacientes
    cargaComboPacientes(miCita);

    // 4: Cargo el combo con los dias disponibles
    cargaComboFechas(miCita);

    // 5: Cargo el combo con las horas disponibles
    cargaComboHoras(miCita);

    // 6: Asigno el evento click al boton 'Aceptar'
    $("#MiCita button:first").attr('codigoCita', miCita.CodigoCita);
    $("#MiCita button:first").unbind("click");
    $("#MiCita button:first").click(function () {
        var codigoCita;

        codigoCita = $(this).attr('codigoCita');
        cambiaCita(codigoCita);
    });

    // 7: Inhabilito los botones del listado de citas y muestro el panel para cambiar la cita
    alert('Deshabilito los botones de citas');
    $("#Citas button").attr('disabled', 'disabled');
    $("#MiCita").fadeIn();
}

/* Responde al botón 'Cancelar' de la moficicación de una cita */
function ocultaCita() {
    $("#Citas button").removeAttr('disabled');
    $("#MiCita").fadeOut();
}

/* Modifica la cita existente con los nuevos valores */
function cambiaCita(codigoCita) {
    var paciente, fecha, hora;
    var miCita;

    // 1: Recupero la cita correpondiente
    miCita = devuelveCita(codigoCita);

    // 2: Recupero los nuevos valores seleccionados por el usuario
    paciente = $("#MiCitaPacientes option:selected").attr('codigoPaciente');
    fecha = $("#MiCitaFecha option:selected").attr('fecha');
    hora = $("#MiCitaHora option:selected").attr('hora');

    // 3: Asigno a la cita los nueos valores
    miCita.CodigoPaciente = paciente;
    miCita.Hora = fecha + hora;

    // 4: Cierro el panel de modificación de cita
    ocultaCita();

    // 5: Refresco la lista de citas en pantalla
    $("#MiCita").fadeOut(muestraCitas);
}

/* Elimina una cita */
function eliminaCita(codigoCita) {
    var i;

    i = 0;
    while ((i < listaCitas.length) && (listaCitas[i].CodigoCita != codigoCita)) {
        i++;
    }

    if (i >= listaCitas.length) {
        alert('No se encontro la cita que se desea eliminar');
    }
    else {
        listaCitas.splice(i, 1);
    }

    muestraCitas();
}

/* Crea una cita nueva */
function creaCita() {
    var i;

    // 1: Asigno el titulo del panel
    $("#MiCitaTitulo").html('Nueva cita');

    // 2: Cargo el combo con los pacientes
    cargaComboPacientes(null);

    // 3: Cargo el combo con los dias disponibles
    cargaComboFechas(null);

    // 4: Cargo el combo con las horas disponibles
    cargaComboHoras(null);

    // 5: Asigno el evento click al boton 'Aceptar'
    $("#MiCita button:first").unbind("click");
    $("#MiCita button:first").click(function () {
        insertaCita();
    });

    // 7: Inhabilito los botones del listado de citas y muestro el panel para cambiar la cita
    $("#Citas button").attr('disabled', 'disabled');
    $("#MiCita").fadeIn();
}

/* Inserta una cita nueva en la lista */
function insertaCita() {
    var paciente, fecha, hora;
    var miCita, codigoNuevaCita;
    var i;

    // 1: Recupero los nuevos valores seleccionados por el usuario
    paciente = $("#MiCitaPacientes option:selected").attr('codigoPaciente');
    fecha = $("#MiCitaFecha option:selected").attr('fecha');
    hora = $("#MiCitaHora option:selected").attr('hora');

    // 2: Calculo el codigo de la nueva cita
    codigoNuevaCita = 0;
    for (i = 0; i < listaCitas.length; i++) {
        if (listaCitas[i].CodigoCita > codigoNuevaCita) {
            codigoNuevaCita = listaCitas[i].CodigoCita;
        }
    }
    codigoNuevaCita++;

    // 3: Asigno a la cita los nuevos valores
    miCita = {
        CodigoCita: codigoNuevaCita.toString(),
        Hora: fecha + hora,
        CodigoPaciente: paciente,
    };

    // 4: Inserto la cita en lista
    listaCitas.push(miCita);

    // 5: Cierro el panel de modificación de cita
    ocultaCita();

    // 6: Refresco la lista de citas en pantalla
    $("#MiCita").fadeOut(muestraCitas);
}
