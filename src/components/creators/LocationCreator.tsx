import { storyApi } from "../../lib/story";

export default () => {
    const addNewLocation = () => {
        storyApi.createEntity(
            'locations',
            {
                name: 'New Location',
                description: '',
                // geofence?: {
                //     type: 'circle' | 'polygon';
                //     center?: [number, number]; // lat/lng
                //     radiusMeters?: number;
                //     polygonCoords?: [number, number][];
                // };
            }
        );
    };

    return <button class='new' onclick={addNewLocation}>New Location</button>;
}

