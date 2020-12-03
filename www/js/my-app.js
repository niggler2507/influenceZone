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
//////////////////////////////////////////////////////////////////////////////////////////
//    RUTAS
//////////////////////////////////////////////////////////////////////////////////////////
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
      {
        path: '/info/',
        url: 'info.html',
      }
    ]
  });


//////////////////////////////////////////////////////////////////////////////////////////
//    ALGUNAS VARIABLES GENERALES QUE SE USAN FRECUENTEMENTE EN ESTE ARCHIVO JS
//////////////////////////////////////////////////////////////////////////////////////////
var mainView = app.views.create('.view-main');
var test = 1;
var email,password, latitud, longitud, platform, pos, icon, toastWithCallback;



//////////////////////////////////////////////////////////////////////////////////////////
//    APP INICIALIZADA
//////////////////////////////////////////////////////////////////////////////////////////
$$(document).on('deviceready', function() {
    mostrar("Device is ready!");

/////////////////////////////////////////////////
//     HERE MAPAS
//     Iniciamos Platform de HereMaps
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
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
});


//////////////////////////////////////////////////////////////////////////////////////////
//    EN TODAS LAS PAGINAS
//////////////////////////////////////////////////////////////////////////////////////////
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    mostrar(e);
    // Preloader
    $$('.open-preloader').on('click', function () {
      app.dialog.preloader();
      setTimeout(function () {
        app.dialog.close();
      }, 4000);
    });
});

//////////////////////////////////////////////////////////////////////////////////////////
//    INDEX
//////////////////////////////////////////////////////////////////////////////////////////
// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="index"]', function (e) {

    mostrar("pantalla index");

    var mySwiper = new Swiper('.swiper-container', {
      autoplay: {
        delay: 5000,
      },
    });
    $$('#btnLogin').on('click', fnLogin);

});

//////////////////////////////////////////////////////////////////////////////////////////
//    REGISTRACION DE USUARIOS Y ORGS
//////////////////////////////////////////////////////////////////////////////////////////
$$(document).on('page:init', '.page[data-name="registracion"]', function (e) {

    mostrar("pantalla de registracion");

    $$('#btnFinRegUsuario').on('click', fnRegistroUsuario);
    $$('#btnFinRegUsuario').on('click', guarDatoUsuario);

    $$('#btnFinRegOrg').on('click', fnRegistroOrg);
    $$('#btnFinRegOrg').on('click', guarDatoOrg);
});

//////////////////////////////////////////////////////////////////////////////////////////
//    PERFIL DEL USUARIO
//////////////////////////////////////////////////////////////////////////////////////////
$$(document).on('page:init', '.page[data-name="perfil"]', function (e) {
    mostrar("pantalla del perfil de usuario");
    /*
    perFoto
    btnGal
    btnCam
    */
    $$('#btnGal').on('click', fnGaleria);
    $$('#btnGam').on('click', fnGamara);
});

//////////////////////////////////////////////////////////////////////////////////////////
//    PANTALLA DEL MAPA
//////////////////////////////////////////////////////////////////////////////////////////
$$(document).on('page:init', '.page[data-name="mapa"]', function (e) {
    mostrar("pantalla del mapa");

/////////////////////////////////////////////////
//    HERE MAPS
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
      zoom: 12,
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
      content: '<b>Estas Aqui! Y esta es tu zona de influencia</b>'
    });

    // Create a marker icon from an image URL:
    icon = new H.map.Icon('img/logo03.png');
    // Create a marker using the previously instantiated icon:
    var marker = new H.map.Marker({ lat: latitud, lng: longitud }, { icon: icon });
    // Add the marker to the map:
    map.addObject(marker);

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
});

//////////////////////////////////////////////////////////////////////////////////////////
//    INFO DE LA APP
//////////////////////////////////////////////////////////////////////////////////////////
$$(document).on('page:init', '.page[data-name="info"]', function (e) {
    mostrar("pantalla de info de la app");
  
});



//////////////////////////////////////////////////////////////////////////////////////////
//    MIS FUNCIONES
//////////////////////////////////////////////////////////////////////////////////////////

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
    $$('#loginMensaje').html('<p><a href="/registracion/" data-view=".page-content" class="link login-screen-close text-color-red"><em><strong>Si aun no tenes una cuenta, Registrate aqui</strong></em></a></p>');
    
    // Create toast with callback on close
    toastWithCallback = app.toast.create({
      text: errorCode,
      closeButton: true,
      on: {
        close: function () {
          app.dialog.alert(errorMessage);
        },
      }
    });
    toastWithCallback.open();
  });
}


/////////////////////////////////
//    USUARIO
/////////////////////////////////
function fnRegistroUsuario() {

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
  Coleccion: USUARIOS       <- colUsuarios
    ID: email@email.com     <- claveDeColleccion
    DATOS JASON:            <- datos
            nombre
            apellido
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
    latitud: latitud,
    longitud: longitud
  }

  colUsuarios.doc(claveDeColleccion).set(datos)
  .catch(function(e) {
  });

}

/////////////////////////////////
// ORGANIZACION
/////////////////////////////////
function fnRegistroOrg() {

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
function guarDatoOrg() {
/*
Coleccion: ORGANIZACIONES       <- colOrganizaciones
  ID: email@email.com     <- claveDeColleccion
  DATOS JASON:            <- datos
          nombre
          apellido
          latitud
          longitud
*/
//CONSTRUYENDO LA BASE DE DATOS EN FIRESTORE
var db = firebase.firestore();
var colOrganizaciones = db.collection('Organizaciones');

claveDeColleccion = email;
nombre = $$('#nombreUsuario').val();
apellido = $$('#apellidoUsuario').val();
datos = {
  nombre: nombre,
  apellido: apellido,
  email: email,
  latitud: latitud,
  longitud: longitud
};

colOrganizaciones.doc(claveDeColleccion).set(datos)
  .catch(function (e) {
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