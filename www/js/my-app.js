var test = 1;
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // Add default routes
    routes: [
      {
        path: '/',
        url: 'index.html',
      },
      {
        path: '/index/',
        url: 'index.html',
      },
      {
        path: '/registracion/',
        url: 'registracion.html',
      },
      {
        path: '/reg-screen/',
        url: 'registracion.html',
      },
      {
        path: '/perfil/',
        url: 'perfil.html',
      },
      {
        path: '/mapa/',
        url: 'mapa.html',
      },
    ]
  });

var mainView = app.views.create('.view-main');

var email,password, latitud, longitud, platform, pos;

//////////////////////////////////////////////////////////////////////////////////////////
//APP INICIALIZADA
//////////////////////////////////////////////////////////////////////////////////////////
// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    mostrar("Device is ready!");

/////////////////////////////////////////////////
//  HERE MAPAS
//  Iniciamos Platform de HereMaps
/////////////////////////////////////////////////
    //Initialize the Platform object
    platform = new H.service.Platform({
      'apikey': 'VNoQVAe8GbbiSpXAgfN7dRf8iLfVkWYQwN2_o8wvThQ'
    });
/////////////////////////////////////////////////
//Plugin Geolocation (acceso a los datos del GPS)
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
    //
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
});

//////////////////////////////////////////////////////////////////////////////////////////
//EN TODAS LAS PAGINAS
//////////////////////////////////////////////////////////////////////////////////////////
// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    mostrar(e);
})

//////////////////////////////////////////////////////////////////////////////////////////
//INDEX
//////////////////////////////////////////////////////////////////////////////////////////
// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="index"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    mostrar("pantalla index");
    
    $$('#btnLogin').on('click', fnLogin);
})

//////////////////////////////////////////////////////////////////////////////////////////
//REGISTRACION DE USUARIOS Y ORGS
//////////////////////////////////////////////////////////////////////////////////////////
// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="registracion"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  mostrar("pantalla de registracion");
  $$('#btnFinReg').on('click', fnRegistro);
  $$('#btnFinReg').on('click', guarDatoUsuario);
})

//////////////////////////////////////////////////////////////////////////////////////////
//PERFIL DEL USUARIO
//////////////////////////////////////////////////////////////////////////////////////////
// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="perfil"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  mostrar("pantalla del perfil de usuario");
  /*
  perFoto
  btnGal
  btnCam
  */
  $$('#btnGal').on('click', fnGaleria);
  $$('#btnGam').on('click', fnGamara);
})

//////////////////////////////////////////////////////////////////////////////////////////
//PANTALLA DEL MAPA
//////////////////////////////////////////////////////////////////////////////////////////
// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="mapa"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  mostrar("pantalla del mapa");

/////////////////////////////////////////////////
//  HERE MAPS
/////////////////////////////////////////////////
  // Obtain the default map types from the platform object:
  var defaultLayers = platform.createDefaultLayers();

  //  CREANDO EL OBJETO MAPA
  
  // marca UBICACION EN EL MAPA
  // Instantiate (and display) a map object:
  var map = new H.Map(
    document.getElementById('mapContainer'),
    defaultLayers.vector.normal.map,
    {
      zoom: 14,
      center: { lat: latitud, lng: longitud }
    });
    coords = { lat: latitud, lng: longitud },
    marker = new H.map.Marker(coords);
    // Add the marker to the map and center the map at the location of the marker:
    map.addObject(marker);
    map.setCenter(coords);


    // BURBUJA DE INFORMACION en la zona en donde esta el usuario
    // Create an info bubble object at a specific geographic location:
    var bubble = new H.ui.InfoBubble({ lat: latitud, lng: longitud }, {
      content: '<b>Estas Aqui!</b>'
    });


    // Configuracion del LENGUAJE DEL MAPA
    // Create the default UI:
    var ui = H.ui.UI.createDefault(map, defaultLayers, 'es-ES');
    // Add info bubble to the UI:
    ui.addBubble(bubble);


    // Se agrega funcionalidades: tactil/mouse (EVENTOS EN EL MAPA)
    // Enable the event system on the map instance:
    var mapEvents = new H.mapevents.MapEvents(map);
    // Add event listener:
    map.addEventListener('tap', function(evt) {
        // Log 'tap' and 'mouse' events:
        console.log(evt.type, evt.currentPointer.type); 
    });
    // Instantiate the default behavior, providing the mapEvents object:
    var behavior = new H.mapevents.Behavior(mapEvents);


    //Creacion de una CODIFICACION GEOGRAFICA que pinta un CIRCULO en la zona de influencia
    // Instantiate a circle object (using the default style):
    var circle = new H.map.Circle({lat: latitud, lng: longitud}, 8000);
    // Add the circle to the map:
    map.addObject(circle);

