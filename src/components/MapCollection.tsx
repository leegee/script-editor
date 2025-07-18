import './MapCollection.scss';
import 'ol/ol.css';
import { onCleanup, onMount, type Component } from 'solid-js';
import Map from 'ol/Map';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import FullScreen from 'ol/control/FullScreen';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Circle as CircleGeom, Polygon } from 'ol/geom';
import { Feature } from 'ol';
import { Style, Fill, Stroke, Text as TextStyle } from 'ol/style';
import type { Location } from '../lib/types';

interface MapCollectionProps {
    locations: Location[];
    summary?: boolean;
}

const mapFilter = ""; // "invert(20%) brightness(60%) contrast(120%) hue-rotate(0)";
const MAX_ZOOM = 20;

const MapCollection: Component<MapCollectionProps> = (props) => {
    let mapContainer!: HTMLDivElement;
    let map: Map;
    let vectorSource: VectorSource;

    function createFeatureFromGeofence(loc: Location): Feature | null {
        const geo = loc.geofence;
        if (!geo || !geo.type) return null;

        let feature: Feature | null = null;
        let labelPosition: [number, number] | null = null;

        if (geo.type === 'polygon' && geo.polygonCoords && geo.polygonCoords.length >= 3) {
            let coords = geo.polygonCoords.map(c => fromLonLat(c));
            if (
                coords.length > 2 &&
                (coords[0][0] !== coords[coords.length - 1][0] ||
                    coords[0][1] !== coords[coords.length - 1][1])
            ) {
                coords = [...coords, coords[0]];
            }

            const polygon = new Polygon([coords]);
            feature = new Feature(polygon);
            labelPosition = polygon.getInteriorPoint().getCoordinates() as [number, number];

        } else if (geo.type === 'circle' && geo.center && geo.radiusMeters) {
            const center = fromLonLat(geo.center);
            const circle = new CircleGeom(center, geo.radiusMeters);
            feature = new Feature(circle);
            labelPosition = center as [number, number];
        }

        if (feature && labelPosition) {
            feature.setStyle(new Style({
                stroke: new Stroke({ color: '#333', width: 2 }),
                fill: new Fill({ color: 'rgba(100, 100, 200, 0.1)' }),
                text: new TextStyle({
                    text: loc.name,
                    font: 'bold 12pt sans-serif',
                    fill: new Fill({ color: '#111' }),
                    stroke: new Stroke({ color: '#fff', width: 3 }),
                    offsetY: -12,
                }),
            }));
        }

        return feature;
    }

    onMount(() => {
        vectorSource = new VectorSource();
        const vectorLayer = new VectorLayer({ source: vectorSource });

        map = new Map({
            target: mapContainer,
            layers: [
                new TileLayer({ source: new OSM() }),
                vectorLayer,
            ],
            view: new View({
                center: fromLonLat([10, 50]),
                zoom: 4,
                maxZoom: MAX_ZOOM,
            }),
        });

        map.addControl(new FullScreen());
        mapContainer.style.filter = mapFilter;

        const features = props.locations.map(createFeatureFromGeofence).filter(Boolean) as Feature[];
        vectorSource.addFeatures(features);

        if (features.length) {
            const extent = vectorSource.getExtent();
            map.getView().fit(extent, { padding: [50, 50, 50, 50], maxZoom: MAX_ZOOM });
        }
    });

    onCleanup(() => {
        map?.setTarget(null);
    });

    return (
        <section
            class='all-locations-mapped'
            ref={mapContainer}
            onmouseenter={() => mapContainer.style.filter = 'none'}
            onmouseout={() => mapContainer.style.filter = mapFilter}
            style={{
                transition: 'filter 0.2s ease-in',
                width: '100%',
                height: props.summary ? '120pt' : '300pt',
            }}
        />
    );
};

export default MapCollection;
