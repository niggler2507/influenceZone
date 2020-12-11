// Si necesitamos usar una biblioteca DOM personalizada, guardémosla en la variable $$:
var $$ = Dom7;

var app = new Framework7({
    // Elemento raíz de la aplicación
    root: '#app',
    // Nombre de la aplicación
    name: 'InfluenceZone',
    // App id
    id: 'com.myapp.test',
    // Habilitar el panel deslizante
    panel: {
      swipe: 'left',
    },
//////////////////////////////////////////////////////////////////////////////////////////
//    RUTAS
//////////////////////////////////////////////////////////////////////////////////////////
    routes: [
      {
        path: '/index/',
        url: 'index.html',
        options: {
          transition: 'f7-circle',
        },
      },
      {
        path: '/registracion/',
        url: 'registracion.html',
        options: {
          transition: 'f7-cover',
        },
      },
      {
        path: '/perfil/',
        url: 'perfil.html',
        options: {
          transition: 'f7-cover',
        },
      },
      {
        path: '/mapa/',
        url: 'mapa.html',
        options: {
          transition: 'f7-flip',
        },
      }, 
      {
        path: '/info/',
        url: 'info.html',
        options: {
          transition: 'f7-cover',
        },
      }, 
      {
        path: '/ong/',
        url: 'ong.html',
        options: {
          transition: 'f7-circle',
        },
      }
    ]
  });

//////////////////////////////////////////////////////////////////////////////////////////
//    ALGUNAS VARIABLES GENERALES QUE SE USAN FRECUENTEMENTE EN ESTE ARCHIVO JS
//////////////////////////////////////////////////////////////////////////////////////////
var mainView = app.views.create('.view-main');
var test = 1;
var platform, pos, icon;
var email,password, nombre, apellido, telefono, pais, provincia, ciudad, direccion, latitud, longitud; 
var emailOng, nombreOng, contactoOng, telefonoOng, direccionOng;


//////////////////////////////////////////////////////////////////////////////////////////
//    MERCADO PAGO
//////////////////////////////////////////////////////////////////////////////////////////
//window.Mercadopago.setPublishableKey("APP_USR-7855476531711397-120720-77e167e074d4d2fadbdf147eb87f473b-125834739");


//////////////////////////////////////////////////////////////////////////////////////////
//    APP INICIALIZADA
//////////////////////////////////////////////////////////////////////////////////////////
$$(document).on('deviceready', function() {
    mostrar("Device is ready!");


    /////////////////////////////////////////////////
    //        Cordova-Plugin-Geolocation
    //  Plugin Geolocation (acceso a los datos del GPS)
    //  devolución de llamada onSuccess
    //  Este método acepta un objeto Position, que contiene las
    //  coordenadas GPS actuales
    /////////////////////////////////////////////////
    var onSuccess = function(position) {
        latitud = position.coords.latitude;
        longitud = position.coords.longitude;
      /*
      alert('Latitude: '          + position.coords.latitude          + '\n' +
            'Longitude: '         + position.coords.longitude         + '\n' +
            'Altitude: '          + position.coords.altitude          + '\n' +
            'Accuracy: '          + position.coords.accuracy          + '\n' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
            'Heading: '           + position.coords.heading           + '\n' +
            'Speed: '             + position.coords.speed             + '\n' +
            'Timestamp: '         + position.timestamp                + '\n');
      */
    };
    // onError Callback receives a PositionError object
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }
    navigator.geolocation.getCurrentPosition(onSuccess, onError);

    
    /////////////////////////////////////////////////
    //     HERE MAPAS
    //     Iniciamos Platform de HereMaps
    /////////////////////////////////////////////////
    //Initialize the Platform object
    platform = new H.service.Platform({
        'apikey': 'VNoQVAe8GbbiSpXAgfN7dRf8iLfVkWYQwN2_o8wvThQ'
    });

});


