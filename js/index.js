const container = document.querySelector('.container');
const search = document.querySelector('.busqueda-box');
const actual = document.querySelector('.ubi');
const containerClima = document.querySelector('.clima-box');
const detallesClima = document.querySelector('.detalles-clima');
const error = document.querySelector('.not-found');
const placeH = document.querySelector('.busqueda-box input');

search.addEventListener('click', () => {
Inicio('search');
});

actual.addEventListener('click', () => {
obtenerUbicacionActual(Inicio);
});

function Inicio(btnClicked, ubicacion) {
let URL = '';
const apiKey = '767fdaeb2efdd0c3f9aead1ad84302f5';

if (btnClicked === 'search') {
    ubicacion = document.querySelector('.busqueda-box input').value;
    URL = `https://api.openweathermap.org/data/2.5/weather?q=${ubicacion}&appid=${apiKey}&lang=sp&units=metric`;
} else if (btnClicked === 'actual') {
    URL = `https://api.openweathermap.org/data/2.5/weather?lat=${ubicacion.lat}&lon=${ubicacion.lon}&appid=${apiKey}&lang=sp&units=metric`;
}

if (ubicacion === '') {
    return;
}

fetch(URL)
    .then((Response) => Response.json())
    .then((json) => {
    if (json.cod == '404') {
        container.style.height = '580px';
        containerClima.style.display = 'none';
        detallesClima.style.display = 'none';
        error.style.display = '';
        error.classList.add('fadeIn');
        return;
    }

    error.style.display = 'none';
    error.classList.remove('fadeIn');

    const image = document.querySelector('.clima-box img');
    const temperatura = document.querySelector('.clima-box .temperatura');
    const descripcion = document.querySelector('.clima-box .descripcion');
    const humedad = document.querySelector('.detalles-clima .humedad p');
    const viento = document.querySelector('.detalles-clima .viento p');

    const momento = tiempo(json.timezone);

    switch (json.weather[0].main) {
        case 'Clear':
            if (momento === 'dia'){
                image.src = './img/dia.png';
            }else{
                image.src = './img/noche.png';
            }
        break;
        case 'Rain':
        image.src = './img/lluvia.png';
        break;
        case 'Snow':
        image.src = './img/nieve.png';
        break;
        case 'Clouds':
            if (momento === 'dia'){
                image.src = './img/dia.png';
            }else{
                image.src = './img/noche.png';
            }
        break;
        case 'Mist':
            if (momento === 'dia'){
                image.src = './img/nublado.png';
            }else{
                image.src = './img/nublado-noche.png';
            }
        break;
        case 'Drizzle':
            if (momento === 'dia'){
                image.src = './img/nublado.png';
            }else{
                image.src = './img/nublado-noche.png';
            }
        break;
        case 'Thunderstorm':
        image.src = './img/tormenta.png';
        break;
        default:
        image.src = '';
    }
    conversorC = parseInt(json.main.temp);
    temperatura.innerHTML = `${conversorC}<span> °C</span>`;
    descripcion.innerHTML = `${json.weather[0].description}`;
    humedad.innerHTML = `${json.main.humidity}%`;
    viento.innerHTML = `${parseInt(json.wind.speed)} Km/h`;

    containerClima.style.display = '';
    detallesClima.style.display = '';
    containerClima.classList.add('fadeIn');
    detallesClima.classList.add('fadeIn');
    container.style.height = '580px';
    placeH.value = `${json.name}, ${json.sys.country}`;
    });
}

function obtenerUbicacionActual(callback) {
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
    (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const ubicacion = { lat, lon };
        callback('actual', ubicacion);
    },
    (error) => {
        alert('Debe aceptar la ubicación para poder usar su ubicación actual.');
    }
    );
} else {
    console.log('La geolocalización no es soportada por este navegador.');
}
}

function tiempo(time){
    const fechaLocal = new Date();

    const horafinal = (fechaLocal.getUTCHours()) + time / 3600;
    const periodo = (horafinal > 7 && horafinal < 19) ? 'dia' : 'noche';

    return periodo;
}