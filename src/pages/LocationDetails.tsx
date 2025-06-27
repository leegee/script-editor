import { type Component, createSignal, createEffect, Suspense } from 'solid-js';
import { useParams } from '@solidjs/router';
import LocationCard from '../components/LocationCard';
import { fakeApi } from '../lib/fakeApi';
import type { Location } from '../lib/types';

const LocationDetails: Component = () => {
    const params = useParams<{ id: string }>();
    const [location, setLocation] = createSignal<Location | null>(null);
    const [loading, setLoading] = createSignal(true);
    const [error, setError] = createSignal<string | null>(null);

    createEffect(() => {
        const locationId = params.id;
        if (!locationId) return;

        setLoading(true);
        setError(null);
        setLocation(null);

        fakeApi.getLocation(locationId)
            .then((data) => {
                setLocation(data);
                setError(null);
            })
            .catch(() => {
                setError('Failed to load location.');
                setLocation(null);
            })
            .finally(() => {
                setLoading(false);
            });
    });

    return (
        <section class="location-details">
            <Suspense fallback={<p>Loading character...</p>}>
                {loading() && <p>Loading character...</p>}
                {error() && <p class="error">{error()}</p>}
                {!loading() && !error() && !location() && <p>Character not found.</p>}
                {location() && (
                    <>
                        <h2>Location</h2>
                        <LocationCard location={location()!} />
                    </>
                )}
            </Suspense>
        </section>
    );
};

export default LocationDetails;
