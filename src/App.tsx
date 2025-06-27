import { HashRouter, A } from '@solidjs/router';
import Routes from './Routes';

const AppLayout = (props) => (
    <>
        <nav class="nav-bar">
            <ul class="nav-list">
                <li class="nav-item">
                    <A href="/" class="nav-link">Home</A>
                </li>
                <li class="nav-item">
                    <A href="/about" class="nav-link">About</A>
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
