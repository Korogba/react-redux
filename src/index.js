import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import {Router, browserHistory} from 'react-router';
import configureStore from './store/configureStore';
import {loadCourses} from "./actions/courseActions";
import {loadAuthors} from "./actions/authorActions";
import {Provider} from 'react-redux';
import routes from './routes';
import './styles/styles.css'; // Webpack can import css files too
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

const store = configureStore();
store.dispatch(loadCourses());
store.dispatch(loadAuthors());

render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes}/>
  </Provider>,
  document.getElementById('app')
);
