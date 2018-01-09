// tslint:disable-next-line:no-submodule-imports
import 'core-js/es6/map';
// tslint:disable-next-line:no-submodule-imports
import 'core-js/es6/set';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import './reset.css';
import './index.css';

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
registerServiceWorker();
