import { Component } from 'solid-js';
import { useNavigate } from '@solidjs/router';

const HomeButton: Component = () => {
    const navigate = useNavigate();

    const goHome = () => {
        navigate('/act?summary=false');
    };

    return (
        <button type="button" onClick={goHome}>
            🏚️ Home
        </button>
    );
};

export default HomeButton;
