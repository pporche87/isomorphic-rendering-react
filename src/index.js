import 'babel-polyfill';
import express from 'express';
import { matchRoutes } from 'react-router-config';
import Routes from './client/Routes';
import renderer from './helpers/renderer';
import createStore from './helpers/createStore';

const app = express();

app.use(express.static('public'));

app.get('*', (request, response) => {
  const store = createStore();

  const promises = matchRoutes(Routes, request.path).map(({ route }) => {
    return route.loadData ? route.loadData(store) : null;
  });

  Promise.all(promises).then(() => {
    response.send(renderer(request, store));
  });
});

app.listen(3000, () => {
  console.log('Listenting on port 3000');
});