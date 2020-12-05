// Si necesitamos usar una biblioteca DOM personalizada, guardémosla en la variable $$:
var $$ = Dom7;

var app = new Framework7({
    // Elemento raíz de la aplicación
    root: '#app',
    // Nombre de la aplicación
    name: 'Influence Zone',
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
var Argentina = "Argentina";
var email,password, nombre, apellido, latitud, longitud, platform, pos, icon;
//var provinciaOrg, ciudadOrg, direccionOrg;
//var direccionHere = `${direccionOrg}, ${ciudadOrg}, ${provinciaOrg}`;


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
});

//////////////////////////////////////////////////////////////////////////////////////////
//    INDEX
//////////////////////////////////////////////////////////////////////////////////////////
$$(document).on('page:init', '.page[data-name="index"]', function (e) {
    mostrar("pantalla index");
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
    // Obtenga los tipos de mapas predeterminados del objeto de plataforma:
    var defaultLayers = platform.createDefaultLayers();
    //  CREANDO EL OBJETO MAPA
    // marca UBICACION EN EL MAPA
    // Crea una instancia (y muestra) un objeto de mapa:
    var map = new H.Map(
    document.getElementById('mapContainer'),
    defaultLayers.vector.normal.map,
    {
      zoom: 12,
      center: { lat: latitud, lng: longitud }
    });
    coords = { lat: latitud, lng: longitud },
    marker = new H.map.Marker(coords);

    ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////
    //  Tomar de los formularios de registro la direccion 
    //  para mostrar en el mapa la ubicacion
    ////////////////////////////////////////////////////////
    // Obtenga una instancia del servicio de codificación geográfica:
    var service = platform.getSearchService();
    // Llame al método de geocodificación con los parámetros de geocodificación,
    // la devolución de llamada y una función de devolución de llamada de error 
    //(llamada si ocurre un error de comunicación):
    service.geocode({
      q: 'Ntra Sra del Buen Viaje 900, B1708ECR Morón, Provincia de Buenos Aires'
    }, (result) => {
      // Add a marker for each location found
      result.items.forEach((item) => {
    
        console.log("item:" + JSON.stringify(item.position) );
        pos = item.position;
        map.addObject(new H.map.Marker(item.position));
    
    // {"lat":-34.60826,"lng":-58.37078}
        latitud = item.position.lat;
        longitud = item.position.lng;
    
        map.setCenter(item.position);
    
    
    
      });
    }, alert);
    


    ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////

    // Agregue el marcador al mapa y centre el mapa en la ubicación del marcador:
    map.addObject(marker);
    map.setCenter(coords);

    // BURBUJA DE INFORMACION en la zona en donde esta el usuario
    // Cree un objeto de burbuja de información en una ubicación geográfica específica:
    var bubble = new H.ui.InfoBubble({ lat: latitud, lng: longitud }, {
      content: '<b>Estas Aqui! Y esta es tu zona de influencia</b>'
    });

    // Cree un icono de marcador a partir de la URL de una imagen:
    icon = new H.map.Icon('img/logoSamllWhite.png');
    // Cree un marcador utilizando el icono instanciado previamente:
    var marker = new H.map.Marker({ lat: latitud, lng: longitud }, { icon: icon });
    // Agrega el marcador al mapa:
    map.addObject(marker);

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
function fnRegistroUsuario() {
  email = $$('#emailUsuario').val();
  password = $$('#apellidoUsuario').val();
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
//Funcion de inicializacion y creacion de base de datos
  var db = firebase.firestore();
  var colUsuarios = db.collection('Usuarios');
//CONSTRUYENDO LA BASE DE DATOS EN FIRESTORE
  claveDeColleccion = email;
    email = $$('#emailUsuario').val();
    password = $$('#passUsuario').val();
    nombre = $$('#nombreUsuario').val();
    apellido = $$('#apellidoUsuario').val();
    telefono = $$('#telUsuario').val();
    provincia = $$('#provinciaUsuario').val();
    ciudad = $$('#ciudadUsuario').val();
    direccion = $$('#direcUsuario').val();

    datos = {
      email: email,
      password: password,
      nombre: nombre,
      apellido: apellido,
      telefono: telefono,
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

/////////////////////////////////
// REGISTRO DE ORGANIZACIONES
/////////////////////////////////
function fnRegistroOrg() {
  email = $$('#emailOrg').val();
  password = $$('#passOrg').val();
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


function guarDatoOrg() {
//Funcion de inicializacion y creacion de base de datos
  var db = firebase.firestore();
  var colOrganizaciones = db.collection('Organizaciones');
//CONSTRUYENDO LA BASE DE DATOS EN FIRESTORE
  claveDeColleccion = email;
    email = $$('#emailOrg').val();
    password = $$('#passOrg').val();
    nombre = $$('#nombreOrg').val();
    contacto = $$('#contactoOrg').val();
    telefono = $$('#telOrg').val();
    provincia = $$('#provinciaOrg').val();
    ciudad = $$('#ciudadOrg').val();
    direccion = $$('#direcOrg').val();
    facebook = $$('#faceOrg').val();
    whatsapp = $$('#whatsOrg').val();
    mercadopago = $$('#mepaOrg').val();

    datos = {
      email: email,
      password: password,
      nombre: nombre,
      contacto: contacto,
      telefono: telefono,
      provincia: provincia,
      ciudad: ciudad,
      direccion: direccion,
      facebook: facebook,
      whatsapp: whatsapp,
      mercadopago: mercadopago,
      latitud: latitud,
      longitud: longitud
    };

  colOrganizaciones.doc(claveDeColleccion).set(datos)
    .catch(function (e) {
    });
}

