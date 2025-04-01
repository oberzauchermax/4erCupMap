import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css';

import markers from './../../files/markers.json';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

function Map() {

    const mapRef = useRef()
    const mapContainerRef = useRef()
    const routeArray = [];

    for (const feature of markers.features) {
        
        routeArray.push(feature.geometry.coordinates)

        const el = document.createElement('div');
        el.className = 'marker w-12 h-12 rounded-full bg-cover cursor-pointer';
        el.style.backgroundImage = `url(${feature.properties.imageURL})`;

        new mapboxgl.Marker(el)
            .setLngLat(feature.geometry.coordinates)
            .setPopup(
                new mapboxgl.Popup({ offset: 25 })
                    .setHTML(
                        `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
                    )
            )
            .addTo(mapRef.current);
    }

    useEffect(() => {
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/standard-satellite',
            center: [13.592967907443288, 46.80903812137259],
            zoom: 16,
        });

        mapRef.current.on("load", () => mapRef.current.resize());

        return () => mapRef.current.remove()
    }, [])

    if(mapRef.current && !mapRef.current.getLayer('route')) {
      routeArray.push(markers.features[0].geometry.coordinates)
        mapRef.current.addLayer({
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
              'line-color': '#888',
              'line-width': 8
            }
        })
    }
    

    return (
        <div id='map-container' ref={mapContainerRef}/>
    );
};

export default Map