//////////////////////////////////////////////////////////////////////////////////////////
//    EN TODAS LAS PAGINAS
//////////////////////////////////////////////////////////////////////////////////////////
$$(document).on('page:init', function (e) {
    mostrar(e);
// Preloader
    $$('.open-preloader').on('click', function () {
        app.dialog.preloader();
        setTimeout(function () {
            app.dialog.close();
        }, 4000);
    });
// velocidad de las imagenes del slider en el index
    mySwiper = new Swiper('.swiper-container', {
      autoplay: {
        delay: 5000,
      },
    });

});

//////////////////////////////////////////////////////////////////////////////////////////
//    INDEX
//////////////////////////////////////////////////////////////////////////////////////////
$$(document).on('page:init', '.page[data-name="index"]', function (e) {
    mostrar("pantalla index");
    $$('#btnLogin').on('click', fnLogin);
    
});

//////////////////////////////////////////////////////////////////////////////////////////
//    REGISTRACION DE USUARIOS
//////////////////////////////////////////////////////////////////////////////////////////
$$(document).on('page:init', '.page[data-name="registracion"]', function (e) {
    mostrar("pantalla de registracion");

    $$('#btnReg').on('click', registroUsuario);
    $$('#btnReg').on('click', guarDatoUsuario);
    $$('#btnRegOng').on('click', guarDatoOng);

});

//////////////////////////////////////////////////////////////////////////////////////////
//    PERFIL DEL USUARIO
//////////////////////////////////////////////////////////////////////////////////////////
$$(document).on('page:init', '.page[data-name="perfil"]', function (e) {
    mostrar("pantalla del perfil de usuario");
    
});

