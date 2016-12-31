import 'babel-polyfill';
import preact from 'preact';
import { Provider } from 'preact-redux';
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import App from 'App';
import reducer from 'reducers/reducer';


const store = createStore(reducer, applyMiddleware(thunkMiddleware));
const appNode = document.getElementById('js-app');
preact.render(
  <Provider store={store}>
    <App ref={app => window.app = app} />
  </Provider>,
  appNode
);
