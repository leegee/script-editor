import './App.scss';
import { HashRouter, A } from '@solidjs/router';
import Routes from './Routes';
import Toolbar from './Toolbar';

const AppLayout = (props) => (
    <>
        <Toolbar />
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
