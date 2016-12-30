import preact from 'preact';

/**
 * Application setup
 *
 * @class App
 */
export default class App extends preact.Component {

  constructor(props) {
    super(props);
    console.log('app started');
  }

  render() {
    return (
      <div>Cupcakes.</div>
    );
  }
}