/*
    // Define a variable holding SVG mark-up that defines an icon image:
    var svgMarkup = '<svg width="24" height="24" ' +
    'xmlns="http://www.w3.org/2000/svg">' +
    '<rect stroke="white" fill="#1b468d" x="1" y="1" width="22" ' +
    'height="22" /><text x="12" y="18" font-size="12pt" ' +
    'font-family="Arial" font-weight="bold" text-anchor="middle" ' +
    'fill="white">H</text></svg>';

    // Create an icon, an object holding the latitude and longitude, and a marker:
    var icon = new H.map.Icon(svgMarkup),
    coords = {lat: 52.53075, lng: 13.3851},
    marker = new H.map.Marker(coords, {icon: icon});

    // Add the marker to the map and center the map at the location of the marker:
    map.addObject(marker);
    map.setCenter(coords);


     // Get an instance of the geocoding service:
  var service = platform.getSearchService();
  
  // Call the geocode method with the geocoding parameters,
  // the callback and an error callback function (called if a
  // communication error occurs):
  service.geocode({
    q: 'Balcarce 50, Buenos Aires, Argentina'
  }, (result) => {
    // Add a marker for each location found
    result.items.forEach((item) => {
      mostrar("item: " + JSON.stringify(item.position));
      pos = item.position;
      map.addObject(new H.map.Marker(item.position));
      //item: {"lat":-34.60826,"lng":-58.37078}
      latitud = item.position.lat;
      longitud = item.position.lng;
      map.setCenter(item.position);
    });
  }, alert);

  //coords = {lat: latitud, longitud};
  //map.setCenter(coords);
*/
})

//////////////////////////////////////////////////////////////////////////////////////////
//MIS FUNCIONES
//////////////////////////////////////////////////////////////////////////////////////////

function mostrar(txt) {
  if(test == 1) {
    console.log(txt);
  }
}


function fnLogin() {
  //usuario: prueba@prueba.com | prueba
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
    $$('#loginMensaje').html(errorMessage);
  });
}

function fnRegistro() {

  email = $$('#regEmail').val();
  password = $$('#regPass').val();
  mostrar('email: '+ email);
  mostrar('password: '+ password);
  
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then( function() {
    mainView.router.navigate("/mapa/");
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });
}

//Funcion de inicializacion y creacion de base de datos
function guarDatoUsuario() {
  /*
  Coleccion: PERSONAS       <- colPersonas
    ID: email@email.com     <- claveDeColleccion
    DATOS JASON:            <- datos
            nombre
            apellido
            foto (servicio de storage)
            latitud
            longitud
  */


 //CONSTRUYENDO LA BASE DE DATOS EN FIRESTORE

  var db = firebase.firestore();
  var colUsuarios = db.collection('Usuarios');

  claveDeColleccion = email;
  nombre = $$('#regNombre').val();
  apellido = $$('#regApellido').val();
  datos = {
    nombre: nombre,
    apellido: apellido,
    email: email,
    foto: 'ninguna',
    latitud: latitud,
    longitud: longitud
  }

  colUsuarios.doc(claveDeColleccion).set(datos)
  .catch(function(e) {
  });

}

function fnGaleria() {
    navigator.camera.getPicture(onSuccessCamara, onErrorCamara,
    {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
    });
}

function fnGamara() {
    navigator.camera.getPicture(onSuccessCamara, onErrorCamara,
    {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
    });
}

function onSuccessCamara(imageURI) {
  $$('#perFoto').attr('src', imageURI);
}

function onErrorCamara(message) {
  alert('Failed because: ' + message);
}