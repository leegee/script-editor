import 'ol/ol.css';
import { onCleanup, onMount, type Component } from 'solid-js';
import Map from 'ol/Map';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Circle as CircleGeom, Polygon } from 'ol/geom';
import { Feature } from 'ol';
import { Style, Fill, Stroke } from 'ol/style';

interface LocationMapProps {
    geofence: {
        type: 'circle' | 'polygon';
        center?: [number, number];
        radiusMeters?: number;
        polygonCoords?: [number, number][];
    };
}

const LocationMap: Component<LocationMapProps> = (props) => {
    let mapContainer!: HTMLDivElement;
    let map: Map;

    onMount(() => {
        const vectorSource = new VectorSource();
        const features: Feature[] = [];

        if (props.geofence.type === 'circle' && props.geofence.center && props.geofence.radiusMeters) {
            const center = fromLonLat(props.geofence.center);
            const radius = props.geofence.radiusMeters;

            const circle = new Feature({
                geometry: new CircleGeom(center, radius),
            });

            circle.setStyle(new Style({
                stroke: new Stroke({ color: '#007bff', width: 2 }),
                fill: new Fill({ color: 'rgba(0, 123, 255, 0.2)' }),
            }));

            vectorSource.addFeature(circle);
            features.push(circle);
        }

        if (props.geofence.type === 'polygon' && props.geofence.polygonCoords?.length) {
            const coords = props.geofence.polygonCoords.map(coord => fromLonLat(coord));

            if (
                coords.length >= 3 &&
                (coords[0][0] !== coords[coords.length - 1][0] ||
                    coords[0][1] !== coords[coords.length - 1][1])
            ) {
                coords.push(coords[0]);
            }

            const polygon = new Feature({
                geometry: new Polygon([coords]),
            });

            polygon.setStyle(new Style({
                stroke: new Stroke({ color: '#28a745', width: 2 }),
                fill: new Fill({ color: 'rgba(40, 167, 69, 0.2)' }),
            }));

            vectorSource.addFeature(polygon);
            features.push(polygon);
        }

        const vectorLayer = new VectorLayer({ source: vectorSource });

        map = new Map({
            target: mapContainer,
            layers: [
                new TileLayer({ source: new OSM() }),
                vectorLayer,
            ],
            view: new View({
                center: fromLonLat(props.geofence.center ?? [0, 0]),
                zoom: 14,
            }),
        });

        if (features.length > 0) {
            const extent = vectorSource.getExtent();
            const padding = 1000; // meters
            const view = map.getView();

            view.fit(extent, {
                size: map.getSize(),
                padding: [padding, padding, padding, padding],
                maxZoom: 18,
            });
        }
    });

    onCleanup(() => {
        map?.setTarget(null);
    });

    return (
        <div ref={mapContainer} style={{ width: '100%', height: '250px' }} />
    );
};

export default LocationMap;
