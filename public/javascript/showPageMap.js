mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: campgrounds.geometry.coordinates, // starting position [lng, lat]
    zoom: 13 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(campgrounds.geometry.coordinates)
    .addTo(map)