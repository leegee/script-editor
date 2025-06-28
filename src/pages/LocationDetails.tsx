import { type Component } from 'solid-js';
import { useParams } from '@solidjs/router';
import LocationCard from '../components/LocationCard';

const LocationDetails: Component = () => {
    const params = useParams<{ id: string }>();
    const locationId = params.id;

    if (!locationId) {
        return <p>Location ID is missing.</p>;
    }

    return (
        <section class="location-details">
            <h2>Location</h2>
            <LocationCard locationId={locationId} />
        </section>
    );
};

export default LocationDetails;
