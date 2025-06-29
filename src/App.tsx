import './App.scss';
import { HashRouter, A } from '@solidjs/router';
import Routes from './Routes';

const AppLayout = (props) => (
    <>
        <nav class="nav-bar">
            <ul>
                <li>
                    <A href="/act" class="nav-link">Acts</A>
                </li>
                <li>
                    <A href="/character" class="nav-link">Characters</A>
                </li>
                <li>
                    <A href="/location" class="nav-link">Locations</A>
                </li>
            </ul>
        </nav>
        {props.children}
    </>
);

export default function App() {
    return (
        <HashRouter root={AppLayout}>
            <Routes />
        </HashRouter>
    );
}
