mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-1.470832, 53.370351], // starting position [lng, lat]
    zoom: 13 // starting zoom
});