//////////////////////////////////////////////////////////////////////////////////////////
//    PANTALLA DEL MAPA
//////////////////////////////////////////////////////////////////////////////////////////
$$(document).on('page:init', '.page[data-name="mapa"]', function (e) {
    mostrar("pantalla del mapa");

/////////////////////////////////////////////////
//    HERE MAPS - MOSTRAR UBIACION EN EL MAPA
/////////////////////////////////////////////////
// Obtenga los tipos de mapas predeterminados del objeto de plataforma:
    var defaultLayers = platform.createDefaultLayers();
//  CREANDO EL OBJETO MAPA
// marca UBICACION EN EL MAPA
// Crea una instancia (y muestra) un objeto de mapa:
    var map = new H.Map(
    document.getElementById('mapContainer'),
    defaultLayers.vector.normal.map,
    {
      zoom: 11.5,
      center: { lat: latitud, lng: longitud },
    });

  // Define a variable holding SVG mark-up that defines an animated icon image:
    var animatedSvg =
    '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" ' + 
    'y="0px" style="margin:-112px 0 0 -32px" width="136px"' + 
    'height="150px" viewBox="0 0 136 150"><ellipse fill="#000" ' +
    'cx="32" cy="128" rx="36" ry="4"><animate attributeName="cx" ' + 
    'from="32" to="32" begin="0s" dur="1.5s" values="96;32;96" ' + 
    'keySplines=".6 .1 .8 .1; .1 .8 .1 1" keyTimes="0;0.4;1"' + 
    'calcMode="spline" repeatCount="indefinite"/>' +    
    '<animate attributeName="rx" from="36" to="36" begin="0s"' +
    'dur="1.5s" values="36;10;36" keySplines=".6 .0 .8 .0; .0 .8 .0 1"' + 
    'keyTimes="0;0.4;1" calcMode="spline" repeatCount="indefinite"/>' +
    '<animate attributeName="opacity" from=".2" to=".2"  begin="0s" ' +
    ' dur="1.5s" values=".1;.7;.1" keySplines=" .6.0 .8 .0; .0 .8 .0 1" ' +
    'keyTimes=" 0;0.4;1" calcMode="spline" ' +
    'repeatCount="indefinite"/></ellipse><ellipse fill="#1b468d" ' +
    'cx="26" cy="20" rx="16" ry="12"><animate attributeName="cy" ' +
    'from="20" to="20" begin="0s" dur="1.5s" values="20;112;20" ' +
    'keySplines=".6 .1 .8 .1; .1 .8 .1 1" keyTimes=" 0;0.4;1" ' +
    'calcMode="spline" repeatCount="indefinite"/> ' +
    '<animate attributeName="ry" from="16" to="16" begin="0s" ' + 
    'dur="1.5s" values="16;12;16" keySplines=".6 .0 .8 .0; .0 .8 .0 1" ' +
    'keyTimes="0;0.4;1" calcMode="spline" ' +
    'repeatCount="indefinite"/></ellipse></svg>';

    // Create an icon object, an object with geographic coordinates and a marker:
    var icon = new H.map.DomIcon(animatedSvg);
    coords = { lat: latitud, lng: longitud },
    //marker = new H.map.Marker(coords, {icon: icon}); 5-12-2020

    marker = new H.map.DomMarker(coords, {icon: icon});

    // Set map center and zoom, add the marker to the map: 
    //map.setZoom(18); 5-12-2020
  
    // Agregue el marcador al mapa y centre el mapa en la ubicación del marcador:
    map.addObject(marker);
    map.setCenter(coords);



    
/////////////////////////////////////////////////
//    HERE MAPS - INTERFAZ DE USUARIO
/////////////////////////////////////////////////
// BURBUJA DE INFORMACION en la zona en donde esta el usuario
// Cree un objeto de burbuja de información en una ubicación geográfica específica:
var bubble = new H.ui.InfoBubble({ lat: latitud, lng: longitud }, {
  content: '<em>Esta es tu zona de influencia</em>'
});
// Configuracion del LENGUAJE DEL MAPA
// Cree la interfaz de usuario predeterminada:
    var ui = H.ui.UI.createDefault(map, defaultLayers, 'es-ES');
// Agregue un cuadro de información a la interfaz de usuario:
    ui.addBubble(bubble);
// Se agrega funcionalidades: tactil/mouse (EVENTOS EN EL MAPA)
// Habilite el sistema de eventos en la instancia del mapa:
    var mapEvents = new H.mapevents.MapEvents(map);
// Agregar detector de eventos:
    map.addEventListener('tap', function(evt) {
// Registre eventos de 'tap' y 'mouse':
    console.log(evt.type, evt.currentPointer.type); 
    });
// Cree una instancia del comportamiento predeterminado, proporcionando el objeto mapEvents:
    var behavior = new H.mapevents.Behavior(mapEvents);
// Creacion de una CODIFICACION GEOGRAFICA que pinta un CIRCULO en la zona de influencia
// Cree una instancia de un objeto de círculo (usando el estilo predeterminado):
    var circle = new H.map.Circle({lat: latitud, lng: longitud}, 8000);
// Agrega el círculo al mapa:
    map.addObject(circle);


/////////////////////////////////////////////////
//    HERE MAPS - Agregando 2 comedores al mapa
/////////////////////////////////////////////////
    //var ccurdeMarker = new H.map.Marker({lat:-34.650839, lng:-58.704216});
    //map.addObject(ccurdeMarker);
  
    //var cdjlcMarker = new H.map.Marker({lat:-34.625248, lng:-58.665604});
    //map.addObject(cdjlcMarker);



/////////////////////////////////////////////////
//    HERE MAPS - Abrir una burbuja de información con un clic del mouse
/////////////////////////////////////////////////
  //Crea un nuevo marcador y lo agrega a un grupo
  //@param {H.map.Group} group El grupo que tiene el nuevo marcador
  //@param {H.geo.Point} coordenada La ubicación del marcador
  //@param {String} html Datos asociados con el marcador
  function addMarkerToGroup(group, coordinate, html) {
    var marker = new H.map.Marker(coordinate);
    // agrega datos personalizados al marcador
    marker.setData(html);
    group.addObject(marker);
  }
  //Agregue dos marcadores que muestren la posición.
  //Al hacer clic en un marcador, se abre una burbuja de información que contiene contenido HTML relacionado con el marcador.
  //@param {H.Map} map Una instancia de HERE Map dentro de la aplicación
  function addInfoBubble(map) {
    var group = new H.map.Group();
  
    map.addObject(group);
  // agregue el detector de eventos 'tap', que abre la burbuja de información, al grupo
    group.addEventListener('tap', function (evt) {
  // el objetivo del evento es el marcador en sí, el grupo es un objetivo del evento principal
  // para todos los objetos que contiene
    var bubble =  new H.ui.InfoBubble(evt.target.getGeometry(), {
  // leer datos personalizados
    content: evt.target.getData()
    });
  // mostrar burbuja de información
  ui.addBubble(bubble);
  }, false);
  //Comedor Comunitario Un Rayito de Esperanza
  addMarkerToGroup(group, {lat:-34.650839, lng:-58.704216},
    '<div class="block"><p><a href="/ong/" data-view=".page-content">' +
    '<em><strong>Comedor Comunitario Un Rayito de Esperanza</strong></em></a></p>' +
    '</div>');
  //Divino Niño Jesús
  addMarkerToGroup(group, {lat:-34.637941, lng:-58.637422},
    '<div class="block"><p><a href="/ong/" data-view=".page-content">' +
    '<em><strong>Divino Niño Jesús</strong></em></a></p>' +
    '</div>');
  }
  addInfoBubble(map);



/////////////////////////////////////////////////
//    HERE MAPS - Agrupacion
/////////////////////////////////////////////////
var dataPoints = [];
  dataPoints.push(new H.clustering.DataPoint(51.01, 0.01));
  dataPoints.push(new H.clustering.DataPoint(50.04, 1.01));
  dataPoints.push(new H.clustering.DataPoint(51.45, 1.01));
  dataPoints.push(new H.clustering.DataPoint(51.01, 2.01));

  

/**
 * 'dataPoints' y 'map' están inicializado y disponible, se crea un proveedor de datos:
 */
var clusteredDataProvider = new H.clustering.Provider(dataPoints, {
  min: 1,
  max: 10,
  clusteringOptions: {
    eps: 32,
    minWeight: 2
  }
});

// Se crea una capa que incluya el proveedor de datos y sus puntos de datos:
var layer = new H.map.layer.ObjectLayer(clusteredDataProvider);

// Agrego la capa al mapa:
map.addLayer(layer);

});

