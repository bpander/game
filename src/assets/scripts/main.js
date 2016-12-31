import 'babel-polyfill';
import preact from 'preact';
import App from 'App';


const appNode = document.getElementById('js-app');
preact.render(<App ref={app => window.app = app} />, appNode);
