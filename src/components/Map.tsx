import 'ol/ol.css';
import { onCleanup, onMount, createEffect, type Component } from 'solid-js';
import Map from 'ol/Map';
import View from 'ol/View';
import { fromLonLat, toLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import FullScreen from 'ol/control/FullScreen';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Circle as CircleGeom, Polygon } from 'ol/geom';
import { Feature } from 'ol';
import { Style, Fill, Stroke } from 'ol/style';
import { Draw, Modify, Snap } from 'ol/interaction';
import { storyApi } from '../stores/story';

interface Geofence {
    type: 'circle' | 'polygon' | null;
    center?: [number, number];
    radiusMeters?: number;
    polygonCoords?: [number, number][];
}

export interface LocationMapProps {
    locationId: string;
    summary?: boolean;
    onUpdate?: (newGeofence: Geofence) => void; // Optional callback
}

const MAX_ZOOM_NORMAL = 19;
const MAX_ZOOM_SUMMARY = 18;

const mapFilter = "invert(20%) brightness(60%) contrast(120%) hue-rotate(0)";

const LocationMap: Component<LocationMapProps> = (props) => {
    const [loc] = storyApi.useLocation(() => props.locationId);
    let mapContainer!: HTMLDivElement;
    let map: Map;
    let vectorSource: VectorSource;
    let drawInteraction: Draw | null = null;
    let modifyInteraction: Modify | null = null;
    let snapInteraction: Snap | null = null;

    const handleFullscreenChange = () => {
        if (document.fullscreenElement === mapContainer) {
            mapContainer.style.filter = 'none';
        } else {
            mapContainer.style.filter = mapFilter;
        }
    };

    createEffect(() => {
        const geo = loc()?.geofence;
        if (geo) {
            addGeofenceFeature(geo);
            fitMapToGeofence();
        }
    });

    onMount(async () => {
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        vectorSource = new VectorSource();

        const vectorLayer = new VectorLayer({ source: vectorSource });

        let initialCenter: [number, number];
        let initialZoom: number;

        if (loc()?.geofence) {
            initialCenter = fromLonLat([0, 0]) as [number, number];
            initialZoom = props.summary ? MAX_ZOOM_SUMMARY : MAX_ZOOM_NORMAL;
        } else {
            initialCenter = fromLonLat([10, 50]) as [number, number];; // lon, lat
            initialZoom = 4;
        }

        map = new Map({
            target: mapContainer,
            layers: [
                new TileLayer({ source: new OSM() }),
                vectorLayer,
            ],
            view: new View({
                center: initialCenter,
                zoom: initialZoom,
            }),
        });

        map.addControl(new FullScreen());

        mapContainer.style.filter = mapFilter;

        if (loc()?.geofence) {
            addGeofenceFeature(loc().geofence);
            fitMapToGeofence();
        }

        // Setup modify interaction for editing
        modifyInteraction = new Modify({ source: vectorSource });
        map.addInteraction(modifyInteraction);

        snapInteraction = new Snap({ source: vectorSource });
        map.addInteraction(snapInteraction);

        modifyInteraction.on('modifyend', () => {
            const updatedFeature = vectorSource.getFeatures()[0];
            if (updatedFeature) {
                const newGeofence = featureToGeofence(updatedFeature);
                if (newGeofence) {
                    updateGeofence(newGeofence);
                }
            }
        });

        // Setup draw interaction to allow user to draw polygon or circle geofence
        // For simplicity, let's enable polygon drawing only; you can extend to circles as needed
        drawInteraction = new Draw({
            source: vectorSource,
            type: 'Polygon',
        });
        map.addInteraction(drawInteraction);

        drawInteraction.on('drawend', (event) => {
            const newGeofence = featureToGeofence(event.feature);
            if (newGeofence) {
                updateGeofence(newGeofence);
            }
        });

    });

    onCleanup(() => {
        map?.setTarget(null);
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
    });

    function addGeofenceFeature(geo: Geofence) {
        vectorSource.clear();
        if (geo.type === 'polygon' && geo.polygonCoords && geo.polygonCoords.length >= 3) {
            // Make sure polygon coords are closed (first = last)
            let coords = geo.polygonCoords.map((coord: [number, number]) => fromLonLat(coord));
            if (
                coords.length > 2 &&
                (coords[0][0] !== coords[coords.length - 1][0] ||
                    coords[0][1] !== coords[coords.length - 1][1])
            ) {
                coords = [...coords, coords[0]];
            }
            const polygon = new Feature(new Polygon([coords]));
            polygon.setStyle(
                new Style({
                    stroke: new Stroke({ color: '#28a745', width: 2 }),
                    fill: new Fill({ color: 'rgba(40, 167, 69, 0.2)' }),
                })
            );
            vectorSource.addFeature(polygon);
        } else if (geo.type === 'circle' && geo.center && geo.radiusMeters) {
            const center = fromLonLat(geo.center);
            const circle = new Feature(new CircleGeom(center, geo.radiusMeters));
            circle.setStyle(
                new Style({
                    stroke: new Stroke({ color: '#007bff', width: 2 }),
                    fill: new Fill({ color: 'rgba(0, 123, 255, 0.2)' }),
                })
            );
            vectorSource.addFeature(circle);
        }
    }

    function fitMapToGeofence() {
        const features = vectorSource.getFeatures();
        if (features.length === 0) {
            return;
        }
        const extent = vectorSource.getExtent();
        if (!extent) {
            return;
        }
        map.getView().fit(extent, {
            maxZoom: props.summary ? MAX_ZOOM_SUMMARY : MAX_ZOOM_NORMAL,
            padding: [50, 50, 50, 50],
        });
    }

    function featureToGeofence(feature: Feature): Geofence | null {
        const geom = feature.getGeometry();
        if (!geom) return null;

        if (geom instanceof Polygon) {
            const coords = geom.getCoordinates()[0];
            // Convert back to lon/lat and remove closing point duplicate if exists
            let polygonCoords = coords.map((coord: [number, number]) => toLonLat(coord)) as [number, number][];
            if (
                polygonCoords.length > 2 &&
                polygonCoords[0][0] === polygonCoords[polygonCoords.length - 1][0] &&
                polygonCoords[0][1] === polygonCoords[polygonCoords.length - 1][1]
            ) {
                polygonCoords = polygonCoords.slice(0, -1);
            }
            return { type: 'polygon', polygonCoords };
        } else if (geom instanceof CircleGeom) {
            const center = toLonLat(geom.getCenter()) as [number, number];
            const radiusMeters = geom.getRadius();
            return { type: 'circle', center, radiusMeters };
        }
        return null;
    }

    async function updateGeofence(newGeo: Geofence) {
        try {
            storyApi.updateEntityField('locations', props.locationId, 'geofence', newGeo);
            props.onUpdate?.(newGeo);
        } catch (e) {
            console.error('Error updating geofence:', e);
        }
    }

    return (
        <section
            ref={mapContainer}
            onmouseenter={() => mapContainer.style.filter = 'none'}
            onmouseout={() => mapContainer.style.filter = mapFilter}
            style={{
                transition: 'filter 0.2s ease-in',
                width: '100%',
                height: '250pt',
            }}
        />
    );
};

export default LocationMap;
