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
        path: '/perfil/',
        url: 'perfil.html',
      },
      {
        path: '/mapa/',
        url: 'mapa.html',
      },
    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');

var email, latitud, longitud, platform;

//////////////////////////////////////////////////////////////////////////////////////////
//APP INICIALIZADA
//////////////////////////////////////////////////////////////////////////////////////////
// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    mostrar("Device is ready!");

    platform = new H.service.Platform({
      'apikey': 'jacZ9NrxaGoiDrVdAS1WsNKV6EfnANi4HAbKqtUjEvo'
    });
    

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
//REGISTRACION DE USUARIOS
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
  // Obtain the default map types from the platform object:
  var defaultLayers = platform.createDefaultLayers();

  // Instantiate (and display) a map object:
  var map = new H.Map(
    document.getElementById('mapContainer'),
    defaultLayers.vector.normal.map,
    {
      zoom: 10,
      center: { lat: 52.5, lng: 13.4 }
    });
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
    // ...
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
  var db = firebase.firestore();
  var colPersonas = db.collection('Personas');

  claveDeColleccion = email;
  nombre = $$('#regNombre').val();
  apellido = $$('#regApellido').val();
  datos = {
    nombre: nombre,
    apellido: apellido,
    foto: 'ninguna',
    latitud: latitud,
    longitud: longitud
  }

  colPersonas.doc(claveDeColleccion).set(datos)
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