//////////////////////////////////////////////////////////////////////////////////////////
//    INFO DE LA APP
//////////////////////////////////////////////////////////////////////////////////////////
$$(document).on('page:init', '.page[data-name="info"]', function (e) {
    mostrar("pantalla de info de la app");
});


//////////////////////////////////////////////////////////////////////////////////////////
//    PERFIL DE LA ONG
//////////////////////////////////////////////////////////////////////////////////////////
$$(document).on('page:init', '.page[data-name="ong"]', function (e) {
  mostrar("pantalla del perfil de usuario");
/*
//////////////////////////////////////////////////////////////////////////////////////////
//    MERCADO PAGO
//////////////////////////////////////////////////////////////////////////////////////////
// SDK de Mercado Pago
const mercadopago = require ('mercadopago');

// Agrega credenciales
mercadopago.configure({
  access_token: 'APP_USR-7855476531711397-120720-77e167e074d4d2fadbdf147eb87f473b-125834739'
});

// Crea un objeto de preferencia
let preference = {
  items: [
    {
      title: 'Donar',
      unit_price: 100,
      quantity: 1,
    }
  ]
};

mercadopago.preferences.create(preference)
.then(function(response){
// Este valor reemplazará el string "<%= global.id %>" en tu HTML
  global.id = response.body.id;
}).catch(function(error){
  console.log(error);
});*/

  
});


