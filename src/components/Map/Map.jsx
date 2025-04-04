import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css';
import './Popup.css';

import markers from './../../files/markers.json';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

function loadMarkers(currentMapRef) {
  for (const feature of markers.features) {
    const el = document.createElement('div');
    el.innerHTML = `
      <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-gray-400 bg-white z-0"></div>
      <div class = "relative w-0 h-0 -translate-y-2 z-10
          border-l-9 border-l-transparent 
          border-r-9 border-r-transparent 
          border-t-12 border-t-sky-800">
        <div class = "absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-6
            rounded-full border-3 border-sky-800 flex items-center justify-center
            ${!feature.properties.imageURL ? 'bg-blue-300' : 'bg-contain'}"
             style = "background-image: url(${feature.properties.imageURL || ''})">
          <p class="text-xs font-bold text-neutral-800">
            ${feature.properties.id || ""}
          </p>
        </div>
      </div>
    `;
    

    new mapboxgl.Marker(el)
      .setLngLat(feature.geometry.coordinates)
      .setPopup(createPopup(currentMapRef, feature))
      .addTo(currentMapRef);
  }
}

function createPopup(currentMapRef, feature) {

  const popUps = document.getElementsByClassName('mapboxgl-popup');
  if (popUps[0]) popUps[0].remove();

  const popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML(`
      <div class="flex items-center justify-between space-x-4">
        <h3 class="text-lg font-semibold">${feature.properties.title}</h3>
        <a href="https://www.google.com/maps/dir/?api=1&destination=${feature.geometry.coordinates[1]},${feature.geometry.coordinates[0]}&travelmode=walking">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" class="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
          </svg>
        </a>
      </div)
    `)
    .addTo(currentMapRef)
    
  
  return popup
}

function loadRoute(currentMapRef) {
  if(currentMapRef && !currentMapRef.getLayer('route')) {

    const routeArray = [];

    for (const feature of markers.features) {
      routeArray.push(feature.geometry.coordinates)
    }

    routeArray.push(markers.features[0].geometry.coordinates)

    currentMapRef.addLayer({
        id: 'route',
        type: 'line',
        source: {
          'type': 'geojson',
          'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
              'type': 'LineString',
              'coordinates': routeArray
            },
          }
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#80bbe8',
          'line-width': 5,
          'line-border-color': '#0c4a6e',
          'line-border-width': 1
          
        }
    })
  }
}

function addLocateUser(currentMapRef) {
  if(currentMapRef) {
    currentMapRef.addControl(
      new mapboxgl.GeolocateControl({
          positionOptions: {
              enableHighAccuracy: true
          },
          trackUserLocation: true,
          showUserHeading: true,
      })
    );
  }
}

function Map() {

    const mapRef = useRef()
    const mapContainerRef = useRef()

    useEffect(() => {
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/standard',
            center: [13.592967907443288, 46.80903812137259],
            zoom: 16,
        });

        mapRef.current.on("load", () => mapRef.current.resize());
        mapRef.current.on("load", () => loadMarkers(mapRef.current));
        mapRef.current.on("load", () => loadRoute(mapRef.current));
        mapRef.current.on("load", () => addLocateUser(mapRef.current));

        return () => mapRef.current.remove()
    }, [])
    
    return (
        <div id='map-container' ref={mapContainerRef}/>
    );
};

export default Map