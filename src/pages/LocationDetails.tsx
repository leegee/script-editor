import { type Component, Show } from 'solid-js';
import { useParams } from '@solidjs/router';
import LocationCard from '../components/LocationCard';

const LocationDetails: Component = () => {
    const params = useParams<{ id: string }>();

    return (
        <section class="location-details">
            <h2>Location</h2>
            <Show when={params.id} fallback={<p>Location ID is missing.</p>} keyed>
                {(id) => <LocationCard locationId={id} />}
            </Show>
        </section>
    );
};

export default LocationDetails;
