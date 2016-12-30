import 'babel-polyfill';
import preact from 'preact';
import App from 'App';


const appNode = document.getElementById('js-app');
window.app = preact.render(<App />, appNode);