//////////////////////////////////////////////////////////////////////////////////////////
//    MIS FUNCIONES
//////////////////////////////////////////////////////////////////////////////////////////
//funcion para mostrar error en consola para ayudarme en los errores que surgan
function mostrar(txt) {
  if(test == 1) {
    console.log(txt);
  }
}


function fnLogin() {
//en Firebase esta activa la autenticación por medio del correo y clave
  email = $$('#loginEmail').val();
  password = $$('#loginPass').val();
  mostrar('email: '+ email);
  mostrar('password: '+ password);
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then( function() {
    mainView.router.navigate("/mapa/");
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
    //Creo un mensaje para que se registren en caso que no tengan una cuenta
    $$('#loginMensaje').html('<p><a href="/registracion/" data-view=".page-content" class="link login-screen-close text-color-red"><em><strong>Si aun no tenes una cuenta, Registrate aqui</strong></em></a></p>');
    //Creo un Toast con callback atrapando y mostrando "eerorCode" y "errorMessage"
    var toastWithCallback = app.toast.create({
      text: errorCode,
      closeButton: true,
      on: {
        close: function () {
          app.dialog.alert(errorMessage);
        },
      }
    });
    //Llamo a toastWithCallback para mostrar en pantalla los el código y mensaje de error
    toastWithCallback.open();
  });
}


/////////////////////////////////
//    REGISTRO DE USUARIOS
/////////////////////////////////
function registroUsuario() {
  email = $$('#regEmail').val();
  password = $$('#regPass').val();
  mostrar('email: '+ email);
  mostrar('password: '+ password);
  
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then( function() {
    mainView.router.navigate("/index/");
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    var toastWithCallback = app.toast.create({
      text: errorCode,
      closeButton: true,
      on: {
        close: function () {
          app.dialog.alert(errorMessage);
        },
      }
    });
    //Llamo a toastWithCallback para mostrar en pantalla los el código y mensaje de error
    toastWithCallback.open();
  });
}

function guarDatoUsuario() {
//Funcion de inicializacion y creacion de base de datos
  var db = firebase.firestore();
  var colUsuarios = db.collection('Usuarios');
//CONSTRUYENDO LA BASE DE DATOS EN FIRESTORE
  claveDeColleccion = email;
    email = $$('#regEmail').val();
    password = $$('#regPass').val();
    nombre = $$('#regNombre').val();
    apellido = $$('#regApellido').val();
    telefono = $$('#regTel').val();
    pais = $$('#regPais').val();
    provincia = $$('#regProvincia').val();
    ciudad = $$('#regCiudad').val();
    direccion = $$('#regDirec').val();
    datos = {
      email: email,
      password: password,
      nombre: nombre,
      apellido: apellido,
      telefono: telefono,
      pais: pais,
      provincia: provincia,
      ciudad: ciudad,
      direccion: direccion,
      latitud: latitud,
      longitud: longitud
    };

  colUsuarios.doc(claveDeColleccion).set(datos)
    .catch(function(e) {
    });

}

function guarDatoOng() {
//Funcion de inicializacion y creacion de base de datos
  var db = firebase.firestore();
  var colOrganizaciones = db.collection('Organizaciones');
//CONSTRUYENDO LA BASE DE DATOS EN FIRESTORE
  claveColleccion = emailOng;
    emailOng = $$('#regEmailOng').val();
    nombreOng = $$('#regNombreOng').val();
    contactoOng = $$('#regContactoOng').val();
    telefonoOng = $$('#regTelOng').val();
    direccionOng = $$('#regDirecOng').val();
    //latitudOng = ;
    //longitudOng = ;
    datos = {
      email: emailOng,
      nombre: nombreOng,
      contacto: contactoOng,
      telefono: telefonoOng,
      direccion: direccionOng,
      //latitud: latitudOng,
      //longitud: longitudOng
    };

  colOrganizaciones.doc(claveColleccion).set(datos)
    .catch(function(e) {
    });
}
